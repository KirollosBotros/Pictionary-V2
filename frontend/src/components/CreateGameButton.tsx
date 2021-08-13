import { Button, Dialog, DialogTitle, makeStyles, withStyles, Slider, Typography, TextField, DialogActions, DialogContent, FormHelperText, FormControl } from "@material-ui/core";
import { useState } from 'react';
import { Socket } from "socket.io-client";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { useForm } from "react-hook-form";
import history from '../config/history';

const useStyles = makeStyles(theme => ({
  button: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
  },
  nameInput: {
    marginBottom: theme.spacing(1),
  },  
  modal: {
    padding: 20,
    marginRight: 5,
    marginLeft: 5,
    [theme.breakpoints.up(650)]: {
      minWidth: 500,
    },
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
  },
}));

const CustomSlider = withStyles(theme => ({
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
  gameType: 'Public' | 'Private';
  password?: string;
  name: string;
}

interface CreateGameButtonProps {
  socket: Socket;
}

export default function CreateGameButton({ socket }: CreateGameButtonProps) {
  const styles = useStyles();
  const [openDialog, setOpenDialog] = useState(false);
  const [maxPlayers, setMaxPlayers] = useState(2);
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();
  
  type GameType = 'Public' | 'Private' | null;
  const [type, setType] = useState<GameType>('Public');

  const handleAlignment = (event: React.MouseEvent<HTMLElement>, newAlignment: GameType) => {
    if (newAlignment !== null) {
      setType(newAlignment);
    }
  };

  const onSubmit = (data: IFormInput) => {
    // socket.emit('createGame');
    const { name, gameType, password } = data;
    const gameObj = {
      creator: socket.id,
      name,
      gameType,
      password,
    };
    console.log(gameObj);
    //history.push('/game/asd');
  };

  const handleClick = () => {
    socket.emit('createGame');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setMaxPlayers(2);
  }
  
  return (
    <>
      <Button className={styles.button} onClick={handleClick}>Create Game</Button>
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          className={styles.modal}
        >
          <DialogTitle className={styles.modal}>Create Game</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl>
                <TextField
                  variant='outlined'
                  inputProps={{ maxLength: 10 }}
                  required
                  label='Enter Game Name'
                  className={styles.nameInput}
                  {...register("name", {
                    required: true,
                    maxLength: 10,
                  })}
                >
                </TextField>
                {errors?.name?.type === 'required' && 
                  <FormHelperText style={{ marginBottom: 15}} error>Please input a game name</FormHelperText>}
              </FormControl>
              <Typography className={styles.subText}>Max Players: {maxPlayers}</Typography>
              <div className={styles.modal}>
                <CustomSlider
                  defaultValue={2}
                  onChange={(_, val: number | number[]) => {
                    if (typeof val === 'number') {
                      setMaxPlayers(val)
                    }
                  }}
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={2}
                  max={10}
                />
                <ToggleButtonGroup
                  exclusive
                  value={type}
                  onChange={handleAlignment}
                >
                  <ToggleButton disableRipple value='Public'>
                    <Typography className={styles.type}>Public</Typography>
                  </ToggleButton>
                  <ToggleButton disableRipple value='Private'>
                  <Typography className={styles.type}>Private</Typography>
                  </ToggleButton>
                </ToggleButtonGroup>
                {type === 'Private' &&
                  <div>
                    <FormControl>
                    <TextField
                      variant='outlined'
                      required
                      inputProps={{ maxLength: 10 }}
                      label='Enter Password'
                      className={styles.passwordInput}
                      {...register("password", {
                        required: true,
                        maxLength: 10,
                      })}
                    >
                    </TextField>
                    {errors?.password?.type === 'required' && 
                      <FormHelperText error>Please input a password</FormHelperText>}
                    {errors?.password?.type === 'maxLength' && 
                      <FormHelperText error>Password must be less than 10 characters</FormHelperText>}
                    </FormControl>
                  </div>}
              </div>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSubmit(onSubmit)} className={styles.createGame}>
              Create Game
            </Button>
          </DialogActions>
        </Dialog>
    </>
  )
}