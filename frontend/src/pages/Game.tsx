import { useParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import { useState, useEffect } from 'react';
import { GameObject, Player, GameInfo } from "../types/game";
import { Button, Dialog, makeStyles, DialogContent, DialogTitle, FormControl, FormHelperText, Grid, TextField, Typography } from "@material-ui/core";
import { useForm } from "react-hook-form";
import { joinGame } from "../utils/joinGame";
import { validatePassword } from "../utils/validatePassword";
import MainGame from "./MainGame";
import host from "../config/host";

interface GameProps {
  socket: Socket;
}

interface IFormInput {
  password?: string;
  name: string;
}

const useStyles = makeStyles(theme => ({
  passwordInput: {
    marginTop: theme.spacing(1.5),
  },
  button: {
    margin: '0 auto',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(1.5),
  },
}));

export default function Game({ socket }: GameProps) {
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
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>({ 
    mode: 'onSubmit', 
    reValidateMode: 'onSubmit' 
  });

  interface GetGamesResponse {
    publicGames: GameObject[];
    privateGames: GameObject[];
  }

  const getGame = async () => {
    const res = await fetch(`https://${host}/get-games`);
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
    const res = await fetch(`https://${host}/get-game?userId=${socketId}`);
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

  const validatePass = (async (v: any) => {
    const validationResponse = await validatePassword({ game, v });
    if (validationResponse === true) {
      return true;
    } else {
      const err = validationResponse.error;
      setError(err);
      return false;
    }
  });

  const startGame = () => {
    socket.emit('startedGame', game.creator);
  };

  if (redirectToGame && currWord) {
    return <MainGame game={game} socket={socket} currWord={currWord} scoreBoard={scoreBoard} />
  }

  return (
    <>
      <Grid container direction="column">
        {socket.id === game.creator &&
          <Grid item>
            <Button onClick={startGame}>Start Game</Button>
          </Grid>}
        {players?.map(player => (
          <Grid item>
            {player.name}
          </Grid>
        ))}
      </Grid>
      <Dialog open={(!inGame && !successJoin || game.status === 'game')}>
        <DialogTitle style={{ textAlign: 'center' }}>
          {fullGame ? 'Game is full' : game.status === 'game' ? 'Game Already Started' : `Join ${game?.name}`}
        </DialogTitle>
        {game.status !== 'game' &&
        <>
          <DialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl>
                <TextField 
                  variant='outlined'
                  required
                  inputProps={{ maxLength: 10 }}
                  label='Enter Name'
                  {...register("name", {
                    required: true,
                    maxLength: 10,
                  })}
                />
                {errors?.name?.type === 'required' && 
                  <FormHelperText error style={{ marginBottom: 15 }}>Please enter your name</FormHelperText>}
                {game?.type === 'Private' &&
                  <TextField 
                    variant='outlined'
                    label='Enter Password'
                    className={styles.passwordInput}
                    required
                    {...register("password", {
                      required: game?.type === 'Private',
                      validate: validatePass,
                    })}
                  />}
                  {(errors?.password?.type === 'validate' || error) ? 
                  <FormHelperText error>{error}</FormHelperText>
                : errors?.password?.type === 'required' && 
                  <FormHelperText error>Please enter the password</FormHelperText>}
              </FormControl>
            </form>
          </DialogContent>
          <Button className={styles.button} disabled={fullGame} onClick={handleSubmit(onSubmit)}>
              {fullGame ? 
                <Typography style={{ color: 'white' }}>
                  Room is Full
                </Typography> : 'Join Game'}
          </Button>
        </>}
      </Dialog>
    </>
  )
}
