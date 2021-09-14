import { Grid, makeStyles, TextField, Typography } from '@material-ui/core'
import { useEffect, useState, useMemo } from 'react'
import * as React from 'react';
import { Socket } from 'socket.io-client';
import GameCanvas from '../components/GameCanvas';
import PlayerCard from '../components/PlayerCard';
import { GameInfo, GameObject, Player } from '../types/game'
import {
  ActionRequest,
  AudioActionResponse,
  ChatController,
  FileActionResponse,
  MuiChat,
} from 'chat-ui-react';

interface MainGameProps {
  game: GameObject;
  socket: Socket;
  currWord: string;
}

const useStyles = makeStyles(theme => ({
  playerCard: {
    height: 50,
    backgroundColor: '#98c9fa',
    verticalAlign: 'middle',
  },
  desktopCarosel: {
    [theme.breakpoints.down(1230)]: {
      display: 'none',
    },
  },
  desktopCanvas: {
    [theme.breakpoints.down(800)]: {
      width: '100%',
    },
  },
  textBox: {
    width: '100%',
    height: '100%',
    border: '3px solid black',
  },
  chatBox: {
    height: 550,
    width: '90%',
    maxWidth: 300,
    textAlign: 'center',
    [theme.breakpoints.down(800)]: {
      height: 200,
      width: 625,
      maxWidth: 625,
    },
    [theme.breakpoints.down(700)]: {
      height: 200,
      width: 535,
      maxWidth: 700,
    },
    [theme.breakpoints.down(615)]: {
      height: 200,
      width: 400,
      maxWidth: 700,
    },
    [theme.breakpoints.down(450)]: {
      height: 200,
      width: 330,
      maxWidth: 700,
    },
    [theme.breakpoints.down(380)]: {
      height: 135,
      width: 260,
      maxWidth: 700,
    },
    [theme.breakpoints.down(340)]: {
      height: 80,
      width: 260,
      maxWidth: 700,
    },
  },
  word: {
    fontSize: 30,
    [theme.breakpoints.down('sm')]: {
      fontSize: 22,
      marginTop: theme.spacing(2),
    },
    fontWeight: 300,
  },
  mobile: {
    [theme.breakpoints.down(1230)]: {
      display: 'none',
    },
  },
  mobileTimer: {
    [theme.breakpoints.up(1230)]: {
      display: 'none',
    },
    textAlign: 'center',
  },
}));

export default function MainGame({ game, socket, currWord }: MainGameProps) {
  const styles = useStyles();
  const [players, setPlayers] = useState(game.players);
  const [secondsLeft, setSecondsLeft] = useState<number>();
  const [currentDrawer, setCurrentDrawer] = useState<string>(game.players[0].id);
  const [chatCtl] = useState(new ChatController());
  const [cnvHeight, setCnvHeight] = useState(0);

  useEffect(() => {
    socket.on('userDisconnect', (players: Player[]) => {
      setPlayers(players);
    });
    socket.on('updateTime', (secondsLeft: number) => {
      setSecondsLeft(secondsLeft);
    });
    socket.on('new message', ([msg, author]) => {
      if (author !== socket.id) {
        chatCtl.addMessage({
          type: 'text',
          content: msg,
          self: false,
        });
      }
    });
  }, []);

  useMemo(async () => {
    const msg = await chatCtl.setActionRequest({ 
      type: 'text', 
      placeholder: 'Guess word here',
      always: true,
    }, (response) => {
      socket.emit('message', [game.creator, response.value, socket.id]);
    });
  }, [chatCtl]);

  const handleTurnChange = (currDrawer: string) => {
    setCurrentDrawer(currDrawer);
    console.log(currDrawer)
  };

  console.log(cnvHeight);

  return (
    <Grid container direction="column" alignItems="center" justifyContent="center" spacing={3}>
      <Grid container direction="row" alignItems="center" className={styles.mobileTimer}>
        <Grid item xs={2} className={styles.mobileTimer}>
          <Typography style={{ fontSize: 36, marginTop: 15 }}>{secondsLeft}</Typography>
        </Grid>
        <Grid item xs={8} style={{textAlign: 'center'}}>
          {socket.id === currentDrawer ?
            <Typography className={styles.word}>Your word to draw is: <strong>{currWord}</strong></Typography>
          : <Typography className={styles.word}>{'_ '.repeat(currWord.length)}</Typography>}
        </Grid>
        <Grid item xs={2} />
      </Grid>
      <Grid item className={styles.mobile}>
        {socket.id === currentDrawer ?
          <Typography className={styles.word}>Your word to draw is: <strong>{currWord}</strong></Typography>
        : <Typography className={styles.word}>{'_ '.repeat(currWord.length)}</Typography>}
      </Grid>
      <Grid item>
        <Grid container direction="row" spacing={2} justifyContent="center">
          <Grid item className={styles.desktopCarosel}>
            <Grid 
              container 
              direction="column"
              spacing={2} 
              justifyContent="flex-start"
              alignItems="center" 
              style={{ minHeight: 700 }}
            >
              <Grid item>
                <Typography style={{ fontSize: 42 }}>{secondsLeft}</Typography>
              </Grid>
              {players?.map(player => (
                <PlayerCard name={player.name}/>
              ))}
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="column" justifyContent="center" alignItems="center">
              <Grid item style={{ touchAction: 'none' }}>
                <GameCanvas
                  socket={socket} 
                  game={game} 
                  players={players} 
                  getHeight={(height: number) => setCnvHeight(height)}
                  onNextTurn={(player: string) => handleTurnChange(player)}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item style={{ textAlign: 'center' }}>
            <Grid container direction="column" alignItems="center">
              <Grid item className={styles.chatBox}>
                <MuiChat chatController={chatCtl} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
