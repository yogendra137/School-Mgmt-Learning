const authService = {
    login: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
    verifyForgotPasswordToken: jest.fn(),
    changePassword: jest.fn(),
};

export default authService;
