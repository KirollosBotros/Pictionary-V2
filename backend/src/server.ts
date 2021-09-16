import { Socket } from "socket.io";
import { GameObject, JoinGameProps } from "./types/game";
import { findGame } from "./utils/findGame";
import { authenticatePassword } from "./utils/authenticatePassword";
import { removePasswords } from "./utils/removePasswords";
import express = require('express');
import { getPlayerGame } from "./utils/getPlayerGame";
import { shuffleWords, wordList } from "./utils/wordList";
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

    console.log('connection: ' + socket.id);
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
    
    socket.on('startedGame', (data: string) => {
      const totalGames = privateGames.concat(publicGames);
      let startedGame: GameObject = totalGames[0];
      console.log('startedGame');
      socket.on('disconnect', () => {
        console.log('here');
      });
      totalGames.forEach(game => {
        if (game.creator === data) {
          startedGame = game;
          game.status = 'game';
        }
        return;
      });
      if (startedGame?.creator && startedGame.players && startedGame.players.length > 0) {
        const TIMER = 45;
        const words = [... new Set(shuffleWords(wordList))];
        let secondsLeft = TIMER;
        let wordPointer = 0;
        let playerPointer = 0;
        let currDrawer: string = startedGame.players[0].id;
        let guessedRight = 0;
        let currWord = words[wordPointer];
        
        let scoreBoard = startedGame.players.reduce((acc: {[key: string]: number}, player) => {
          acc[player.id] = 0;
          return acc;
        }, {});
        socket.on('guessedRight', ([creator, playerId]) => {
          ++guessedRight;
          const points = secondsLeft;
          scoreBoard[playerId] += points;
          const keys = Object.keys(scoreBoard);
          const values = Object.values(scoreBoard);
          const newArr = keys.map((key, idx) => {
            return [key, values[idx]];
          });
          const sortedScores = newArr.sort((a, b) => {
            if (a[1] < b[1]) {
              return 1;
            } else {
              return -1;
            }
          });
          const sortedPlayers = sortedScores.map(item => item[0]);
          io.to(creator).emit('updateScore', [scoreBoard, sortedPlayers]);
        });
        io.to(startedGame.creator).emit('startGame', [currWord, scoreBoard]);
        let playersLength = startedGame.players.length;
        // used to rotate players
        const updateTurn = () => {
          guessedRight = 0;
          if (playerPointer + 1 >= startedGame.players.length) {
            playerPointer = 0;
          } else {
            ++playerPointer;
          }
          if (wordPointer + 1 >= words.length) {
            wordPointer = 0;
          } else {
            ++wordPointer;
          }
          const player = startedGame.players[playerPointer];
          currDrawer = player.id;
          currWord = words[wordPointer];
          console.log(player);
          console.log(startedGame.players)
          io.to(startedGame.creator).emit('nextTurn', [currWord, player]);
          secondsLeft = TIMER;
        }
        setInterval(() => {
          if (startedGame.players.length === 0) return;
          if (startedGame.players.length !== playersLength) {
            let notCurr = 0;
            playersLength = startedGame.players.length;
            startedGame.players.forEach(player => {
              if (player.id !== currDrawer) {
                ++notCurr;
              }
            });
            if (notCurr === startedGame.players.length) {
              updateTurn();
            }
          } else {
            io.to(startedGame.creator).emit('updateTime', secondsLeft);
            if (secondsLeft === 0 || (guessedRight === playersLength - 1 && guessedRight !== 0)) {
              updateTurn();
            } else {
              --secondsLeft;
            }
          }
        }, 1000);
      }
    });
   
    socket.on('message', ([creator, message, author]: string[]) => {
      io.to(creator).emit('new message', [message, author]);
    })

    socket.on('mouse', (data: (string | number[])[]) => {
      const lineCords = data[1];
      io.to(data[0]).emit('drawing', lineCords);
    });

    socket.on('clearedBoard', (creator: string) => {
      io.to(creator).emit('clearBoard');
    });

    socket.on('disconnect', () => {
      console.log('disconnect');
      onDisconnect(socket);
    });

    const onDisconnect = (socket: Socket) => {
      const totalGames = publicGames.concat(privateGames);
      totalGames.forEach(game => {
        game.players.forEach(player => {
          if (player.id === socket.id) {
            const idx = game.players.indexOf(player);
            game.players.splice(idx, 1);
            io.to(game.creator).emit('userDisconnect', [player.name, game.players, player.id]);
          }
        });
        if (game.players.length === 0) {
          if (game.type === 'Public') {
            const newPublic = publicGames.filter(publicGame => {
              if (game.creator === publicGame.creator) {
                return false;
              }
              return true;
            });
            publicGames = newPublic;
          }
          if (game.type === 'Private') {
            const newPrivate = privateGames.filter(privateGame => {
              if (game.creator === privateGame.creator) {
                return false;
              }
              return true;
            });
            privateGames = newPrivate;
          }
        }
      });
    }
});
