import { Request } from 'express';

declare module 'express-serve-static-core' {
    interface Request {
        user?: {
            _id: string;
            email: string;
            role: string;
        };
    }
}
