import socket from '.././config/socketConfig';
import { Grid, makeStyles, Typography } from "@material-ui/core";
import {
  BrowserRouter as Router,
} from "react-router-dom";
import ActiveRooms from '../components/ActiveRooms';
import JoinGameButton from '../components/JoinGameButton';
import CreateGameButton from '../components/CreateGameButton';

const useStyles = makeStyles(theme => ({
    title: {
        color: 'black',
        fontSize: 36,
        textAlign: 'center',
    },
    button: {
      marginLeft: 10,
      marginRight: 10,
      marginTop: 10,
    },
    modal: {
      width: 'auto',
    }
}));

export default function LandingPage() {
    const styles = useStyles();

    return (
      <Router>
        <>
          <Grid container direction="column" justifyContent="center">
              <Grid item className={styles.title}>
                  <Typography style={{ fontSize: 36 }}>Welcome to PictoBear!</Typography>
              </Grid>
              <Grid item>
                <Grid container direction="row" justifyContent="center">
                  <Grid item>
                    <JoinGameButton socket={socket} />
                  </Grid>
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
    )
}
