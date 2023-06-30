/* eslint-disable import/no-extraneous-dependencies */
import mongoose, { Model, Document } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import UnauthorizedError from '../utils/badRequestError';
import { validateLink } from '../middlewares/validation';

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}
interface IUserDocument extends Document<IUser>{}

interface UserModel extends Model<IUser> {
  // eslint-disable-next-line no-unused-vars
  findUserByCredentials: (email: string, password: string) => Promise<IUserDocument>
}

const userSchema = new mongoose.Schema<IUser, UserModel>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: validateLink,
      message: 'Некорректный формат URL',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: any) => validator.isEmail(v),
      message: 'Некорректный email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.static('findUserByCredentials', async function findUserByCredentials(email: string, password: string) {
  const user:IUser|null = await this.findOne({ email }).select('+password');
  if (!user) {
    throw new UnauthorizedError('Неправильные почта или пароль');
  }
  const userValid = await bcrypt.compare(password, user.password);
  if (!userValid) {
    throw new UnauthorizedError('Неправильные почта или пароль');
  }
  return user;
});

export default mongoose.model<IUser, UserModel>('user', userSchema);
