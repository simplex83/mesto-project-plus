import { NextFunction, Request, Response } from 'express';
import { IError } from 'utils/types';

export function errorHandler(err: IError, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Ошибка по умолчанию';
  res.status(statusCode).json({ message });
}