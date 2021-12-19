import { GameObject } from '../types/game';

export const findGame = (creator: string, privateGames: GameObject[]): GameObject | null => {
  let returnGame: GameObject | null = null;
  privateGames.forEach((game) => {
    if (game.creator === creator) {
      returnGame = game;
    }
    return;
  });
  return returnGame;
};
