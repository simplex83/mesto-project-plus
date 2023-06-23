import { Router } from "express";
import { createCard, getCards, delCardsById, addLikeCard, delLikeCard } from "../controllers/cards";

const router = Router();
router.post('/', createCard);
router.get('/', getCards);
router.delete('/:cardId', delCardsById);
router.put('/:cardId/likes', addLikeCard);
router.delete('/:cardId/likes', delLikeCard);

export default router;