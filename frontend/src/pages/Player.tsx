import { useParams } from "react-router-dom";

export default function Player() {
  const { id }: any = useParams();

  return (
    <div>
      Player id: {id}
    </div>
  )
}
