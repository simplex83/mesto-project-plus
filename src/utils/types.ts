import { Request } from 'express';

export interface RequestCustom extends Request {
  user?: {
    _id: string;
  };
}

export interface IError extends Error {
  statusCode: number;
  message: string
}