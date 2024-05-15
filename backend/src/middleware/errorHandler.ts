import { NextFunction, Request, Response } from 'express';
import HTTPStatus from '../config/statusCode';
import messages from '../config/messages';
interface CustomError extends Error {
    status?: number;
}

const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(err.status || HTTPStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message || messages.INTERNAL_SERVER_ERROR,
    });
};

export default errorHandler;
