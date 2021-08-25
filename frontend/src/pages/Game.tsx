import { useParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import { useState, useEffect } from 'react';
import { GameObject, Player } from "../types/game";
import { Button, Dialog, DialogTitle, Grid } from "@material-ui/core";

interface GameProps {
  socket: Socket;
}

export default function Game({ socket }: GameProps) {
  const { id }: any = useParams();
  const { id: socketId } = socket;
  const [players, setPlayers] = useState<Player[]>([]);
  const [inGame, setInGame] = useState(false);
  const [game, setGame] = useState<GameObject | null>(null);

  interface GetGamesResponse {
    publicGames: GameObject[];
    privateGames: GameObject[];
  }

  const getGame = async () => {
    const res = await fetch('http://localhost:3001/get-games');
    const resJSON = await res.json();
    const { publicGames, privateGames } = resJSON as GetGamesResponse;
    const totalGames = publicGames.concat(privateGames);
    totalGames.forEach(game => {
      if (game.creator === id) {
        setGame(game);
        setPlayers(game.players);
      }
    })
  }

  const getPlayers = async () => {
    const res = await fetch(`http://localhost:3001/get-game?userId=${socketId}`);
    const gameObj: GameObject | null = await res.json();
    if (gameObj) {
      gameObj.players.forEach(player => {
        if (player.id === socket.id) {
          setInGame(true);
        }
      });
      setPlayers(gameObj.players);
    }
  };

  useEffect(() => {
    socket.on('userConnection', (gameObj: GameObject) => {
      setGame(gameObj);
      setPlayers(gameObj.players)
    });
    socket.on('userDisconnect', (players: Player[]) => {
      setPlayers(players);
    });
    getPlayers();
    getGame();
  }, []);


  if (!game) {
    return (
      <div>
        Game Not Found
      </div>
    )
  }
  const { maxPlayers } = game;
  const fullGame = maxPlayers <= players.length;

  return (
    <>
      <Grid container direction="column">
        {players?.map(player => (
          <Grid item>
            {player.name}
          </Grid>
        ))}
      </Grid>
      <Dialog open={!inGame && game?.type === 'Private'}>
        <DialogTitle style={{ textAlign: 'center' }}>
          {fullGame? `Join ${game?.name}` : 'Game is full'}
        </DialogTitle>
        <Button disabled={fullGame}>
          Join Game
        </Button>
      </Dialog>
    </>
  )
}
