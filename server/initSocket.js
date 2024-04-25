const manageRoom = require('./Routes/socketCodeRouter')

const initSocketIo = (io, connection) => {
    io.on('connection', (socket) => {
        ++connection.count;
        connection.users.push(socket.id);
        io.emit('connection', connection);
        console.log(`A user connected. Total connections: ${connection.count}`);

        manageRoom(socket, io);

        socket.on('disconnect', () => {
            connection.count--;
            connection.users = connection.users.filter(user => user !== socket.id);
            io.emit('disconnection', connection);
            console.log(`A user disconnected. Total connections: ${connection.count}`);
        });
    });
};

module.exports = initSocketIo;