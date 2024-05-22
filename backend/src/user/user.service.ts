import { encryptPassword, message } from '../common';
import messages from '../config/messages';
import { AddUserInterface } from './interface';
import userModel from './user.model';
/**
 * This route for to add user with different roles
 * @param userData
 * @returns
 */

const addUser = async (userData: any) => {
    try {
        const {
            body: { name, email, mobileNo, userType, haveSkills, createdBy, updatedBy },
        }: AddUserInterface = userData;
        // we will get SA id which add roles will add in updated BY and created by so this will get by auth middleware
        /**
         * Generate random password
         */
        const generatePassword = Math.random().toString(36).slice(-8);
        console.log('generatePassword', generatePassword);
        const hashedPassword = await encryptPassword(generatePassword);
        console.log('hashedPassword', hashedPassword);
        await userModel.create({
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
        return {
            message: message.userAddedSuccess,
            status: true,
        };
    } catch (error) {
        console.log('error', error);
        // will throw error
    }
};

const deleteUser = async (id: string) => {
    try {
        const user = await userModel.findOne({ _id: id });
        if (!user) return { success: false, message: messages.USER_NOT_FOUND };
        if (user?.userType === 'SA') return { success: false, message: messages.YOU_CAN_NOT_DELETE_SUPER_ADMIN };

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
