import { useParams } from "react-router-dom";

export default function Game() {
  const { id }: any = useParams();

  return (
    <div>
      Game id: {id}
    </div>
  )
}
