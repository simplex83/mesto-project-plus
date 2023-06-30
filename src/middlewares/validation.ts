/* eslint-disable import/no-extraneous-dependencies */
import { celebrate, Joi } from 'celebrate';

const validateUrl = /^https?:\/\/(?:www\.|(?!www))[-a-zA-Z0-9]{1,256}\.[a-zA-Z0-9]{2,6}[-a-zA-Z0-9()@:%_+.~#?&/=]*/;

export const validateGetUserById = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
});

export const validateUpdateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
  }),
});

export const validateUpdateAva = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(validateUrl),
  }),
});

export const validateCreaeteCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().pattern(validateUrl),
  }),
});

export const validateCardById = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

export const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().pattern(validateUrl),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

export const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

export const validateLink = (url: string) => validateUrl.test(url);
