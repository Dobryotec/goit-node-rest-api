import { rename } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import {
  registerUser,
  loginUser,
  modifySubscription,
  modifyUserAvatar,
} from '../services/authServices.js';
import { ctrlWrapper } from '../helpers/ctrlWrapper.js';
import { logoutUser } from '../services/authServices.js';

const avatarsDir = resolve('public', 'avatars');

const registerController = async (req, res) => {
  const { email, subscription } = await registerUser(req.body);

  res.status(201).json({
    user: {
      email,
      subscription,
    },
  });
};

const loginController = async (req, res) => {
  const { token, subscription } = await loginUser(req.body);
  res.json({
    token,
    user: { email: req.body.email, subscription },
  });
};

const getCurrentContoller = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const logoutController = async (req, res) => {
  await logoutUser(req.user.id);
  res.status(204).json();
};

const updateSubscriptionController = async (req, res) => {
  const result = await modifySubscription(req.user.id, req.body);
  res.json(result);
};

const updateUserAvatarController = async (req, res) => {
  let avatar = null;
  if (req.file) {
    const { path: oldPath, filename } = req.file;
    const newPath = join(avatarsDir, filename);
    await rename(oldPath, newPath);
    avatar = join('avatars', filename);
  }
  const result = await modifyUserAvatar(req.user.id, avatar);
  res.json(result);
};

export default {
  registerController: ctrlWrapper(registerController),
  loginController: ctrlWrapper(loginController),
  getCurrentContoller: ctrlWrapper(getCurrentContoller),
  logoutController: ctrlWrapper(logoutController),
  updateSubscriptionController: ctrlWrapper(updateSubscriptionController),
  updateUserAvatarController: ctrlWrapper(updateUserAvatarController),
};
