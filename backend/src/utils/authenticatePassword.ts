import bodyParser = require('body-parser');
import express = require('express');
import { GameObject } from '../types/game';
import { findGame } from './findGame';

interface AuthenticatePasswordParams {
  req: express.Request,
  res: express.Response,
  privateGames: GameObject[];
  method: 'POST' | 'GET';
  app: any;
}

export const authenticatePassword = ({ req, res, privateGames, method, app } : AuthenticatePasswordParams) => {
  app.use(bodyParser.json());
  const { creator, password } = method === 'POST' ? req.body : req.query;
  console.log(creator);
  const gameObj: GameObject | null= findGame(creator as string, privateGames);
  if (!gameObj) {
    if (method === 'POST') return false;
    return res.json({
      status: 'error',
      reason: 'Error: game not found',
    });
  }
  const { password: gamePass, maxPlayers, players } = gameObj;
  if (gamePass === password) {
    if (maxPlayers > players.length) {
      if (method === 'POST') return true;
      return res.json({ 
        status: 'success',
       });
    } else {
      if (method === 'POST') return false;
      return res.json({
        status: 'unsuccessful',
        reason: 'Room is full',
      });
    }
  } else {
    if (method === 'POST') return false;
    return res.json({
      status: 'unsuccessful',
      reason: 'Incorrect password'
    });
  }
}