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

  useEffect(() => {
    socket.emit('getGames');
    socket.on('getGamesResponse', (data: GameObject[][]) => {
      setPublicRooms(data[0]);
      setPrivateRooms(data[1]);
    });
  }, [socket]);
  
  return (
      <Grid container direction="column" alignItems="center" className={styles.roomList}>
        <Typography>
          {publicRooms.length !== 0 && 
            `Public Rooms (${publicRooms.length})`}
        </Typography>
        {publicRooms?.map(room => (
          <Grid item key={room.creator}>
            <ActiveRoomCard isPrivate={false} game={room} room={room.gameName} socket={socket} />
          </Grid>))}
        <Typography>
          {privateRooms.length !== 0 && 
            `Private Rooms (${privateRooms.length})`}
        </Typography>
        {privateRooms?.map(room => (
          <Grid item key={room.creator}>
            <ActiveRoomCard isPrivate game={room} room={room.gameName} socket={socket} />
          </Grid>))}
      </Grid>
  )
}
