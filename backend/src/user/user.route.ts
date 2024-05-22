import express from 'express';
import userController from './user.controller';
import authenticateToken from '../middleware/validateToken';

const router = express.Router();

router.post('/add', userController.addUser);
router.delete('/:id', userController.deleteUser);
router.put('/change-status/:id', userController.changeUserStatus);

export default router;
