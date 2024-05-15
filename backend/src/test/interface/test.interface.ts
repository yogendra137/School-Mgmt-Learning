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
}
export { TestModelInterface, AddTestInterface };
