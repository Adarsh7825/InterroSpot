const express = require('express');
const { createServer } = require('http');
const bodyParser = require('body-parser');
const userRoutes = require('./Routes/userRoutes')
const dbConnect = require('./DB/connect')
const app = express();
const cors = require('cors');
const { Server } = require('socket.io');
const httpserver = createServer(app);
const initSocketIo = require('./initSocket')
const port = process.env.PORT || 8181;
require('dotenv').config();

app.use(bodyParser.json({ limit: '1mb' }))

const io = new Server(httpserver, {
    cors: {
        origin: "*",
        transports: ['websocket', 'polling'], credentials: true
    }, allowEIO3: true
});

const connection = {
    count: 0,
    users: []
}
initSocketIo(io, connection);

app.use(cors());
app.use(express.json());
app.use("/api/v1/auth", userRoutes);
httpserver.listen(port, () => {
    console.log("Server started on port 8181");
})

dbConnect().then(() => {
    console.log("Db connected successfully");
})

app.use('/', (req, res) => {
    res.status(200).send(connection);
})