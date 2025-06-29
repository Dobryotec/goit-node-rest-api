import Joi from 'joi';

import { valuesList } from '../constants/users.js';

export const authSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(5),
  subscription: Joi.string().valid(...valuesList),
  token: Joi.string(),
});

export const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid(...valuesList)
    .required(),
});
