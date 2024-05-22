import accessLogsModel from '../accessLogs/access.logs.model';
import { decipher, messages } from '../common';
import { AddUserInterface } from './interface';
import userModel from './user.model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import httpStatusCode from '../config/statusCode';
/**
 * This route for to add user with different roles
 * @param userData
 * @returns
 */

const addUser = async (userData: any) => {
    try {
        const {
            body: { name, email, mobileNo, password, userType, haveSkills },
            user: { _id, userType: userRole },
        }: AddUserInterface = userData;
        /**
         * Generate random password
         */
        const decodedPassword = decipher()(password);
        const password1 = bcrypt.hashSync(decodedPassword, 10);
        const loginIp = userData.socket.remoteAddress;
        const loginPlatform = userData.headers['user-agent'];
        // console.log('hashedPassword', hashedPassword);
        const user = await userModel.create({
            name,
            email,
            mobileNo,
            password: password1,
            haveSkills,
            isActive: true,
            userType,
            createdBy: userRole === 'SA' ? _id : null,
            updatedBy: userRole === 'SA' ? _id : null,
        });
        // Add entry on access logs
        await accessLogsModel.create({
            userId: user._id,
            loginDateAndTime: new Date(),
            loginIp,
            loginPlatform,
        });
        // await accessLogsModel.cr({ _id: user._id }, { $set: { loginIp, loginPlatform } });
        const token = jwt.sign(
            { _id: user._id, email: user.email, userType: user.userType },
            process.env.JWT_PRIVATE_KEY || '',
        );

        // await sendEmail('shivani.p@chapter247.com', 'Success', 'null', emailTemplateConstants.SIGNUP_EMAIL_TEMPLATE);
        return {
            message: messages.USER_ADDED_SUCCESS,
            status: httpStatusCode.OK,
            token,
        };
    } catch (error) {
        console.log('error', error);
    }
};

const deleteUser = async (resourceData: any) => {
    try {
        const {
            params: { id },
            user: { _id },
        }: AddUserInterface = resourceData;
        const user = await userModel.findOne({ _id: id });
        if (!user) return { success: false, message: messages.USER_NOT_FOUND };
        if (user?.userType === 'SA') return { success: false, message: messages.SUPER_ADMIN_NOT_DEACTIVATE };

        if (!user?.isDeleted) {
            const result = await userModel.updateOne({ _id: id }, { $set: { isDeleted: true, updatedBy: _id } });
            if (result.modifiedCount)
                return {
                    message: messages.USER_DELETED,
                    success: true,
                    status: httpStatusCode.OK,
                };
        }

        return {
            message: messages.USER_NOT_FOUND,
            success: false,
            status: 404,
        };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
};

const changeUserStatus = async (id: string, status: boolean, userData: any) => {
    try {
        const user = await userModel.findOne({ _id: id, isDeleted: false });
        if (!user) return { success: false, message: messages.USER_NOT_FOUND };
        if (user?.userType === 'SA') return { success: false, message: messages.SUPER_ADMIN_NOT_DEACTIVATE };
        await userModel.updateOne({ _id: id }, { $set: { isActive: status, updatedBy: userData._id } });
        return {
            success: true,
            message: messages.TOGGLE_STATUS.replace('toggle', status ? 'activated' : 'deactivated'),
        };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
};

export default {
    addUser,
    changeUserStatus,
    deleteUser,
};
