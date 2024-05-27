import express from 'express';
import schoolController from './school.controller';
import authenticateToken from '../middleware/validateToken';
import upload from '../utils/multer/upload';
import { addSchoolValidation } from './school.validation';
import handleValidationErrors from '../middleware/handleValidationError';

const router = express.Router();

router.post(
    '/add',
    upload.single('schoolLogo'),
    addSchoolValidation,
    handleValidationErrors,
    authenticateToken,
    schoolController.addSchool,
);
router.get('/list', authenticateToken, schoolController.schoolList);
router.get('/:id', authenticateToken, schoolController.getSchoolById);
router.put('/delete/:id', authenticateToken, schoolController.deleteSchool);
router.put('/change-status/:id', authenticateToken, schoolController.activeAndDeActiveSchool);

export default router;
