import testTypeService from '../testType.service';
import testTypeModel from '../testType.model'; // Import your school model
import { messages } from '../../common'; // Import your messages

jest.mock('../testType.model');
// Add school test cases
describe('addTest', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should add a test type successfully', async () => {
        // Mock school data and user data
        const schoolData = {
            body: {
                testName: 'Eye test specialist',
                skills: ['Eye teaming', 'Eye tracking'],
                description: 'knowledge of related this',
                duration: '3',
            },
            user: { _id: 'userId', userType: 'SA' },
        };

        // Mock school document returned by the create method
        const newTest = {
            _id: 'testId',
            schoolName: 'Test name',
        };

        // Mock the school model's create method to return the new school document
        (testTypeModel.create as jest.Mock).mockResolvedValue(newTest);

        // Call the addSchool function
        const result = await testTypeService.addTestType(schoolData);

        // Verify the result
        expect(result).toEqual({
            message: messages.TEST_ADDED_SUCCESS,
            status: 200,
        });

        // Verify that the school model's create method was called with the correct data
        expect(testTypeModel.create).toHaveBeenCalledWith({
            testName: 'Eye test specialist',
            skills: ['Eye teaming', 'Eye tracking'],
            description: 'knowledge of related this',
            duration: '3',
            isActive: true,
            createdBy: 'userId',
            updatedBy: 'userId',
        });
    });

    it('should return a permission denied message and status 403 for non-SA user', async () => {
        // test can be add by SA
        // Mock school data with non-SA user
        const schoolData = {
            body: {}, // Empty body for simplicity
            user: { _id: 'userId', userType: 'non-SA' },
        };

        // Call the addSchool function
        const result = await testTypeService.addTestType(schoolData);

        // Verify the result
        expect(result).toEqual({
            message: messages.NOT_PERMISSION,
            status: 403,
        });

        // Ensure the school model's create method was not called
        expect(testTypeModel.create).not.toHaveBeenCalled();
    });
});

describe('testList', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    it('should return an error message when no user is provided', async () => {
        const result = await testTypeService.testList(null);

        expect(result).toEqual({
            message: messages.SOMETHING_WENT_WRONG,
            status: false,
        });
    });

    // it('should return a not found message when no tests are found', async () => {
    //     (testTypeModel.find as jest.Mock).mockResolvedValue([]);

    //     const result = await testTypeService.testList({});

    //     expect(testTypeModel.find).toHaveBeenCalledWith(
    //         {},
    //         { testName: 1, skills: 1, duration: 1, isActive: 1, description: 1 },
    //     );
    //     console.log('result0000001', result);
    //     expect(result).toEqual({
    //         message: messages.NOT_FOUND.replace('Item', 'test'),
    //         status: false,
    //     });
    // });

    it('should return the test list successfully', async () => {
        const mockTests = [
            {
                testName: 'Eye test specialist',
                skills: ['Eye teaming', 'Eye tracking'],
                description: 'knowledge of related this',
                duration: '3',
                isActive: true,
                createdBy: 'userId',
                updatedBy: 'userId',
            },
        ];

        // Mock the find method to return the mock tests
        (testTypeModel.find as jest.Mock).mockResolvedValue(mockTests);

        // Call the service function
        const result = await testTypeService.testList({});

        // Ensure the find method was called with the correct arguments
        expect(testTypeModel.find).toHaveBeenCalledWith(
            {},
            { testName: 1, skills: 1, duration: 1, isActive: 1, description: 1 },
        );

        // Ensure the result matches the expected output
        expect(result).toEqual({
            message: messages.FETCH_TEST_LIST,
            status: 200,
            list: mockTests,
        });
    });

    it('should handle errors with status 500', async () => {
        (testTypeModel.find as jest.Mock).mockRejectedValue(new Error(messages.INTERNAL_SERVER_ERROR));

        const result = await testTypeService.testList({});

        expect(result).toEqual({
            success: false,
            status: 500,
            message: messages.INTERNAL_SERVER_ERROR,
        });
    });
});
