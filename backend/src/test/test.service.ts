import { messages } from '../common';
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
                message: messages.TEST_ADDED_SUCCESS,
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
            message: messages.FETCH_TEST_LIST,
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
