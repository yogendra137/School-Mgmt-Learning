import request from 'supertest';
import app from '../../server';
import authController from '../auth.controller';

describe('POST /login', () => {
    it('responds with 200 if login is successful', async () => {
        const res = await request(app)
            .post('/api/1.0.0/auth/login')
            .send({ email: 'admin2@gmail.com', password: '3pxfgm0d' });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Login successful');
    });

    it('responds with 404 if login fails', async () => {
        const res = await request(app)
            .post('/api/1.0.0/auth/login')
            .send({ email: 'admin1@gmail.com', password: 'wrongpassword' });
        console.log('res.status', res);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Password is invalid');
    });

    it('responds with 422 if email is missing', async () => {
        const res = await request(app).post('/api/1.0.0/auth/login').send({ password: '3pxfgm0d' });
        expect(res.status).toBe(422);
        expect(res.body.errors.email).toBe('Email is required');
    });

    it('responds with 422 if password is missing', async () => {
        const res = await request(app).post('/api/1.0.0/auth/login').send({ email: 'admin2@gmail.com' });
        expect(res.status).toBe(422);
        expect(res.body.errors.password).toBe('Password is required');
    });

    it('responds with 422 if email is invalid', async () => {
        const res = await request(app)
            .post('/api/1.0.0/auth/login')
            .send({ email: 'invalid-email', password: '3pxfgm0d' });
        expect(res.status).toBe(422);
        expect(res.body.errors.email).toBe('Invalid email');
    });

    it('responds with 404 if user is not found', async () => {
        const res = await request(app)
            .post('/api/1.0.0/auth/login')
            .send({ email: 'nonexistent@gmail.com', password: 'password' });
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('User not found');
    });
});

// Sample test for auth.controller.ts
// describe('Auth Controller', () => {
//     it('should handle successful login', async () => {
//         const req = { body: { email: 'admin2@gmail.com', password: '3pxfgm0d' } };
//         const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
//         const next = jest.fn();
//         await authController.login(req as any, res as any, next);
//         expect(res.status).toHaveBeenCalledWith(200);
//         expect(res.json).toHaveBeenCalledWith({ message: 'Login successful' });
//     });

//     it('should handle login failure', async () => {
//         const req = { body: { email: 'admin1@gmail.com', password: 'wrongpassword' } };
//         const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
//         const next = jest.fn();
//         await authController.login(req as any, res as any, next);
//         expect(res.status).toHaveBeenCalledWith(404);
//         expect(res.json).toHaveBeenCalledWith({ message: 'Password is invalid' });
//     });

//     // Add more test cases for other scenarios
// });
