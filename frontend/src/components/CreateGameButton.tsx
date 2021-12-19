import {
  Button,
  Dialog,
  Grid,
  DialogTitle,
  makeStyles,
  withStyles,
  Slider,
  Typography,
  TextField,
  DialogActions,
  DialogContent,
  FormHelperText,
  FormControl,
  CircularProgress,
} from '@material-ui/core';
import { useState } from 'react';
import { Socket } from 'socket.io-client';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { useForm } from 'react-hook-form';
import history from '../config/history';
import { GameObject } from '../types/game';
import host from '../config/host';
const Filter = require('bad-words');
const filter = new Filter();

const useStyles = makeStyles((theme) => ({
  button: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    backgroundColor: '#9813F0',
    '&:hover': {
      backgroundColor: '#b553d4',
    },
  },
  nameInput: {
    marginBottom: theme.spacing(1),
    width: '100%',
  },
  modal: {
    marginRight: 5,
    marginLeft: 5,
    [theme.breakpoints.up(650)]: {
      minWidth: 500,
    },
    [theme.breakpoints.up(690)]: {},
    [theme.breakpoints.down(650)]: {
      minWidth: 400,
    },
    [theme.breakpoints.down(545)]: {
      minWidth: 300,
    },
    [theme.breakpoints.down(445)]: {
      minWidth: 220,
    },
    [theme.breakpoints.down(365)]: {
      minWidth: 180,
    },
    [theme.breakpoints.down(325)]: {
      minWidth: 0,
    },
    textAlign: 'center',
  },
  passwordInput: {
    marginTop: 20,
  },
  subText: {
    fontSize: 18,
    fontWeight: 550,
  },
  type: {
    [theme.breakpoints.down('sm')]: {
      fontSize: 12,
    },
    fontSize: 18,
    fontWeight: 550,
    color: 'black',
  },
  createGame: {
    margin: '0 auto',
    marginBottom: theme.spacing(2),
    '&:hover': {
      backgroundColor: '#4f76d1',
    },
  },
}));

const CustomSlider = withStyles((theme) => ({
  root: {
    color: theme.palette.primary.main,
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  mark: {
    backgroundColor: theme.palette.primary.main,
    height: 8,
    width: 5,
    marginTop: 0,
  },
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
}))(Slider);

interface IFormInput {
  maxPlayers: number;
  type: 'Public' | 'Private';
  password?: string;
  name: string;
  playerName: string;
}

interface CreateGameButtonProps {
  socket: Socket;
}

export default function CreateGameButton({ socket }: CreateGameButtonProps) {
  const styles = useStyles();
  const [openDialog, setOpenDialog] = useState(false);
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  type GameType = 'Public' | 'Private' | null;
  type SetGameType = NonNullable<GameType>;

  const [type, setType] = useState<SetGameType>('Public');

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: GameType
  ) => {
    if (newAlignment !== null) {
      setType(newAlignment);
    }
  };

  const onSubmit = async (data: IFormInput) => {
    setLoading(true);
    const { name, password, playerName } = data;
    const { id } = socket;
    const gameObj: GameObject = {
      creator: id,
      name,
      type,
      maxPlayers: maxPlayers,
      password,
      players: [
        {
          id,
          name: playerName,
        },
      ],
      status: 'lobby',
    };
    try {
      const res = await fetch(`${host}/create-game`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameObj),
      });
      const resJSON = await res.json();
      const { status } = resJSON;
      if (status === 'successful') {
        history.push(`/game/${gameObj.creator}`);
      } else {
        const { reason } = resJSON;
        console.log(reason);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setMaxPlayers(2);
  };

  let marks = [];
  for (let i = 2; i <= 10; ++i) {
    marks[i - 2] = {
      value: i,
      label: i,
    };
  }

  return (
    <>
      <Button className={styles.button} onClick={handleClick}>
        Create Game
      </Button>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        className={styles.modal}
      >
        <DialogTitle>Create Game</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container direction="column" justifyContent="space-evenly">
              <FormControl>
                <Grid item>
                  <TextField
                    variant="outlined"
                    inputProps={{
                      maxLength: 10,
                    }}
                    required
                    label="Enter Your Name"
                    className={styles.nameInput}
                    {...register('playerName', {
                      required: true,
                      maxLength: 10,
                      validate: (v) => !filter.isProfane(v),
                    })}
                  />
                </Grid>
                {errors?.playerName?.type === 'required' && (
                  <FormHelperText
                    style={{
                      marginBottom: 15,
                    }}
                    error
                  >
                    Please enter your name
                  </FormHelperText>
                )}
                {errors?.playerName?.type === 'validate' && (
                  <FormHelperText
                    style={{
                      marginBottom: 15,
                    }}
                    error
                  >
                    Please enter a clean name
                  </FormHelperText>
                )}
                <Grid item>
                  <TextField
                    variant="outlined"
                    inputProps={{
                      maxLength: 10,
                    }}
                    required
                    label="Enter Game Name"
                    className={styles.nameInput}
                    {...register('name', {
                      required: true,
                      maxLength: 10,
                    })}
                  />
                </Grid>
                {errors?.name?.type === 'required' && (
                  <FormHelperText
                    style={{
                      marginBottom: 15,
                    }}
                    error
                  >
                    Please input a game name
                  </FormHelperText>
                )}
              </FormControl>
              <Typography
                className={styles.subText}
                style={{
                  textAlign: 'left',
                }}
              >
                Max Players: {maxPlayers}
              </Typography>
              <div className={styles.modal}>
                <Grid item>
                  <CustomSlider
                    defaultValue={2}
                    onChange={(_, val: number | number[]) => {
                      if (typeof val === 'number') {
                        setMaxPlayers(val);
                      }
                    }}
                    step={1}
                    marks={marks}
                    min={2}
                    max={10}
                  />
                </Grid>
                <Grid item>
                  <ToggleButtonGroup
                    exclusive
                    value={type}
                    onChange={handleAlignment}
                  >
                    <ToggleButton disableRipple value="Public">
                      <Typography className={styles.type}>Public</Typography>
                    </ToggleButton>
                    <ToggleButton disableRipple value="Private">
                      <Typography className={styles.type}>Private</Typography>
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
                {type === 'Private' && (
                  <FormControl>
                    <Grid item>
                      <TextField
                        variant="outlined"
                        required
                        inputProps={{
                          maxLength: 10,
                        }}
                        label="Enter Password"
                        className={styles.passwordInput}
                        {...register('password', {
                          required: true,
                          maxLength: 10,
                        })}
                      />
                    </Grid>
                    {errors?.password?.type === 'required' && (
                      <FormHelperText error>
                        Please input a password
                      </FormHelperText>
                    )}
                    {errors?.password?.type === 'maxLength' && (
                      <FormHelperText error>
                        Password must be less than 10 characters
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              </div>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSubmit(onSubmit)}
            className={styles.createGame}
          >
            {loading ? (
              <CircularProgress
                size={24}
                style={{
                  color: 'white',
                }}
              />
            ) : (
              'Create Game'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
