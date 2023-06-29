/* eslint-disable import/no-extraneous-dependencies */
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface RequestCustom extends Request {
  user?: {
    _id: string;
  };
}

export interface IError extends Error {
  statusCode: number;
  message: string
}

export interface SessionCustom extends Request {
  user?: string | JwtPayload ;
}
