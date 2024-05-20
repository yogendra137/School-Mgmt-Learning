interface TestModelInterface {
    testName: string;
    skills: string[];
    isActive: boolean;
    Description: string;
    duration: string;
    createdBy: string;
    updatedBy: string;
}

interface AddTestInterface {
    body: {
        testName: string;
        skills: string[];
        description: string;
        duration: string;
        createdBy: string;
        updatedBy: string;
    };
    user: {
        _id: string;
        userType: string;
    };
}
export { TestModelInterface, AddTestInterface };
