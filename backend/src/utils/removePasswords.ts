import { GameObject } from "../types/game";

export const removePasswords = (games: GameObject[]) => {
  const temp = games;
  const safeGames = temp.map(
    ({ password, ...clientSafeProp }) => clientSafeProp
  );
  return safeGames;
};
