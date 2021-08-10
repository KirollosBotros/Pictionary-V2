import socket from './config/socketConfig';
import { MuiThemeProvider, Grid } from '@material-ui/core';
import { theme } from './config/theme';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Game from './pages/Game';
import Player from './pages/Player';

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Header />
      <Router>
        <Route path="/" exact render={props => <LandingPage socket={socket} />} />
        <Route path="/game/:id" component={Game} />
        <Route path="/player/:id" component={Player} />
      </Router>
      <Footer />
    </MuiThemeProvider>
  );
}

export default App;
