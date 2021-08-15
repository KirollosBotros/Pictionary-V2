import { Button, makeStyles, Grid, Dialog, DialogContent, DialogTitle, TextField, FormHelperText, FormControl, Typography, Theme, createStyles, CircularProgress } from '@material-ui/core'
import history from '../config/history';
import LockSharpIcon from '@material-ui/icons/LockSharp';
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { Socket } from 'socket.io-client';
import { GameObject } from '../types/game';
import PersonIcon from '@material-ui/icons/Person';
import { ThumbUpTwoTone } from '@material-ui/icons';

type StyleProps = {
  error: boolean;
};

const useStyles = makeStyles<Theme, StyleProps>(theme => 
  createStyles({
    roomCard: {
      textDecoration: 'none',
      marginBottom: 10,
      [theme.breakpoints.down('sm')]: {
        width: 350,
      },
      [theme.breakpoints.up('md')]: {
        width: 600,
      },
      [theme.breakpoints.up('lg')]: {
        width: 650,
      },
    },
    personIcon: {
      marginTop: 5,
      lineHeight: 0, 
      marginRight: 6,
      color: '#1bb33c',
    },
    nameInput: {
      marginBottom: ({ error }) => error ? theme.spacing(0) : theme.spacing(2),
    },
    roomText: {
      fontSize: 20,
      [theme.breakpoints.down('sm')]: {
        fontSize: 16,
      },
    },
    link: {
      textDecoration: 'none',
      color: 'white',
    },
    modal: {
  
    },
    passwordInput: {
    },
    button: {
      margin: '0 auto',
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2),
    },
}));

interface IFormInput {
  password: string;
  name: string;
}

interface ActiveRoomCardProps {
  room: string;
  isPrivate: boolean;
  socket: Socket;
  game: GameObject;
}

export default function ActiveRoomCard({ room, isPrivate, game, socket }: ActiveRoomCardProps) {
  const redirectLink = '/game/' + room;
  const [openPassword, setOpenPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>({ 
    mode: 'onSubmit', 
    reValidateMode: 'onSubmit' 
  });
  const styles = useStyles({ error: errors.name != null });

  const redirect = () => {
    if (isPrivate) {
      setOpenPassword(true);
    } else {
      socket.emit('joinGame', {
        name: 'john',
        id: socket.id,
        gameId: game.creator,
      });
      history.push(redirectLink);
    }
  };
  
  const handleClose = () => {
    setOpenPassword(false);
  };

  const onSubmit = async (data: IFormInput) => {
    setLoading(true);
    const { name, password } = data;
    const { id } = socket;
    try {
      const res = await fetch('http://localhost:3001/join-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          creator: game.creator,
          password,
          name,
          id,
        }),
      });
      const resJSON = await res.json();
      const { status } = resJSON;
      if (status === 'successful') {
        history.push(redirectLink);
      } else {
        setError('Internal server error. Please refresh and try again.');
      }
      setLoading(false);
      return;
    } catch(err) {
      setError(err);
    }
  };

  const validatePassword = (async (v: any) => {
    const link = `http://localhost:3001/validate?creator=${game.creator}&password=${v}`;
    try {
      const res = await fetch(link);
      const resJSON = await res.json();
      const { status } = resJSON;
      if (status === 'success') {
        return true;
      } else {
        const { reason } = resJSON;
        setError(reason);
        return false;
      }
    } catch(err) {
      setError(err.message);
      return false;
    }
  });

  return (
    <>
      <Button onClick={redirect} className={styles.roomCard}>
        <Grid container direction="row" alignItems="center" justifyContent="space-between">
          <Grid item xs={2} style={{ textAlign: 'left' }}>
            {isPrivate && <LockSharpIcon style={{ marginBottom: -7 }} />}
          </Grid>
          <Grid item xs={8}>
            <Typography className={styles.roomText}>{room}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Grid container direction="row" alignItems="center" justifyContent="flex-end">
              <Grid item>
                <PersonIcon className={styles.personIcon} />
              </Grid>
              <Grid item>
                {game.players.length}/{game.maxPlayers}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Button>
      <Dialog 
        open={openPassword} 
        onClose={handleClose}
        className={styles.modal}
      >
        <DialogTitle style={{ textAlign: 'center' }}>Join {game.gameName}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl>
              <TextField
                variant='outlined'
                required
                className={styles.nameInput}
                label='Enter Name'
                {...register("name", {
                  required: true,
                  maxLength: 10,
                })}
              />
              {errors?.name?.type === 'required' && 
                <FormHelperText style={{ marginBottom: 15 }} error>Please enter your name</FormHelperText>}
              <TextField
                variant='outlined'
                required
                className={styles.passwordInput}
                label='Enter Password'
                {...register("password", {
                  required: true,
                  validate: validatePassword,
                })}
              />
              {(errors?.password?.type === 'validate' || error) && 
                <FormHelperText style={{ marginBottom: 15 }} error>{error}</FormHelperText>}
              {errors?.password?.type === 'required' && 
                <FormHelperText style={{ marginBottom: 15 }} error>Please enter the password</FormHelperText>}
            </FormControl>
          </form>
        </DialogContent>
        <Button className={styles.button} onClick={handleSubmit(onSubmit)}>
          {loading ? <CircularProgress size={24} /> : 'Join Game'}
        </Button>
      </Dialog>
    </>
  )
}
