import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import UserModel from '../user/user.model';
import { UserModelInterface } from '../user/interface';
import { messages } from '../common';
import UserTokenModel from '../usersToken/userToken.model';
import accessLogsModel from '../accessLogs/access.logs.model';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

const login = async (email: string, password: string, loginIp: any, loginPlatform: any) => {
    try {
        const user: UserModelInterface | null = await UserModel.findOne({ email });
        if (user) {
            if (!bcrypt.compareSync(password, user.password))
                return { success: false, message: messages.PASSWORD_INVALID };
            const token = jwt.sign(
                { _id: user._id, email: user.email, userType: user.userType },
                process.env.JWT_PRIVATE_KEY ?? ''
            );
            console.log('user._id', user._id);
            await accessLogsModel.findOneAndUpdate(
                { userId: new ObjectId(user._id) },
                { $set: { loginIp, loginPlatform, loginDateAndTime: new Date() } },
                { new: true },
            );

            return { success: true, token, userType: user.userType, message: messages.LOGIN_SUCCESSFULLY };

        }
        return {
            success: false,
            message: messages.USER_NOT_FOUND,
        };
    } catch (error) {
        return { success: false, error, message: (error as Error).message };
    }
};

const forgotPassword = async (email: string) => {
    try {
        const user = await UserModel.findOne({ email });
        if (user) {
            const token = jwt.sign({ email: user.email, userType: user.userType }, process.env.JWT_PRIVATE_KEY ?? '');
            await UserTokenModel.create({ token, userId: user._id, tokenType: 'FP', isUtilized: false });
            return { success: true, message: messages.EMAIL_SENT, token };
        }
        return {
            success: false,
            message: messages.USER_NOT_FOUND,
        };
    } catch (error) {
        return { success: false, error, message: (error as Error).message };
    }
};

const changePassword = async (email: string, oldPassword: string, newPassword: string) => {
    try {
        const user = await UserModel.findOne({ email });
        if (user) {
            if (!bcrypt.compareSync(oldPassword, user.password))
                return { success: false, message: messages.PASSWORD_INVALID };

            user.password = bcrypt.hashSync(newPassword, 10);
            await UserModel.updateOne({ email }, { $set: { password: user.password } });
            return { success: true, message: messages.PASSWORD_UPDATED };
        }
        return {
            success: false,
            message: messages.USER_NOT_FOUND,
        };
    } catch (error) {
        return { success: false, error, message: (error as Error).message };
    }
};

const verifyForgotPasswordToken = async (token: string) => {
    try {
        const result = await UserTokenModel.findOne({ token });
        if (!result) return { success: false, message: messages.TOKEN_NOT_FOUND };
        else if (result && result.isUtilized) return { success: false, message: messages.TOKEN_UTILIZED };
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY ?? '');
        if (!decoded) return { success: false, message: messages.TOKEN_EXPIRED };
        return { success: true, message: messages.TOKEN_VERIFIED };
    } catch (error) {
        return { success: false, error, message: (error as Error).message };
    }
};

const resetPassword = async (email: string, password: string) => {
    try {
        const user = await UserModel.findOne({ email });
        if (user) {
            user.password = bcrypt.hashSync(password, 10);
            await UserModel.updateOne({ email }, { $set: { password: user.password } });
            const token = jwt.sign(
                { email: user.email, userType: user.userType, _id: user._id },
                process.env.JWT_PRIVATE_KEY ?? ''
            );

            return { success: true, token, message: messages.PASSWORD_UPDATED };
        }
        return { success: false, message: messages.USER_NOT_FOUND };
    } catch (error) {
        return { success: false, error, message: (error as Error).message };
    }
};

const markTokenAsInvalid = async (token: string) => {
    try {
        await UserTokenModel.findOneAndUpdate({ token }, { $set: { isUtilized: true } });
        return { success: true, message: messages.TOKEN_UTILIZED };
    } catch (error) {
        return { success: false, error, message: (error as Error).message };
    }
};

export default {
    login,
    forgotPassword,
    resetPassword,
    verifyForgotPasswordToken,
    changePassword,
    markTokenAsInvalid,
};
