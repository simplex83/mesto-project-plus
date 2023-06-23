import { NextFunction, Request, Response } from 'express';
import { IError } from '../utils/types';

function errorHandler(err: IError, req: Request, res: Response, next:NextFunction) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Ошибка по умолчанию';
  res.status(statusCode).json({ message });
  next();
}

export default errorHandler;
