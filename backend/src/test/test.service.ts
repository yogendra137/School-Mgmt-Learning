import { message } from '../common';
import { AddTestInterface } from './interface';
import testModel from './test.model';
/**
 * This function is use for add test
 * @param userData
 * @returns
 */
const addTest = async (userData: any) => {
    try {
        const {
            body: { testName, skills, description, duration, createdBy, updatedBy },
        }: AddTestInterface = userData;
        // we will get SA id which add roles will add in updated BY and created by so this will get by auth middleware
        await testModel.create({
            testName,
            skills,
            description,
            duration,
            isActive: true,
            createdBy,
            updatedBy,
        });
        return {
            message: message.testAddedSuccess,
            status: 200,
        };
    } catch (error) {
        console.log('error', error);
        // will throw error
    }
};
/**
 * This function is use for get list of test
 * @returns list
 */
const testList = async () => {
    try {
        const list = await testModel.find({}, { testName: 1, skills: 1, duration: 1 });
        // console.log('list', list);
        return {
            message: message.fetchTestList,
            status: 200,
            list,
        };
    } catch (error) {
        console.log('error', error);
        // will throw error
    }
};
export default {
    addTest,
    testList,
};
