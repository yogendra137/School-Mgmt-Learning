import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import HTTPStatus from '../config/statusCode';

interface NewRequest extends Request {
    user?: any;
}

const authenticateJWT = (req: NewRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_PRIVATE_KEY || '', (err, user) => {
            if (err) {
                return res.sendStatus(HTTPStatus.FORBIDDEN);
            }

            console.log('user', user);
            if (typeof user === 'object' && user !== null)
                req.user = { _id: user._id, email: user.email, userType: user.userType };
            next();
        });
    } else {
        res.sendStatus(HTTPStatus.UNAUTHORIZED);
    }
};

export default authenticateJWT;
