import express from 'express';
import userController from './user.controller';
import authenticateToken from '../middleware/validateToken';

const router = express.Router();

router.post('/add', authenticateToken, userController.addUser);
router.delete('/:id', authenticateToken, userController.deleteUser);
router.put('/activate-deactivate/:id', userController.changeUserStatus);

export default router;
