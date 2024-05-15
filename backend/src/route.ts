import express from 'express';
import userRoute from './user/user.route';
import schoolRoute from './school/school.route';
import testRoute from './test/test.route';
import { version } from '../../backend/package.json';

const router = express.Router();

router.use(`/api/${version}/user`, userRoute);
router.use(`/api/${version}/school`, schoolRoute);
router.use(`/api/${version}/test`, testRoute);

export default router;
