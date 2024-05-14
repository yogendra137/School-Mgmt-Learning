import express from 'express';
import userRoute from './user/user.route';
import authRoute from './auth/auth.route';
import { version } from '../../backend/package.json';

const router = express.Router();

router.use(`/${version}/api/user`, userRoute);
router.use(`/${version}/api/auth`, authRoute);

export default router;
