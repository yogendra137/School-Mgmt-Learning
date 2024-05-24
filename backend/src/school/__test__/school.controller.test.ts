import { Request, Response, query } from 'express';
import schoolController from '../school.controller';
import schoolService from '../school.service'; // Import your school service
import { messages } from '../../common'; // Import your messages

// jest.mock('../../school.controller'); // Mock the school service
jest.mock('../school.service');
jest.mock('../../common');

describe('addSchoolController', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        // Initialize Express Request and Response mocks
        req = {
            body: {
                schoolName: 'Test School',
                contactPerson: 'John Doe',
                contactEmail: 'john@example.com',
                contactNumber: '1234567890',
                city: 'City',
                state: 'State',
                country: 'Country',
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
            schoolName: 'Test School',
            contactPerson: 'John Doe',
            contactEmail: 'john@example.com',
            contactNumber: '1234567890',
            city: 'City',
            state: 'State',
            country: 'Country',
        };
        // Mock the response from the school service
        const mockResponse = {
            message: messages.SCHOOL_ADDED_SUCCESS,
            status: 200,
        };

        // Mock the addSchool function of the school service
        (schoolService.addSchool as jest.Mock).mockResolvedValue(mockResponse);

        // Call the controller function with the mocked Request and Response objects
        // await addSchoolController(req as Request, res as Response);
        await schoolController.addSchool({ body: mockRequestBody } as Request, res as Response);

        expect(schoolService.addSchool).toHaveBeenCalledWith({ body: mockRequestBody });
        // Ensure the status and JSON methods were called with the correct arguments
        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({ message: messages.SCHOOL_ADDED_SUCCESS, status: 200 });

        // Ensure the addSchool service function was called with the correct arguments
    });

    it('should return an error message and status 401 when an error occurs', async () => {
        // Mock the error response from the school service
        const errorMessage = 'Internal Server Error';
        const error = new Error(errorMessage);
        (schoolService.addSchool as jest.Mock).mockRejectedValue(error);

        // Call the controller function with the mocked Request and Response objects
        await schoolController.addSchool(req as Request, res as Response);

        // Ensure the status and JSON methods were called with the correct arguments
        expect(statusMock).toHaveBeenCalledWith(401);
        expect(jsonMock).toHaveBeenCalledWith({ error: errorMessage });

        // Ensure the addSchool service function was called with the correct arguments
        expect(schoolService.addSchool).toHaveBeenCalledWith(req);
    });
});

describe('schoolList Controller', () => {
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
            message: messages.FETCH_SCHOOL_LIST_SUCCESS,
            status: 200,
            list: [
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
            ],
        };

        (schoolService.schoolList as jest.Mock).mockResolvedValue(mockResponse);

        await schoolController.schoolList(req as Request, res as Response); // this will be controller

        expect(schoolService.schoolList).toHaveBeenCalled(); // Ensure the service method is called
        expect(statusMock).toHaveBeenCalledWith(200); // Ensure status method is called with 200
        expect(jsonMock).toHaveBeenCalledWith(mockResponse); // Ensure json method is called with the correct response
    });
    // this will handle catch error
    it('should return error message and status 401 on failure', async () => {
        const errorMessage = 'Internal Server Error';
        (schoolService.schoolList as jest.Mock).mockRejectedValue(new Error(errorMessage));

        await schoolController.schoolList(req as Request, res as Response); // this is the controller

        expect(schoolService.schoolList).toHaveBeenCalled(); // Ensure the service method is called
        expect(statusMock).toHaveBeenCalledWith(401); // Ensure status method is called with 401
        expect(jsonMock).toHaveBeenCalledWith({ error: errorMessage }); // Ensure json method is called with the error message
    });
});

describe('Get school by id Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        req = {
            params: { id: '123' },
            user: { _id: 'user123' },
        }; // Initialize request object with params and user
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

    it('should return the school successfully', async () => {
        const mockResponse = {
            message: messages.ITEM_FETCH_SUCCESS.replace('Item', 'School'),
            status: 200,
            school: { _id: '123', schoolName: 'Test School' },
        };

        (schoolService.getSchoolById as jest.Mock).mockResolvedValue(mockResponse);

        await schoolController.getSchoolById(req as Request, res as Response); // This will be the controller

        expect(schoolService.getSchoolById).toHaveBeenCalledWith('123', { _id: 'user123' }); // Ensure the service method is called with correct arguments
        expect(statusMock).toHaveBeenCalledWith(200); // Ensure status method is called with 200
        expect(jsonMock).toHaveBeenCalledWith(mockResponse); // Ensure json method is called with the correct response
    });

    it('should return a 404 status and not found message when the school is not found', async () => {
        const mockResponse = {
            message: messages.NOT_FOUND.replace('Item', 'School'),
            status: false,
        };

        (schoolService.getSchoolById as jest.Mock).mockResolvedValue(mockResponse);

        await schoolController.getSchoolById(req as Request, res as Response); // This is the controller

        expect(schoolService.getSchoolById).toHaveBeenCalledWith('123', { _id: 'user123' }); // Ensure the service method is called with correct arguments
        expect(statusMock).toHaveBeenCalledWith(false); // Ensure status method is called with 200
        expect(jsonMock).toHaveBeenCalledWith(mockResponse); // Ensure json method is called with the correct response
    });

    it('should return an error message and status 401 on failure', async () => {
        const errorMessage = 'Internal Server Error';
        (schoolService.getSchoolById as jest.Mock).mockRejectedValue(new Error(errorMessage));

        await schoolController.getSchoolById(req as Request, res as Response); // This is the controller

        expect(schoolService.getSchoolById).toHaveBeenCalledWith('123', { _id: 'user123' }); // Ensure the service method is called with correct arguments
        expect(statusMock).toHaveBeenCalledWith(401); // Ensure status method is called with 401
        expect(jsonMock).toHaveBeenCalledWith({ error: errorMessage }); // Ensure json method is called with the error message
    });
});

describe('Delete school by id Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        req = {
            params: { id: '123' },
            user: { _id: 'user123' },
        }; // Initialize request object with params and user
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

    it('should return success message and status 200 when delete school', async () => {
        const mockResponse = {
            message: messages.ITEM_DELETED_SUCCESS.replace('Item', 'School'),
            status: 200,
        };

        (schoolService.deleteSchool as jest.Mock).mockResolvedValue(mockResponse);

        await schoolController.deleteSchool(req as Request, res as Response);

        expect(schoolService.deleteSchool).toHaveBeenCalledWith('123', { _id: 'user123' });
        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({
            message: messages.ITEM_DELETED_SUCCESS.replace('Item', 'School'),
            status: 200,
        });
    });

    // it('should return a 404 status and not found message when the school is not found', async () => {
    //     const mockResponse = {
    //         message: messages.NOT_FOUND.replace('Item', 'School'),
    //         status: false,
    //     };

    //     (schoolService.getSchoolById as jest.Mock).mockResolvedValue(mockResponse);

    //     await schoolController.getSchoolById(req as Request, res as Response); // This is the controller

    //     expect(schoolService.getSchoolById).toHaveBeenCalledWith('123', { _id: 'user123' }); // Ensure the service method is called with correct arguments
    //     expect(statusMock).toHaveBeenCalledWith(false); // Ensure status method is called with 200
    //     expect(jsonMock).toHaveBeenCalledWith(mockResponse); // Ensure json method is called with the correct response
    // });

    // it('should return an error message and status 401 on failure', async () => {
    //     const errorMessage = 'Internal Server Error';
    //     (schoolService.getSchoolById as jest.Mock).mockRejectedValue(new Error(errorMessage));

    //     await schoolController.getSchoolById(req as Request, res as Response); // This is the controller

    //     expect(schoolService.getSchoolById).toHaveBeenCalledWith('123', { _id: 'user123' }); // Ensure the service method is called with correct arguments
    //     expect(statusMock).toHaveBeenCalledWith(401); // Ensure status method is called with 401
    //     expect(jsonMock).toHaveBeenCalledWith({ error: errorMessage }); // Ensure json method is called with the error message
    // });
});

describe('activeAndDeActiveSchool', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        // Initialize request and response objects with necessary properties
        req = {
            params: { id: 'school123' },
            query: { status: '1' },
            user: { _id: 'userId' },
        };

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

    it('should activate the school and return success message with status 200', async () => {
        // req.query.status = '1'; // Set query parameter status to activate school

        // Mock the activeAndDeActiveSchool service to succeed
        (schoolService.activeAndDeActiveSchool as jest.Mock).mockResolvedValue(req.params);

        // Call the controller function
        await schoolController.activeAndDeActiveSchool(req as Request, res as Response);

        // Verify that the response is sent with status 200 and the success message
        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({ message: 'School activated successfully', status: 200 });
    });
});
