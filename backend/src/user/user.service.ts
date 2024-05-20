import accessLogsModel from '../accessLogs/access.logs.model';
import { encryptPassword, messages } from '../common';
import { AddUserInterface } from './interface';
import userModel from './user.model';
import jwt from 'jsonwebtoken';
/**
 * This route for to add user with different roles
 * @param userData
 * @returns
 */

const addUser = async (userData: any) => {
    try {
        const {
            body: { name, email, mobileNo, userType, haveSkills, createdBy, updatedBy },
            // user: { _id, userType:{userRole} },
        }: AddUserInterface = userData;
        // we will get SA id which add roles will add in updated BY and created by so this will get by auth middleware
        /**
         * Generate random password
         */
        const generatePassword = Math.random().toString(36).slice(-8);
        console.log('generatePassword', generatePassword);
        const hashedPassword = await encryptPassword(generatePassword);
        const loginIp = userData.socket.remoteAddress;
        const loginPlatform = userData.headers['user-agent'];
        console.log('hashedPassword', hashedPassword);
        const user = await userModel.create({
            name,
            email,
            mobileNo,
            password: hashedPassword,
            haveSkills,
            isActive: true,
            userType,
            createdBy,
            updatedBy,
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
        return {
            message: messages.USER_ADDED_SUCCESS,
            status: true,
            token,
        };
    } catch (error) {
        console.log('error', error);
        // will throw error
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
                };
        }

        return {
            message: messages.USER_NOT_FOUND,
            success: false,
        };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
};

const toggleUserStatus = async (id: string, status: boolean) => {
    try {
        const user = await userModel.findOne({ _id: id, isDeleted: false });
        if (!user) return { success: false, message: messages.USER_NOT_FOUND };
        if (user?.userType === 'SA') return { success: false, message: messages.SUPER_ADMIN_NOT_DEACTIVATE };
        await userModel.updateOne({ _id: id }, { $set: { isActive: status } });
        return {
            success: true,
            message: messages.TOGGLE_STATUS.replace('toggle', status ? 'deactivated' : 'activated'),
        };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
};

export default {
    addUser,
    toggleUserStatus,
    deleteUser,
};
