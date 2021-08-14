import { Button, makeStyles, Grid, Dialog, DialogContent, DialogTitle, TextField, FormHelperText, FormControl } from '@material-ui/core'
import history from '../config/history';
import LockSharpIcon from '@material-ui/icons/LockSharp';
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { Socket } from 'socket.io-client';
import { GameObject } from '../types/game';

const useStyles = makeStyles(theme => ({
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
  nameInput: {
    marginBottom: theme.spacing(2),
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
  const styles = useStyles();
  const redirectLink = '/game/' + room;
  const [openPassword, setOpenPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();

  const redirect = () => {
    if (isPrivate) {
      setOpenPassword(true);
    } else {
      // const { name } = data;
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

  const onSubmit = (data: IFormInput) => {
    const { name } = data;
    console.log('submit');
    socket.emit('joinGame', {
      name,
      id: socket.id,
      gameId: game.creator,
    });
    history.push(redirectLink);
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
        <Grid container direction="row" alignItems="center">
          <Grid item xs={1} style={{textAlign: 'left'}}>
            {isPrivate && <LockSharpIcon style={{ marginBottom: -6 }} />}
          </Grid>
          <Grid item xs={10}>
            {room}
          </Grid>
        </Grid>
      </Button>
      <Dialog 
        open={openPassword} 
        onClose={handleClose}
        className={styles.modal}
      >
        <DialogTitle>Enter Password</DialogTitle>
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
              {errors?.password?.type === 'validate' && 
                <FormHelperText style={{ marginBottom: 15 }} error>{error}</FormHelperText>}
              {errors?.password?.type === 'required' && 
                <FormHelperText style={{ marginBottom: 15 }} error>Please enter the password</FormHelperText>}
            </FormControl>
          </form>
        </DialogContent>
        <Button className={styles.button} onClick={handleSubmit(onSubmit)}>Join Game</Button>
      </Dialog>
    </>
  )
}
