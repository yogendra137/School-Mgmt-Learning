import express from 'express';
import userRoute from './user/user.route';
import schoolRoute from './school/school.route';
import testRoute from './test/test.route';
import authRoute from './auth/auth.route';
import { version } from '../../backend/package.json';

const router = express.Router();

router.use(`/api/${version}/user`, userRoute);
router.use(`/api/${version}/school`, schoolRoute);
router.use(`/api/${version}/test`, testRoute);
router.use(`/api/${version}/auth`, authRoute);

export default router;
