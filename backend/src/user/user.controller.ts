import { Request, Response } from 'express';
import userService from './user.service';

const addUser = async (req: Request, res: Response) => {
    try {
        const data = await userService.addUser(req.body);
        // res.status(200).json()
    } catch (error) {
        console.log('Error--', error);
        // res.status(401).json({ error: error.message })
    }
};
export default { addUser };
