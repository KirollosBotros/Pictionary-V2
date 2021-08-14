export interface GameObject {
  creator: string,
  gameName: string,
  gameType: 'Public' | 'Private',
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