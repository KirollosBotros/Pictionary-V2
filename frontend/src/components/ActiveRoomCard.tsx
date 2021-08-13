import { Button, makeStyles } from '@material-ui/core'
import { Link } from 'react-router-dom';

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
}

export default function ActiveRoomCard({ room }: ActiveRoomCardProps) {
  const styles = useStyles();
  const redirectLink = '/game/' + room;

  const refreshPage = () => {
    window.location.href = redirectLink;
  };
  
  return (
    <Link onClick={refreshPage} to={redirectLink} className={styles.link}>
      <Button className={styles.roomCard}>
        {room}
      </Button>
    </Link>
  )
}
