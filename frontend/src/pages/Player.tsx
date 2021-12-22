import { useParams } from 'react-router-dom';

export default function Player() {
  const { id }: any = useParams();
  let a = 3;
  let b = 3;
  console.log(a);
  return <div>Player id: {id}</div>;
}
