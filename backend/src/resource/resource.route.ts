import express from 'express';
import resourceController from './resource.controller';
import upload from '../utils/multer/upload';
import authenticateToken from '../middleware/validateToken';

const router = express.Router();

router.post('/add', upload.array('fileName'), authenticateToken, resourceController.addResource);
router.get('/:id', resourceController.getResourceById);
router.put('/update/:id', upload.array('fileName'), authenticateToken, resourceController.editResource);
router.put('/delete/:id', resourceController.deleteResource);
// router.get('/list', resourceController.getAllResources);
router.post('/change-status/:id', resourceController.activeAndDeActiveResource);

export default router;
