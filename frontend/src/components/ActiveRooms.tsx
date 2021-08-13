import { makeStyles, Grid, Typography } from "@material-ui/core";
import ActiveRoomCard from "./ActiveRoomCard";

const useStyles = makeStyles(theme => ({
  roomList: {
    marginTop: 15,
  },
}));

export default function ActiveRooms() {
  const styles = useStyles();
  const rooms: string[] = ['Tes', 'My Awesome Room', 'PictoBear Room'];

  return (
      <Grid container direction="column" alignItems="center" className={styles.roomList}>
        <Typography>Public Rooms ({rooms.length})</Typography>
        {rooms?.map(room => (
        <Grid item key={room}>
          <ActiveRoomCard room={room} />
        </Grid>))}
      </Grid>
  )
}
