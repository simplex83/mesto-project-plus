import { Router } from 'express';
import {
  getUsers, getUserById, updateProfile, updateAva, getMe,
} from '../controllers/users';
import { validateGetUserById, validateUpdateProfile, validateUpdateAva } from '../middlewares/validation';

const router = Router();
router.get('/', getUsers);
router.get('/me', getMe);
router.get('/:userId', validateGetUserById, getUserById);
router.patch('/me', validateUpdateProfile, updateProfile);
router.patch('/me/avatar', validateUpdateAva, updateAva);

export default router;
