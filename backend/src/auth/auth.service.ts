import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import UserModel from '../user/user.model';
import { UserModelInterface } from '../user/interface';
import messages from '../config/messages';

const login = async (email: string, password: string) => {
    try {
        const user: UserModelInterface | null = await UserModel.findOne({ email });
        if (user) {
            if (!bcrypt.compareSync(password, user.password as string))
                return { success: false, message: messages.PASSWORD_INVALID };
            const token = jwt.sign(
                { _id: user._id, email: user.email, userType: user.userType },
                process.env.JWT_PRIVATE_KEY || '',
            );
            return { success: true, token };
        }
        return {
            success: false,
            message: messages.USER_NOT_FOUND,
        };
    } catch (error) {
        console.log('error', error);
    }
};

const forgotPassword = async (email: string) => {
    try {
        const user = await UserModel.findOne({ email });
        if (user) {
            const token = jwt.sign({ email: user.email, userType: user.userType }, process.env.JWT_PRIVATE_KEY || '');
            // sendMail(email, templateId, content = { token });
            return { success: true, message: messages.EMAIL_SENT, token };
        }
        return {
            success: false,
            message: messages.USER_NOT_FOUND,
        };
    } catch (error) {
        console.log('error', error);
    }
};

const changePassword = async (email: string, oldPassword: string, newPassword: string) => {
    try {
        const user = await UserModel.findOne({ email });
        if (user) {
            if (!bcrypt.compareSync(oldPassword, user.password as string))
                return { success: false, message: messages.PASSWORD_INVALID };

            user.password = bcrypt.hashSync(newPassword, 10);
            // await user.save();
            await UserModel.updateOne({ email }, { $set: { password: user.password } });
            const token = jwt.sign({ email: user.email, userType: user.userType }, process.env.JWT_PRIVATE_KEY || '');
            return { success: true, token, message: messages.PASSWORD_UPDATED };
        }
        return {
            success: false,
            message: messages.USER_NOT_FOUND,
        };
    } catch (error) {
        console.log('error', error);
    }
};

const verifyForgotPasswordToken = async (token: string) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY || '');
        if (!decoded) return { success: false, message: messages.TOKEN_EXPIRED };
        return { success: true };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
};

const resetPassword = async (email: string, password: string) => {
    try {
        const user = await UserModel.findOne({ email });
        if (user) {
            user.password = bcrypt.hashSync(password, 10);
            // await user.save();
            await UserModel.updateOne({ email }, { $set: { password: user.password } });
            return { success: true, email, password, message: messages.PASSWORD_UPDATED };
        }
        return { success: false, message: messages.USER_NOT_FOUND };
    } catch (error) {
        console.log('error', error);
    }
};

const markTokenAsInvalid = (token: string) => {
    console.log('calling function');
};

export default {
    login,
    forgotPassword,
    resetPassword,
    verifyForgotPasswordToken,
    changePassword,
    markTokenAsInvalid,
};
