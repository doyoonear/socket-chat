const path = require('path');
const http = require('http'); 
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const botName = 'ChatBot';

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Run when client connets
io.on('connection', socket=> {
  socket.emit('message', formatMessage(botName, 'Welcome to chatcord!'));

  // MEMO: emit to everyone except the client that's connecting
  // Broadcast when a user connects
  socket.broadcast.emit('message', formatMessage(botName, 'A user has joined the chat')); 

  socket.on('disconnect', ()=> { 
    io.emit('message', formatMessage(botName, 'A user has left the chat'))
  })

  // Listen for chat message
  socket.on('chatMessage', msg => {
    // Send message to client side
    io.emit('message',formatMessage('USER', msg));
  })
})

const PORT = 3000 || process.env.PORT;
server.listen(PORT, ()=> console.log(`Server running on port ${PORT}... `));