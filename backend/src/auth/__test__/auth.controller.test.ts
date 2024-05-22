import { NextFunction, Request, Response } from 'express';
import authService from '../auth.service';
import HTTPStatus from '../../config/statusCode';
import authController from '../auth.controller';
import { decipher } from '../../common';
import app from '../../server'; // Adjust the path as needed
jest.mock('../auth.service');
jest.mock('../../common');
let server: any;
beforeAll((done) => {
    server = app.listen(done);
});

afterAll((done) => {
    server.close(done);
});

describe('login', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
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
        (decipher as jest.Mock).mockReturnValue((pwd: string) => (pwd === password ? decodedPassword : ''));

        (authService.login as jest.Mock).mockResolvedValue({ success: true, token });

        await authController.login(req as Request, res as Response, next);

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
        (decipher as jest.Mock).mockReturnValue(() => decodedPassword);

        (authService.login as jest.Mock).mockResolvedValue({ success: false, message: errorMessage });

        await authController.login(req as Request, res as Response, next);

        expect(decipher).toHaveBeenCalledWith();
        expect(authService.login).toHaveBeenCalledWith(email, decodedPassword);
        expect(res.status).toHaveBeenCalledWith(HTTPStatus.NOT_FOUND);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: errorMessage });
    });

    it('should handle errors thrown during login', async () => {
        const errorMessage = 'Internal server error';
        req.body = { email: 'test@example.com', password: 'password' };

        (authService.login as jest.Mock).mockRejectedValue(new Error(errorMessage));

        await authController.login(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(new Error(errorMessage));
    });

    it('should throw an error if login returns an error', async () => {
        const email = 'test@example.com';
        const password = 'password';
        const decodedPassword = 'decodedPassword';
        const errorMessage = 'Some error message';

        req.body = { email, password };
        (decipher as jest.Mock).mockReturnValue(() => decodedPassword);

        (authService.login as jest.Mock).mockResolvedValue({ success: false, error: true, message: errorMessage });

        await authController.login(req as Request, res as Response, next);

        expect(decipher).toHaveBeenCalledWith();
        expect(authService.login).toHaveBeenCalledWith(email, decodedPassword);
        expect(next).toHaveBeenCalledWith(new Error(errorMessage));
    });
});

describe('forgotPassword', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
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

        await authController.forgotPassword(req as Request, res as Response, next);

        expect(authService.forgotPassword).toHaveBeenCalledWith(email);
        expect(res.status).toHaveBeenCalledWith(HTTPStatus.OK);
        expect(res.json).toHaveBeenCalledWith({ success: true, token, message });
    });

    it('should return failure message if email not found', async () => {
        const email = 'test@example.com';
        const errorMessage = 'Invalid value';

        req.body = { email };

        (authService.forgotPassword as jest.Mock).mockResolvedValue({ success: false, message: errorMessage });

        await authController.forgotPassword(req as Request, res as Response, next);

        expect(authService.forgotPassword).toHaveBeenCalledWith(email);
        expect(res.status).toHaveBeenCalledWith(HTTPStatus.NOT_FOUND);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: errorMessage });
    });

    it('should handle errors thrown during the forgotPassword process', async () => {
        const errorMessage = 'Internal server error';
        req.body = { email: 'test@example.com' };

        // Mocking authService.forgotPassword to reject with an error
        (authService.forgotPassword as jest.Mock).mockRejectedValue(new Error(errorMessage));

        await authController.forgotPassword(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(new Error(errorMessage));
    });

    it('should throw an error if forgotPassword returns an error object', async () => {
        const email = 'test@example.com';
        const errorMessage = 'Some error message';

        req.body = { email };

        (authService.forgotPassword as jest.Mock).mockResolvedValue({
            success: false,
            error: true,
            message: errorMessage,
        });

        await authController.forgotPassword(req as Request, res as Response, next);

        expect(authService.forgotPassword).toHaveBeenCalledWith(email);
        expect(next).toHaveBeenCalledWith(new Error(errorMessage));
    });
});

describe('changePassword', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock;

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

        await authController.changePassword(req as Request, res as Response, next);

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

        await authController.changePassword(req as Request, res as Response, next);

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

        await authController.changePassword(req as Request, res as Response, next);

        expect(decipher).toHaveBeenCalledTimes(2); // Ensure decipher was called twice, for old and new passwords
        expect(authService.changePassword).toHaveBeenCalledWith(req.user.email, 'oldPassword', 'decodedPassword');
        expect(next).toHaveBeenCalledWith(new Error(errorMessage));
    });

    it('should throw an error if changePassword returns an error object', async () => {
        req.body.oldPassword = 'oldPassword';
        req.body.newPassword = 'newPassword';

        (decipher as jest.Mock).mockReturnValueOnce((pwd: string) => pwd); // Mock decipher to return the password itself

        const errorMessage = 'Some error message';
        (authService.changePassword as jest.Mock).mockResolvedValueOnce({
            success: false,
            error: true,
            message: errorMessage,
        });

        await authController.changePassword(req as Request, res as Response, next);

        expect(decipher).toHaveBeenCalledTimes(2); // Ensure decipher was called twice, for old and new passwords
        expect(authService.changePassword).toHaveBeenCalledWith(req.user.email, 'oldPassword', 'decodedPassword');
        expect(next).toHaveBeenCalledWith(new Error(errorMessage));
    });
});

describe('resetPassword', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear all mocks after each test
    });

    it('should return success and token if resetPassword successful', async () => {
        const email = 'test@example.com';
        const password = 'password';
        const decodedPassword = 'decodedPassword';
        const token = 'token';

        req.body = { email, password, token };
        const mockDecipher = jest.fn().mockReturnValue(decodedPassword);
        (decipher as jest.Mock).mockReturnValue(mockDecipher);

        (authService.resetPassword as jest.Mock).mockResolvedValue({ success: true, token });

        await authController.resetPassword(req as Request, res as Response, next);

        expect(decipher).toHaveBeenCalledWith();
        expect(authService.resetPassword).toHaveBeenCalledWith(email, decodedPassword);
        expect(res.status).toHaveBeenCalledWith(HTTPStatus.OK);
        expect(res.json).toHaveBeenCalledWith({ success: true, token });
    });

    it('should return failure message if resetPassword unsuccessful', async () => {
        const email = 'test@example.com';
        const password = 'password';
        const decodedPassword = 'decodedPassword';
        const errorMessage = 'Invalid credentials';

        req.body = { email, password };
        const mockDecipher = jest.fn().mockReturnValue(decodedPassword);
        (decipher as jest.Mock).mockReturnValue(mockDecipher);

        (authService.resetPassword as jest.Mock).mockResolvedValue({ success: false, message: errorMessage });

        await authController.resetPassword(req as Request, res as Response, next);

        expect(decipher).toHaveBeenCalledWith();
        expect(authService.resetPassword).toHaveBeenCalledWith(email, decodedPassword);
        expect(res.status).toHaveBeenCalledWith(HTTPStatus.NOT_FOUND);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: errorMessage });
    });

    it('should handle errors thrown during resetPassword', async () => {
        const errorMessage = 'Internal server error';
        req.body = { email: 'test@example.com', password: 'password', token: 'token' };

        (authService.resetPassword as jest.Mock).mockRejectedValue(new Error(errorMessage));

        await authController.resetPassword(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(new Error(errorMessage));
    });

    it('should throw an error if resetPassword returns an error object', async () => {
        const email = 'test@example.com';
        const password = 'password';
        const decodedPassword = 'decodedPassword';
        const token = 'token';
        const errorMessage = 'Some error message';

        req.body = { email, password, token };
        const mockDecipher = jest.fn().mockReturnValue(decodedPassword);
        (decipher as jest.Mock).mockReturnValue(mockDecipher);

        (authService.resetPassword as jest.Mock).mockResolvedValue({
            success: false,
            error: true,
            message: errorMessage,
        });

        await authController.resetPassword(req as Request, res as Response, next);

        expect(decipher).toHaveBeenCalledWith();
        expect(authService.resetPassword).toHaveBeenCalledWith(email, decodedPassword);
        expect(next).toHaveBeenCalledWith(new Error(errorMessage));
    });
});

describe('verifyForgotPasswordToken', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear all mocks after each test
    });

    it('should return success ', async () => {
        const token = 'token';

        req.query = { token };

        (authService.verifyForgotPasswordToken as jest.Mock).mockResolvedValue({ success: true });

        await authController.verifyForgotPasswordToken(req as Request, res as Response, next);

        expect(authService.verifyForgotPasswordToken).toHaveBeenCalledWith(token);
        expect(res.status).toHaveBeenCalledWith(HTTPStatus.OK);
        expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    it('should return failure for invalid token', async () => {
        const token = 'invalid_token';

        req.query = { token };

        (authService.verifyForgotPasswordToken as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Invalid token',
        });

        await authController.verifyForgotPasswordToken(req as Request, res as Response, next);

        expect(authService.verifyForgotPasswordToken).toHaveBeenCalledWith(token);
        expect(res.status).toHaveBeenCalledWith(HTTPStatus.INVALID_TOKEN);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Invalid token' });
    });

    it('should handle errors thrown during verifyForgotPasswordToken', async () => {
        const errorMessage = 'Internal server error';
        const token = 'token';

        req.query = { token };

        (authService.verifyForgotPasswordToken as jest.Mock).mockRejectedValue(new Error(errorMessage));

        await authController.verifyForgotPasswordToken(req as Request, res as Response, next);

        expect(authService.verifyForgotPasswordToken).toHaveBeenCalledWith(token);
        expect(next).toHaveBeenCalledWith(new Error(errorMessage));
    });

    it('should throw an error if verifyForgotPasswordToken returns an error object', async () => {
        const token = 'token';
        const errorMessage = 'Some error message';

        req.query = { token };

        (authService.verifyForgotPasswordToken as jest.Mock).mockResolvedValue({
            success: false,
            error: true,
            message: errorMessage,
        });

        await authController.verifyForgotPasswordToken(req as Request, res as Response, next);

        expect(authService.verifyForgotPasswordToken).toHaveBeenCalledWith(token);
        expect(next).toHaveBeenCalledWith(new Error(errorMessage));
    });
});
