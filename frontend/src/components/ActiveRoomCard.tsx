import {
  Button, 
  makeStyles,
  Grid, 
  Dialog,
  DialogContent,
  DialogTitle, 
  TextField, 
  FormHelperText, 
  FormControl, 
  Typography, 
  CircularProgress } from '@material-ui/core'
import LockSharpIcon from '@material-ui/icons/LockSharp';
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { Socket } from 'socket.io-client';
import { GameObject } from '../types/game';
import PersonIcon from '@material-ui/icons/Person';
import { joinGame } from '../utils/joinGame';
import { validatePassword } from '../utils/validatePassword';

const useStyles = makeStyles(theme => ({
    roomCard: {
      textDecoration: 'none',
      marginBottom: 10,
      '&:hover': {
        backgroundColor: '#0944A8',
      },
      borderRadius: 5,
      [theme.breakpoints.down(960)]: {
        width: 500,
      },
      [theme.breakpoints.down(600)]: {
        width: 400,
      },
      [theme.breakpoints.down(450)]: {
        width: 350,
      },
      [theme.breakpoints.down(385)]: {
        width: 340,
      },
      [theme.breakpoints.down(356)]: {
        width: 300,
      },
      [theme.breakpoints.down(317)]: {
        width: 250,
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
      [theme.breakpoints.down(356)]: {
        display: 'none',
      },
    },
    nameInput: {
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
  const [openPassword, setOpenPassword] = useState(false);
  const [openName, setOpenName] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>({ 
    mode: 'onSubmit', 
    reValidateMode: 'onSubmit' 
  });

  const redirect = () => {
    if (isPrivate) {
      setOpenPassword(true);
    } else {
      setOpenName(true);
    }
  };
  
  const handleClose = () => {
    setOpenPassword(false);
    setOpenName(false);
  };

  const onSubmit = async (data: IFormInput) => {
    setLoading(true);
    const { name, password } = data;
    joinGame({
      playerId: socket.id,
      game,
      name,
      password,
      socket,
    });
    setLoading(false);
  };

  const validatePass = (async (v: any) => {
    const validationResponse = await validatePassword({
      game,
      v,
    });
    if (validationResponse === true) {
      return true;
    } else {
      const err = validationResponse.error;
      setError(err);
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
        open={openPassword || openName} 
        onClose={handleClose}
        className={styles.modal}
      >
        <DialogTitle style={{ textAlign: 'center' }}>Join {game.name}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl>
              <TextField
                variant='outlined'
                inputProps={{ maxLength: 10 }}
                required
                className={styles.nameInput}
                label='Enter Name'
                {...register("name", {
                  required: true,
                  maxLength: 10,
                  validate: validatePass,
                })}
              />
              {errors?.name?.type === 'required' && 
                <FormHelperText error style={{ marginBottom: 15 }}>Please enter your name</FormHelperText>}
              {isPrivate && 
                <TextField
                  variant='outlined'
                  required
                  className={styles.passwordInput}
                  label='Enter Password'
                  {...register("password", {
                    required: isPrivate,
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
        <Button className={styles.button} onClick={handleSubmit(onSubmit)}>
          {loading ? <CircularProgress size={24} style={{ color: 'white' }} /> : 'Join Game'}
        </Button>
      </Dialog>
    </>
  )
}
