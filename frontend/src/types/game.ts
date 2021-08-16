export interface GameObject {
  creator: string,
  name: string,
  type: 'Public' | 'Private',
  maxPlayers: number,
  password?: string,
  players: {
    id: string;
    name: string;
  }[];
  status: 'lobby' | 'game';
}

export interface JoinGameProps {
  name: string;
  id: string;
  gameId: string;
}