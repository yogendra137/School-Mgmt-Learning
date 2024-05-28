import { NextFunction, Request, Response } from 'express';
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

describe('deleteUserController', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        req = {
            params: { id: '123' },
            user: { _id: 'someUserId', userType: 'SA' },
        };

        statusMock = jest.fn().mockReturnThis();
        jsonMock = jest.fn();

        res = {
            status: statusMock,
            json: jsonMock,
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return success message and status 200', async () => {
        const mockResponse = {
            message: messages.ITEM_DELETED_SUCCESS.replace('Item', 'User'),
            status: 200,
        };

        (userService.deleteUser as jest.Mock).mockResolvedValue(mockResponse);

        await userController.deleteUser(req as Request, res as Response, next as NextFunction);

        expect(userService.deleteUser).toHaveBeenCalledWith(req);
        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({
            message: messages.ITEM_DELETED_SUCCESS.replace('Item', 'User'),
            status: 200,
        });
    });

    // it('should return an error message and status 401 when an error occurs', async () => {
    //     // Mock the error response from the school service
    //     const errorMessage = 'Internal Server Error';
    //     const error = new Error(errorMessage);
    //     (userService.addUser as jest.Mock).mockRejectedValue(error);

    //     // Call the controller function with the mocked Request and Response objects
    //     await userController.addUser(req as Request, res as Response);

    //     // Ensure the status and JSON methods were called with the correct arguments
    //     expect(statusMock).toHaveBeenCalledWith(401);
    //     expect(jsonMock).toHaveBeenCalledWith({ error: errorMessage });

    //     // Ensure the addSchool service function was called with the correct arguments
    //     expect(userService.addUser).toHaveBeenCalledWith(req);
    // });
});

describe('User List Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        req = {
            query: {},
            user: { _id: 'userId', userType: 'SA' },
        };

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

    it('should return a list of users with a 200 status', async () => {
        const mockResult = {
            message: 'Fetch users successfully',
            status: 200,
            list: [{ name: 'John Doe' }, { name: 'Jane Doe' }],
        };

        (userService.userList as jest.Mock).mockResolvedValue(mockResult);

        await userController.userList(req as Request, res as Response, next);

        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({
            message: 'Fetch users successfully',
            status: 200,
            list: mockResult.list,
        });
        expect(userService.userList).toHaveBeenCalledWith(req.query, req.user);
    });

    it('should handle errors and call next with the error', async () => {
        const error = new Error('Something went wrong');
        (userService.userList as jest.Mock).mockRejectedValue(error);

        await userController.userList(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
