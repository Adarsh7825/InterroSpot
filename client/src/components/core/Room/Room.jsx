import { useContext, useEffect, useState, useRef } from "react";
import { DataContext } from '../../../context/DataContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { diff_match_patch } from 'diff-match-patch';
import defaultCode from './../../../static/default_code.json';
import axios from 'axios';
import WhiteBoard from './WhiteBoard';
import { useSelector } from "react-redux";
const dmp = new diff_match_patch();

const Room = () => {
    const { currRoom, socket } = useContext(DataContext);
    const { user } = useSelector((state) => state.profile);
    const navigate = useNavigate();
    const [language, setLanguage] = useState(currRoom ? currRoom.language : "javascript");
    let [code, setCode] = useState(currRoom ? currRoom.code : defaultCode[language ? language : "javascript"]);
    const location = useLocation();
    let roomid = location.state?.roomid;
    let name = user ? user.firstName : "";
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [inRoomUsers, setInRoomUsers] = useState([]);
    const [running, setRunning] = useState(false);
    const EditorRef = useRef(null);
    const REACT_APP_BACKEND_URL = 'http://localhost:8181/';


    function updateRoom(patch) {
        socket.emit('update', { roomid, patch });
    }

    useEffect(() => {
        if (user?.token === null) {
            navigate('/');
        }
        socket.on('connect', () => {
            console.log('Connected');
        });
        if (currRoom) {
            socket.emit('join', {
                name,
                roomid,
                code,
                language,
                token: user?.token,
                input,
                output,
                avatar: user?.avatar
            })
        }

        socket.on('join', (msg, room) => {
            console.log("join gave me this data\n", room, "\n");
            toast(msg, {
                position: toast.POSITION.TOP_RIGHT
            });

            setCode(room.code);
            setLanguage(room.language);
            setInput(room.input);
            setOutput(room.output);
            setInRoomUsers(room.users);
            socket.off('join');
            console.log(room);
        })

        return () => {
            socket.off('join');
        }
    }, []);

    useEffect(() => {
        const resizeBtn = document.querySelector("#resize-editor");
        resizeBtn?.addEventListener("mousedown", (e) => {
            const startX = e.clientX;
            const initialWidth = document.querySelector("#editor").offsetWidth;
            console.log(initialWidth);
            document.body.addEventListener("mousemove", changeWidth);

            document.body.addEventListener("mouseup", () => {
                document.body.removeEventListener("mousemove", changeWidth);
            })

            document.body.addEventListener("mouseleave", () => {
                document.body.removeEventListener("mousemove", changeWidth);
            })

            function changeWidth(e) {
                const videoChat = document.querySelector(".video-chat");
                const editor = document.querySelector("#editor");
                const finalX = e.clientX;
                let editorWidth = initialWidth + finalX - startX;
                if (editorWidth < window.innerWidth * 0.5) {
                    editorWidth = window.innerWidth * 0.5;
                }
                editor.style.width = editorWidth + "px";
                let videoWidth = window.innerWidth - editorWidth - 50;
                if (videoWidth < window.innerWidth * 0.20)
                    videoWidth = window.innerWidth * 0.20;

                if (videoWidth > window.innerWidth * 0.35)
                    videoChat.classList.add("wide");
                else
                    videoChat.classList.remove("wide");
                videoChat.style.width = videoWidth + "px";

            }

        });
    }, [currRoom]);

    if (socket.connected) {
        {
            socket.off('userJoin');
            socket.on('userJoin', ({ msg, newUser }) => {
                const arr = [];
                arr.push(newUser);
                for (let user of inRoomUsers) {
                    arr.push(user);
                }
                setInRoomUsers(arr);
                toast.success(msg, {
                    position: toast.POSITION.TOP_RIGHT
                })
            })
        }

        {
            socket.off('userLeft');
            socket.on('userLeft', ({ msg, userId }) => {
                console.log('userLeft', msg)

                const arr = inRoomUsers.filter(user => user.id !== userId);
                setInRoomUsers(arr);
                console.log('userLeft', inRoomUsers);
                toast.error(msg, {
                    position: toast.POSITION.TOP_RIGHT
                })
            })
        }

        {
            socket.off('update')
            socket.on('update', ({ patch }) => {
                code = EditorRef.current.editor.getValue();
                let [newCode, results] = dmp.patch_apply(patch, code);
                if (results[0] === true) {
                    const pos = EditorRef.current.editor.getCursorPosition();
                    let oldn = code.split('\n').length;
                    let newn = newCode.split('\n').length;
                    code = newCode;
                    setCode(newCode);
                    const newrow = pos.row + newn - oldn;
                    if (oldn != newn) {
                        EditorRef.current.editor.gotoLine(newrow, pos.column);
                    }
                }
                else {
                    console.log('error applying patch')
                    socket.emit('getRoom', { roomid })
                }
            })

        }
        {
            socket.off('getRoom')
            socket.on('getRoom', ({ room }) => {
                setCode(room.code);
                setLanguage(room.language);
                setInput(room.input);
                setOutput(room.output);
            })

        }
        {
            socket.off('updateIO')
            socket.on('updateIO', ({ newinput, newoutput, newlanguage }) => {
                // update IO
                console.log('updateIo', newinput, newoutput, newlanguage);
                setLanguage(newlanguage);
                setInput(newinput);
                setOutput(newoutput);
            })
        }
        {
            socket.off('error')
            socket.on('error', ({ error }) => {
                console.log('error from socket call', error)
            })
        }
    }

    const IOEMIT = (a, b, c) => {
        socket.emit('updateIO', {
            roomid,
            input: a,
            output: b,
            language: c
        })
    }

    const run = async () => {
        setRunning(true);
        const id = toast.loading("Compiling...");
        const response = await apiConnector('POST', 'code/execute', { code, language, input }, { 'Authorization': `Bearer ${token}` });
        if (response?.data?.success) {
            toast.update(id, { render: "Compiled successfully", type: "success", isLoading: false, autoClose: 1000 });
            setRunning(false);
            let result = response.data.output ? response.data.output : response.data.error;
            setOutput(result);
            IOEMIT(input, result, language);
        } else {
            toast.update(id, { render: "Compilation failed", type: "error", isLoading: false, autoClose: 1500 });
            setRunning(false);
            console.log("error from axios", response.error);
        }
    };

    async function leaveRoom() {
        socket.emit('leave', { roomid });
        socket.off();
        navigate('/');
    }

    console.log(user);

    if (user.rooms && user) {
        return (
            <div className='text-white room'>
                <button id="leave-room" className=" active" onClick={leaveRoom}>Leave Room</button>
                <div className="users-joined">
                    {inRoomUsers.map((user) => (

                        <div className="user-joined" key={user.id}>
                            <img src={user.avatar} alt="" />
                            <div className="name">{user.firstName}</div>
                        </div>
                    ))}
                </div>

                <div id="resize-editor">
                    <div id="lines-resize"></div>
                </div>

                <WhiteBoard roomId={roomid} socket={socket} />
                <ToastContainer autoClose={2000} />
            </div >
        )
    }
};

export default Room;