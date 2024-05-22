import express from 'express';
import schoolController from './school.controller';
import authenticateToken from '../middleware/validateToken';
import upload from '../utils/multer/upload';

const router = express.Router();

router.post('/add', upload.single('schoolLogo'), authenticateToken, schoolController.addSchool);
router.get('/list', authenticateToken, schoolController.schoolList);
router.get('/:id', authenticateToken, schoolController.getSchoolById);

export default router;
