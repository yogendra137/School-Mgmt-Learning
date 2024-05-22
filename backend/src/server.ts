import express from 'express';
import cors from 'cors';
import http from 'http';
import { connect } from 'mongoose';
import dotenv from 'dotenv';
import router from './route';
import path from 'path';
import log from './utils/logger';
import errorHandler from './middleware/errorHandler';

dotenv.config();
const app = express();

const url: string | undefined = process.env.DB_URL || '';

app.use(cors());
app.use(express.json());

const staticPath = path.join(__dirname);
app.use(express.static(path.join(__dirname)));
app.use(express.static(staticPath));

const connectOptions = {
    connectTimeoutMS: 30000, // Set the connection timeout to 30 seconds (adjust as needed)
};

connect(url, connectOptions)
    .then(() => {
        log('Database connected successfully.');
    })
    .catch((err: any) => {
        log('Error in database connection - ', err.message);
    });

app.use('/', router);

// Global error handler middleware
app.use(errorHandler);

const server = http.createServer(app);

const port = process.env.PORT || 8000;

server.listen(port, () => {
    log(`Server is running on port ${port}!`);
});

export default app;
