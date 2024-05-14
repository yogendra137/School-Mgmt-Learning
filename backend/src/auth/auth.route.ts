import express from 'express';
import authController from './auth.controller';

const router = express.Router();

router.post('/login', authController.login);
router.get('/forgot-password', authController.forgotPassword);
router.get('/reset-password', authController.resetPassword);
router.get('/verify-forgot-password-token', authController.login);

export default router;
