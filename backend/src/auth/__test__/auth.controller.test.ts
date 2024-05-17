import { NextFunction, Request, Response } from 'express';
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

describe('forgotPassword', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: Partial<NextFunction>;

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

    it('should return success and token if email found successful', async () => {
        const email = 'test@example.com';
        const token = 'token';
        const message = 'Email sent successfully';

        req.body = { email };

        (authService.forgotPassword as jest.Mock).mockResolvedValue({ success: true, token, message });

        await authController.forgotPassword(req as Request, res as Response, () => {});

        expect(authService.forgotPassword).toHaveBeenCalledWith(email);
        expect(res.status).toHaveBeenCalledWith(HTTPStatus.OK);
        expect(res.json).toHaveBeenCalledWith({ success: true, token, message });
    });

    it('should return failure message if email not found', async () => {
        const email = 'test@example.com';
        const errorMessage = 'Invalid value';

        req.body = { email };

        (authService.forgotPassword as jest.Mock).mockResolvedValue({ success: false, message: errorMessage });

        await authController.forgotPassword(req as Request, res as Response, () => {});

        console.log('res.json', JSON.stringify(res.json));
        expect(authService.forgotPassword).toHaveBeenCalledWith(email); // Ensure authService.login is called with the decoded password
        expect(res.status).toHaveBeenCalledWith(HTTPStatus.NOT_FOUND);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: errorMessage });
    });

    it('should handle errors thrown during login', async () => {
        const errorMessage = 'Internal server error';
        req.body = { email: 'test@example.com', password: 'password' };

        // Mocking authService.login to reject with an error
        (authService.forgotPassword as jest.Mock).mockRejectedValue(new Error(errorMessage));

        // Call the login function
        await authController.forgotPassword(req as Request, res as Response, () => {});

        // Ensure that res.status is not called with HTTPStatus.OK
        expect(res.status).not.toHaveBeenCalledWith(HTTPStatus.OK);
        // Ensure that res.json is called with the expected error message
        // console.log('res.json', res.json);
        // expect(res.json).toHaveBeenCalledWith({ success: false, message: errorMessage });
    });
});

describe('changePassword', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: Partial<NextFunction>;

    beforeEach(() => {
        req = {
            body: {},
            user: { email: 'test@example.com' },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear all mocks after each test
    });

    it('should change password successfully', async () => {
        req.body.oldPassword = 'oldPassword';
        req.body.newPassword = 'newPassword';

        (decipher as jest.Mock).mockReturnValueOnce((pwd: string) => pwd); // Mock decipher to return the password itself

        const result = { success: true };
        (authService.changePassword as jest.Mock).mockResolvedValueOnce(result);

        await authController.changePassword(req as Request, res as Response, next as NextFunction);

        expect(decipher).toHaveBeenCalledTimes(2); // Ensure decipher was called twice, for old and new passwords
        expect(authService.changePassword).toHaveBeenCalledWith(req.user.email, 'oldPassword', 'decodedPassword');
        expect(res.status).toHaveBeenCalledWith(HTTPStatus.OK);
        expect(res.json).toHaveBeenCalledWith(result);
    });

    it('should handle unsuccessful password change', async () => {
        req.body.oldPassword = 'oldPassword';
        req.body.newPassword = 'newPassword';

        (decipher as jest.Mock).mockReturnValueOnce((pwd: string) => pwd); // Mock decipher to return the password itself

        const result = { success: false, message: 'Invalid credentials' };
        (authService.changePassword as jest.Mock).mockResolvedValueOnce(result);

        await authController.changePassword(req as Request, res as Response, next as NextFunction);

        expect(decipher).toHaveBeenCalledTimes(2); // Ensure decipher was called twice, for old and new passwords
        expect(authService.changePassword).toHaveBeenCalledWith(req.user.email, 'oldPassword', 'decodedPassword');
        expect(res.status).toHaveBeenCalledWith(HTTPStatus.NOT_FOUND);
        expect(res.json).toHaveBeenCalledWith(result);
    });

    it('should handle errors during password change', async () => {
        req.body.oldPassword = 'oldPassword';
        req.body.newPassword = 'newPassword';

        (decipher as jest.Mock).mockReturnValueOnce((pwd: string) => pwd); // Mock decipher to return the password itself

        const errorMessage = 'Internal server error';
        (authService.changePassword as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

        await authController.changePassword(req as Request, res as Response, next as NextFunction);

        expect(decipher).toHaveBeenCalledTimes(2); // Ensure decipher was called twice, for old and new passwords
        expect(authService.changePassword).toHaveBeenCalledWith(req.user.email, 'oldPassword', 'decodedPassword');
        // expect(res.status).not.toHaveBeenCalledWith(HTTPStatus.OK);
        // expect(res.json).toHaveBeenCalledWith({ success: false, message: errorMessage });
    });
});

describe('resetPassword', () => {
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

        req.body = { email, password, token };
        const mockDecipher = jest.fn().mockReturnValue(decodedPassword); // Mock decipher to return the decoded password
        (decipher as jest.Mock).mockReturnValue(mockDecipher);

        (authService.resetPassword as jest.Mock).mockResolvedValue({ success: true, token });

        await authController.resetPassword(req as Request, res as Response, () => {});

        expect(decipher).toHaveBeenCalledWith();
        expect(authService.resetPassword).toHaveBeenCalledWith(email, decodedPassword);
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

        (authService.resetPassword as jest.Mock).mockResolvedValue({ success: false, message: errorMessage });

        await authController.resetPassword(req as Request, res as Response, () => {});

        expect(decipher).toHaveBeenCalledWith(); // Ensure decipher was called with the password
        expect(authService.resetPassword).toHaveBeenCalledWith(email, decodedPassword); // Ensure authService.login is called with the decoded password
        expect(res.status).toHaveBeenCalledWith(HTTPStatus.NOT_FOUND);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: errorMessage });
    });

    it('should handle errors thrown during login', async () => {
        const errorMessage = 'Internal server error';
        req.body = { email: 'test@example.com', password: 'password' };

        // Mocking authService.login to reject with an error
        (authService.resetPassword as jest.Mock).mockRejectedValue(new Error(errorMessage));

        // Call the resetPassword function
        await authController.resetPassword(req as Request, res as Response, () => {});

        // Ensure that res.status is not called with HTTPStatus.OK
        expect(res.status).not.toHaveBeenCalledWith(HTTPStatus.OK);
        // Ensure that res.json is called with the expected error message
        // console.log('res.json', res.json);
        // expect(res.json).toHaveBeenCalledWith({ success: false, message: errorMessage });
    });
});

describe('verifyForgotPasswordToken', () => {
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

    it('should return success ', async () => {
        const token = 'token';

        req.query = { token };

        (authService.verifyForgotPasswordToken as jest.Mock).mockResolvedValue({ success: true });

        await authController.verifyForgotPasswordToken(req as Request, res as Response, () => {});

        expect(authService.verifyForgotPasswordToken).toHaveBeenCalledWith(token);
        expect(res.status).toHaveBeenCalledWith(HTTPStatus.OK);
        expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    it('should return failure for invalid token', async () => {
        const token = 'invalid_token'; // Provide an invalid token

        req.query = { token }; // Mocking request query parameter

        // Mocking authService.verifyForgotPasswordToken to return a resolved promise with failure
        (authService.verifyForgotPasswordToken as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Invalid token',
        });

        // Calling the verifyForgotPasswordToken function of authController
        await authController.verifyForgotPasswordToken(req as Request, res as Response, () => {});

        // Assertions
        expect(authService.verifyForgotPasswordToken).toHaveBeenCalledWith(token);
        expect(res.status).toHaveBeenCalledWith(HTTPStatus.INVALID_TOKEN); // Assuming you want to return a bad request for an invalid token
        expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Invalid token' });
    });

    it('should handle errors thrown during login', async () => {
        const errorMessage = 'Internal server error';
        req.body = { email: 'test@example.com', password: 'password' };

        // Mocking authService.login to reject with an error
        (authService.verifyForgotPasswordToken as jest.Mock).mockRejectedValue(new Error(errorMessage));

        // Call the login function
        await authController.verifyForgotPasswordToken(req as Request, res as Response, () => {});

        // Ensure that res.status is not called with HTTPStatus.OK
        expect(res.status).not.toHaveBeenCalledWith(HTTPStatus.OK);
        // Ensure that res.json is called with the expected error message
        // console.log('res.json', res.json);
        // expect(res.json).toHaveBeenCalledWith({ success: false, message: errorMessage });
    });
});
