import { Request, Response } from 'express';
import testService from './test.service';

const addTestType = async (req: Request, res: Response) => {
    try {
        const response: any = await testService.addTestType(req);
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
        const response: any = await testService.testList();
        if (response) {
            const { message, status, list } = response;
            res.status(200).json({ message, status, list });
        }
    } catch (error: any) {
        console.log('Error--', error);
        res.status(401).json({ error: error.message });
    }
};
export default { addTestType, testList };
