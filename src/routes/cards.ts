import { Router } from 'express';
import {
  createCard, getCards, delCardsById, addLikeCard, delLikeCard,
} from '../controllers/cards';
import { validateCreaeteCard, validateCardById } from '../middlewares/validation';

const router = Router();
router.post('/', validateCreaeteCard, createCard);
router.get('/', getCards);
router.delete('/:cardId', validateCardById, delCardsById);
router.put('/:cardId/likes', validateCardById, addLikeCard);
router.delete('/:cardId/likes', validateCardById, delLikeCard);

export default router;
