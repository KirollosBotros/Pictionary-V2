import socket from './config/socketConfig';
import { MuiThemeProvider } from '@material-ui/core';
import { theme } from './config/theme';
import ButtonTest from './components/ButtonTest';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Header />
      <ButtonTest />
      <Footer />
    </MuiThemeProvider>
  );
}

export default App;
