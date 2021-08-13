import { useParams } from "react-router-dom";
import { Socket } from "socket.io-client";

interface GameProps {
  socket: Socket;
}

export default function Game({ socket }: GameProps) {
  const { id }: any = useParams();
  const { id: socketId } = socket;
  console.log(socketId);

  return (
    <div>
      Game id: {id}
    </div>
  )
}
