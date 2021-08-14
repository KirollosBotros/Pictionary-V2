import { GameObject } from "../types/game";

export const findGame = (creator: string, privateGames: GameObject[]) => {
  let returnGame: GameObject | null = privateGames[0];
  privateGames.forEach(game => {
    if (game.creator === creator) {
      returnGame = game;
    }
    return;
  });
  return returnGame;
}