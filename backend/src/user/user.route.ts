import express from 'express';
import userController from './user.controller';
import authenticateToken from '../middleware/validateToken';

const router = express.Router();

router.post('/add', userController.addUser);
router.delete('/:id', authenticateToken, userController.deleteUser);
router.put('/activate-deactivate/:id', userController.toggleUserStatus);

export default router;
