import request from 'supertest';
import app from '../../server';
import { messages } from '../../common';

describe('POST /add', () => {
    it('responds with 200 if add school', async () => {
        // Send a POST request to the correct URL
        const res = await request(app).post('/api/1.0.0/school/add').send({
            // Add your request payload here
            schoolName: 'Test School',
            contactPerson: 'John Doe',
            contactEmail: 'john.doe@example.com',
            contactNumber: '8547125412',
            city: 'indore',
            state: 'm.p',
            country: 'india',
            createdBy: '',
            updatedBy: '',
        });
        console.log('res.status...................', res.status, res.body.message);
        // Check if the response status is 200
        expect(res.status).toBe(200);

        // Check if the response body contains the expected message
        expect(res.body.message).toBe(messages.SCHOOL_ADDED_SUCCESS);
    });
});
