import express from 'express';
import resourceController from './resource.controller';
import upload from '../utils/multer/upload';
import authenticateToken from '../middleware/validateToken';

const router = express.Router();

router.post('/add', upload.array('fileName'), authenticateToken, resourceController.addResource); // add resource only by Admin
router.get('/:id', resourceController.getResourceById); // access resource by aby user
router.put('/update/:id', upload.array('fileName'), authenticateToken, resourceController.editResource); // Update resource by Admin
router.put('/delete/:id', authenticateToken, resourceController.deleteResource); // delete resource by admin
// router.get('/list', resourceController.getAllResources);
router.post('/change-status/:id', authenticateToken, resourceController.activeAndDeActiveResource);

export default router;
