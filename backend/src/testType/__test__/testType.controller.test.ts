import { Request, Response } from 'express';
import testTypeController from '../testType.controller';
import testTypeService from '../testType.service'; // Import your school service
import { messages } from '../../common'; // Import your messages

jest.mock('../testType.service');
jest.mock('../../common');

describe('addTestTypeController', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        // Initialize Express Request and Response mocks
        req = {
            body: {
                testName: 'Eye test specialist',
                skills: ['Eye teaming', 'Eye tracking'],
                description: 'knowledge of related this',
                duration: '3',
            },
            user: {
                _id: 'someUserId',
                userType: 'SA',
            },
        };
        // this will manage when get json error of actual controller
        statusMock = jest.fn().mockReturnThis();
        jsonMock = jest.fn();
        res = {
            status: statusMock,
            json: jsonMock,
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should add a new school successfully', async () => {
        const mockRequestBody = {
            testName: 'Eye test specialist',
            skills: ['Eye teaming', 'Eye tracking'],
            description: 'knowledge of related this',
            duration: '3',
        };
        // Mock the response from the school service
        const mockResponse = {
            message: messages.TEST_ADDED_SUCCESS,
            status: 200,
        };

        // Mock the addSchool function of the school service
        (testTypeService.addTestType as jest.Mock).mockResolvedValue(mockResponse);

        // Call the controller function with the mocked Request and Response objects
        // await addSchoolController(req as Request, res as Response);
        await testTypeController.addTestType({ body: mockRequestBody } as Request, res as Response);

        expect(testTypeService.addTestType).toHaveBeenCalledWith({ body: mockRequestBody });
        // Ensure the status and JSON methods were called with the correct arguments
        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({ message: messages.TEST_ADDED_SUCCESS, status: 200 });

        // Ensure the addSchool service function was called with the correct arguments
    });

    it('should return an error message and status 401 when an error occurs', async () => {
        // Mock the error response from the school service
        const errorMessage = 'Internal Server Error';
        const error = new Error(errorMessage);
        (testTypeService.addTestType as jest.Mock).mockRejectedValue(error);

        // Call the controller function with the mocked Request and Response objects
        await testTypeController.addTestType(req as Request, res as Response);

        // Ensure the status and JSON methods were called with the correct arguments
        expect(statusMock).toHaveBeenCalledWith(401);
        expect(jsonMock).toHaveBeenCalledWith({ error: errorMessage });

        // Ensure the addSchool service function was called with the correct arguments
        expect(testTypeService.addTestType).toHaveBeenCalledWith(req);
    });
});

describe('test type List Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        req = {}; // Initialize request object
        statusMock = jest.fn().mockReturnThis(); // Mock status method
        jsonMock = jest.fn(); // Mock json method
        res = {
            status: statusMock,
            json: jsonMock,
        };
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    it('should return the list of schools successfully', async () => {
        const mockResponse = {
            message: messages.FETCH_TEST_LIST,
            status: true,
            list: [
                {
                    testName: 'Eye test specialist',
                    skills: ['Eye teaming', 'Eye tracking'],
                    description: 'knowledge of related this',
                    duration: '3',
                },
            ],
        };

        (testTypeService.testList as jest.Mock).mockResolvedValue(mockResponse);

        await testTypeController.testList(req as Request, res as Response); // this will be controller

        expect(testTypeService.testList).toHaveBeenCalled(); // Ensure the service method is called
        expect(statusMock).toHaveBeenCalledWith(200); // Ensure status method is called with 200
        expect(jsonMock).toHaveBeenCalledWith(mockResponse); // Ensure json method is called with the correct response
    });
    // this will handle catch error
    it('should return error message and status 401 on failure', async () => {
        const errorMessage = 'Internal Server Error';
        (testTypeService.testList as jest.Mock).mockRejectedValue(new Error(errorMessage));

        await testTypeController.testList(req as Request, res as Response); // this is the controller

        expect(testTypeService.testList).toHaveBeenCalled(); // Ensure the service method is called
        expect(statusMock).toHaveBeenCalledWith(401); // Ensure status method is called with 401
        expect(jsonMock).toHaveBeenCalledWith({ error: errorMessage }); // Ensure json method is called with the error message
    });
});
