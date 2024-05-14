import { Request, Response } from 'express';
import authService from './auth.service';
import HTTPStatus from '../config/statusCode';

interface NewRequest extends Request {
    user?: any;
}

const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        if (result?.success) res.status(HTTPStatus.OK).json({ success: true, token: result?.token });
        res.status(HTTPStatus.NOT_FOUND).json({ success: false, message: result?.message });
    } catch (error) {
        console.log('error', error);
    }
};

const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const result = await authService.forgotPassword(email);
        if (result?.success) res.status(HTTPStatus.OK).json({ ...result });
        res.status(HTTPStatus.NOT_FOUND).json({ ...result });
    } catch (error) {
        console.log('error', error);
    }
};

// This function is called when the user don't know the password.
const resetPassword = async (req: Request, res: Response) => {
    try {
        const { email, token, password } = req.body;
        // authService.markTokenAsInvalid(token);
        const result = await authService.resetPassword(email, password);
        if (result?.success) res.status(HTTPStatus.OK).json({ ...result });
        res.status(HTTPStatus.NOT_FOUND).json({ ...result });
    } catch (error) {
        console.log('error', error);
    }
};

const verifyForgotPasswordToken = async (req: Request, res: Response) => {
    const { token }: { token: string } = req.query as { token: string };
    const result = await authService.verifyForgotPasswordToken(token);
    if (result?.success) res.status(HTTPStatus.OK).json({ ...result });
    res.status(HTTPStatus.NOT_FOUND).json({ ...result });
};

// This function is called when the user know its password.
const changePassword = async (req: NewRequest, res: Response) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const { email } = req.user;
        console.log('request.user', req.user);
        const result = await authService.changePassword(email, oldPassword, newPassword);
        if (result?.success) return res.status(HTTPStatus.OK).json({ ...result });
        res.status(HTTPStatus.NOT_FOUND).json({ ...result });
    } catch (error) {
        console.log('error', error);
    }
};

export default {
    login,
    forgotPassword,
    resetPassword,
    verifyForgotPasswordToken,
    changePassword,
};
