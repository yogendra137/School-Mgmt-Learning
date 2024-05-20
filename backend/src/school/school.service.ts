import { message } from '../common';
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
                message: message.schoolAddSuccess,
                status: 200,
            };
        } else {
            return {
                message: message.notPermission,
                status: 403,
            };
        }
    } catch (error) {
        console.log('error', error);
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
        console.log(list, 'list');
        return {
            message: message.fetchSchoolListSuccess,
            status: true,
            list,
        };
    } catch (error) {
        console.log('');
    }
};

const getSchoolById = async (schoolId: any) => {
    try {
        const { id }: any = schoolId;
        const school = await schoolModel.findOne({ _id: id });
        return {
            message: message.fetchSchool,
            status: true,
            school,
        };
    } catch (error) {
        console.log('error', error);
    }
};

export default {
    addSchool,
    schoolList,
    getSchoolById,
};
