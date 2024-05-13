import { AddUserInterface } from './interface';

const addUser = async (userData: any) => {
    try {
        const { email, mobileNo, password, userType, createdBy, updatedBy }: AddUserInterface = userData;
        console.log('userData', email);
    } catch (error) {
        console.log('error', error);
    }
};

export default {
    addUser,
};
