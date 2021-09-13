import { Grid, makeStyles, TextField, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { Socket } from 'socket.io-client';
import GameCanvas from '../components/GameCanvas';
import PlayerCard from '../components/PlayerCard';
import { GameObject, Player } from '../types/game'

interface MainGameProps {
  game: GameObject;
  socket: Socket;
}

const useStyles = makeStyles(theme => ({
  playerCard: {
    height: 50,
    backgroundColor: '#98c9fa',
    verticalAlign: 'middle',
  },
  desktopCarosel: {
    [theme.breakpoints.down(950)]: {
      display: 'none',
    },
  },
  desktopCanvas: {
    [theme.breakpoints.down(950)]: {
      width: '100%',
    },
  },
  textBox: {
    width: '100%',
    height: '100%',
    border: '3px solid black',
  },
}));

export default function MainGame({ game, socket }: MainGameProps) {
  const styles = useStyles();
  const [players, setPlayers] = useState(game.players);

  useEffect(() => {
    socket.on('userDisconnect', (players: Player[]) => {
      setPlayers(players);
    });
  });

  return (
    <Grid container direction="row">
      <Grid item xs={3} className={styles.desktopCarosel}>
        <Grid 
          container 
          direction="column"
          spacing={2} 
          justifyContent="center"
          alignItems="center" 
          style={{minHeight: 700}}
        >
          {players?.map(player => (
            <PlayerCard name={player.name}/>
          ))}
        </Grid>
      </Grid>
      <GameCanvas socket={socket} creator={game.creator} />
      <Grid item xs={3} style={{ textAlign: 'center' }}>
        <Grid container direction="column" alignItems="center">
          <Grid item>
            <TextField variant="outlined"></TextField>
          </Grid>
        </Grid>
      </Grid>
    </Grid>

  )
}
