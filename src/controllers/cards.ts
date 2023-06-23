import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import Card from "../models/card";
import { RequestCustom } from '../utils/types';
import { NotFoundError, BadRequestError } from '../utils/errors';

export const createCard = async (req: RequestCustom, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  try {
    if (!name || !link) {
      throw new BadRequestError('Переданы некорректные данные при создании карточки');
    }
    const card = await Card.create({ name, link, owner: req.user?._id });
    return res.status(200).json({ data: card });
  } catch (err) {
    next(err)
  }
}

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({})
    return res.status(200).json({ data: cards })
  } catch (err) {
    next(err)
  }
}

export const delCardsById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId)
    return res.status(200).json({ data: card })
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new NotFoundError('Карточка с указанным _id не найдена'));
    } else {
      next(err)
    }
  }
}

export const addLikeCard = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user?._id } },
      { new: true },
    )
    return res.status(200).json({ data: card })
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка'));
    } else {
      next(err)
    }
  }
}

export const delLikeCard = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user?._id } },
      { new: true },
    )
    return res.status(200).json({ data: card })
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка'));
    } else {
      next(err)
    }
  }
}

