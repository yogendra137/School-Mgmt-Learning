import express from 'express';
import userController from './user.controller';

const router = express.Router();

router.post('/add', userController.addUser);
router.delete('/:id', userController.deleteUser);
router.put('/change-status/:id', userController.toggleUserStatus);

export default router;
