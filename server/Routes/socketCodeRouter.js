const { addRoomUser, removeRoomUser, updateRoom, deleteRoom, updateRoomInputOutput, getRoom, createRoom } = require('../Room/socketRoom');

function manageRoom(socket, io) {
    const { id: socketId } = socket;

    socket.on('joinRoom', async ({ roomName = 'Room X', roomid, name, code = '', language = 'javascript', input = '', output = '', avatar = '' }) => {
        try {
            if (!name) {
                throw new Error("Name is required");
            }
            createRoom(roomid, roomName, code, language, input, output, avatar);
            addRoomUser(roomid, { id: socketId, name, avatar });
            await socket.join(roomid);

            socket.emit('join', { msg: `Welcome to ${roomName} room`, room: getRoom(roomid) });

            socket.to(roomid).emit('userJoin', { msg: `${name} joined the room`, newUser: { id: socketId, name, avatar } });
        } catch (error) {
            console.log("Error in joining room", error);
            socket.emit('error', { msg: error.message });
        }
    });

    socket.on('leaveRoom', ({ roomid }) => {
        try {
            const name = removeRoomUser(roomid, socketId);
            socket.leave(roomid);
            io.to(roomid).emit('userLeave', { msg: `${name} left the room`, userId: socketId });
            console.log(`${name} left the room`);
        } catch (error) {
            console.log("Error in leaving room", error);
        }
    });

    socket.on('update', ({ roomid, patch }) => {
        try {
            updateRoom(roomid, patch);
            socket.to(roomid).emit('update', patch);
        } catch (error) {
            console.log("Error in updating room", error);
        }
    });

    socket.on('updateInputOutput', ({ roomid, input, output, language }) => {
        try {
            updateRoomInputOutput(roomid, input, output, language);
            socket.to(roomid).emit('updateInputOutput', { newinput: input, newoutput: output, newlanguage: language });
        } catch (error) {
            console.log(error);
        }
    });
    socket.on('disconnect', () => {
        console.log("User disconnected", socketId);
        let roomid = removeRoomUser(socketId);
        if (roomid) {
            socket.leave(roomid);
            io.to(roomid).emit('userLeave', { msg: `User left the room`, userId: socketId });
        }
    });
    socket.on('getRoom', ({ roomid }) => {
        try {
            io.in(roomid).emit('getRoom', { room: getRoom(roomid) });
        } catch (err) {
            console.log(err);
            socket.emit('error', { error: err });
        }
    });

    socket.on('deleteRoom', ({ roomid }) => {
        try {
            deleteRoom(roomid);
            socket.to(roomid).emit('deleteRoom', { msg: `Room deleted` });
        } catch (error) {
            console.log("Error in deleting room", error);
            socket.emit('error', { msg: error.message });
        }
    });

    socket.on('Id', ({ roomid, peerId, name }) => {
        try {
            console.log(peerId, name)
            socket.to(roomid).emit('Id', { peerId, name });
        } catch (error) {
            console.log("Error in sending Id", error);
        }
    });
    socket.on('drawData', (data) => {
        try {
            socket.to(data.roomid).emit('drawData', data);
        } catch (error) {
            console.log("Error in sending draw data", error);
        }
    });
    socket.on('start-video', (data) => {
        try {
            console.log("Starting video")
            socket.broadcast.emit('start-video', data);
        } catch (error) {
            console.log("Error in starting video", error);
        }
    });
    socket.on('quit-video', (data) => {
        try {
            console.log("Quitting video")
            socket.to(roomid).emit('quit-video', data.peerId);
        } catch (error) {
            console.log("Error in quitting video", error);
        }
    });
}

module.exports = manageRoom;