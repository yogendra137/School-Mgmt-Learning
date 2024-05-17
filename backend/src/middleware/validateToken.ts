import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import HTTPStatus from '../config/statusCode';
import UserModel from '../user/user.model';
import messages from '../config/messages';

interface NewRequest extends Request {
    user?: any;
}

const authenticateToken = (req: NewRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_PRIVATE_KEY || '', async (err, user) => {
            if (err) {
                return res.sendStatus(HTTPStatus.FORBIDDEN);
            }

            if (typeof user === 'object' && user !== null) {
                const result = await UserModel.findOne({ email: user.email });
                if (!result)
                    return res
                        .sendStatus(HTTPStatus.NOT_FOUND)
                        .json({ success: false, message: messages.USER_NOT_FOUND });
                req.user = { _id: user._id, email: user.email, userType: user.userType };
            }
            next();
        });
    } else {
        res.sendStatus(HTTPStatus.UNAUTHORIZED);
    }
};

export default authenticateToken;
