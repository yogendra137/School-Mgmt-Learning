import request from 'supertest';
import app from '../../../src/server';

describe('POST /login', () => {
    it('responds with 200 if login is successful', async () => {
        const res = await request(app).post('/login').send({ username: 'user', password: 'password' });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Login successful');
    });

    it('responds with 401 if login fails', async () => {
        const res = await request(app).post('/login').send({ username: 'wronguser', password: 'wrongpassword' });
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Unauthorized');
    });
});
