import { Button, Dialog, DialogTitle, makeStyles, withStyles, Slider, Typography } from "@material-ui/core";
import { useState } from 'react';
import { Socket } from "socket.io-client";

const useStyles = makeStyles(theme => ({
  button: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    '&:hover': {
      backgroundColor: '#0944A8',
    },
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
  subText: {
    fontSize: 18,
    fontWeight: 550,
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

interface JoinGameButtonProps {
  socket: Socket;
}

export default function JoinGameButton({ socket }: JoinGameButtonProps) {
  const styles = useStyles();
  const [openDialog, setOpenDialog] = useState(false);
  const [maxPlayers, setMaxPlayers] = useState(2);

  const handleClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  }

  return (
    <>
    <Button className={styles.button} onClick={handleClick}>Join Game</Button>
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      className={styles.modal}
    >
      <DialogTitle className={styles.modal}>Join Game</DialogTitle>
      <Typography className={styles.subText}>Max Players: {maxPlayers}</Typography>
      <div className={styles.modal}>
        <CustomSlider
          defaultValue={2}
          onChange={(_, val) => {
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
      </div>

    </Dialog>
    </>
  )
}
