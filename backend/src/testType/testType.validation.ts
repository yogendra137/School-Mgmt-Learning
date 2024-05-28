import { body } from 'express-validator';

export const addTestTypeValidation = [body('testName').notEmpty().withMessage('Test name is required')];
