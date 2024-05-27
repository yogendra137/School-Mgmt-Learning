import userModel from '../user/user.model';
import httpsStatusCode from '../config/statusCode';
import { messages } from '../common';
import { UserModelInterface } from '../user/interface';

const me = async (user: any) => {
    try {
        const { _id } = user;
        const me = await userModel.findOne(
            { _id, isDeleted: false },
            { name: 1, email: 1, mobileNo: 1, userType: 1, isActive: 1, location: 1 },
        );
        if (!me) {
            return {
                message: messages.NOT_FOUND.replace('Item', 'Profile'),
                status: httpsStatusCode.NOT_FOUND,
            };
        }
        return {
            message: messages.ITEM_FETCH_SUCCESS.replace('Item', 'Profile'),
            status: httpsStatusCode.OK,
            me,
        };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
};

const updateProfile = async (user: any, body: UserModelInterface) => {
    try {
        const { _id } = user;
        const { name, email, mobileNo, city, state, country } = body;
        console.log('body', body);
        await userModel.findOneAndUpdate(
            { _id, isDeleted: false },
            { $set: { name, email, mobileNo, city, state, country } },
        );

        return {
            message: messages.ITEM_UPDATED_SUCCESS.replace('Item', 'Profile'),
            status: httpsStatusCode.OK,
        };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
};
export default {
    me,
    updateProfile,
};
