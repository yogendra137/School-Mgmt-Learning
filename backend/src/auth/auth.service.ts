import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../user/user.model';
import { UserModelInterface } from '../user/interface';

const login = async (email: string, password: string) => {
    try {
        const user: UserModelInterface | null = await User.findOne({ email });
        if (user) {
            if (!bcrypt.compareSync(password, user.password as string)) console.log('Password not match');

            const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_PRIVATE_KEY || '');
            return token;
        }
    } catch (error) {
        console.log('error', error);
    }
};

const forgotPassword = async (email: string) => {
    try {
        const user = await User.findOne({ email });
        if (user) {
            const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_PRIVATE_KEY || '');
        }

        // sendMail(email, templateId, content = { token });
    } catch (error) {
        console.log('error', error);
    }
};

const resetPassword = async (email: string, oldPassword: string, newPassword: string) => {
    try {
        const user = await User.findOne({ email });
        if (user) {
            if (!bcrypt.compareSync(oldPassword, user.password as string)) console.log('Password not match');

            user.password = bcrypt.hashSync(newPassword, 10);
            await user.save();
            const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_PRIVATE_KEY || '');
        }
    } catch (error) {
        console.log('error', error);
    }
};

const verifyForgotPasswordToken = async (token: string) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY || '');
        if (!decoded) console.log('Token not match or expired');
        return decoded;
    } catch (error) {
        console.log('error', error);
    }
};

const changePassword = async (email: string, password: string) => {
    try {
        const user = await User.findOne({ email });
        if (user) {
            user.password = bcrypt.hashSync(password, 10);
            await user.save();
        }
    } catch (error) {
        console.log('error', error);
    }
};

export default {
    login,
    forgotPassword,
    resetPassword,
    verifyForgotPasswordToken,
};
