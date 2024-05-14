import { Request, Response } from 'express';
import userService from './user.service';

const addUser = async (req: Request, res: Response) => {
    try {
        const {message}= await userService.addUser(req.body)||undefined;
        res.status(200).json(data)
    } catch (error) {
        console.log('Error--', error);
        // res.status(401).json({ error: error.message })
    }
};
export default { addUser };
