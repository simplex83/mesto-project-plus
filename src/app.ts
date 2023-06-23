import express, { NextFunction, Response } from 'express';
import mongoose from 'mongoose';
import { RequestCustom } from './utils/types';
import userRoute from './routes/users';
import cardRoute from './routes/cards';
import errorHandler from './middlewares/errors';
import NotFoundError from './utils/notFoundError ';

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// подключение mongoose
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

// временное решение авторизации
app.use((req:RequestCustom, res:Response, next:NextFunction) => {
  req.user = {
    _id: '6492bfca4b2dbc7714a519e2',
  };
  next();
});

// подключение роутов
app.use('/users', userRoute);
app.use('/cards', cardRoute);
app.use((req: RequestCustom, res: Response, next: NextFunction) => {
  next(new NotFoundError('Страницы не существует'));
});
// подключение обработчика ошибок
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
