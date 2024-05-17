import { NextFunction, Request, Response } from 'express';
import authService from './auth.service';
import HTTPStatus from '../config/statusCode';
import { decipher } from '../common';
interface NewRequest extends Request {
    user?: any;
}

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const decodedPassword = decipher()(password);

        const result = await authService.login(email, decodedPassword);
        if (result?.success) return res.status(HTTPStatus.OK).json({ ...result });
        else if (result?.error) throw new Error(result.message);
        res.status(HTTPStatus.NOT_FOUND).json({ success: false, message: result?.message });
    } catch (error) {
        next(error);
    }
};

const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        const result = await authService.forgotPassword(email);
        if (result?.success) return res.status(HTTPStatus.OK).json({ ...result });
        else if (result?.error) throw new Error(result.message);
        res.status(HTTPStatus.NOT_FOUND).json({ ...result });
    } catch (error) {
        next(error);
    }
};

// This function is called when the user don't know the password.
const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, token, password } = req.body;
        authService.markTokenAsInvalid(token);
        const decodedPassword = decipher()(password);
        const result = await authService.resetPassword(email, decodedPassword);
        if (result?.success) return res.status(HTTPStatus.OK).json({ ...result });
        else if (result?.error) throw new Error(result.message);
        res.status(HTTPStatus.NOT_FOUND).json({ ...result });
    } catch (error) {
        next(error);
    }
};

const verifyForgotPasswordToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers['x-icu-fp-token'];
        const result = await authService.verifyForgotPasswordToken(token as string);
        if (result?.success) return res.status(HTTPStatus.OK).json({ ...result });
        else if (result?.error) throw new Error(result.message);
        res.status(HTTPStatus.INVALID_TOKEN).json({ ...result });
    } catch (error) {
        next(error);
    }
};

// This function is called when the user know its password.
const changePassword = async (req: NewRequest, res: Response, next: NextFunction) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const { email } = req.user;
        const decodedOldPassword = decipher()(oldPassword);
        const decodedNewPassword = decipher()(newPassword);

        const result = await authService.changePassword(email, decodedOldPassword, decodedNewPassword);
        if (result?.success) return res.status(HTTPStatus.OK).json({ ...result });
        else if (result?.error) throw new Error(result.message);
        res.status(HTTPStatus.NOT_FOUND).json({ ...result });
    } catch (error) {
        next(error);
    }
};

export default {
    login,
    forgotPassword,
    resetPassword,
    verifyForgotPasswordToken,
    changePassword,
};
