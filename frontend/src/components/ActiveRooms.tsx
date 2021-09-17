import { makeStyles, Grid, Typography } from "@material-ui/core";
import ActiveRoomCard from "./ActiveRoomCard";
import { useState, useEffect } from 'react';
import { Socket } from "socket.io-client";
import { GameObject } from "../types/game";
import host from "../config/host";

const useStyles = makeStyles(theme => ({
  roomList: {
    marginTop: 15,
  },
  roomsTitle: {
    textAlign: 'center',
    marginTop: theme.spacing(3),
    fontSize: 22,
    [theme.breakpoints.down(490)]: {
      maxWidth: 300,
      fontSize: 18,
      margin: '0 auto',
      marginTop: theme.spacing(3),
    },
  },
}));

interface ActiveRoomsProps {
  socket: Socket;
}

export default function ActiveRooms({ socket }: ActiveRoomsProps) {
  const styles = useStyles();
  const [publicRooms, setPublicRooms] = useState<GameObject[]>([]);
  const [privateRooms, setPrivateRooms] = useState<GameObject[]>([]);

  const getGames = async () => {
    const res = await fetch(`${host}/get-games`);
    const resJSON = await res.json();
    const { privateGames, publicGames } = resJSON;
    setPrivateRooms(privateGames);
    setPublicRooms(publicGames);
  };

  useEffect(() => {
    getGames();
  }, []);
  
  if (publicRooms.length === 0 && privateRooms.length === 0) {
    return (
      <Typography className={styles.roomsTitle}>There are currently no active rooms</Typography>
    );
  }

  return (
      <Grid container direction="column" alignItems="center" className={styles.roomList}>
        <Typography>
          {publicRooms.length !== 0 && 
            `Public Rooms (${publicRooms.length})`}
        </Typography>
        {publicRooms?.map(room => (
          <Grid item key={room.creator}>
            <ActiveRoomCard isPrivate={false} game={room} room={room.name} socket={socket} />
          </Grid>
          ))
        }
        <Typography>
          {privateRooms.length !== 0 && 
            `Private Rooms (${privateRooms.length})`}
        </Typography>
        {privateRooms?.map(room => (
          <Grid item key={room.creator}>
            <ActiveRoomCard isPrivate game={room} room={room.name} socket={socket} />
          </Grid>))}
      </Grid>
  );
}
