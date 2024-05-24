import { Request, Response } from 'express';
import profileService from './profile.service';

const me = async (req: Request, res: Response) => {
    try {
        const { user }: any = req;
        const result = await profileService.me(user);
        if (result) {
            const { message, status, me } = result;
            res.status(typeof status === 'number' ? status : 200).json({ message, status, me });
        }
    } catch (error: any) {
        res.status(401).json({ error: error.message });
    }
};

const updateProfile = async (req: Request, res: Response) => {
    try {
        const { user, body }: any = req;
        console.log('user', user);
        const result = await profileService.updateProfile(user, body);
        if (result) {
            const { message, status } = result;
            res.status(typeof status === 'number' ? status : 200).json({ message, status });
        }
    } catch (error: any) {
        res.status(401).json({ error: error.message });
    }
};
export default { me, updateProfile };
