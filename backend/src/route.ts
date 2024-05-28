import express from 'express';
import userRoute from './user/user.route';
import schoolRoute from './school/school.route';
import testRoute from './testType/testType.route';
import authRoute from './auth/auth.route';
import resourceRoute from './resource/resource.route';
import profileRoute from './profile/profile.route';

const router = express.Router();
const version = process.env.APP_VERSION ?? '1.0.0';

router.use(`/api/${version}/user`, userRoute);
router.use(`/api/${version}/school`, schoolRoute);
router.use(`/api/${version}/test`, testRoute);
router.use(`/api/${version}/auth`, authRoute);
router.use(`/api/${version}/resource`, resourceRoute);
router.use(`/api/${version}/profile`, profileRoute);

export default router;
