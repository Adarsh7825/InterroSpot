const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const Peer = require('simple-peer');
const wrtc = require('wrtc');

const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const compiler = require('compilex');
const { exec } = require('child_process');
const fs = require('fs');


const http = require("http");
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser'); // Add this line

const { Server } = require("socket.io");
const ACTIONS = require("./Actions");
const { off } = require("process");

const server = http.createServer(app);
const options = { stats: true }; //prints stats on console 

const io = new Server(server);
app.use(bodyParser.json()); // Add this line
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,  // enable set cookie
}));

const db = mongoose.connection;


mongoose.connect("mongodb+srv://adarshgupta2626:ZomIqn98vMdZPR7V@amazonengineering.hverwwi.mongodb.net/code", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const User = mongoose.model('User', {
  username: String,
  password: String,
});
const secretKey = 'aqjr0q39rjmq3irneqwrh83w';
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    password: hashedPassword,
  });

  await user.save();
  res.status(201).send('User registered successfully!');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(404).send('User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).send('Invalid password');
  }

  const token = jwt.sign({ username: user.username }, secretKey);

  res.cookie('authToken', token, { httpOnly: true });
  res.json({ token });
});

app.post('/editor/:roomId', async (req, res) => {


  console.log('Received request:', req.body);

  var code = req.body.code;
  var input = req.body.input;
  var inputRadio = req.body.inputRadio;
  var lang = req.body.lang;
  if (lang === 'C' || lang === 'C++') {
    if (inputRadio === 'true') {
      const command = `echo '${input}' | g++ -o executable -xc++ - && ./executable`;
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error('Error:', stderr);
          res.send({ error: stderr });
        } else {
          console.log('Output:', stdout);
          res.send({ output: stdout, compiledCode: stdout });
        }
      });
    } else {
      // Assuming `code` contains the C++ code
      const command = `echo '${code}' > source.cpp && g++ -o executable source.cpp && ./executable`;
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error('Error:', stderr);
          res.send({ error: stderr });
        } else {
          console.log('Output:', stdout);
          res.send({ output: stdout, compiledCode: stdout });
        }
      });
    }
  }

  if (lang === 'Python') {
    if (inputRadio === 'true') {
      const command = `echo '${input}' | python3 -c '${code}'`;
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error('Error:', stderr);
          res.send({ error: stderr });
        } else {
          console.log('Output:', stdout);
          res.send({ output: stdout, compiledCode: stdout }); // Include compiled code in the response
        }
      });
    } else {
      const command = `python3 -c '${code}'`;
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error('Error:', stderr);
          res.send({ error: stderr });
        } else {
          console.log('Output:', stdout);
          res.send({ output: stdout, compiledCode: stdout }); // Include compiled code in the response
        }
      });
    }
  } if (lang === 'JavaScript') {
    if (inputRadio === 'true') {
      const command = `echo "${input}" | node -e "${code}"`;
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error('Error:', error.message);
          res.send({ error: error.message });
        } else {
          console.log('Output:', stdout);
          res.send({ output: stdout, executedCode: stdout });
        }
      });
    } else {
      // Assuming `code` contains the JavaScript code
      const escapedCode = code.replace(/"/g, '\\"');
      const command = `node -e "${escapedCode}"`
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error('Error:', error.message);
          res.send({ error: error.message });
        } else {
          console.log('Output:', stdout);
          res.send({ output: stdout, executedCode: stdout });
        }
      });
    }
  }





})

app.get('/editor/:roomId', async (req, res) => {

  compiler.editor(function (data) {
    // console.log('Code Output:', data);

    res.send(data)
  })
})

const userSocketMap = {};
const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
};

const cursors = {};
let cursorPositions = {};
const peers = {};
console.log("heelo ", peers)


io.on("connection", (socket) => {
  socket.on(ACTIONS.CODE_EXECUTED, ({ roomId, output }) => {
    socket.to(roomId).emit(ACTIONS.CODE_EXECUTED, { output });
  });

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    console.log(`${username} joined room: ${roomId}`);
    const clients = getAllConnectedClients(roomId);
    // notify that new user join
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });
  // console.log('Socket connected', socket.id);

  // console.log("untriggered", peers)
  console.log("hi", userSocketMap)
  // console.log(socket.id)
  socket.on("user:call", ({ to, offer }) => {
    console.log("dfsdfsdf", to, offer);
    if (!to || !offer) {
      console.error("Invalid data received for user:call event.");
      return;
    }
    // Emit the call to the specified user
    io.to(to).emit("incoming:call", { from: socket.id, offer });
  });



  socket.on("call:accepted", ({ to, ans }) => {
    console.log("ACCEPTING CALL ", to, ans)
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    console.log("peer:nego:needed", offer);
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    console.log("peer:nego:done", ans);
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });

  // Listen for cursor position updates
  socket.on(ACTIONS.CURSOR_POSITION_UPDATE, ({ roomId, username, x, y }) => {
    // Update the cursor position for the user

    cursors[username] = { x, y };
    socket.in(roomId).emit(ACTIONS.CURSOR_POSITION_UPDATE, { cursors });
    // console.log(cursors)
    // Broadcast the cursor position to all connected clients in the room except the sender
    // io.in(roomId).emit(ACTIONS.CURSOR_POSITION_UPDATE, {
    //   cursors
    // });
  });

  // When a new user joins, send all existing cursors to that user
  // socket.on(ACTIONS.JOINED, ({ socketId }) => {
  //   // Get all existing cursors
  //   const existingCursors = Object.values(cursors);

  //   // Send the existing cursors to the new user
  //   socket.to(socketId).emit(ACTIONS.ALL_CURSORS_UPDATE, existingCursors);
  // });





  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code, username, cursorPos }) => {
    // Check if the user already has a cursor position recorded
    if (!cursorPositions[username]) {
      cursorPositions[username] = { cursorPos: null };
    }

    // Update the cursor position for the user
    cursorPositions[username].cursorPos = cursorPos;

    // console.log(username);


    // Emit the code change event to all clients in the room
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code, username, cursorPositions });
    // console.log(cursorPositions);
  });

  // leave room
  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    // leave all the room
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });

    delete userSocketMap[socket.id];
    socket.leave();
  });
});

const PORT = 5000; // Use a fixed port number
compiler.flush(function () {
  console.log('All temporary files flushed !');
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));