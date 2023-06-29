import express, { NextFunction, Response } from 'express';
import mongoose from 'mongoose';
// eslint-disable-next-line import/no-extraneous-dependencies
import { errors } from 'celebrate';
import { RequestCustom } from './utils/types';
import userRoute from './routes/users';
import cardRoute from './routes/cards';
import errorHandler from './middlewares/errors';
import NotFoundError from './utils/notFoundError ';
import { login, createUser } from './controllers/users';
import auth from './middlewares/auth';
import logger from './middlewares/logger';
import { validateCreateUser, validateLogin } from './middlewares/validation';

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// подключение mongoose
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
// логер запросов
app.use(logger.requestLogger);

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);
app.use(auth);

// подключение роутов
app.use('/users', userRoute);
app.use('/cards', cardRoute);

// логер ошибок
app.use(logger.errorLogger);

app.use((req: RequestCustom, res: Response, next: NextFunction) => {
  next(new NotFoundError('Страницы не существует'));
});
app.use(errors);
// подключение обработчика ошибок
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
