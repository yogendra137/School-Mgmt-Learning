import { message } from '../common';
import { AddResourceInterface } from './interface/resource.interface';
import resourceModel from './resource.model';

/**
 *
 * @param schoolData
 * @returns
 */
const addResource = async (schoolData: any) => {
    try {
        const {
            body: { title, description, tags, createdBy, updatedBy },
        }: AddResourceInterface = schoolData;
        // we will get SA id which add roles will add in updated BY and created by so this will get by auth middleware

        const resourceFiles: string[] = [];
        if (Array.isArray(schoolData.files)) {
            schoolData.files.forEach((element: any) => {
                resourceFiles.push(element.filename);
            });
        }
        await resourceModel.create({
            fileName: resourceFiles,
            title,
            description,
            tags,
            isActive: true,
            createdBy,
            updatedBy,
        });
        return {
            message: message.resourceAddedSuccess,
            status: true,
        };
    } catch (error) {
        console.log('error', error);
    }
};
const getResourceById = async (resourceId: any) => {
    try {
        const { id }: any = resourceId;
        const resource = await resourceModel.findOne({ _id: id });
        return {
            message: message.fetchSchool,
            status: true,
            resource,
        };
    } catch (error) {
        console.log('error ', error);
    }
};
const editResource = async (schoolData: any) => {
    try {
        const {
            body: { title, description, tags },
            params: { id },
        }: AddResourceInterface = schoolData;
        // we will get SA id which add roles will add in updated BY and created by so this will get by auth middleware
        const payload: any = {
            title,
            description,
            tags,
        };
        if (schoolData.files && schoolData.files.length) {
            const resourceFiles: string[] = [];
            if (Array.isArray(schoolData.files)) {
                schoolData.files.forEach((element: any) => {
                    resourceFiles.push(element.filename);
                });
            }
            // need to manage delete file from folder also so will do later
            payload.fileName = resourceFiles;
        }
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
            status: true,
        };
    } catch (error) {
        console.log('error', error);
    }
};
export default { addResource, editResource, getResourceById };
