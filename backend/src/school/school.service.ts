import { messages } from '../common';
import { AddSchoolInterface } from './interface';
import schoolModel from './school.model';
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
        }: AddSchoolInterface = schoolData;
        if (userType === 'SA') {
            await schoolModel.create({
                schoolName,
                contactPerson,
                contactEmail,
                contactNumber,
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
                status: 200,
            };
        } else {
            return {
                message: messages.NOT_PERMISSION,
                status: 403,
            };
        }
    } catch (error) {
        console.log('error', error);
        return { success: false, status: 500, message: (error as Error).message };
    }
};
/**
 * This function is use for the get list of school
 * @returns status,message and list
 */
const schoolList = async () => {
    try {
        const list = await schoolModel.find(
            {},
            { schoolName: 1, contactPerson: 1, contactEmail: 1, contactNumber: 1, location: 1 },
        );
        return {
            message: messages.FETCH_SCHOOL_LIST_SUCCESS,
            status: 200,
            list,
        };
    } catch (error) {
        console.log('');
        return { success: false, status: 500, message: (error as Error).message };
    }
};

const getSchoolById = async (schoolId: any) => {
    try {
        const { id }: any = schoolId;
        const school = await schoolModel.findOne({ _id: id });
        if (!school) {
            return {
                message: messages.SOMETHING_WENT_WRONG,
                status: false,
            };
        }
        return {
            message: messages.FETCH_SCHOOL,
            status: true,
            school,
        };
    } catch (error) {
        console.log('error', error);
        return { success: false, status: 500, message: (error as Error).message };
    }
};

export default {
    addSchool,
    schoolList,
    getSchoolById,
};
