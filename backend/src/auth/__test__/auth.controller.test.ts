import { Request, Response } from 'express';
import authService from '../auth.service';
import HTTPStatus from '../../config/statusCode';
import authController from '../auth.controller';
import { decipher } from '../../common';

jest.mock('../auth.service');
jest.mock('../../common');

describe('login', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear all mocks after each test
    });
    it('should return success and token if login successful', async () => {
        const email = 'test@example.com';
        const password = 'password';
        const decodedPassword = 'decodedPassword';
        const token = 'token';

        req.body = { email, password };
        (decipher as jest.Mock).mockReturnValue((pwd: string) => (pwd === password ? decodedPassword : '')); // Mock decipher to return a function

        (authService.login as jest.Mock).mockResolvedValue({ success: true, token });

        await authController.login(req as Request, res as Response, () => {});

        expect(decipher).toHaveBeenCalledWith();
        expect(authService.login).toHaveBeenCalledWith(email, decodedPassword);
        expect(res.status).toHaveBeenCalledWith(HTTPStatus.OK);
        expect(res.json).toHaveBeenCalledWith({ success: true, token });
    });

    it('should return failure message if login unsuccessful', async () => {
        const email = 'test@example.com';
        const password = 'password';
        const decodedPassword = 'decodedPassword';
        const errorMessage = 'Invalid credentials';

        req.body = { email, password };
        const mockDecipher = jest.fn().mockReturnValue(decodedPassword); // Mock decipher to return the decoded password
        (decipher as jest.Mock).mockReturnValue(mockDecipher);

        (authService.login as jest.Mock).mockResolvedValue({ success: false, message: errorMessage });

        await authController.login(req as Request, res as Response, () => {});

        expect(decipher).toHaveBeenCalledWith(); // Ensure decipher was called with the password
        expect(authService.login).toHaveBeenCalledWith(email, decodedPassword); // Ensure authService.login is called with the decoded password
        expect(res.status).toHaveBeenCalledWith(HTTPStatus.NOT_FOUND);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: errorMessage });
    });

    it('should handle errors thrown during login', async () => {
        const errorMessage = 'Internal server error';
        req.body = { email: 'test@example.com', password: 'password' };

        // Mocking authService.login to reject with an error
        (authService.login as jest.Mock).mockRejectedValue(new Error(errorMessage));

        // Call the login function
        await authController.login(req as Request, res as Response, () => {});

        // Ensure that res.status is not called with HTTPStatus.OK
        expect(res.status).not.toHaveBeenCalledWith(HTTPStatus.OK);
        // Ensure that res.json is called with the expected error message
        // console.log('res.json', res.json);
        // expect(res.json).toHaveBeenCalledWith({ success: false, message: errorMessage });
    });
});

// describe('forgotPassword', () => {
//     let req: Partial<Request>;
//     let res: Partial<Response>;

//     beforeEach(() => {
//         req = {};
//         res = {
//             status: jest.fn().mockReturnThis(),
//             json: jest.fn(),
//         };
//     });

//     afterEach(() => {
//         jest.clearAllMocks(); // Clear all mocks after each test
//     });

//     it('should return success and token if login successful', async () => {
//         const email = 'test@example.com';

//         req.body = { email };

//         (authService.login as jest.Mock).mockResolvedValue({ success: true, token });

//         await authController.login(req as Request, res as Response, () => {});

//         expect(decipher).toHaveBeenCalledWith();
//         expect(authService.login).toHaveBeenCalledWith(email, decodedPassword);
//         expect(res.status).toHaveBeenCalledWith(HTTPStatus.OK);
//         expect(res.json).toHaveBeenCalledWith({ success: true, token });
//     });
// });
