import express from 'express';
import userController from './user.controller';
import authenticateToken from '../middleware/validateToken';
import handleValidationErrors from '../middleware/handleValidationError';
import { addUserValidation } from './user.validation';

const router = express.Router();

router.post('/add', authenticateToken, addUserValidation, handleValidationErrors, userController.addUser);
router.delete('/:id', authenticateToken, userController.deleteUser);
router.put('/change-status/:id', authenticateToken, userController.changeUserStatus);
router.get('/list', authenticateToken, userController.list);

export default router;
