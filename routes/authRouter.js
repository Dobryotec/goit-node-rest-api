import express from 'express';

import authControllers from '../controllers/authContorllers.js';

import validateBody from '../helpers/validateBody.js';
import {
  authSchema,
  updateSubscriptionSchema,
} from '../schemas/authSchemas.js';

import { authenticate } from '../middlewares/authenticate.js';

const authRouter = express.Router();

authRouter.post(
  '/register',
  validateBody(authSchema),
  authControllers.registerController
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

export default authRouter;
