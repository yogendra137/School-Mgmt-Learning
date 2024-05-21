import authService from '../auth.service';
import UserModel from '../../user/user.model'; // Adjust the import according to your file structure
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { messages } from '../../common'; // Assuming messages is an object containing your message strings
import TokenHistoryModel from '../tokenHistory.model';

jest.mock('../../user/user.model'); // Mock the UserModel
jest.mock('../tokenHistory.model'); // Mock the TokenHistoryModel
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('login function', () => {
    const email = 'test@example.com';
    const password = 'password123';
    const user = {
        _id: 'user-id',
        email,
        password: 'hashed-password',
        userType: 'user',
    };
    const ip = '13.7.13.1';
    const loginPlatform = 'plate-form';

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return USER_NOT_FOUND if the user does not exist', async () => {
        (UserModel.findOne as jest.Mock).mockResolvedValue(null);

        const result = await authService.login(email, password, ip, loginPlatform);

        expect(result).toEqual({
            success: false,
            message: messages.USER_NOT_FOUND,
        });
    });

    it('should return PASSWORD_INVALID if the password is incorrect', async () => {
        (UserModel.findOne as jest.Mock).mockResolvedValue(user);
        (bcrypt.compareSync as jest.Mock).mockReturnValue(false);

        const result = await authService.login(email, password, ip, loginPlatform);

        expect(result).toEqual({
            success: false,
            message: messages.PASSWORD_INVALID,
        });
    });

    it('should return a token if the login is successful', async () => {
        (UserModel.findOne as jest.Mock).mockResolvedValue(user);
        (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
        const token = 'jwt-token';
        (jwt.sign as jest.Mock).mockReturnValue(token);

        const result = await authService.login(email, password, ip, loginPlatform);
        console.log('result9999', result);

        expect(result).toEqual({
            success: true,
            token,
            message: messages.LOGIN_SUCCESSFULLY,
        });
    });

    it('should return an error message if an error occurs', async () => {
        const errorMessage = 'Database error';
        (UserModel.findOne as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const result = await authService.login(email, password, ip, loginPlatform);

        expect(result).toEqual({
            success: false,
            error: expect.any(Error),
            message: errorMessage,
        });
    });
});

describe('forgotPassword function', () => {
    const email = 'test@example.com';
    const user = {
        _id: 'user-id',
        email,
        userType: 'user',
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return USER_NOT_FOUND if the user does not exist', async () => {
        (UserModel.findOne as jest.Mock).mockResolvedValue(null);

        const result = await authService.forgotPassword(email);

        expect(result).toEqual({
            success: false,
            message: messages.USER_NOT_FOUND,
        });
    });

    it('should return EMAIL_SENT and a token if the user is found', async () => {
        (UserModel.findOne as jest.Mock).mockResolvedValue(user);
        const token = 'jwt-token';
        (jwt.sign as jest.Mock).mockReturnValue(token);

        const result = await authService.forgotPassword(email);

        expect(result).toEqual({
            success: true,
            message: messages.EMAIL_SENT,
            token,
        });
    });

    it('should return an error message if an error occurs', async () => {
        const errorMessage = 'Database error';
        (UserModel.findOne as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const result = await authService.forgotPassword(email);

        expect(result).toEqual({
            success: false,
            error: expect.any(Error),
            message: errorMessage,
        });
    });
});

describe('changePassword function', () => {
    const email = 'test@example.com';
    const oldPassword = 'oldPassword123';
    const newPassword = 'newPassword123';
    const user = {
        _id: 'user-id',
        email,
        password: 'hashed-old-password',
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return USER_NOT_FOUND if the user does not exist', async () => {
        (UserModel.findOne as jest.Mock).mockResolvedValue(null);

        const result = await authService.changePassword(email, oldPassword, newPassword);

        expect(result).toEqual({
            success: false,
            message: messages.USER_NOT_FOUND,
        });
    });

    it('should return PASSWORD_INVALID if the old password is incorrect', async () => {
        (UserModel.findOne as jest.Mock).mockResolvedValue(user);
        (bcrypt.compareSync as jest.Mock).mockReturnValue(false);

        const result = await authService.changePassword(email, oldPassword, newPassword);

        expect(result).toEqual({
            success: false,
            message: messages.PASSWORD_INVALID,
        });
    });

    it('should return PASSWORD_UPDATED if the password is successfully changed', async () => {
        (UserModel.findOne as jest.Mock).mockResolvedValue(user);
        (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
        const hashedNewPassword = 'hashed-new-password';
        (bcrypt.hashSync as jest.Mock).mockReturnValue(hashedNewPassword);
        (UserModel.updateOne as jest.Mock).mockResolvedValue({});

        const result = await authService.changePassword(email, oldPassword, newPassword);

        expect(result).toEqual({
            success: true,
            message: messages.PASSWORD_UPDATED,
        });
        expect(UserModel.updateOne).toHaveBeenCalledWith({ email }, { $set: { password: hashedNewPassword } });
    });

    it('should return an error message if an error occurs', async () => {
        const errorMessage = 'Database error';
        (UserModel.findOne as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const result = await authService.changePassword(email, oldPassword, newPassword);

        expect(result).toEqual({
            success: false,
            error: expect.any(Error),
            message: errorMessage,
        });
    });
});

describe('verifyForgotPasswordToken function', () => {
    const token = 'valid-token';
    const decoded = { email: 'test@example.com', userType: 'user' };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return success if the token is valid', async () => {
        (jwt.verify as jest.Mock).mockReturnValue(decoded);

        const result = await authService.verifyForgotPasswordToken(token);

        expect(result).toEqual({ success: true });
        expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_PRIVATE_KEY ?? '');
    });

    it('should return TOKEN_EXPIRED if the token is invalid or expired', async () => {
        (jwt.verify as jest.Mock).mockReturnValue(null);

        const result = await authService.verifyForgotPasswordToken(token);

        expect(result).toEqual({ success: false, message: messages.TOKEN_EXPIRED });
        expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_PRIVATE_KEY ?? '');
    });

    it('should return an error message if an error occurs during verification', async () => {
        const errorMessage = 'Invalid token';
        (jwt.verify as jest.Mock).mockImplementation(() => {
            throw new Error(errorMessage);
        });

        const result = await authService.verifyForgotPasswordToken(token);

        expect(result).toEqual({ success: false, error: expect.any(Error), message: errorMessage });
        expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_PRIVATE_KEY ?? '');
    });
});

describe('resetPassword function', () => {
    const email = 'test@example.com';
    const password = 'newPassword123';
    const user = {
        _id: 'user-id',
        email,
        password: 'hashed-old-password',
        userType: 'user',
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return USER_NOT_FOUND if the user does not exist', async () => {
        (UserModel.findOne as jest.Mock).mockResolvedValue(null);

        const result = await authService.resetPassword(email, password);

        expect(result).toEqual({
            success: false,
            message: messages.USER_NOT_FOUND,
        });
    });

    it('should return PASSWORD_UPDATED and a token if the password is successfully reset', async () => {
        (UserModel.findOne as jest.Mock).mockResolvedValue(user);
        const hashedNewPassword = 'hashed-new-password';
        (bcrypt.hashSync as jest.Mock).mockReturnValue(hashedNewPassword);
        const token = 'jwt-token';
        (jwt.sign as jest.Mock).mockReturnValue(token);
        (UserModel.updateOne as jest.Mock).mockResolvedValue({});

        const result = await authService.resetPassword(email, password);

        expect(result).toEqual({
            success: true,
            token,
            message: messages.PASSWORD_UPDATED,
        });
        expect(UserModel.updateOne).toHaveBeenCalledWith({ email }, { $set: { password: hashedNewPassword } });
    });

    it('should return an error message if an error occurs', async () => {
        const errorMessage = 'Database error';
        (UserModel.findOne as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const result = await authService.resetPassword(email, password);

        expect(result).toEqual({
            success: false,
            error: expect.any(Error),
            message: errorMessage,
        });
    });
});

describe('markTokenAsInvalid function', () => {
    const token = 'invalid-token';

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully mark the token as invalid', async () => {
        (TokenHistoryModel.create as jest.Mock).mockResolvedValue({});

        const result = await authService.markTokenAsInvalid(token);

        expect(TokenHistoryModel.create).toHaveBeenCalledWith({ token });
        // Since the function does not return anything on success, we just ensure no errors are thrown
        expect(result).toBeUndefined();
    });

    it('should return an error message if an error occurs', async () => {
        const errorMessage = 'Database error';
        (TokenHistoryModel.create as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const result = await authService.markTokenAsInvalid(token);

        expect(result).toEqual({
            success: false,
            error: expect.any(Error),
            message: errorMessage,
        });
    });
});
