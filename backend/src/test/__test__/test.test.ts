import request from 'supertest';
import app from '../../server';
import { messages } from '../../common';

describe('POST /add', () => {
    it('responds with 200 if add test', async () => {
        try {
            // Send a POST request to the correct URL
            const res = await request(app)
                .post('/api/1.0.0/test/add')
                .send({
                    testName: 'Eye test specilist',
                    skills: ['Eye teaming', 'Eye tracking'],
                    description: 'knowledge of related this',
                    duration: '',
                    isActive: true,
                    createdBy: '',
                    updatedBy: '',
                });

            console.log('res.status..................', res.status, res.body.message);

            // Check if the response status is 200
            expect(res.status).toBe(200);

            // Check if the response body contains the expected message
            expect(res.body.message).toBe(messages.TEST_ADDED_SUCCESS);
        } catch (error) {
            // Log any errors for debugging
            console.error('Test case error:', error);
            throw error; // Rethrow the error to fail the test case
        }
    });
});

describe('GET /list', () => {
    it('responds with 200 if get test list', async () => {
        // Send a GET request to the correct URL
        const res = await request(app).get('/api/1.0.0/test/list').send();
        console.log('res.status................... test22', res.status, res.body.message);
        // Check if the response status is 200
        expect(res.status).toBe(200);

        // Check if the response body contains the expected message
        expect(res.body.message).toBe(messages.FETCH_TEST_LIST);
    });
});
