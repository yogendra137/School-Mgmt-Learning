import { body } from 'express-validator';
import userModel from './user.model';

export const addUserValidation = [
    body('name').notEmpty().withMessage('User name is required'),
    body('email')
        .not()
        .isEmpty()
        .withMessage('Email is required')
        .trim()
        .isEmail()
        .withMessage('Please enter valid email address')
        .trim()
        .custom(async (value) => {
            const user = await userModel.findOne({ email: value });
            if (user) {
                throw new Error('Email is already exist');
            }
        }),
    body('mobileNo').notEmpty().withMessage('Contact number is required'),
    body('userType').notEmpty().withMessage('User type is required'),
];
