import { Request, Response, NextFunction } from 'express';
import User from "../models/user";
import { RequestCustom } from '../utils/types';
import { NotFoundError, BadRequestError } from '../utils/errors';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;
  try {
    if (!name || !about || !avatar) {
      throw new BadRequestError('Переданы некорректные данные при создании пользователя');
    }
    const user = await User.create({ name, about, avatar });
    return res.status(200).json({ data: user });
  } catch (err) {
    next(err)
  }
}

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({})
    return res.status(200).json({ data: users })
  } catch (err) {
    next(err)
  }
}

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.userId)
    if (!user) {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    }
    return res.status(200).json({ data: user })
  } catch (err) {
    next(err)
  }
}

export const updateProfile = async (req: RequestCustom, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  try {
    if (!name || !about) {
      throw new BadRequestError('Переданы некорректные данные при обновлении профиля');
    }
    const user = await User.findByIdAndUpdate(req.user?._id, {
      name,
      about,
    }, {
      new: true,
    });
    return res.status(200).json({ data: user })
  } catch (err) {
    next(err)
  }
}

export const updateAva = async (req: RequestCustom, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  try {
    if (!avatar) {
      throw new BadRequestError('Переданы некорректные данные при обновлении аватара');
    }
    const user = await User.findByIdAndUpdate(req.user?._id, {
      avatar
    }, {
      new: true,
    });
    return res.status(200).json({ data: user })
  } catch (err) {
    next(err)
  }
}
