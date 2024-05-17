import express from 'express';
import schoolController from './school.controller';
import authenticateToken from '../middleware/validateToken';

const router = express.Router();

router.post('/add', authenticateToken, schoolController.addSchool);
router.get('/list', schoolController.schoolList);
router.get('/:id', schoolController.getSchoolById);

export default router;
