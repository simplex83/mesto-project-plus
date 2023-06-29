import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import Card from '../models/card';
import { RequestCustom } from '../utils/types';
import NotFoundError from '../utils/notFoundError ';
import BadRequestError from '../utils/badRequestError';

export const createCard = async (req: RequestCustom, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  try {
    if (!name || !link) {
      throw new BadRequestError('Переданы некорректные данные при создании карточки');
    }
    const card = await Card.create({ name, link, owner: req.user?._id });
    return res.status(200).json({ data: card });
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные при создании карточки'));
    }
    return next(err);
  }
};

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({});
    return res.status(200).json({ data: cards });
  } catch (err) {
    return next(err);
  }
};

export const delCardsById = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    }
    if (req.user?._id !== card?.owner.toString()) {
      throw new BadRequestError('Можно удалять только свои карточки');
    }
    await card.deleteOne();
    return res.status(200).json({ data: card });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new BadRequestError('Передан некорретный _id карточки'));
    }
    return next(err);
  }
};

export const addLikeCard = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user?._id } },
      { new: true },
    );
    if (!card) {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    }
    return res.status(200).json({ data: card });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка'));
    }
    return next(err);
  }
};

export const delLikeCard = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user?._id } },
      { new: true },
    );
    if (!card) {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    }
    return res.status(200).json({ data: card });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка'));
    }
    return next(err);
  }
};
