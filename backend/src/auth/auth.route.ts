import express from 'express';
import authController from './auth.controller';
import validateToken from '../middleware/validateToken';

const router = express.Router();

router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/change-password', validateToken, authController.changePassword);
router.get('/verify-forgot-password-token', authController.verifyForgotPasswordToken);

export default router;
