import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import HTTPStatus from '../config/statusCode';
import UserModel from '../user/user.model';
import { messages } from '../common';

interface NewRequest extends Request {
    user?: any;
}

const authenticateToken = async (req: NewRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.cookies.token) return res.sendStatus(HTTPStatus.UNAUTHORIZED);

        const token = req.cookies.token;
        const user = jwt.verify(token, process.env.JWT_PRIVATE_KEY ?? '');

        if (typeof user === 'object' && user !== null) {
            const result = await UserModel.findOne({ email: user.email });
            if (!result)
                return res.sendStatus(HTTPStatus.NOT_FOUND).json({ success: false, message: messages.USER_NOT_FOUND });
            req.user = { _id: user._id, email: user.email, userType: user.userType };
            next();
        }
    } catch (error) {
        return res.sendStatus(HTTPStatus.INVALID_TOKEN);
    }
};

export default authenticateToken;
