import { createStyles, Grid, makeStyles, Typography, Theme } from '@material-ui/core'
import { useEffect, useState, useMemo } from 'react'
import * as React from 'react';
import { Socket } from 'socket.io-client';
import GameCanvas from '../components/GameCanvas';
import PlayerCard from '../components/PlayerCard';
import { GameObject, Player } from '../types/game'
import {
  ChatController,
  MuiChat,
} from 'chat-ui-react';

const TIMER = 20;

interface MainGameProps {
  game: GameObject;
  socket: Socket;
  currWord: string;
  scoreBoard: Record<string, number>;
}

type Props = {
  cnvHeight: number;
}

const useStyles = makeStyles<Theme, Props>((theme: Theme) => 
  createStyles({
    playerCard: {
      height: 50,
      backgroundColor: '#98c9fa',
      verticalAlign: 'middle',
    },
    desktopCarosel: {
      maxHeight: 100,
      [theme.breakpoints.down(1230)]: {
        display: 'none',
      },
    },
    textBox: {
      width: '100%',
      height: '100%',
      border: '3px solid black',
    },
    chatBox: {
      height: 200,
      textAlign: 'center',
      [theme.breakpoints.up(800)]: {
        height: (props: Props) => props.cnvHeight - 15,
      },
      [theme.breakpoints.down(800)]: {
        width: (props: Props) => props.cnvHeight * 1.176,
      },
      [theme.breakpoints.down(700)]: {
        height: 200,
      },
      [theme.breakpoints.down(615)]: {
        height: 200,
      },
      [theme.breakpoints.down(450)]: {
        height: 200,
      },
      [theme.breakpoints.down(380)]: {
        height: 135,
      },
      [theme.breakpoints.down(340)]: {
        height: 80,
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
      [theme.breakpoints.down(1100)]: {
        marginTop: theme.spacing(2),
      },
      [theme.breakpoints.down(600)]: {
        marginTop: theme.spacing(1),
      },
      textAlign: 'center',
    },
}));

export default function MainGame({ game, socket, currWord, scoreBoard }: MainGameProps) {
  const [cnvHeight, setCnvHeight] = useState(0);
  const styles = useStyles({ cnvHeight });
  const [players, setPlayers] = useState(game.players);
  const [secondsLeft, setSecondsLeft] = useState<number>(TIMER);
  const [currentDrawer, setCurrentDrawer] = useState<string>(game.players[0].id);
  const [chatCtl] = useState(new ChatController());
  const [currentWord, setCurrentWord] = useState(currWord);
  const [scores, setScores] = useState<Record<string, number>>(scoreBoard);
  const [sortedPlayers, setSortedPlayers] = useState<string[]>(players.map(player => player.id));
  const [correctGuessers, setCorrectGuessers] = useState<string[]>([]);

  useEffect(() => {
    socket.on('userDisconnect', (data) => {
      setPlayers(data[1]);
      let tempSorted = sortedPlayers;
      tempSorted.splice(sortedPlayers.indexOf(data[2]), 1);
      console.log(tempSorted)
      setSortedPlayers(tempSorted);
    });
    socket.on('updateTime', (secondsLeft: number) => {
      setSecondsLeft(secondsLeft);
    });
    socket.on('nextTurn', ([word, player]) => {
      setCurrentWord(word);
      setCorrectGuessers([]);
    });
    socket.on('updateScore', ([updatedScores, sortedPlayers]) => {
      setScores(updatedScores);
      setSortedPlayers(sortedPlayers);
    });
  }, []);

  console.log(correctGuessers);

  useMemo(async () => {
    const msg = await chatCtl.setActionRequest({ 
      type: 'text', 
      placeholder: 'Guess word here',
      always: true,
    }, (response) => {
      socket.emit('message', [game.creator, response.value, socket.id]);
    });
    socket.off('new message');
    socket.on('new message', ([msg, author]) => {
      if (msg.toLowerCase() === currentWord.toLowerCase()) {
        let name: string = '';
        game.players.forEach(player => {
          if (player.id === author) {
            name = player.name;
            socket.emit('guessedRight', [game.creator, player.id]);
            console.log(correctGuessers);
            let tempGuessers = correctGuessers;
            tempGuessers.push(player.id);
            setCorrectGuessers(tempGuessers);
          }
        });
        const guessedRightMsg = `${name} guessed the word!`;
        chatCtl.addMessage({
          type: 'text',
          content: guessedRightMsg,
          self: false,
        });
      } else if (author !== socket.id) {
        chatCtl.addMessage({
          type: 'text',
          content: msg,
          self: false,
        });
      }
    });
    socket.off('userDisconnect');
    socket.on('userDisconnect', (data) => {
      setPlayers(data[1]);
      const disconnectedMsg = `${data[0]} has left the game`;
      chatCtl.addMessage({
        type: 'text',
        content: disconnectedMsg,
        self: false,
      });
    });
  }, [chatCtl, currentWord, correctGuessers]);

  const handleTurnChange = (currDrawer: string) => {
    setCurrentDrawer(currDrawer);
  };

  return (
    <Grid container direction="column" alignItems="center" justifyContent="center" spacing={3}>
      <Grid container direction="row" alignItems="center" className={styles.mobileTimer}>
        <Grid item xs={2}>
          <Typography style={{ fontSize: 24, marginTop: 15 }}>{secondsLeft}</Typography>
        </Grid>
        <Grid item xs={8} style={{textAlign: 'center'}}>
          {socket.id === currentDrawer ?
            <Typography className={styles.word}>Your word to draw is: <strong>{currentWord}</strong></Typography>
          : <Typography className={styles.word}>{'_ '.repeat(currentWord.length)}</Typography>}
        </Grid>
        <Grid item xs={2} />
      </Grid>
      <Grid item className={styles.mobile}>
        {socket.id === currentDrawer ?
          <Typography className={styles.word}>Your word to draw is: <strong>{currentWord}</strong></Typography>
        : <Typography className={styles.word}>{'_ '.repeat(currentWord.length)}</Typography>}
      </Grid>
      <Grid item>
        <Grid container direction="row" spacing={2} justifyContent="center">
          <Grid item className={styles.desktopCarosel} style={{ maxHeight: cnvHeight, overflowY: 'auto' }}>
            <Grid 
              container 
              direction="column"
              spacing={2} 
              justifyContent="flex-start"
              alignItems="center" 
            >
              <Grid item>
                <Typography style={{ fontSize: 42 }}>{secondsLeft}</Typography>
              </Grid>
              {sortedPlayers?.map((player, idx) => {
                let name = '';
                let id = '';
                players.forEach(playerObj => {
                  if (player === playerObj.id) {
                    name = playerObj.name;
                    id = playerObj.id;
                  }
                });
                // change up this stuff to account for rank change
                if (name !== '') {
                  return (
                    <PlayerCard
                      name={name}
                      score={scores[player]}
                      rank={idx + 1}
                      drawBorder={currentDrawer === id}
                      guessedRight={correctGuessers.includes(id)}
                    />
                  )
                }
              })}
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
                  onNextTurn={(player: string, word: string) => {
                    handleTurnChange(player);
                    setCurrentWord(word);
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item style={{ textAlign: 'center' }}>
            <Grid container direction="column" alignItems="center">
              <Grid item className={styles.chatBox} style={{ pointerEvents: socket.id === currentDrawer ? 'none' : 'auto' }}>
                <MuiChat chatController={chatCtl} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}