import { Socket } from 'socket.io-client';
import history from '../config/history';
import host from '../config/host';
import { GameObject } from '../types/game';

interface JoinGameProps {
  playerId: string;
  game: GameObject;
  name: string;
  password?: string;
  socket: Socket;
}

export const joinGame = async ({ playerId, game, name, password, socket }: JoinGameProps) => {
  const redirectLink = '/game/' + game.creator;
  try {
    const res = await fetch(`${host}/join-game`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        creator: game.creator,
        password,
        name,
        id: playerId,
      }),
    });
    const resJSON = await res.json();
    const { status } = resJSON;
    socket.emit('updatePlayers', game);
    if (status === 'successful') {
      socket.emit('joinGame', {
        name,
        id: playerId,
        gameId: game.creator,
      });
      history.push(redirectLink);
      return 'success';
    }
    return;
  } catch (err) {
    return;
  }
};
