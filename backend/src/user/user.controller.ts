import { Request, Response } from 'express';
import userService from './user.service';

const addUser = async (req: Request, res: Response) => {
    try {
        const response: any = await userService.addUser(req);
        if (response) {
            const { message, status } = response
            res.status(200).json({ message, status })
        }
    } catch (error: any) {
        console.log('Error--', error);
        res.status(401).json({ error: error.message })
    }
};
export default { addUser };
