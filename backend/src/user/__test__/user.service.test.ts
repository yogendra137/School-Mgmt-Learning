import userModel from '../user.model';
import accessLogsModel from '../../accessLogs/access.logs.model';
import userService from '../user.service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { decipher } from '../../common'; // Import decipher function if it’s a custom module
import { messages } from '../../common'; // Import messages

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
            status: true,
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
