import express from 'express';
import testController from './testType.controller';
import authenticateToken from '../middleware/validateToken';

const router = express.Router();

router.post('/add', authenticateToken, testController.addTestType);
router.get('/list', authenticateToken, testController.testList);

export default router;
