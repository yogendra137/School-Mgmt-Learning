import { Request, Response } from 'express';
import authService from './auth.service';

const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        await authService.login(email, password);
        res.status(200).json({ success: true });
    } catch (error) {
        console.log('error', error);
    }
};

const forgotPassword = async (req: Request, res: Response) => {};

const resetPassword = async (req: Request, res: Response) => {};

const verifyForgotPasswordToken = async (req: Request, res: Response) => {};

const changePassword = async (req: Request, res: Response) => {};

export default {
    login,
    forgotPassword,
    resetPassword,
    verifyForgotPasswordToken,
    changePassword,
};
