import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import Loading from '../components/Loading';
import host from '../config/host';
import { GameObject, Player } from '../types/game';
import { joinGame } from '../utils/joinGame';
import { validatePassword } from '../utils/validatePassword';
import MainGame from './MainGame';

interface GameProps {
  socket: Socket;
  connectionEstablished: boolean;
}

interface IFormInput {
  password?: string;
  name: string;
}

const useStyles = makeStyles((theme) => ({
  passwordInput: {
    marginTop: theme.spacing(1.5),
  },
  listContainer: {
    width: 385,
    [theme.breakpoints.down(405)]: {
      width: 340,
    },
    [theme.breakpoints.down(330)]: {
      width: 290,
    },
  },
  gameTitle: {
    fontSize: 36,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  twoButtons: {
    minWidth: 168,
    [theme.breakpoints.down(440)]: {
      minWidth: 100,
      fontSize: 16,
      margin: 0,
    },
    '&:hover': {
      backgroundColor: '#0944A8',
    },
    fontSize: 20,
  },
  list: {
    backgroundColor: '#ebeff0',
    marginTop: theme.spacing(2),
  },
  button: {
    margin: '0 auto',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(1.5),
    '&:hover': {
      backgroundColor: '#0944A8',
    },
  },
  name: {
    fontSize: 20,
  },
}));

export default function Game({ socket, connectionEstablished }: GameProps) {
  const { id }: any = useParams();
  const { id: socketId } = socket;
  const styles = useStyles();
  const [players, setPlayers] = useState<Player[]>([]);
  const [inGame, setInGame] = useState(false);
  const [successJoin, setSuccessJoin] = useState(false);
  const [error, setError] = useState(false);
  const [redirectToGame, setRedirectToGame] = useState(false);
  const [game, setGame] = useState<GameObject | null>(null);
  const [currWord, setCurrWord] = useState<string | null>(null);
  const [scoreBoard, setScoreBoard] = useState<Record<string, number>>({});
  const [copyMessage, setCopyMessage] = useState('Copy Invite Link');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  interface GetGamesResponse {
    publicGames: GameObject[];
    privateGames: GameObject[];
  }

  useEffect(() => {
    const getGame = async () => {
      const res = await fetch(`${host}/get-games`);
      const resJSON = await res.json();
      const { publicGames, privateGames } = resJSON as GetGamesResponse;
      const totalGames = publicGames.concat(privateGames);
      totalGames.forEach((game) => {
        if (game.creator === id) {
          setGame(game);
          setPlayers(game.players);
        }
      });
    };

    const getPlayers = async () => {
      const res = await fetch(`${host}/get-game?userId=${socketId}`);
      const gameObj: GameObject | null = await res.json();
      if (gameObj) {
        gameObj.players.forEach((player) => {
          if (player.id === socket.id) {
            setInGame(true);
          }
        });
        setPlayers(gameObj.players);
      }
    };

    socket.on('userConnection', (gameObj: GameObject) => {
      setGame(gameObj);
      setPlayers(gameObj.players);
    });
    socket.on('userDisconnect', (data) => {
      setPlayers(data[1]);
    });
    socket.on('startGame', ([currWord, scoreBoard]) => {
      setCurrWord(currWord);
      setScoreBoard(scoreBoard);
      setRedirectToGame(true);
    });
    getPlayers();
    getGame();
  }, [socket, id, socketId]);

  if (!connectionEstablished) {
    return <Loading />;
  }

  if (!game) {
    return <div>Game Not Found</div>;
  }
  const { maxPlayers } = game;
  const fullGame = maxPlayers <= players.length;

  const onSubmit = async (data: IFormInput) => {
    const { name, password } = data;
    const joinGameRes = await joinGame({
      playerId: socketId,
      game,
      name,
      password,
      socket,
    });
    if (joinGameRes === 'success') {
      setSuccessJoin(true);
    }
  };

  const validatePass = async (v: any) => {
    const validationResponse = await validatePassword({
      game,
      v,
    });
    if (validationResponse === true) {
      return true;
    } else {
      const err = validationResponse.error;
      setError(err);
      return false;
    }
  };

  const startGame = () => {
    socket.emit('startedGame', game.creator);
  };

  const copyMessageToClipboard = (event: React.MouseEvent<HTMLElement>) => {
    const prod = window.location.hostname !== 'localhost';
    const link = `${prod ? 'https://' : 'http://'}${window.location.host}${
      window.location.pathname
    }`;
    navigator.clipboard.writeText(link);
    setCopyMessage('Copied!');
  };

  if (redirectToGame && currWord) {
    return <MainGame game={game} socket={socket} currWord={currWord} scoreBoard={scoreBoard} />;
  }

  if (connectionEstablished) {
    return (
      <>
        <Grid container direction="column" alignItems="center">
          <Grid item>
            <Typography className={styles.gameTitle}>{game.name}</Typography>
          </Grid>
          {socket.id === game.creator ? (
            <Grid item>
              <Grid container direction="row" spacing={2}>
                <Grid item>
                  <Button onClick={startGame} className={styles.twoButtons}>
                    Start Game
                  </Button>
                </Grid>
                <Grid item>
                  <Button onClick={copyMessageToClipboard} className={styles.twoButtons}>
                    {copyMessage}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <Grid item>
              <Button onClick={copyMessageToClipboard} className={styles.twoButtons}>
                {copyMessage}
              </Button>
            </Grid>
          )}
          <Box className={styles.list}>
            <List dense={true} className={styles.listContainer}>
              {players?.map((player) => (
                <ListItem
                  key={player.id}
                  style={{
                    marginBottom: 10,
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      style={{
                        width: 43,
                        height: 43,
                      }}
                    >
                      <PersonIcon fontSize="large" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography className={styles.name}>{player.name}</Typography>}
                    secondary={game.creator === player.id ? 'Host' : ''}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Grid>
        <Dialog open={(!inGame && !successJoin) || game.status === 'game'}>
          <DialogTitle
            style={{
              textAlign: 'center',
            }}
          >
            {fullGame
              ? 'Game is full'
              : game.status === 'game'
              ? 'Game Already Started'
              : `Join ${game?.name}`}
          </DialogTitle>
          {game.status !== 'game' && (
            <>
              <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <FormControl>
                    <TextField
                      variant="outlined"
                      required
                      inputProps={{
                        maxLength: 10,
                      }}
                      label="Enter Name"
                      {...register('name', {
                        required: true,
                        maxLength: 10,
                      })}
                    />
                    {errors?.name?.type === 'required' && (
                      <FormHelperText
                        error
                        style={{
                          marginBottom: 15,
                        }}
                      >
                        Please enter your name
                      </FormHelperText>
                    )}
                    {game?.type === 'Private' && (
                      <TextField
                        variant="outlined"
                        label="Enter Password"
                        className={styles.passwordInput}
                        required
                        {...register('password', {
                          required: game?.type === 'Private',
                          validate: validatePass,
                        })}
                      />
                    )}
                    {errors?.password?.type === 'validate' || error ? (
                      <FormHelperText error>{error}</FormHelperText>
                    ) : (
                      errors?.password?.type === 'required' && (
                        <FormHelperText error>Please enter the password</FormHelperText>
                      )
                    )}
                  </FormControl>
                </form>
              </DialogContent>
              <Button
                className={styles.button}
                disabled={fullGame}
                onClick={handleSubmit(onSubmit)}
              >
                {fullGame ? (
                  <Typography
                    style={{
                      color: 'white',
                    }}
                  >
                    Room is Full
                  </Typography>
                ) : (
                  'Join Game'
                )}
              </Button>
            </>
          )}
        </Dialog>
      </>
    );
  }

  return <></>;
}
