import express from 'express';

import authControllers from '../controllers/authContorllers.js';

import validateBody from '../helpers/validateBody.js';
import {
  authSchema,
  authVerifySchema,
  updateSubscriptionSchema,
} from '../schemas/authSchemas.js';

import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/upload.js';

const authRouter = express.Router();

authRouter.post(
  '/register',
  validateBody(authSchema),
  authControllers.registerController
);

authRouter.get('/verify/:verificationToken', authControllers.verifyController);

authRouter.post(
  '/verify',
  validateBody(authVerifySchema),
  authControllers.resendVerifyEmailController
);

authRouter.post(
  '/login',
  validateBody(authSchema),
  authControllers.loginController
);

authRouter.get('/current', authenticate, authControllers.getCurrentContoller);

authRouter.post('/logout', authenticate, authControllers.logoutController);

authRouter.patch(
  '/subscription',
  authenticate,
  validateBody(updateSubscriptionSchema),
  authControllers.updateSubscriptionController
);

authRouter.patch(
  '/avatars',
  authenticate,
  upload.single('avatar'),
  authControllers.updateUserAvatarController
);

export default authRouter;
