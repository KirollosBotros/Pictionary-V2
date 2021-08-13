import { Socket } from "socket.io";

const express = require('express');
const cors = require('cors');
const socket = require('socket.io');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
    console.log('Server running on port ', PORT);
});

const io = socket(server, {
    cors: {
        origin: '*',
    },
});

io.on('connection', (socket: Socket) => {
    console.log('Connection Received:', socket.id);
    socket.on('createGame', () => {
      console.log('Create Game');
    });
    socket.on('joinRoon', (data: {gameCode: string}) => {
        // if (roomIsFull(data)) {
        //     socket.emit('error', 'full');
        // } else if (invalidCode(data)) {
        //     socket.emit('error', 'invalid code');
        // } else {
        //     socket.join(data.gameCode);
        // }
    });
    socket.on('joinGame', () => {
      console.log('Join game');
      // if (roomIsFull(data)) {
      //     socket.emit('error', 'full');
      // } else if (invalidCode(data)) {
      //     socket.emit('error', 'invalid code');
      // } else {
      //     socket.join(data.gameCode);
      // }
  });
});
