/* eslint-disable import/no-extraneous-dependencies */
import jwt from 'jsonwebtoken';
import { NextFunction, Response } from 'express';
import { SessionCustom } from '../utils/types';
import UnauthorizedError from '../utils/unauthorizedError';

export default (req: SessionCustom, res: Response, next: NextFunction) => {
  const token = req.cookies.JWT;
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};
