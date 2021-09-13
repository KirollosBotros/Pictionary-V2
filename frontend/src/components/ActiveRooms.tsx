import { makeStyles, Grid, Typography } from "@material-ui/core";
import ActiveRoomCard from "./ActiveRoomCard";
import { useState, useEffect } from 'react';
import { Socket } from "socket.io-client";
import { GameObject } from "../types/game";

const useStyles = makeStyles(theme => ({
  roomList: {
    marginTop: 15,
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
    const res = await fetch('http://localhost:3001/get-games');
    const resJSON = await res.json();
    const { privateGames, publicGames } = resJSON;
    setPrivateRooms(privateGames);
    setPublicRooms(publicGames);
  };

  useEffect(() => {
    getGames();
  }, []);
  
  return (
      <Grid container direction="column" alignItems="center" className={styles.roomList}>
        <Typography>
          {publicRooms.length !== 0 && 
            `Public Rooms (${publicRooms.length})`}
        </Typography>
        {publicRooms?.map(room => (
          <Grid item key={room.creator}>
            <ActiveRoomCard isPrivate={false} game={room} room={room.name} socket={socket} />
          </Grid>))}
        <Typography>
          {privateRooms.length !== 0 && 
            `Private Rooms (${privateRooms.length})`}
        </Typography>
        {privateRooms?.map(room => (
          <Grid item key={room.creator}>
            <ActiveRoomCard isPrivate game={room} room={room.name} socket={socket} />
          </Grid>))}
      </Grid>
  )
}
