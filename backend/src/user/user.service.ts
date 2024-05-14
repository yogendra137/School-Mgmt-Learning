import { AddUserInterface } from './interface';
import userModel from './user.model';

const addUser = async (userData: any) => {
    try {
        const { email, mobileNo, password, userType, createdBy, updatedBy }: AddUserInterface = userData;
        console.log('userData', email);
        const generatePassword = Math.random().toString(36).slice(-8);
        console.log("generatePassword",generatePassword)
        await userModel.create({
            email,
            mobileNo,
            password :generatePassword,
            userType,
            createdBy,
            updatedBy
        });
        return{
            message:"Added"
        }
    } catch (error) {
        console.log('error', error);
    }
};

export default {
    addUser,
};
