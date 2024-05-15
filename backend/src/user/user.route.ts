import express from 'express';
import userController from './user.controller';

const router = express.Router();

router.post('/add', userController.addUser);
router.delete('/:id', userController.deleteUser);
router.put('/activate-deactivate/:id', userController.toggleUserStatus);

export default router;
