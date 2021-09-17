import socket from './config/socketConfig';
import { MuiThemeProvider } from '@material-ui/core';
import { theme } from './config/theme';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import { Router, Route } from "react-router-dom";
import { useState, useEffect } from 'react';
import Game from './pages/Game';
import Player from './pages/Player';
import history from './config/history';

function App() {
  const [connectionEstablished, setConnectionEstablished] = useState(false);

  useEffect(() => {
    socket.on('connect', () => {
      setConnectionEstablished(true);
    });
    socket.on('disconnect', () => {
      setConnectionEstablished(false);
    })
  }, []);

  return (
      <MuiThemeProvider theme={theme}>
        <Header />
        <Router history={history}>
          <Route
            path="/"
            exact
            render={props => <LandingPage socket={socket} connectionEstablished={connectionEstablished} />}
          />
          <Route
            path="/game/:id"
            render={props => <Game socket={socket} connectionEstablished={connectionEstablished} />} />
          <Route path="/player/:id" component={Player} />
        </Router>
        <Footer />
      </MuiThemeProvider>
  );
}

export default App;
