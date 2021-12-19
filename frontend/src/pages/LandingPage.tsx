import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { BrowserRouter as Router } from 'react-router-dom';
import ActiveRooms from '../components/ActiveRooms';
import CreateGameButton from '../components/CreateGameButton';
import { Socket } from 'socket.io-client';

interface LandingPageProps {
  socket: Socket;
  connectionEstablished: boolean;
}

const useStyles = makeStyles((theme) => ({
  title: {
    color: 'black',
    fontSize: 36,
    marginTop: theme.spacing(1.5),
    textAlign: 'center',
  },
  welcome: {
    fontSize: 36,
    [theme.breakpoints.down(430)]: {
      fontSize: 30,
    },
  },
  button: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
  },
  modal: {
    width: 'auto',
  },
  connecting: {
    textAlign: 'center',
    padding: theme.spacing(2),
  },
  connectingTitle: {
    fontSize: 32,
  },
}));

export default function LandingPage({
  socket,
  connectionEstablished,
}: LandingPageProps) {
  const styles = useStyles();

  if (!connectionEstablished) {
    return (
      <Dialog open>
        <DialogTitle className={styles.connectingTitle}>
          Connecting to server ...
        </DialogTitle>
        <DialogContent className={styles.connecting}>
          <CircularProgress size={60} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Router>
      <>
        <Grid container direction="column" justifyContent="center">
          <Grid item className={styles.title}>
            <Typography className={styles.welcome}>
              Welcome to PictoBear!
            </Typography>
          </Grid>
          <Grid item>
            <Grid container direction="row" justifyContent="center">
              <Grid item>
                <CreateGameButton socket={socket} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <ActiveRooms socket={socket} />
          </Grid>
        </Grid>
      </>
    </Router>
  );
}
