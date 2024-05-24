import { messages } from '../common';
import { AddSchoolInterface } from './interface';
import schoolModel from './school.model';
import httpsStatusCode from '../config/statusCode';
/**
 * This route for to add school by admin
 * @param schoolData
 * @returns
 */
const addSchool = async (schoolData: any) => {
    try {
        const {
            body: { schoolName, contactPerson, contactEmail, contactNumber, city, state, country },
            user: { _id, userType },
            file,
        }: AddSchoolInterface = schoolData;
        if (userType === 'SA') {
            await schoolModel.create({
                schoolName,
                contactPerson,
                contactEmail,
                contactNumber,
                schoolLogo: file.filename,
                location: {
                    city,
                    state,
                    country,
                },
                isActive: true,
                createdBy: _id,
                updatedBy: _id,
            });
            return {
                message: messages.SCHOOL_ADDED_SUCCESS,
                status: httpsStatusCode.OK,
            };
        } else {
            return {
                message: messages.NOT_PERMISSION,
                status: httpsStatusCode.FORBIDDEN,
            };
        }
    } catch (error) {
        console.log('error', error);
        return { success: false, status: httpsStatusCode.INTERNAL_SERVER_ERROR, message: (error as Error).message };
    }
};
/**
 * This api is use for to get the lost of schools
 * @param user
 * @returns
 */
const schoolList = async (user: any) => {
    try {
        if (!user) {
            return {
                message: messages.SOMETHING_WENT_WRONG,
                status: httpsStatusCode.INTERNAL_SERVER_ERROR,
            };
        }
        const list = await schoolModel.find(
            { isDeleted: false },
            { schoolName: 1, contactPerson: 1, contactEmail: 1, contactNumber: 1, location: 1, isActive: 1 },
        );
        if (list.length === 0) {
            return {
                message: messages.NOT_FOUND.replace('Item', 'School'),
                status: httpsStatusCode.NOT_FOUND,
            };
        }
        return {
            message: messages.FETCH_SCHOOL_LIST_SUCCESS,
            status: httpsStatusCode.OK,
            list,
        };
    } catch (error) {
        console.log('');
        return { success: false, status: httpsStatusCode.INTERNAL_SERVER_ERROR, message: (error as Error).message };
    }
};
/**
 * This api is use for to get school by id
 * @param schoolId
 * @param user
 * @returns
 */
const getSchoolById = async (schoolId: any, user: any) => {
    try {
        if (!user) {
            return {
                message: messages.SOMETHING_WENT_WRONG,
                status: httpsStatusCode.INTERNAL_SERVER_ERROR,
            };
        }
        const school = await schoolModel.findOne({ _id: schoolId, isDeleted: false });
        if (!school || school == null) {
            return {
                message: messages.NOT_FOUND.replace('Item', 'School'),
                status: httpsStatusCode.NOT_FOUND,
            };
        }
        return {
            message: messages.ITEM_FETCH_SUCCESS.replace('Item', 'School'),
            status: httpsStatusCode.OK,
            school,
        };
    } catch (error) {
        console.log('error', error);
        return { success: false, status: httpsStatusCode.INTERNAL_SERVER_ERROR, message: (error as Error).message };
    }
};
/**
 * This function is use for to delete the school
 * @param schoolId
 * @param user
 * @returns
 */
const deleteSchool = async (schoolId: any, user: any) => {
    try {
        if (!user) {
            return {
                message: messages.SOMETHING_WENT_WRONG,
                status: httpsStatusCode.INTERNAL_SERVER_ERROR,
            };
        }
        const getSchool = await schoolModel.findOne({ _id: schoolId, isDeleted: false });
        if (!getSchool) {
            return {
                message: messages.NOT_FOUND.replace('Item', 'School'),
                status: httpsStatusCode.NOT_FOUND,
            };
        }
        await schoolModel.findOneAndUpdate({ _id: schoolId }, { $set: { isDeleted: true, isActive: false } });
        return {
            message: messages.ITEM_DELETED_SUCCESS.replace('Item', 'School'),
            status: httpsStatusCode.OK,
        };
    } catch (error) {
        console.log('error', error);
        return { success: false, status: httpsStatusCode.INTERNAL_SERVER_ERROR, message: (error as Error).message };
    }
};
/**
 * This api is use for to change the status of school
 * @param schoolId
 * @param user
 * @param status
 * @returns
 */
const activeAndDeActiveSchool = async (schoolId: any, user: any, status: boolean) => {
    try {
        const { userType, _id } = user;
        if (userType === 'SA') {
            if (status === true) {
                await schoolModel.findOneAndUpdate({ _id: schoolId }, { $set: { isActive: true }, updatedBy: _id });
            } else {
                await schoolModel.findOneAndUpdate({ _id: schoolId }, { $set: { isActive: false }, updatedBy: _id });
            }
            return {
                message: messages.CHANGE_STATUS_SUCCESS.replace('Item', 'School'),
                status: httpsStatusCode.OK,
            };
        } else {
            throw new Error('User is not authorized'); // Throw an error if user is not SA
        }
    } catch (error) {
        console.log('error', error);
        return { success: false, status: httpsStatusCode.INTERNAL_SERVER_ERROR, message: (error as Error).message };
    }
};

export default {
    addSchool,
    schoolList,
    getSchoolById,
    deleteSchool,
    activeAndDeActiveSchool,
};
