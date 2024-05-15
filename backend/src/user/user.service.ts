import { encryptPassword, message } from '../common';
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

export default {
    addUser,
};
