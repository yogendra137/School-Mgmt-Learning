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
        // Mock resourceService.getResourceById to reject with an error
        (resourceService.getResourceById as jest.Mock).mockRejectedValue(new Error(errorMessage));

        // Call the controller function with the updated req object
        await resourceController.getResourceById(req as Request, res as Response);

        // Verify that the response is sent with status 401 and the error message
        expect(statusMock).toHaveBeenCalledWith(401);
        expect(jsonMock).toHaveBeenCalledWith({ error: errorMessage });
    });
});

describe('getResourceById controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        req = {
            params: { id: 'resourceId' },
            user: { _id: 'userId', userType: 'SA' },
        } as Partial<Request>;

        statusMock = jest.fn().mockReturnThis();
        jsonMock = jest.fn();

        res = {
            status: statusMock,
            json: jsonMock,
        } as Partial<Response>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return resource details with status 200 when resource is found', async () => {
        const mockResource = {
            _id: 'resourceId',
            title: 'Test Resource',
            content: 'Lorem ipsum dolor sit amet',
        };

        // Mock resourceService.getResourceById to resolve with the mock resource
        (resourceService.getResourceById as jest.Mock).mockResolvedValue({
            message: 'Resource found',
            status: 200,
            resource: mockResource,
        });

        // Call the controller function
        await resourceController.getResourceById(req as Request, res as Response);

        // Verify that the response is sent with the correct status and resource
        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({
            message: 'Resource found',
            status: 200,
            resource: mockResource,
        });
    });

    it('should return 401 status with error message when an error occurs', async () => {
        const errorMessage = 'Internal Server Error';

        // Mock resourceService.getResourceById to reject with an error
        (resourceService.getResourceById as jest.Mock).mockRejectedValue(new Error(errorMessage));

        // Call the controller function
        await resourceController.getResourceById(req as Request, res as Response);

        // Verify that the response is sent with status 401 and the error message
        expect(statusMock).toHaveBeenCalledWith(401);
        expect(jsonMock).toHaveBeenCalledWith({ error: errorMessage });
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
            message: messages.ITEM_DELETED_SUCCESS.replace('Item', 'Resource'),
            status: 200,
        };

        (resourceService.deleteResource as jest.Mock).mockResolvedValue(mockResponse);

        await resourceController.deleteResource(req as Request, res as Response);

        expect(resourceService.deleteResource).toHaveBeenCalledWith(req);
        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({
            message: messages.ITEM_DELETED_SUCCESS.replace('Item', 'Resource'),
            status: 200,
        });
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

    it('should activate the resource and return success message with status 200', async () => {
        // Mock the response from the service
        const mockResponse = {
            message: messages.CHANGE_STATUS_SUCCESS.replace('Item', 'Resource'),
            status: 200,
        };
        (resourceService.activeAndDeActiveResource as jest.Mock).mockResolvedValue(mockResponse);

        // Call the controller function
        await resourceController.activeAndDeActiveResource(req as Request, res as Response);

        // Verify the response sent by the controller
        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith(mockResponse);
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
