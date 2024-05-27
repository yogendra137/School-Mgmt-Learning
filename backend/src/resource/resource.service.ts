import path from 'path';
import { messages } from '../common';
import { AddResourceInterface } from './interface/resource.interface';
import resourceModel from './resource.model';
import fs from 'fs';
import httpsStatusCode from '../config/statusCode';

/**
 * This function using for to add resources with respective files and create entries in DB
 * @param resourceData
 * @returns
 */

const addResource = async (resourceData: any) => {
    try {
        const {
            body: { title, description, tags },
            files,
            user: { _id, userType },
        }: AddResourceInterface = resourceData;
        const resourceTages = String(tags).split(',');
        const resourceEntries = [];
        if (userType === 'SA') {
            // Iterate over each file
            for (const file of files) {
                // Create a database entry for each file
                const newResource = await resourceModel.create({
                    fileName: file.filename,
                    title,
                    description,
                    tags: resourceTages,
                    isActive: true,
                    createdBy: _id,
                    updatedBy: _id,
                });
                resourceEntries.push(newResource);
            }
            return {
                message: messages.RESOURCE_ADDED_SUCCESS,
                status: httpsStatusCode.OK,
                resourceEntries, // Return the created resource entries if needed
            };
        } else {
            return {
                message: messages.NOT_PERMISSION,
                status: httpsStatusCode.FORBIDDEN,
            };
        }
    } catch (error) {
        console.log('error', error);
        return { success: false, message: (error as Error).message };
    }
};
/**
 * THis function is use for to get resource by id
 * @param resourceId
 * @returns
 */
const getResourceById = async (resourceId: any, user: any) => {
    try {
        if (!user) {
            return {
                message: messages.SOMETHING_WENT_WRONG,
                status: httpsStatusCode.INTERNAL_SERVER_ERROR,
            };
        }
        const resource = await resourceModel.findOne({ _id: resourceId, isDeleted: false });
        if (!resource) {
            return {
                message: messages.NOT_FOUND.replace('Item', 'Resource'),
                status: httpsStatusCode.NOT_FOUND,
            };
        }
        return {
            message: messages.ITEM_FETCH_SUCCESS.replace('Item', 'Resource'),
            status: httpsStatusCode.OK,
            resource,
        };
    } catch (error) {
        console.log('error ', error);
        return { success: false, status: httpsStatusCode.INTERNAL_SERVER_ERROR, message: (error as Error).message };
    }
};
/**
 * This function is user for to update resource
 * @param resourceData
 * @returns
 */
const editResource = async (resourceData: any) => {
    try {
        const {
            body: { title, description, tags, fileName },
            params: { id },
            user: { _id, userType },
        }: AddResourceInterface = resourceData;
        const resourceTages = String(tags).split(',');
        // we will get SA id which add roles will add in updated BY and created by so this will get by auth middleware
        const payload: any = {
            fileName,
            title,
            description,
            tags: resourceTages,
            createdBy: _id,
            updatedBy: _id,
        };
        console.log('resourceData', resourceData.files);
        if (resourceData.files && resourceData.files.length) {
            console.log('resourceData.files', resourceData.files[0].filename);
            // need to manage delete file from folder also so will do later
            payload.fileName = resourceData.files[0].filename;
        }
        console.log('payload....', payload);
        await resourceModel.updateOne(
            {
                _id: id,
            },
            {
                $set: payload,
            },
        );
        return {
            message: messages.ITEM_UPDATED_SUCCESS.replace('Item', 'Resource'),
            status: httpsStatusCode.OK,
        };
    } catch (error) {
        console.log('error', error);
        return { success: false, status: httpsStatusCode.INTERNAL_SERVER_ERROR, message: (error as Error).message };
    }
};
/**
 * This api is use for to soft delete the resource.
 * @param resourceData
 * @returns
 */
const deleteResource = async (resourceData: any) => {
    try {
        const {
            params: { id },
            user: { _id, userType },
        }: AddResourceInterface = resourceData;
        if (userType === 'SA') {
            const updatedResource: any = await resourceModel.findOneAndUpdate(
                { _id: id },
                { $set: { isDeleted: true }, updatedBy: _id }, // updatedBy by SA id
                { new: true },
            );

            // move file in an another folder which are deleted
            const srcPath = path.resolve(__dirname, '../');
            // Construct the upload path relative to the 'src' directory
            const deletedFilesPath = path.join(srcPath, 'public/deleted_resources');
            console.log('path....', deletedFilesPath);

            const deletedPath = path.join(deletedFilesPath);
            if (!fs.existsSync(deletedPath)) {
                fs.mkdirSync(deletedPath);
            }
            // get old path and new deleted path
            const oldFilesPath = path.join(srcPath, 'public/resources');
            const oldPath = path.join(oldFilesPath, updatedResource.fileName);
            const newPath = path.join(deletedPath, updatedResource.fileName);
            fs.rename(oldPath, newPath, (err) => {
                if (err) throw err;
                console.log(`${updatedResource.fileName} moved to ${deletedPath}`);
            });

            // if (!updatedResource) {
            //     // Resource not found or already deleted
            //     return {
            //         message: messages.RESOURCE_NOT_FOUND,
            //         status: 404,
            //     };
            // }
        }

        return {
            message: messages.ITEM_DELETED_SUCCESS.replace('Item', 'Resource'),
            status: httpsStatusCode.OK,
        };
    } catch (error) {
        console.log('error', error);
        return { success: false, status: httpsStatusCode.INTERNAL_SERVER_ERROR, message: (error as Error).message };
    }
};

/**
 * This api is user for the manage the status of resources
 * @param resourceData
 * @query status
 * @returns
 * pass 1,0 in status so according to this manage active and deActive status respectively
 */
const activeAndDeActiveResource = async (resourceId: string, status: boolean, user: any) => {
    try {
        const { _id, userType } = user;
        if (userType === 'SA') {
            if (status === true) {
                await resourceModel.findOneAndUpdate({ _id: resourceId }, { $set: { isActive: true }, updatedBy: _id });
            } else {
                await resourceModel.findOneAndUpdate(
                    { _id: resourceId },
                    { $set: { isActive: false }, updatedBy: _id },
                );
            }
            return {
                message: messages.CHANGE_STATUS_SUCCESS.replace('Item', 'Resource'),
                status: httpsStatusCode.OK,
            };
        } else {
            throw new Error('User is not authorized'); // Throw an error if user is not SA
        }
    } catch (error) {
        console.log(error, 'error');
        return { success: false, status: httpsStatusCode.INTERNAL_SERVER_ERROR, message: (error as Error).message };
    }
};

export default { addResource, editResource, getResourceById, deleteResource, activeAndDeActiveResource };
