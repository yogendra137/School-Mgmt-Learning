import { Request, Response } from 'express';
import resourceService from './resource.service';
/**
 * This controller use for to add resource by admin
 * @param req
 * @param res
 * @returns status and message
 */

const addResource = async (req: Request, res: Response) => {
    try {
        const response: any = await resourceService.addResource(req);
        if (response) {
            const { message, status } = response;
            res.status(200).json({ message, status });
        }
    } catch (error: any) {
        console.log('Error--', error);
        res.status(401).json({ error: error.message });
    }
};

const getResourceById = async (req: Request, res: Response) => {
    try {
        const response: any = await resourceService.getResourceById(req.params);
        if (response) {
            const { message, status, resource } = response;
            res.status(200).json({ message, status, resource });
        }
    } catch (error: any) {
        res.status(401).json({ error: error.message });
    }
};

const editResource = async (req: Request, res: Response) => {
    try {
        const response: any = await resourceService.editResource(req);
        if (response) {
            const { message, status } = response;
            res.status(200).json({ message, status });
        }
    } catch (error: any) {
        console.log('Error--', error);
        res.status(401).json({ error: error.message });
    }
};

const deleteResource = async (req: Request, res: Response) => {
    try {
        const response: any = await resourceService.deleteResource(req);
        if (response) {
            const { message, status } = response;
            res.status(200).json({ message, status });
        }
    } catch (error: any) {
        console.log('Error--', error);
        res.status(401).json({ error: error.message });
    }
};

// const getAllResources = async (req: Request, res: Response) => {
//     try {
//         const response: any = await resourceService.getAllResources();
//         if (response) {
//             const { message, status ,list} = response;
//             res.status(200).json({ message, status ,list });
//         }
//     } catch (error: any) {
//         console.log('Error--', error);
//         res.status(401).json({ error: error.message });
//     }
// };

const activeAndDeActiveResource = async (req: Request, res: Response) => {
    try {
        const response: any = await resourceService.activeAndDeActiveResource(req);
        if (response) {
            const { message, status, list } = response;
            res.status(200).json({ message, status, list });
        }
    } catch (error: any) {
        console.log('Error--', error);
        res.status(401).json({ error: error.message });
    }
};
export default { addResource, editResource, getResourceById, deleteResource, activeAndDeActiveResource };
