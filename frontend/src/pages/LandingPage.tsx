import { Grid, makeStyles, Typography } from '@material-ui/core';
import { BrowserRouter as Router } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import ActiveRooms from '../components/ActiveRooms';
import CreateGameButton from '../components/CreateGameButton';
import Loading from '../components/Loading';

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
}));

export default function LandingPage({ socket, connectionEstablished }: LandingPageProps) {
  const styles = useStyles();

  return (
    <Router>
      <>
        <Grid container direction="column" justifyContent="center">
          <Grid item className={styles.title}>
            <Typography className={styles.welcome}>Welcome to PictoBear! The ultimate Pictionary game!</Typography>
          </Grid>
          <Grid item>
            <Grid container direction="row" justifyContent="center">
              <Grid item>
                <CreateGameButton socket={socket} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>{connectionEstablished ? <ActiveRooms socket={socket} /> : <Loading />}</Grid>
        </Grid>
      </>
    </Router>
  );
}
