import { NextFunction, Request, Response } from 'express';
import resourceService from '../resource.service';
import HTTPStatus from '../../config/statusCode';
import resourceController from '../resource.controller';
import { decipher, messages } from '../../common';

jest.mock('../resource.service');
jest.mock('../../common');

// jest.mock('./path/to/resourceService');

describe('addResource Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock;

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

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return status and message successfully', async () => {
        const mockResult = {
            message: messages.RESOURCE_ADDED_SUCCESS,
            success: true,
            resourceEntries: [], // Assuming empty array for simplicity
        };

        (resourceService.addResource as jest.Mock).mockResolvedValue(mockResult);

        await resourceController.addResource(req as Request, res as Response);

        // Ensure the service method is called with the correct arguments
        expect(resourceService.addResource).toHaveBeenCalledWith(req);

        // Ensure the response is sent with the correct status and message
        expect(res.status).toHaveBeenCalledWith(HTTPStatus.OK);
        expect(res.json).toHaveBeenCalledWith({ status: true, message: messages.RESOURCE_ADDED_SUCCESS });
    });
});
