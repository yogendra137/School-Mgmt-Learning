import { messages } from '../common';
import { AddTestInterface, TestModelInterface } from './interface';
import testTypeModel from './testType.model';
import httpsStatusCode from '../config/statusCode';
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
            await testTypeModel.create({
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
        return { success: false, message: (error as Error).message };
    }
};
/**
 * This function is use for get list of test
 * @returns list
 */
const testList = async (user: any) => {
    try {
        if (!user) {
            return {
                message: messages.SOMETHING_WENT_WRONG,
                status: httpsStatusCode.INTERNAL_SERVER_ERROR,
            };
        }
        const list = await testTypeModel.find(
            { isDeleted: false },
            { testName: 1, skills: 1, duration: 1, isActive: 1, description: 1 },
        );
        if (!list) {
            return {
                message: messages.NOT_FOUND.replace('Item', 'test'),
                status: httpsStatusCode.NOT_FOUND,
            };
        }
        return {
            message: messages.FETCH_TEST_LIST,
            status: httpsStatusCode.OK,
            list,
        };
    } catch (error) {
        console.log('error', error);
        return { success: false, status: httpsStatusCode.INTERNAL_SERVER_ERROR, message: (error as Error).message };
    }
};
/**
 * This service is use for to delete the test type
 * @param user
 * @param id
 * @returns
 */
const deleteTestType = async (user: any, id: string) => {
    try {
        if (!user) {
            return {
                message: messages.SOMETHING_WENT_WRONG,
                status: httpsStatusCode.INTERNAL_SERVER_ERROR,
            };
        }
        const getTestType = await testTypeModel.findOne({ _id: id, isDeleted: false });
        if (!getTestType) {
            return {
                message: messages.NOT_FOUND.replace('Item', 'Test type'),
                status: httpsStatusCode.NOT_FOUND,
            };
        }
        await testTypeModel.findOneAndUpdate({ _id: id }, { $set: { isDeleted: true } });
        return {
            message: messages.ITEM_DELETED_SUCCESS.replace('Item', 'Test type'),
            status: httpsStatusCode.OK,
        };
    } catch (err) {
        console.log('err', err);
    }
};
/**
 * This service is use for to update test type
 * @param user
 * @param body
 * @param id
 * @returns
 */
const updateTestType = async (user: any, body: TestModelInterface, id: string) => {
    try {
        if (!user) {
            return {
                message: messages.SOMETHING_WENT_WRONG,
                status: httpsStatusCode.INTERNAL_SERVER_ERROR,
            };
        }
        const { testName, description, skills, duration } = body;
        await testTypeModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: { testName, description, skills, duration } },
        );
        return {
            message: messages.ITEM_UPDATED_SUCCESS.replace('Item', 'Test type'),
            status: httpsStatusCode.OK,
        };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
};
/**
 * This function is call to get test type by id
 * @param user
 * @param id
 * @returns
 */
const getTestTypeById = async (user: any, id: string) => {
    try {
        if (!user) {
            return {
                message: messages.SOMETHING_WENT_WRONG,
                status: httpsStatusCode.INTERNAL_SERVER_ERROR,
            };
        }
        const testType = await testTypeModel.findOne({ _id: id, isDeleted: false });
        if (!testType) {
            return {
                message: messages.NOT_FOUND.replace('Item', 'Test type'),
                status: httpsStatusCode.NOT_FOUND,
            };
        }
        return {
            message: messages.ITEM_FETCH_SUCCESS.replace('Item', 'Test type'),
            status: httpsStatusCode.OK,
            testType,
        };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
};
export default {
    addTestType,
    testList,
    deleteTestType,
    updateTestType,
    getTestTypeById,
};
