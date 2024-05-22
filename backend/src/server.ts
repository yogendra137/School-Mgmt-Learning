import express from 'express';
import cors from 'cors';
import http from 'http';
import { connect } from 'mongoose';
import dotenv from 'dotenv';
import router from './route';
import path from 'path';
import log from './utils/logger';
import errorHandler from './middleware/errorHandler';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();

const url: string | undefined = process.env.DB_URL || '';

// app.use(
//     cookieSession({
//         name: 'session',
//         keys: [
//             /* secret keys */
//         ],

//         // Cookie Options
//         maxAge: 24 * 60 * 60 * 1000, // 24 hours
//     }),
// );
// app.use(cookieParser());
app.use(
    cors({
        origin: 'http://localhost:3000', // your frontend domain
        credentials: true,
    }),
);
app.use(cookieParser());
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
});
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
