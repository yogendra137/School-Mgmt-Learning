import express from 'express';
import userRoute from './user/user.route';
import { version } from '../../backend/package.json';

const router = express.Router();

router.use(`/api/${version}/user`, userRoute);

export default router;
