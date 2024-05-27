import express from 'express';
import testController from './testType.controller';
import authenticateToken from '../middleware/validateToken';
import { addTestTypeValidation } from './testType.validation';
import handleValidationErrors from '../middleware/handleValidationError';

const router = express.Router();

router.post('/add', authenticateToken, addTestTypeValidation, handleValidationErrors, testController.addTestType);
router.get('/list', authenticateToken, testController.testList);
router.put('/delete/:id', authenticateToken, testController.deleteTestType);
router.get('/:id', authenticateToken, testController.getTestTypeById);
router.put('/update/:id', authenticateToken, testController.updateTestType);

export default router;
