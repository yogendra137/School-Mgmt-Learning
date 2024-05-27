import { Request, Response } from 'express';
import schoolService from './school.service';
/**
 * This controller use for to add schools by admin
 * @param req
 * @param res
 * @returns status and message
 */

const addSchool = async (req: Request, res: Response) => {
    try {
        const response: any = await schoolService.addSchool(req);
        if (response) {
            const { message, status } = response;
            res.status(status).json({ message, status });
        }
    } catch (error: any) {
        console.log('Error--', error);
        res.status(401).json({ error: error.message });
    }
};
/**
 * This controller is use for fetching all schools list
 * @param req
 * @param res
 */
const schoolList = async (req: Request, res: Response) => {
    try {
        const { user }: any = req;
        const response: any = await schoolService.schoolList(user);
        if (response) {
            const { message, status, list } = response;
            res.status(status).json({ message, status, list });
        }
    } catch (error: any) {
        console.log('Error--', error);
        res.status(401).json({ error: error.message });
    }
};
/**
 * This controller is use for get individual detail of school
 * @param req
 * @param res
 * @returns status , message
 */
const getSchoolById = async (req: Request, res: Response) => {
    try {
        const {
            params: { id },
        } = req;
        const { user }: any = req;
        const response: any = await schoolService.getSchoolById(id, user);
        if (response) {
            const { message, status, school } = response;
            res.status(status).json({ message, status, school });
        }
    } catch (error: any) {
        console.log('Error--', error);
        res.status(401).json({ error: error.message });
    }
};

const deleteSchool = async (req: Request, res: Response) => {
    try {
        const {
            params: { id },
        } = req;
        const { user }: any = req;
        const response: any = await schoolService.deleteSchool(id, user);
        if (response) {
            const { message, status } = response;
            res.status(status).json({ message, status });
        }
    } catch (error: any) {
        console.log('Error--', error);
        res.status(401).json({ error: error.message });
    }
};

const activeAndDeActiveSchool = async (req: Request, res: Response) => {
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
        const response: any = await schoolService.activeAndDeActiveSchool(id, user, booleanStatus);
        if (response) {
            const { message, status } = response;
            res.status(status).json({ message, status });
        }
    } catch (error: any) {
        console.log('Error--', error);
        res.status(401).json({ error: error.message });
    }
};
export default { addSchool, schoolList, getSchoolById, deleteSchool, activeAndDeActiveSchool };
