/* eslint-disable import/no-extraneous-dependencies */
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { MongoServerError } from 'mongodb';
import User from '../models/user';
import { RequestCustom } from '../utils/types';
import NotFoundError from '../utils/notFoundError ';
import BadRequestError from '../utils/badRequestError';
import ConflictError from '../utils/conflictError';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, about, avatar, email, password: hash,
    });
    return res.status(200).json({
      data: {
        name: user.name, about: user.about, avatar: user.avatar, email: user.email,
      },
    });
  } catch (err) {
    if (err instanceof MongoServerError && err.code === 11000) {
      return next(new ConflictError('Пользователь с такими данными уже существует'));
    }
    if (err instanceof Error && err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
    }
    return next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
    res.cookie('JWT', token, { httpOnly: true, maxAge: 3600000 * 24 * 7 });
    return res.status(200).json({ message: 'Вы успешно авторизовались' });
  } catch (err) {
    return next(err);
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    return res.status(200).json({ data: users });
  } catch (err) {
    return next(err);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    }
    return res.status(200).json({ data: user });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new BadRequestError('Передан некорретный _id пользователя'));
    }
    return next(err);
  }
};

export const updateProfile = async (req: RequestCustom, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.user?._id, {
      name,
      about,
    }, {
      new: true, runValidators: true,
    });
    return res.status(200).json({ data: user });
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
    }
    return next(err);
  }
};

export const updateAva = async (req: RequestCustom, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.user?._id, {
      avatar,
    }, {
      new: true, runValidators: true,
    });
    return res.status(200).json({ data: user });
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
    }
    return next(err);
  }
};

export const getMe = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    return res.status(200).json({ data: user });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new BadRequestError('Пользователь не найден'));
    }
    return next(err);
  }
};
