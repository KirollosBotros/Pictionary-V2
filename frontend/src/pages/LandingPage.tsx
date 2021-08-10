import { Grid, makeStyles } from "@material-ui/core";
import { Socket } from 'socket.io-client';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

const useStyles = makeStyles(theme => ({
    title: {
        color: 'black',
        fontSize: 36,
        textAlign: 'center',
    },
}));

interface LandingPageProps {
  socket: Socket;
}

export default function LandingPage({ socket }: LandingPageProps) {
    const styles = useStyles();

    return (
      <Router>
        <Grid container justifyContent="center">
            <Grid item className={styles.title}>
                Welcome to PictoBear!
            </Grid>
        </Grid>
      </Router>
    )
}
