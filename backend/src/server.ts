import { Socket } from "socket.io";
import { GameObject, JoinGameProps } from "./types/game";
import { findGame } from "./utils/findGame";
import { authenticatePassword } from "./utils/authenticatePassword";
import { removePasswords } from "./utils/removePasswords";
import express = require('express');
import { getPlayerGame } from "./utils/getPlayerGame";
const cors = require('cors');
const bodyParser = require('body-parser');
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
});

app.post('/create-game', (req: express.Request, res: express.Response) => {
  const gameObj: GameObject = req.body
  const { type } = gameObj;
  if (!gameObj) {
    return res.status(200).json({
      status: 'error',
      reason: 'Cannot find game',
    });
  }
  if (type === 'Private') {
    privateGames.push(gameObj);
  } else {
    publicGames.push(gameObj);
  }
  console.log(gameObj);
  return res.status(200).json({
    status: 'successful',
  });
});

app.post('/join-game', (req: express.Request, res: express.Response) => {
  const { creator, name, id } = req.body;
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
  if (gameObj.type === 'Private') {
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
  console.log(gameObj);
  return res.status(200).json({
    status: 'successful',
  });
});

// http://localhost:3001/validate?creator=asd&password=passss
app.get('/validate', (req: express.Request, res: express.Response) => {
  authenticatePassword({ req, res, privateGames, method: 'GET', app});
});

app.get('/get-game', (req: express.Request, res: express.Response) => {
  const { userId } = req.query;
  const gameObj = getPlayerGame(privateGames.concat(publicGames), userId as string);
  return res.status(200).json(gameObj);
});

io.on('connection', (socket: Socket) => {
    socket.on('createGame', (data: GameObject) => {
      data.type === 'Public' ? publicGames.push(data) : privateGames.push(data);
    });
    socket.on('getGames', () => {
      socket.emit('getGamesResponse', [
        publicGames,
        privateGames,
      ]);
    });
    socket.on('joinGame', (data: JoinGameProps) => {
      const { gameId } = data;
      socket.join(gameId);
      const gameObj = findGame(gameId, privateGames.concat(publicGames));
      io.to(gameId).emit('userConnection', gameObj);
    });
    socket.on('disconnect', () => {
      console.log('disconnect');
      const totalGames = publicGames.concat(privateGames);
      totalGames.forEach(game => {
        game.players.forEach(player => {
          if (player.id === socket.id) {
            const idx = game.players.indexOf(player);
            game.players.splice(idx, 1);
            io.to(game.creator).emit('userDisconnect', game.players);
          }
        });
      });
    });
});
