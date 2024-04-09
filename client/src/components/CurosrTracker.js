import React, { useState, useEffect } from 'react';
import { ACTIONS } from '../Actions';

const CursorTracker = ({ socketRef, clients, roomId, username }) => {
    // State to store cursor positions for all users
    const [clientCursors, setClientCursors] = useState({});
    const generateColor = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }

        const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();

        return `#${'00000'.substring(0, 6 - c.length)}${c}`;
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            const newCursorPosition = { x: e.clientX, y: e.clientY };
            setClientCursors((prev) => ({ ...prev, [username]: newCursorPosition }));
            emitCursorUpdate(newCursorPosition);
        };

        const emitCursorUpdate = (position) => {
            if (socketRef.current) {
                socketRef.current.emit(ACTIONS.CURSOR_POSITION_UPDATE, {
                    roomId,
                    username,  // Ensure that the correct username is used here
                    x: position.x,
                    y: position.y,

                });
                // console.log(clientCursors)

            }

        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [socketRef, roomId, username]);



    useEffect(() => {
        setTimeout(() => {
            // console.log(socketRef.current.connected)

            if (socketRef.current.connected) {
                socketRef.current.on(ACTIONS.CURSOR_POSITION_UPDATE, (data) => {
                    // console.log('hi data', data)
                    // setClientCursors((prev) => ({ ...prev, [data.username]: { x: data.x, y: data.y } }));
                    setClientCursors(data.cursors);

                });

            }
        }, 2000);



        return () => {
            socketRef.current.off(ACTIONS.CURSOR_POSITION_UPDATE);
        };
    }, [socketRef]);



    return (
        <>
            {clients.map((client) => {

                return (<div
                    key={client.socketId}
                    className="w-4 h-4 absolute rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer border-2 border-white"
                    style={{
                        left: `${clientCursors[client.username]?.x}px`,
                        top: `${clientCursors[client.username]?.y}px`,
                        backgroundColor: generateColor(client.username),
                        boxShadow: '0 0 5px rgba(0, 0, 0, 0.5)',
                        zIndex: 1000,
                        pointerEvents: 'none',
                    }}
                >
                    <span className="text-[#ff9f1c] m-3  text-xs font-semibold">{client.username}</span>
                </div>)
            })}
        </>
    );
};

export default CursorTracker;