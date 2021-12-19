import {
  Dialog,
  makeStyles,
  DialogContent,
  CircularProgress,
  DialogTitle,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  connecting: {
    textAlign: 'center',
    padding: theme.spacing(2),
  },
  connectingTitle: {
    fontSize: 32,
  },
}));

export default function JoinGameButton() {
  const styles = useStyles();

  return (
    <Dialog open>
      <DialogTitle className={styles.connectingTitle}>Connecting to server ...</DialogTitle>
      <DialogContent className={styles.connecting}>
        <CircularProgress size={60} />
      </DialogContent>
    </Dialog>
  );
}
