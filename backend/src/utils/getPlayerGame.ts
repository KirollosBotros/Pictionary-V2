import { GameObject } from "../types/game";

export const getPlayerGame = (games: GameObject[], userId: string): GameObject | null => {
  let gameObj: GameObject | null = null;
  games.forEach(game => {
    const { players } = game;
    players.forEach(player => {
      if (player.id === userId) {
        gameObj = game;
      }
    });
  });
  return gameObj;
}