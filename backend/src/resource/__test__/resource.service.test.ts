import resourceService from '../resource.service';
import resourceModel from '../resource.model';
import { messages } from '../../common';

jest.mock('../resource.model');

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
            message: messages.RESOURCE_ADDED_SUCCESS,
            status: true,
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
