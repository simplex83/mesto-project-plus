/* eslint-disable import/no-extraneous-dependencies */
import { celebrate, Joi } from 'celebrate';

export const validateGetUserById = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
});

export const validateUpdateProfile = celebrate({
  params: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
  }),
});

export const validateUpdateAva = celebrate({
  params: Joi.object().keys({
    avatar: Joi.string(),
  }),
});

export const validateCreaeteCard = celebrate({
  params: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
});

export const validateCardById = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
});

export const validateCreateUser = celebrate({
  params: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

export const validateLogin = celebrate({
  params: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateUrl = /^https?:\/\/(?:www\.|(?!www))[-a-zA-Z0-9]{1,256}\.[a-zA-Z0-9]{2,6}[-a-zA-Z0-9()@:%_+.~#?&/=]*/;
export const validateLink = (url: string) => validateUrl.test(url);
