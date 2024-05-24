import { Request, Response } from 'express';
import testTypeService from './testType.service';

const addTestType = async (req: Request, res: Response) => {
    try {
        const response: any = await testTypeService.addTestType(req);
        if (response) {
            const { message, status } = response;
            res.status(200).json({ message, status });
        }
    } catch (error: any) {
        console.log('Error--', error);
        res.status(401).json({ error: error.message });
    }
};

const testList = async (req: Request, res: Response) => {
    try {
        const { user }: any = req;
        const response: any = await testTypeService.testList(user);
        if (response) {
            const { message, status, list } = response;
            res.status(200).json({ message, status, list });
        }
    } catch (error: any) {
        console.log('Error--', error);
        res.status(401).json({ error: error.message });
    }
};

const deleteTestType = async (req: Request, res: Response) => {
    try {
        const { user, params }: any = req;
        console.log('params.id', params.id);
        const response: any = await testTypeService.deleteTestType(user, params.id);
        if (response) {
            const { message, status } = response;
            res.status(200).json({ message, status });
        }
    } catch (error: any) {
        console.log('Error--', error);
        res.status(401).json({ error: error.message });
    }
};
const updateTestType = async (req: Request, res: Response) => {
    try {
        const { user, body, params }: any = req;
        console.log('user', user);
        const result = await testTypeService.updateTestType(user, body, params.id);
        if (result) {
            const { message, status } = result;
            res.status(typeof status === 'number' ? status : 200).json({ message, status });
        }
    } catch (error: any) {
        res.status(401).json({ error: error.message });
    }
};

const getTestTypeById = async (req: Request, res: Response) => {
    try {
        const { user, params }: any = req;
        console.log('user', user);
        const result = await testTypeService.getTestTypeById(user, params.id);
        if (result) {
            const { message, status, testType } = result;
            res.status(typeof status === 'number' ? status : 200).json({ message, status, testType });
        }
    } catch (error: any) {
        res.status(401).json({ error: error.message });
    }
};
export default { addTestType, testList, deleteTestType, updateTestType, getTestTypeById };
