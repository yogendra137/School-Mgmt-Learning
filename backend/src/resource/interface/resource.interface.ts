interface ResourceModelInterface {
    fileName: string;
    title: string;
    description: string;
    tags: string[];
    isDeleted: boolean;
    isActive: boolean;
    createdBy: string;
    updatedBy: string;
}
interface AddResourceInterface {
    body: {
        fileName: string;
        title: string;
        description: string;
        tags: string[];
        createdBy: string;
        updatedBy: string;
    };
    params: {
        id: string;
    };
    files: any;
    query: { status: string };
    user: {
        _id: string;
        userType: string;
    };
}
export { ResourceModelInterface, AddResourceInterface };
