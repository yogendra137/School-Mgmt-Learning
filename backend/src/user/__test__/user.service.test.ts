import userModel from '../user.model';
import accessLogsModel from '../../accessLogs/access.logs.model';
import userService from '../user.service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { decipher } from '../../common'; // Import decipher function if it’s a custom module
import { messages } from '../../common'; // Import messages
import httpStatusCode from '../../config/statusCode';

jest.mock('../user.model');
jest.mock('../../accessLogs/access.logs.model');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../common');

describe('addUser', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should add a new user successfully', async () => {
        // Mock user data
        const userData = {
            body: {
                name: 'project coordinator1',
                email: 'project1@gmail.com',
                password: 'Project@123',
                mobileNo: '7854126589',
                userType: 'PC',
                haveSkills: [],
            },
            user: { _id: 'userId', userType: 'SA' },
            socket: { remoteAddress: '127.0.0.1' },
            headers: { 'user-agent': 'Mozilla/5.0' },
        };

        // Mock password decoding
        const decodedPassword = 'decodedPassword';
        // decipher.mockReturnValue(() => decodedPassword);
        (decipher as jest.Mock).mockReturnValue(() => decodedPassword);

        // Mock password hashing
        const hashedPassword = 'hashedPassword';
        // (bcrypt.hashSync as jest.Mock).mockReturnValue(() => hashedPassword);
        (bcrypt.hashSync as jest.Mock).mockReturnValue(hashedPassword);

        // Mock user creation
        const newUser = { _id: 'userId', email: 'user@gmail.com', userType: 'SA' };
        // userModel.create.mockResolvedValue(newUser);
        (userModel.create as jest.Mock).mockResolvedValue(newUser);

        // Mock access log creation
        (accessLogsModel.create as jest.Mock).mockResolvedValue({});

        // Mock JWT token creation
        const token = 'jwtToken';
        // jwt.sign.mockReturnValue(token);
        // (jwt.sign as jest.Mock).mockReturnValue(() => token);
        (jwt.sign as jest.Mock).mockReturnValue(token);

        // Call the addUser function
        const result = await userService.addUser(userData);
        console.log('result.......', result);

        // Verify the result
        expect(result).toEqual({
            message: messages.USER_ADDED_SUCCESS,
            status: 200,
            token,
        });

        // Verify that the user model's create method was called with the correct data
        expect(userModel.create).toHaveBeenCalledWith({
            name: 'project coordinator1',
            email: 'project1@gmail.com',
            mobileNo: '7854126589',
            password: hashedPassword,
            haveSkills: [],
            isActive: true,
            userType: 'PC',
            createdBy: 'userId',
            updatedBy: 'userId',
        });

        // Verify that the access logs model's create method was called with the correct data
        expect(accessLogsModel.create).toHaveBeenCalledWith({
            userId: newUser._id,
            loginDateAndTime: expect.any(Date),
            loginIp: '127.0.0.1',
            loginPlatform: 'Mozilla/5.0',
        });

        // Verify JWT token creation
        expect(jwt.sign).toHaveBeenCalledWith(
            { _id: newUser._id, email: newUser.email, userType: newUser.userType },
            process.env.JWT_PRIVATE_KEY || '',
        );
    });

    // Add more test cases as needed
});

describe('deleteUser', () => {
    const userId = 'user-id';
    const adminId = 'admin-id';

    const resourceData = {
        params: { id: userId },
        user: { _id: adminId },
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return USER_NOT_FOUND if the user does not exist', async () => {
        (userModel.findOne as jest.Mock).mockResolvedValue(null);

        const result = await userService.deleteUser(resourceData);

        expect(result).toEqual({
            success: false,
            message: messages.USER_NOT_FOUND,
        });
    });

    it('should return SUPER_ADMIN_NOT_DEACTIVATE if the user is a super admin', async () => {
        const user = { _id: userId, userType: 'SA' };
        (userModel.findOne as jest.Mock).mockResolvedValue(user);

        const result = await userService.deleteUser(resourceData);

        expect(result).toEqual({
            success: false,
            message: messages.YOU_CAN_NOT_DELETE_SUPER_ADMIN,
        });
    });

    it('should return USER_DELETED if the user is successfully marked as deleted', async () => {
        const user = { _id: userId, userType: 'user', isDeleted: false };
        (userModel.findOne as jest.Mock).mockResolvedValue(user);
        (userModel.updateOne as jest.Mock).mockResolvedValue({ modifiedCount: 1 });

        const result = await userService.deleteUser(resourceData);

        expect(result).toEqual({
            success: true,
            message: messages.ITEM_DELETED_SUCCESS.replace('Item', 'User'),
            status: 200,
        });

        expect(userModel.updateOne).toHaveBeenCalledWith(
            { _id: userId },
            { $set: { isDeleted: true, updatedBy: adminId } },
        );
    });

    it('should return USER_NOT_FOUND if the user is already marked as deleted', async () => {
        const user = { _id: userId, userType: 'user', isDeleted: true };
        (userModel.findOne as jest.Mock).mockResolvedValue(user);

        const result = await userService.deleteUser(resourceData);

        expect(result).toEqual({
            success: false,
            message: messages.USER_NOT_FOUND,
            status: 404,
        });
    });

    it('should return an error message if an error occurs', async () => {
        const errorMessage = 'Database error';
        (userModel.findOne as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const result = await userService.deleteUser(resourceData);

        expect(result).toEqual({
            success: false,
            message: errorMessage,
        });
    });
});

describe('changeUserStatus', () => {
    const userId = 'user-id';
    const adminId = 'admin-id';
    const userData = { _id: adminId };
    const activeStatus = true;

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return USER_NOT_FOUND if the user does not exist', async () => {
        (userModel.findOne as jest.Mock).mockResolvedValue(null);

        const result = await userService.changeUserStatus(userId, activeStatus, userData);

        expect(result).toEqual({
            success: false,
            message: messages.USER_NOT_FOUND,
        });
    });

    it('should return SUPER_ADMIN_NOT_DEACTIVATE if the user is a super admin', async () => {
        const user = { _id: userId, userType: 'SA', isDeleted: false };
        (userModel.findOne as jest.Mock).mockResolvedValue(user);

        const result = await userService.changeUserStatus(userId, activeStatus, userData);

        expect(result).toEqual({
            success: false,
            message: messages.SUPER_ADMIN_NOT_DEACTIVATE,
        });
    });

    it('should return a success message if the user status is changed successfully', async () => {
        const user = { _id: userId, userType: 'user', isDeleted: false };
        (userModel.findOne as jest.Mock).mockResolvedValue(user);
        (userModel.updateOne as jest.Mock).mockResolvedValue({ modifiedCount: 1 });

        const result = await userService.changeUserStatus(userId, activeStatus, userData);

        expect(result).toEqual({
            success: true,
            message: messages.TOGGLE_STATUS.replace('toggle', activeStatus ? 'activated' : 'deactivated'),
        });

        expect(userModel.updateOne).toHaveBeenCalledWith(
            { _id: userId },
            { $set: { isActive: activeStatus, updatedBy: adminId } },
        );
    });

    it('should return an error message if an error occurs', async () => {
        const errorMessage = 'Database error';
        (userModel.findOne as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const result = await userService.changeUserStatus(userId, activeStatus, userData);

        expect(result).toEqual({
            success: false,
            message: errorMessage,
        });
    });
});

describe('userList', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return an error message when user is not provided', async () => {
        const query = { userType: 'someType' };
        const user = null;

        const result = await userService.list(query, user);

        expect(result).toEqual({
            message: messages.SOMETHING_WENT_WRONG,
            status: httpStatusCode.INTERNAL_SERVER_ERROR,
        });
    });

    it('should return a not found message when the list is empty', async () => {
        const query = { userType: 'someType' };
        const user = { _id: 'userId' };

        (userModel.find as jest.Mock).mockResolvedValue([]);

        const result = await userService.list(query, user);

        expect(result).toEqual({
            message: messages.ITEM_NOT_FOUND.replace('Item', 'List'),
            success: false,
            status: httpStatusCode.NOT_FOUND,
        });

        expect(userModel.find).toHaveBeenCalledWith(
            { userType: 'someType', isDeleted: false },
            { location: 1, name: 1, email: 1, mobileNo: 1, schoolId: 1, isActive: 1, userType: 1 },
        );
    });

    it('should return the list of users successfully', async () => {
        const query = { userType: 'someType' };
        const user = { _id: 'userId' };
        const userList = [
            { name: 'User1', email: 'user1@example.com' },
            { name: 'User2', email: 'user2@example.com' },
        ];

        (userModel.find as jest.Mock).mockResolvedValue(userList);

        const result = await userService.list(query, user);

        expect(result).toEqual({
            message: messages.FETCH_LIST_SUCCESS.replace('Item', 'Users'),
            status: httpStatusCode.OK,
            list: userList,
        });

        expect(userModel.find).toHaveBeenCalledWith(
            { userType: 'someType', isDeleted: false },
            { location: 1, name: 1, email: 1, mobileNo: 1, schoolId: 1, isActive: 1, userType: 1 },
        );
    });

    it('should handle errors gracefully', async () => {
        const query = { userType: 'someType' };
        const user = { _id: 'userId' };
        const errorMessage = 'Internal Server Error';

        (userModel.find as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const result = await userService.list(query, user);

        expect(result).toEqual({
            success: false,
            message: errorMessage,
        });

        expect(userModel.find).toHaveBeenCalledWith(
            { userType: 'someType', isDeleted: false },
            { location: 1, name: 1, email: 1, mobileNo: 1, schoolId: 1, isActive: 1, userType: 1 },
        );
    });
});
