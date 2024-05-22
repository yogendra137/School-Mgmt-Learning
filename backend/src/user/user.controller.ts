import { NextFunction, Request, Response } from 'express';
import userService from './user.service';
import HTTPStatus from '../config/statusCode';
/**
 * This controller for add user
 * @param req
 * @param res
 */

const addUser = async (req: Request, res: Response) => {
    try {
        const response: any = await userService.addUser(req);
        if (response) {
            const { message, status, token } = response;
            res.status(status).json({ message, status, token });
        }
    } catch (error: any) {
        res.status(401).json({ error: error.message });
    }
};
/**
 * This controller is for delete user
 * @param req
 * @param res
 * @param next
 * @returns
 */
const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await userService.deleteUser(req);
        console.log('result', result);
        if (result) {
            const { message, status } = result;
            res.status(200).json({ message, status });
        }
    } catch (error) {
        next(error);
    }
};
/**
 * This controller for change the status of user
 * @param req
 * @param res
 * @param next
 * @returns
 */
const changeUserStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            params: { id },
            query: { status },
        } = req;
        const { user }: any = req;
        let booleanStatus;
        if (status === '0') {
            booleanStatus = false;
        } else if (status === '1') {
            booleanStatus = true;
        } else {
            throw new Error("Invalid status value. Expected '0' or '1'.");
        }
        const result = await userService.changeUserStatus(id, booleanStatus, user);
        if (result?.success) return res.status(HTTPStatus.OK).json({ ...result });
        res.status(HTTPStatus.NOT_FOUND).json({ ...result });
    } catch (error) {
        next(error);
    }
};

export default { addUser, changeUserStatus, deleteUser };
