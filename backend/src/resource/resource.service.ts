import { message } from '../common';
import { AddResourceInterface } from './interface/resource.interface';
import resourceModel from './resource.model';

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
        if (userType == 'SA') {
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
                message: message.resourceAddedSuccess,
                status: true,
                resourceEntries, // Return the created resource entries if needed
            };
        } else {
            return {
                message: message.notPermission,
                status: 403,
            };
        }
    } catch (error) {
        console.log('error', error);
        // Handle error appropriately
    }
};
/**
 * THis function is use for to get resource by id
 * @param resourceId
 * @returns
 */
const getResourceById = async (resourceId: any) => {
    try {
        const { id }: any = resourceId;
        const resource = await resourceModel.findOne({ _id: id });
        return {
            message: message.fetchResourceSuccess,
            status: 200,
            resource,
        };
    } catch (error) {
        console.log('error ', error);
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
        // we will get SA id which add roles will add in updated BY and created by so this will get by auth middleware
        const payload: any = {
            fileName,
            title,
            description,
            tags,
            createdBy: _id,
            updatedBy: _id,
        };
        console.log('resourceData', resourceData.files);
        if (resourceData.files && resourceData.files.length) {
            console.log('resourceData.files', resourceData.files);
            // const resourceFiles: string[] = [];
            // if (Array.isArray(resourceData.files)) {
            //     resourceData.files.forEach((element: any) => {
            //         resourceFiles.push(element.filename);
            //     });
            // }
            // need to manage delete file from folder also so will do later
            payload.fileName = resourceData.files;
        }
        console.log('payload....', payload ,payload.fileName);
        await resourceModel.updateOne(
            {
                _id: id,
            },
            {
                $set: payload,
            },
        );
        return {
            message: message.updateResourceSuccess,
            status: 200,
        };
    } catch (error) {
        console.log('error', error);
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
        }: AddResourceInterface = resourceData;
        await resourceModel.findOneAndUpdate({ _id: id }, { $set: { isDeleted: true } }, { new: true });
        // move file in an another folder which are deleted
        return {
            message: message.resourceDeleteSuccess,
            status: 200,
        };
    } catch (error) {
        console.log('error', error);
    }
};

/**
 * This api is user for the manage the status of resources
 * @param resourceData
 * @query status
 * @returns
 * pass 1,0 in status so according to this manage active and deActive status respectively
 */
const activeAndDeActiveResource = async (resourceData: any) => {
    try {
        // console.log("resourceData", resourceData)
        const {
            params: { id },
            query: { status },
        }: AddResourceInterface = resourceData;
        console.log('status', status, typeof Boolean(status), Boolean(status), typeof true);
        if (String(status) === '1') {
            console.log('vvvvvv');
            await resourceModel.findOneAndUpdate({ _id: id }, { $set: { isActive: true } });
        } else {
            console.log('else');
            await resourceModel.findOneAndUpdate({ _id: id }, { $set: { isActive: false } });
        }
        return {
            message: message.changeResourcesStatus,
            status: 200,
        };
    } catch (error) {
        console.log(error, 'error');
    }
};

export default { addResource, editResource, getResourceById, deleteResource, activeAndDeActiveResource };
