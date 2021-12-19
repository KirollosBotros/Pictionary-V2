import host from '../config/host';
import { GameObject } from '../types/game';

interface ValidatePasswordProps {
  game: GameObject;
  v: any;
}

export const validatePassword = async ({ game, v }: ValidatePasswordProps) => {
  const validationEndpoint = `${host}/validate?creator=${game.creator}&password=${v}`;
  try {
    const res = await fetch(validationEndpoint);
    const resJSON = await res.json();
    const { status } = resJSON;
    if (status === 'success') {
      return true;
    } else {
      const { reason } = resJSON;
      return {
        error: reason,
      };
    }
  } catch (err) {
    return {
      error: err,
    };
  }
};
