import { Socket } from "socket.io";
import { GameObject, JoinGameProps } from "./types/game";
import express = require('express');
import { findGame } from "./utils/findPrivateGame";

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

// const removePassword = (games: GameObject[]) => {
//   const tempGames = games;
//   const newGames = tempGames.map(game => {
//     delete game.password;
//   });
//   return newGames;
// };

// http://localhost:3001/validate?creator=asd&password=passss
app.get('/validate', (req: express.Request, res: express.Response) => {
  const { creator, password } = req.query;

  const gameObj: GameObject = findGame(creator as string, privateGames);
  console.log(gameObj)

  const { password: gamePass, maxPlayers, players } = gameObj;

  if (gamePass === password) {
    if (maxPlayers > players.length) {
      res.json({ result: true });
    } else {
      res.json({ result: 'Room is Full' });
    }
  } else {
    res.json({ result: 'Incorrect Password' });
  }
});

io.on('connection', (socket: Socket) => {
    socket.on('createGame', (data: GameObject) => {
      data.gameType === 'Public' ? publicGames.push(data) : privateGames.push(data);
      console.log(privateGames);
    });
    socket.on('getGames', () => {
      socket.emit('getGamesResponse', [
        publicGames,
        privateGames,
      ]);
      console.log(privateGames)
    });
    socket.on('joinGame', (data: JoinGameProps) => {
      const { name, id, gameId } = data;
      const gameObj: GameObject = findGame(gameId, publicGames.concat(privateGames));
      socket.join(gameId);
      const newPlayer= {
        id,
        name,
      };
      gameObj.players.push(newPlayer);
      console.log(gameObj.players);
    });
});
