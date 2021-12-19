import { MuiThemeProvider } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { Route, Router } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import history from './config/history';
import socket from './config/socketConfig';
import { theme } from './config/theme';
import Game from './pages/Game';
import LandingPage from './pages/LandingPage';
import Player from './pages/Player';

function App() {
  const [connectionEstablished, setConnectionEstablished] = useState(false);

  useEffect(() => {
    socket.on('connect', () => {
      setConnectionEstablished(true);
    });
    socket.on('disconnect', () => {
      setConnectionEstablished(false);
    });
  }, []);

  return (
    <MuiThemeProvider theme={theme}>
      <Header />
      <Router history={history}>
        <Route
          path="/"
          exact
          render={(props) => (
            <LandingPage socket={socket} connectionEstablished={connectionEstablished} />
          )}
        />
        <Route
          path="/game/:id"
          render={(props) => <Game socket={socket} connectionEstablished={connectionEstablished} />}
        />
        <Route path="/player/:id" component={Player} />
      </Router>
      <Footer />
    </MuiThemeProvider>
  );
}

export default App;
