import { NextFunction, Request, Response } from 'express';
import resourceService from '../resource.service';
import resourceController from '../resource.controller';
import { messages } from '../../common';

jest.mock('../resource.service');
jest.mock('../../common');

describe('addResource Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        req = {
            body: {
                title: 'Medicine materials',
                description: 'This is the doc of medicine',
                tags: 'care,setup',
            },
            files: [
                {
                    filename: 'file1.pdf',
                    fieldname: 'file',
                    originalname: 'file1.pdf',
                    encoding: '7bit',
                    mimetype: 'application/pdf',
                },
                {
                    filename: 'file2.pdf',
                    fieldname: 'file',
                    originalname: 'file2.pdf',
                    encoding: '7bit',
                    mimetype: 'application/pdf',
                },
            ] as any,
            user: {
                _id: 'someUserId',
                userType: 'SA',
            },
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

    it('should return status and message successfully', async () => {
        const mockRequestBody = {
            title: 'Medicine materials',
            description: 'This is the doc of medicine',
            tags: ['care', 'setup'],
        };

        const mockResult = {
            message: messages.RESOURCE_ADDED_SUCCESS,
            status: 200,
        };

        // Mock the addResource method to return mockResult
        (resourceService.addResource as jest.Mock).mockResolvedValue(mockResult); // this will what we want to return

        // Call the controller method with a mock request and response
        await resourceController.addResource({ body: mockRequestBody } as Request, res as Response);

        // Ensure the service method is called with the correct arguments
        expect(resourceService.addResource).toHaveBeenCalledWith({ body: mockRequestBody });

        // Ensure the response is sent with the correct status and message
        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({ message: messages.RESOURCE_ADDED_SUCCESS, status: 200 });
    });
    // this will handle catch error
    it('should return error message and status 401 on failure', async () => {
        const errorMessage = 'Internal Server Error';
        (resourceService.getResourceById as jest.Mock).mockRejectedValue(new Error(errorMessage));

        await resourceController.getResourceById(req as Request, res as Response); // this is the controller

        expect(resourceService.getResourceById).toHaveBeenCalled(); // Ensure the service method is called
        expect(statusMock).toHaveBeenCalledWith(401); // Ensure status method is called with 401
        expect(jsonMock).toHaveBeenCalledWith({ error: errorMessage }); // Ensure json method is called with the error message
    });
});

describe('getResourceById Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        req = {
            params: { id: '123' },
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

    it('should return the resource with a success message and status 200', async () => {
        const mockResource = { _id: '123', title: 'Test Resource' };
        (resourceService.getResourceById as jest.Mock).mockResolvedValue({
            message: messages.FETCH_RESOURCE_SUCCESS,
            status: 200,
            resource: mockResource,
        });

        await resourceController.getResourceById(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({
            message: messages.FETCH_RESOURCE_SUCCESS,
            status: 200,
            resource: mockResource,
        });
        expect(resourceService.getResourceById).toHaveBeenCalledWith(req.params);
    });

    it('should return a failure message and status 401', async () => {
        const errorMessage = 'Internal Server Error';
        (resourceService.getResourceById as jest.Mock).mockRejectedValue(new Error(errorMessage));

        await resourceController.getResourceById(req as Request, res as Response); // here is the controller

        expect(statusMock).toHaveBeenCalledWith(401); // return expected status
        expect(jsonMock).toHaveBeenCalledWith({ error: messages.INTERNAL_SERVER_ERROR });
        expect(resourceService.getResourceById).toHaveBeenCalledWith(req.params);
    });
});

describe('deleteResource controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
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
            message: messages.RESOURCE_DELETE_SUCCESS,
            status: 200,
        };

        (resourceService.deleteResource as jest.Mock).mockResolvedValue(mockResponse);

        await resourceController.deleteResource(req as Request, res as Response);

        expect(resourceService.deleteResource).toHaveBeenCalledWith(req);
        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({ message: messages.RESOURCE_DELETE_SUCCESS, status: 200 });
    });

    it('should handle errors gracefully and return status 401', async () => {
        const errorMessage = 'Internal Server Error';

        (resourceService.deleteResource as jest.Mock).mockRejectedValue(new Error(errorMessage)); // this will we service

        await resourceController.deleteResource(req as Request, res as Response); // This will we controller not service

        expect(resourceService.deleteResource).toHaveBeenCalledWith(req); // passing request in service
        expect(statusMock).toHaveBeenCalledWith(401); // manage status code
        expect(jsonMock).toHaveBeenCalledWith({ error: errorMessage }); // this is the error message
    });
});

describe('Get resource by id Controller', () => {
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

    it('should return the resource successfully', async () => {
        const mockResponse = {
            message: messages.FETCH_SCHOOL,
            status: true,
        };

        (resourceService.getResourceById as jest.Mock).mockResolvedValue(mockResponse);

        await resourceController.getResourceById(req as Request, res as Response); // this will be controller

        expect(resourceService.getResourceById).toHaveBeenCalled(); // Ensure the service method is called
        expect(statusMock).toHaveBeenCalledWith(200); // Ensure status method is called with 200
        expect(jsonMock).toHaveBeenCalledWith(mockResponse); // Ensure json method is called with the correct response
    });
    // this will handle catch error
    it('should return error message and status 401 on failure', async () => {
        const errorMessage = 'Internal Server Error';
        (resourceService.getResourceById as jest.Mock).mockRejectedValue(new Error(errorMessage));

        await resourceController.getResourceById(req as Request, res as Response); // this is the controller

        expect(resourceService.getResourceById).toHaveBeenCalled(); // Ensure the service method is called
        expect(statusMock).toHaveBeenCalledWith(401); // Ensure status method is called with 401
        expect(jsonMock).toHaveBeenCalledWith({ error: errorMessage }); // Ensure json method is called with the error message
    });
});

describe('activeAndDeActiveResource Controller', () => {
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

    it('should return the message and status successfully', async () => {
        const mockResponse = {
            message: messages.CHANGE_RESOURCE_STATUS,
            status: true,
        };

        (resourceService.activeAndDeActiveResource as jest.Mock).mockResolvedValue(mockResponse);

        await resourceController.activeAndDeActiveResource(req as Request, res as Response); // this will be controller

        expect(resourceService.activeAndDeActiveResource).toHaveBeenCalled(); // Ensure the service method is called
        expect(statusMock).toHaveBeenCalledWith(200); // Ensure status method is called with 200
        expect(jsonMock).toHaveBeenCalledWith(mockResponse); // Ensure json method is called with the correct response
    });
    // this will handle catch error
    it('should return error message and status 401 on failure', async () => {
        const errorMessage = 'Internal Server Error';
        (resourceService.activeAndDeActiveResource as jest.Mock).mockRejectedValue(new Error(errorMessage));

        await resourceController.activeAndDeActiveResource(req as Request, res as Response); // this is the controller

        expect(resourceService.activeAndDeActiveResource).toHaveBeenCalled(); // Ensure the service method is called
        expect(statusMock).toHaveBeenCalledWith(401); // Ensure status method is called with 401
        expect(jsonMock).toHaveBeenCalledWith({ error: errorMessage }); // Ensure json method is called with the error message
    });
});
