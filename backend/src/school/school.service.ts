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
 * This function is use for the get list of school
 * @returns status,message and list
 */
const schoolList = async (user: any) => {
    try {
        if (!user) {
            return {
                message: messages.SOMETHING_WENT_WRONG,
                status: false,
            };
        }
        const list = await schoolModel.find(
            {},
            { schoolName: 1, contactPerson: 1, contactEmail: 1, contactNumber: 1, location: 1 },
        );
        if (!list) {
            return {
                message: messages.NOT_FOUND.replace('Item', 'School'),
                status: false,
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

const getSchoolById = async (schoolId: any, user: any) => {
    try {
        if (!user) {
            return {
                message: messages.SOMETHING_WENT_WRONG,
                status: false,
            };
        }
        const school = await schoolModel.findOne({ _id: schoolId });
        if (!school) {
            return {
                message: messages.NOT_FOUND.replace('Item', 'School'),
                status: false,
            };
        }
        return {
            message: messages.FETCH_SCHOOL,
            status: httpsStatusCode.OK,
            school,
        };
    } catch (error) {
        console.log('error', error);
        return { success: false, status: httpsStatusCode.INTERNAL_SERVER_ERROR, message: (error as Error).message };
    }
};

export default {
    addSchool,
    schoolList,
    getSchoolById,
};
