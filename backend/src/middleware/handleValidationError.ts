import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import HTTPStatus from '../config/statusCode';
import { messages } from '../common';

const handleValidationErrors = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsArray = errors.array();
        const errorMessages: any = {};
        errorsArray.forEach((error: any) => {
            if (!errorMessages[error.path]) errorMessages[error.path] = error.msg;
        });
        return res
            .status(HTTPStatus.UNPROCESSABLE_ENTITY)
            .json({ message: messages.INVALID_REQUEST, errors: errorMessages });
    }
    next();
};

export default handleValidationErrors;
