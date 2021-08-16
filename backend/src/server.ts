import { Socket } from "socket.io";
import express = require('express');
import { GameObject, JoinGameProps } from "./types/game";
import { findGame } from "./utils/findGame";
import { authenticatePassword } from "./utils/authenticatePassword";
import { removePasswords } from "./utils/removePasswords";
const bodyParser = require('body-parser');

const cors = require('cors');
const socket = require('socket.io');

const app = express();
app.use(cors());
app.use(bodyParser.json());

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

app.get('/get-games', (req: express.Request, res: express.Response) => {
  res.json({
    privateGames: removePasswords(privateGames),
    publicGames,
  });
  console.log(privateGames)
  console.log('sent games');
});

app.post('/create-game', (req: express.Request, res: express.Response) => {
  const gameObj: GameObject = req.body
  const { gameType } = gameObj;
  if (!gameObj) {
    return res.status(200).json({
      status: 'error',
      reason: 'Cannot find game',
    });
  }
  if (gameType === 'Private') {
    privateGames.push(gameObj);
  } else {
    publicGames.push(gameObj);
  }
  return res.status(200).json({
    status: 'successful',
  });
});

app.post('/join-game', (req: express.Request, res: express.Response) => {
  const { creator, name, id } = req.body;
  console.log(req.body)
  const gameObj = findGame(creator, privateGames.concat(publicGames));
  if (!gameObj) {
    return res.status(200).json({ 
      status: 'unsuccessful',
      reason: 'Game does not exist'
    });
  }
  if (gameObj.players.length >= gameObj.maxPlayers) {
    return res.status(200).json({
      status: 'unsuccessful',
      reason: 'Game is full',
    });
  }
  if (gameObj.gameType === 'Private') {
    const valid = authenticatePassword({ req, res, privateGames, method: 'POST', app });
    if (!valid) {
      return res.status(200).json({
        status: 'unsuccessful',
        reason: 'Unauthenticated',
      });
    }
  }
  const newPlayer = { id, name };
  gameObj.players.push(newPlayer);
  return res.status(200).json({
    status: 'successful',
  });
});

// http://localhost:3001/validate?creator=asd&password=passss
app.get('/validate', (req: express.Request, res: express.Response) => {
  authenticatePassword({ req, res, privateGames, method: 'GET', app});
});

io.on('connection', (socket: Socket) => {
    socket.on('createGame', (data: GameObject) => {
      data.gameType === 'Public' ? publicGames.push(data) : privateGames.push(data);
    });
    socket.on('getGames', () => {
      socket.emit('getGamesResponse', [
        publicGames,
        privateGames,
      ]);
    });
    socket.on('joinGame', (data: JoinGameProps) => {
      const { name, id, gameId } = data;
      const gameObj: GameObject | null = findGame(gameId, publicGames.concat(privateGames));
      if (!gameObj) {
        throw new Error('Game not found');
      }
      socket.join(gameId);
      const newPlayer= {
        id,
        name,
      };
      gameObj.players.push(newPlayer);
    });
});
