import socket from './config/socketConfig';
import { Button, makeStyles, MuiThemeProvider } from '@material-ui/core';
import { theme } from './config/theme';
import ButtonTest from './components/ButtonTest';


function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <ButtonTest />
    </MuiThemeProvider>
  );
}

export default App;
