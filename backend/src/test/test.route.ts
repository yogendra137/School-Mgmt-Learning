import express from 'express';
import testController from './test.controller';

const router = express.Router();

router.post('/add', testController.addTest);
router.get('/list', testController.testList);

export default router;
