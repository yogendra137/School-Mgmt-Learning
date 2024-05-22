import { ObjectId } from 'mongoose';

interface UserTokenModelInterface {
    _id?: string;
    token: string;
    userId: ObjectId;
    isUtilized: boolean;
    tokenType: string;
}

export { UserTokenModelInterface };
