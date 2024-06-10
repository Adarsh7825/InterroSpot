const { createRoom, addRoomUser, removeRoomUser, getRoom, updateRoom, updateRoomInputOutput, deleteRoom } = require('../Room/socketRoom');

function manageRoom(socket, io) {
    const { id: socketId } = socket;

    socket.on('join', async ({ roomid, name, code = '', language = 'javascript', input = '', output = '', avatar = '' }) => {
        try {
            if (!name) {
                throw new Error('Invalid data');
            }
            createRoom(roomid, code, language, input, output);

            addRoomUser(roomid, { id: socketId, name, avatar });

            await socket.join(roomid);

            socket.emit('join', { msg: 'Welcome to room', room: getRoom(roomid) });

            socket.to(roomid).emit('userJoin', { msg: `New user joined ${name}`, newUser: { id: socketId, name, avatar } });

        } catch (err) {
            console.log(err);
            socket.emit('error', { error: err.message });
        }
    });

    socket.on('update', ({ roomid, patch }) => {
        try {
            updateRoom(roomid, patch);
            socket.to(roomid).emit('update', { patch });
        } catch (err) {
            console.log(err);
            socket.emit('error', { error: err.message });
        }
    });

    socket.on('leave', ({ roomid }) => {
        try {
            const name = removeRoomUser(roomid, socketId);
            socket.leave(roomid);
            io.to(roomid).emit('userLeft', { msg: `${name} left the room`, userId: socketId });
            console.log('user left', name);

        } catch (err) {
            console.log(err);
            socket.emit('error', { error: err.message });
        }
    });

    socket.on('updateIO', ({ roomid, input, output, language }) => {
        try {
            console.log('updateIO', input, output, language)
            updateRoomInputOutput(roomid, input, output, language);
            socket.to(roomid).emit('updateIO', {
                newinput: input,
                newoutput: output,
                newlanguage: language
            });
        } catch (err) {
            console.log(err);
            socket.emit('error', { error: err.message });
        }
    });

    socket.on('updateOutput', ({ roomid, newOutput }) => {
        try {
            io.to(roomid).emit('updateOutput', { newOutput });
        } catch (err) {
            console.log(err);
            socket.emit('error', { error: err.message });
        }
    });

    socket.on('getRoom', ({ roomid }) => {
        try {
            io.in(roomid).emit('getRoom', { room: getRoom(roomid) });
        } catch (err) {
            console.log(err);
            socket.emit('error', { error: err.message });
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        let roomid = deleteRoom(socketId);
        if (roomid !== null) {
            const name = removeRoomUser(roomid, socketId);
            socket.leave(roomid);
            io.to(roomid).emit('userLeft', { msg: `${name} left the room`, userId: socketId });
            console.log('user left', name);
        }
    });

    socket.on('Id', ({ roomid, peerId, name }) => {
        console.log("peerId", peerId)
        socket.to(roomid).emit('Id', { peerId, name });
    });

    socket.on("drawData", (data) => {
        socket.to(data.roomId).emit("drawData", data);
    });

    socket.on("start-video", (data) => {
        socket.broadcast.emit("start-video", data);
    });

    socket.on("quit-video", (data) => {
        console.log(data);
        socket.to(data.roomId).emit("quit-video", data.peerId);
    });

    socket.on('update-cursor-position', ({ roomId, username, x, y }) => {
        console.log('Server Received Cursor Update:', { roomId, username, x, y });
        const room = getRoom(roomId);
        if (room) {
            const cursors = room.users.reduce((acc, user) => {
                if (user.name === username) {
                    acc[username] = { x, y };
                }
                return acc;
            }, {});
            console.log('Broadcasting Cursor Update:', { cursors });
            io.to(roomId).emit('update-cursor-position', { cursors });
        }
    });

    socket.on('tab-visibility-change', ({ roomId, isTabActive }) => {
        socket.to(roomId).emit('tab-visibility-change', { roomId, isTabActive });
    });

    socket.on('clearCanvas', ({ roomId }) => {
        io.to(roomId).emit('clearCanvas');
    });
}

module.exports = manageRoom;