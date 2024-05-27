import schoolService from '../school.service';
import schoolModel from '../school.model'; // Import your school model
import { messages } from '../../common'; // Import your messages

jest.mock('../school.model');
// Add school test cases
describe('addSchool', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should add a new school successfully', async () => {
        // Mock school data and user data
        const schoolData = {
            body: {
                schoolName: 'Test School',
                contactPerson: 'John Doe',
                contactEmail: 'john@example.com',
                contactNumber: '1234567890',
                // schoolLogo: 'dhgsd_7468.png',
                city: 'City',
                state: 'State',
                country: 'Country',
            },
            file: { schoolLogo: 'file1.pdf' },
            user: { _id: 'userId', userType: 'SA' },
        };

        // Mock school document returned by the create method
        const newSchool = {
            _id: 'schoolId',
            schoolName: 'Test School',
        };

        // Mock the school model's create method to return the new school document
        (schoolModel.create as jest.Mock).mockResolvedValue(newSchool);

        // Call the addSchool function
        const result = await schoolService.addSchool(schoolData);

        // Verify the result
        expect(result).toEqual({
            message: messages.SCHOOL_ADDED_SUCCESS,
            status: 200,
        });

        // Verify that the school model's create method was called with the correct data
        expect(schoolModel.create).toHaveBeenCalledWith({
            schoolName: 'Test School',
            contactPerson: 'John Doe',
            contactEmail: 'john@example.com',
            contactNumber: '1234567890',
            // schoolLogo: 'dhgsd_7468.png',
            location: {
                city: 'City',
                state: 'State',
                country: 'Country',
            },
            isActive: true,
            createdBy: 'userId',
            updatedBy: 'userId',
        });
    });

    it('should return a permission denied message and status 403 for non-SA user', async () => {
        // school can be add by SA
        // Mock school data with non-SA user
        const schoolData = {
            body: {}, // Empty body for simplicity
            user: { _id: 'userId', userType: 'non-SA' },
        };

        // Call the addSchool function
        const result = await schoolService.addSchool(schoolData);

        // Verify the result
        expect(result).toEqual({
            message: messages.NOT_PERMISSION,
            status: 403,
        });

        // Ensure the school model's create method was not called
        expect(schoolModel.create).not.toHaveBeenCalled();
    });
});
// Test case for the list of test type
describe('schoolList', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    it('should return an error message when no user is provided', async () => {
        const result = await schoolService.schoolList(null);

        expect(result).toEqual({
            message: messages.SOMETHING_WENT_WRONG,
            status: false,
        });
    });

    it('should return the list of schools successfully', async () => {
        const mockSchools = [
            {
                schoolName: 'Test School',
                contactPerson: 'John Doe',
                contactEmail: 'john@example.com',
                contactNumber: '1234567890',
                location: {
                    city: 'City',
                    state: 'State',
                    country: 'Country',
                },
            },
        ];
        // Mock the find method to return the mock schools
        (schoolModel.find as jest.Mock).mockResolvedValue(mockSchools);

        // Call the service function with a mock user
        const mockUser = { _id: 'mockUserId' };
        const result = await schoolService.schoolList(mockUser);
        console.log('result-----');

        // Ensure the find method was called with the correct arguments
        expect(schoolModel.find).toHaveBeenCalledWith(
            {},
            { schoolName: 1, contactPerson: 1, contactEmail: 1, contactNumber: 1, location: 1 },
        );

        // Ensure the result matches the expected output
        expect(result).toEqual({
            message: messages.FETCH_SCHOOL_LIST_SUCCESS,
            status: 200,
            list: mockSchools,
        });
    });
    // it('should return a not found message when no schools are found', async () => {
    //     // Mock the find method to return an empty array
    //     (schoolModel.find as jest.Mock).mockResolvedValue([]);

    //     // Call the service function with a mock user
    //     const mockUser = { _id: 'mockUserId' };
    //     const result = await schoolService.schoolList(mockUser);

    //     // Ensure the find method was called with the correct arguments
    //     expect(schoolModel.find).toHaveBeenCalledWith(
    //         {},
    //         { schoolName: 1, contactPerson: 1, contactEmail: 1, contactNumber: 1, location: 1 },
    //     );

    //     // Ensure the result matches the expected output
    //     expect(result).toEqual({
    //         message: messages.NOT_FOUND.replace('Item', 'School'),
    //         status: false,
    //     });
    // });

    it('should handle errors with status 500', async () => {
        (schoolModel.find as jest.Mock).mockRejectedValue(new Error(messages.INTERNAL_SERVER_ERROR));

        // Call the service function with a mock user
        const mockUser = { _id: 'mockUserId' };
        const result = await schoolService.schoolList(mockUser);

        expect(result).toEqual({
            success: false,
            status: 500,
            message: messages.INTERNAL_SERVER_ERROR,
        });
    });
});

describe('getSchoolById', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch the individual school successfully', async () => {
        const mockSchool = {
            _id: '123',
            schoolName: 'Test School',
        };

        const mockUser = { _id: 'user123' }; // Mock user object

        // Mock the findOne method to return the mock school
        (schoolModel.findOne as jest.Mock).mockResolvedValue(mockSchool);

        const result = await schoolService.getSchoolById('123', mockUser);

        expect(result).toEqual({
            message: messages.ITEM_FETCH_SUCCESS.replace('Item', 'School'),
            status: 200,
            school: mockSchool,
        });

        // Ensure the findOne method was called with the correct arguments
        expect(schoolModel.findOne).toHaveBeenCalledWith({ _id: '123' });
    });

    it('should return a 404 status when the school is not found', async () => {
        const mockUser = { _id: 'user123' }; // Mock user object

        // Mock the findOne method to return null
        (schoolModel.findOne as jest.Mock).mockResolvedValue(null);

        const result = await schoolService.getSchoolById('nonExistingId', mockUser);

        expect(result).toEqual({
            message: messages.NOT_FOUND.replace('Item', 'School'),
            status: false,
        });

        // Ensure the findOne method was called with the correct arguments
        expect(schoolModel.findOne).toHaveBeenCalledWith({ _id: 'nonExistingId' });
    });

    it('should return an error message when no user is provided', async () => {
        const result = await schoolService.getSchoolById('123', null);

        expect(result).toEqual({
            message: messages.SOMETHING_WENT_WRONG,
            status: false,
        });
    });

    it('should handle errors and return a 500 status', async () => {
        const errorMessage = 'Database error';
        const mockUser = { _id: 'user123' }; // Mock user object

        // Mock the findOne method to throw an error
        (schoolModel.findOne as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const result = await schoolService.getSchoolById('123', mockUser);

        expect(result).toEqual({
            success: false,
            status: 500,
            message: errorMessage,
        });

        // Ensure the findOne method was called with the correct arguments
        expect(schoolModel.findOne).toHaveBeenCalledWith({ _id: '123' });
    });
});
