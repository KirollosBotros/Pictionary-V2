import { Socket } from "socket.io";
import { GameObject } from "./types/game";

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

let publicGames: GameObject[] = [];
let privateGames: GameObject[] = [];

io.on('connection', (socket: Socket) => {
    socket.on('createGame', (data: GameObject) => {
      data.gameType === 'Public' ? publicGames.push(data) : privateGames.push(data);
    });
    socket.on('getGames', () => {
      console.log(publicGames)
      console.log('getGames request recieved')
      socket.emit('getGamesResponse', [
        publicGames,
        privateGames,
      ]);
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
