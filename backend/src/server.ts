import express from 'express';
import http from 'http';
import { connect } from 'mongoose';
import dotenv from 'dotenv';

import router from './route';
import errorHandler from './middleware/errorHandler';

dotenv.config();
const app = express();

const url: string | undefined = process.env.DB_URL || '';

app.use(express.json());

const connectOptions = {
    useNewUrlParser: true,
    connectTimeoutMS: 30000, // Set the connection timeout to 30 seconds (adjust as needed)
};

connect(url, connectOptions)
    .then(() => {
        // console.log('Database connected successfully.');
    })
    .catch((err: any) => {
        // console.log('Error in database connection - ', err.message);
    });

app.use('/', router);

// Global error handler middleware
app.use(errorHandler);

const server = http.createServer(app);

const port = process.env.PORT || 8000;

server.listen(port, () => {
    console.log(`Server is running on port ${port}!`);
});

export default app;
