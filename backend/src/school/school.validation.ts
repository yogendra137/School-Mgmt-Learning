import { body } from 'express-validator';

export const addSchoolValidation = [
    body('schoolName').notEmpty().withMessage('School name is required'),
    body('contactPerson').notEmpty().withMessage('Person name is required'),
    body('contactEmail').isEmail().withMessage('Valid contact email is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('state').notEmpty().withMessage('State is required'),
    body('country').notEmpty().withMessage('Country is required'),
];
