import { body } from 'express-validator';

export const loginValidation = [
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password should be greater than 6'),
];
