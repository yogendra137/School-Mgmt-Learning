import { Request, Response } from 'express';
import resourceService from './resource.service';
import { AddResourceInterface } from './interface/resource.interface';
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
        const { params, user }: any = req;
        const response: any = await resourceService.getResourceById(params.id, user);
        if (response) {
            const { message, status, resource } = response;
            res.status(status).json({ message, status, resource });
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

const activeAndDeActiveResource = async (req: Request, res: Response) => {
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
        const response: any = await resourceService.activeAndDeActiveResource(id, booleanStatus, user);
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
