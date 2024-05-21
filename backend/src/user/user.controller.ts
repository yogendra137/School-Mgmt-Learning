import { NextFunction, Request, Response } from 'express';
import userService from './user.service';
import HTTPStatus from '../config/statusCode';

const addUser = async (req: Request, res: Response) => {
    try {
        const response: any = await userService.addUser(req);
        if (response) {
            const { message, status, token } = response;
            res.status(200).json({ message, status, token });
        }
    } catch (error: any) {
        res.status(401).json({ error: error.message });
    }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const { id } = req.params;
        // console.log('......', req.user);
        // return 0;
        const result = await userService.deleteUser(req);
        console.log('result', result);
        if (result?.success) return res.status(HTTPStatus.OK).json({ ...result });
        res.status(HTTPStatus.NOT_FOUND).json({ ...result });
    } catch (error) {
        next(error);
    }
};

const changeUserStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, status } = req.params;
        const result = await userService.changeUserStatus(id, Boolean(status));
        if (result?.success) return res.status(HTTPStatus.OK).json({ ...result });
        res.status(HTTPStatus.NOT_FOUND).json({ ...result });
    } catch (error) {
        next(error);
    }
};

export default { addUser, changeUserStatus, deleteUser };
