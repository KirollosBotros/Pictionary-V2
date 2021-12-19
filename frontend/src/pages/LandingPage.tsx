import { Grid, makeStyles, Typography } from '@material-ui/core';
import Loading from '../components/Loading';
import { BrowserRouter as Router } from 'react-router-dom';
import ActiveRooms from '../components/ActiveRooms';
import CreateGameButton from '../components/CreateGameButton';
import { Socket } from 'socket.io-client';
import { useCookies } from 'react-cookie';

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
  const [cookies, setCookie] = useCookies(['name']);

  return (
    <Router>
      <>
        <Grid container direction="column" justifyContent="center">
          <Grid item className={styles.title}>
            <Typography className={styles.welcome} onClick={() => setCookie('name', 'kiro')}>
              Welcome to PictoBear ({cookies.name})!
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
            {connectionEstablished ? <ActiveRooms socket={socket} /> : <Loading />}
          </Grid>
        </Grid>
      </>
    </Router>
  );
}
