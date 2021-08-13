import { Button, makeStyles, Grid } from '@material-ui/core'
import { Link } from 'react-router-dom';
import history from '../config/history';
import LockSharpIcon from '@material-ui/icons/LockSharp';

const useStyles = makeStyles(theme => ({
  roomCard: {
    textDecoration: 'none',
    marginBottom: 10,
    [theme.breakpoints.down('sm')]: {
      width: 350,
    },
    [theme.breakpoints.up('md')]: {
      width: 600,
    },
    [theme.breakpoints.up('lg')]: {
      width: 650,
    },
  },
  link: {
    textDecoration: 'none',
    color: 'white',
  },
}));

interface ActiveRoomCardProps {
  room: string;
  isPrivate: boolean;
}

export default function ActiveRoomCard({ room, isPrivate }: ActiveRoomCardProps) {
  const styles = useStyles();
  const redirectLink = '/game/' + room;

  const redirect = () => {
    history.push(redirectLink);
  };
  
  return (
    <Link onClick={redirect} to={redirectLink} className={styles.link}>
      <Button className={styles.roomCard}>
        <Grid container direction="row" alignItems="center">
          <Grid item xs={1} style={{textAlign: 'left'}}>
            {isPrivate && <LockSharpIcon style={{ marginBottom: -6 }} />}
          </Grid>
          <Grid item xs={10}>
            {room}
          </Grid>
        </Grid>
      </Button>
    </Link>
  )
}
