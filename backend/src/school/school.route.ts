import express from 'express';
import schoolController from './school.controller';

const router = express.Router();

router.post('/add', schoolController.addSchool);
router.get('/list', schoolController.schoolList);
router.get('/:id', schoolController.getSchoolById);

export default router;
