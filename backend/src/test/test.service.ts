import { message } from '../common';
import { AddTestInterface } from './interface';
import testModel from './test.model';
/**
 * This function is use for add test
 * @param testData
 * @returns
 */
const addTestType = async (testData: any) => {
    try {
        const {
            body: { testName, skills, description, duration },
            user: { _id, userType },
        }: AddTestInterface = testData;
        if (userType === 'SA') {
            await testModel.create({
                testName,
                skills,
                description,
                duration,
                isActive: true,
                createdBy: _id,
                updatedBy: _id,
            });
            return {
                message: message.testAddedSuccess,
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
    addTestType,
    testList,
};
