import express from 'express';
import profileController from './profile.controller';
import authenticateToken from '../middleware/validateToken';

const router = express.Router();

router.get('/me', authenticateToken, profileController.me);
router.put('/update', authenticateToken, profileController.updateProfile);

export default router;
