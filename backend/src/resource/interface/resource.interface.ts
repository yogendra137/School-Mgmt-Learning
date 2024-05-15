interface ResourceModelInterface {
    fileName: string[];
    title: string;
    description: string;
    tags: string[];
    isActive: boolean;
    createdBy: string;
    updatedBy: string;
}
interface AddResourceInterface {
    body: {
        // fileName: string[];
        title: string;
        description: string;
        tags: string[];
        createdBy: string;
        updatedBy: string;
    };
    params: {
        id: string;
    };
}
export { ResourceModelInterface, AddResourceInterface };
