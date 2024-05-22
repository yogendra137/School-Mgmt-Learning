import resourceService from '../resource.service';
import resourceModel from '../resource.model';
import { messages } from '../../common';
import path from 'path';
import fs from 'fs';

jest.mock('../resource.model');
jest.mock('fs');
// Add resource test case
describe('add resource', () => {
    const data = {
        body: {
            title: 'Medicine materials',
            description: 'This is the doc of medicine',
            tags: 'care,setup',
        },
        files: [{ filename: 'file1.pdf' }, { filename: 'file2.pdf' }],
        user: {
            _id: 'someUserId',
            userType: 'SA',
        },
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return status and message successfully', async () => {
        const mockResourceEntry = {
            fileName: 'file1.pdf',
            title: 'Medicine materials',
            description: 'This is the doc of medicine',
            tags: ['care', 'setup'],
            isActive: true,
            createdBy: 'someUserId',
            updatedBy: 'someUserId',
        };

        // Mock the create method to resolve with a mock resource entry
        // resourceModel.create.mockResolvedValue(mockResourceEntry);
        (resourceModel.create as jest.Mock).mockResolvedValue(mockResourceEntry);

        const result = await resourceService.addResource(data);

        expect(result).toEqual({
            status: 200,
            message: messages.RESOURCE_ADDED_SUCCESS,
            resourceEntries: [mockResourceEntry, mockResourceEntry], // Expecting two entries for the two files
        });

        // Ensure the create method is called with the correct parameters for each file
        expect(resourceModel.create).toHaveBeenCalledWith({
            fileName: 'file1.pdf',
            title: 'Medicine materials',
            description: 'This is the doc of medicine',
            tags: ['care', 'setup'],
            isActive: true,
            createdBy: 'someUserId',
            updatedBy: 'someUserId',
        });
        expect(resourceModel.create).toHaveBeenCalledWith({
            fileName: 'file2.pdf',
            title: 'Medicine materials',
            description: 'This is the doc of medicine',
            tags: ['care', 'setup'],
            isActive: true,
            createdBy: 'someUserId',
            updatedBy: 'someUserId',
        });
    });
});

// get resource by id
describe('getResourceById', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return the resource with a success message and status 200', async () => {
        const mockResource = { _id: '123', title: 'Test Resource' };
        (resourceModel.findOne as jest.Mock).mockResolvedValue(mockResource);

        const resourceId = { id: '123' };
        const result = await resourceService.getResourceById(resourceId);

        expect(result).toEqual({
            message: messages.FETCH_RESOURCE_SUCCESS,
            status: 200,
            resource: mockResource,
        });
        expect(resourceModel.findOne).toHaveBeenCalledWith({ _id: '123' });
    });

    it('should return a failure message and status 500', async () => {
        (resourceModel.findOne as jest.Mock).mockRejectedValue(new Error(messages.INTERNAL_SERVER_ERROR));

        const resourceId = { id: '123' };
        const result = await resourceService.getResourceById(resourceId);

        expect(result).toEqual({
            message: messages.INTERNAL_SERVER_ERROR,
            status: 500,
            success: false,
        });
        expect(resourceModel.findOne).toHaveBeenCalledWith({ _id: '123' });
    });
});

// Delete resource
describe('deleteResource', () => {
    const srcPath = path.resolve(__dirname, '../../');
    const deletedFilesPath = path.join(srcPath, 'public/deleted_resources');
    const oldFilesPath = path.join(srcPath, 'public/resources');
    console.log('deletedFilesPath', deletedFilesPath, oldFilesPath);

    const mockResource = {
        _id: '123',
        fileName: 'fileName_1715765378375.png',
        isDeleted: false,
        updatedBy: 'someUserId',
    };
    const resourceData = {
        params: { id: '123' },
        user: { _id: 'someUserId', userType: 'SA' },
    };

    beforeEach(() => {
        (resourceModel.findOneAndUpdate as jest.Mock).mockResolvedValue(mockResource);
        (fs.existsSync as jest.Mock).mockReturnValue(false);
        (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
        (fs.rename as unknown as jest.Mock).mockImplementation((oldPath, newPath, callback) => callback(null));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should delete the resource and move the file successfully', async () => {
        const result = await resourceService.deleteResource(resourceData);

        expect(resourceModel.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: '123' },
            { $set: { isDeleted: true }, updatedBy: 'someUserId' },
            { new: true },
        );
        expect(fs.existsSync).toHaveBeenCalledWith(deletedFilesPath);
        expect(fs.mkdirSync).toHaveBeenCalledWith(deletedFilesPath);
        expect(fs.rename).toHaveBeenCalledWith(
            path.join(oldFilesPath, mockResource.fileName),
            path.join(deletedFilesPath, mockResource.fileName),
            expect.any(Function),
        );

        expect(result).toEqual({
            message: messages.RESOURCE_DELETE_SUCCESS,
            status: 200,
        });
    });

    // it('should return resource not found message if resource is already deleted', async () => {
    //     (resourceModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

    //     const result = await resourceService.deleteResource(resourceData);
    //     console.log('result00', result, resourceData);

    //     expect(result).toEqual({
    //         message: messages.RESOURCE_NOT_FOUND,
    //         status: 404,
    //     });
    // });

    it('should handle errors with 500', async () => {
        (resourceModel.findOneAndUpdate as jest.Mock).mockRejectedValue(new Error('Error message'));

        const result = await resourceService.deleteResource(resourceData);

        expect(result).toEqual({
            success: false,
            status: 500,
            message: 'Error message',
        });
    });
});

// Change status of resource
describe('activeAndDeActiveResource', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    it('should return success message and status 200 when status is 1 (active)', async () => {
        const mockResourceData = {
            params: { id: 'resourceId' },
            query: { status: '1' },
            user: { _id: 'userId', userType: 'SA' },
        };

        const mockUpdatedResource = { _id: 'resourceId', isActive: true, updatedBy: 'userId' };

        // Mock the resourceModel.findOneAndUpdate function
        (resourceModel.findOneAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedResource);

        const result = await resourceService.activeAndDeActiveResource(mockResourceData);

        expect(result).toEqual({
            message: messages.CHANGE_RESOURCE_STATUS,
            status: 200,
        });
    });

    it('should return success message and status 200 when status is 0 (inactive)', async () => {
        const mockResourceData = {
            params: { id: 'resourceId' },
            query: { status: '0' },
            user: { _id: 'userId', userType: 'SA' },
        };

        const mockUpdatedResource = { _id: 'resourceId', isActive: false, updatedBy: 'userId' };

        // Mock the resourceModel.findOneAndUpdate function
        (resourceModel.findOneAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedResource);

        const result = await resourceService.activeAndDeActiveResource(mockResourceData);

        expect(result).toEqual({
            message: messages.CHANGE_RESOURCE_STATUS,
            status: 200,
        });
    });

    it('should return error message and status 500 when user is not authorized', async () => {
        const mockResourceData = {
            params: { id: 'resourceId' },
            query: { status: '1' },
            user: { _id: 'userId', userType: 'PC' }, // User is not SA
        };

        const result = await resourceService.activeAndDeActiveResource(mockResourceData);
        console.log('result00000000', result);

        expect(result).toEqual({
            success: false,
            status: 500,
            message: 'User is not authorized', // Ensure error message is returned
        });
    });
});
