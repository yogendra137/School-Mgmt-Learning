import { encryptPassword, message } from '../common';
import messages from '../config/messages';
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
        const token = jwt.sign(
            { _id: user._id, email: user.email, userType: user.userType },
            process.env.JWT_PRIVATE_KEY || '',
        );
        return {
            message: message.userAddedSuccess,
            status: true,
            token,
        };
    } catch (error) {
        console.log('error', error);
        // will throw error
    }
};

const deleteUser = async (id: string) => {
    try {
        const user = await userModel.findOne({ _id: id });
        if (!user?.isDeleted) {
            const result = await userModel.updateOne({ _id: id }, { $set: { isDeleted: true } });
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

const toggleUserStatus = async (id: string) => {
    try {
        const user = await userModel.findOne({ _id: id });
        if (user?.userType === 'SA') return { success: false, message: messages.SUPER_ADMIN_NOT_DEACTIVATE };
        await userModel.updateOne({ _id: id }, { $set: { isActive: !Boolean(user?.isActive) } });
        return {
            success: true,
            message: messages.TOGGLE_STATUS.replace('toggle', Boolean(user?.isActive) ? 'deactivated' : 'activated'),
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
