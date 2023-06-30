import mongoose, { Date, Schema } from 'mongoose';
import user from './user';
import { validateLink } from '../middlewares/validation';

interface ICard {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId;
  likes: [Schema.Types.ObjectId];
  createdAt: Date
}

const cardSchema = new mongoose.Schema<ICard>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: validateLink,
      message: 'Некорректный формат URL',
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  likes: {
    type: [Schema.Types.ObjectId],
    ref: user,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('card', cardSchema);
