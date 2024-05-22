import { Request, Response } from 'express';
import { messages } from '../../common'; // Import your messages
import userService from '../user.service';
import userController from '../user.controller';

jest.mock('../user.service');
jest.mock('../../common');

describe('addUserController', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        // Initialize Express Request and Response mocks
        req = {
            body: {
                name: 'project coordinator1',
                email: 'project1@gmail.com',
                password: 'Project@123',
                mobileNo: '7854126589',
                userType: 'PC',
                haveSkills: [],
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

    it('should add a new user successfully', async () => {
        const mockRequestBody = {
            name: 'project coordinator1',
            email: 'project1@gmail.com',
            password: 'Project@123',
            mobileNo: '7854126589',
            userType: 'PC',
            haveSkills: [],
        };
        // Mock the response from the school service
        const mockResponse = {
            message: messages.SCHOOL_ADDED_SUCCESS,
            status: 200,
        };

        // Mock the addSchool function of the school service
        (userService.addUser as jest.Mock).mockResolvedValue(mockResponse);

        // Call the controller function with the mocked Request and Response objects
        // await addSchoolController(req as Request, res as Response);
        await userController.addUser({ body: mockRequestBody } as Request, res as Response);

        expect(userService.addUser).toHaveBeenCalledWith({ body: mockRequestBody });
        // Ensure the status and JSON methods were called with the correct arguments
        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({ message: messages.SCHOOL_ADDED_SUCCESS, status: 200 });

        // Ensure the addSchool service function was called with the correct arguments
    });

    it('should return an error message and status 401 when an error occurs', async () => {
        // Mock the error response from the school service
        const errorMessage = 'Internal Server Error';
        const error = new Error(errorMessage);
        (userService.addUser as jest.Mock).mockRejectedValue(error);

        // Call the controller function with the mocked Request and Response objects
        await userController.addUser(req as Request, res as Response);

        // Ensure the status and JSON methods were called with the correct arguments
        expect(statusMock).toHaveBeenCalledWith(401);
        expect(jsonMock).toHaveBeenCalledWith({ error: errorMessage });

        // Ensure the addSchool service function was called with the correct arguments
        expect(userService.addUser).toHaveBeenCalledWith(req);
    });
});
