import { Router } from "express";
import { createUser, getUsers, getUserById, updateProfile, updateAva } from "../controllers/users";

const router = Router();
router.post('/', createUser);
router.get('/', getUsers);
router.get('/:userId', getUserById);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAva)

export default router