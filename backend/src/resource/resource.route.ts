import express from 'express';
import resourceController from './resource.controller';
import upload from '../utils/multer/upload';

const router = express.Router();

router.post('/add', upload.array('fileName'), resourceController.addResource);
router.get('/:id', resourceController.getResourceById);
router.put('/update/:id', upload.array('fileName'), resourceController.editResource);

export default router;
