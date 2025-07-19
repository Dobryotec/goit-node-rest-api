import bcrypt from 'bcrypt';
import gravatar from 'gravatar';
import { nanoid } from 'nanoid';

import { User } from '../db/User.js';
import HttpError from '../helpers/HttpError.js';
import { createToken } from '../helpers/jwt.js';
import { sendEmail } from '../helpers/sendEmail.js';

const { APP_DOMAIN } = process.env;

const createVerifyEmail = (email, verificationToken) => ({
  to: email,
  subject: 'Verify email',
  html: `<a href="${APP_DOMAIN}/api/auth/verify/${verificationToken}" target="_blank">Click verify email</a>`,
});

function findUser(query) {
  return User.findOne({
    where: query,
  });
}

async function registerUser(payload) {
  const avatarURL = gravatar.url(payload.email);
  const hashPassword = await bcrypt.hash(payload.password, 10);
  const verificationToken = nanoid();
  const newUser = await User.create({
    ...payload,
    avatarURL,
    password: hashPassword,
    verificationToken,
  });

  const verifyEmail = createVerifyEmail(payload.email, verificationToken);

  await sendEmail(verifyEmail);
  return newUser;
}

async function verifyUser(verificationToken) {
  const user = await findUser({ verificationToken });
  if (!user) {
    throw HttpError(404, 'User not found');
  }
  await user.update({ verificationToken: null, verify: true });
}

async function resendVerifyEmail(email) {
  const user = await findUser({ email });

  if (!user) {
    throw HttpError(404, 'User not found');
  }
  if (user.verify) {
    throw HttpError(400, 'Verification has already been passed');
  }

  const verifyEmail = createVerifyEmail(email, user.verificationToken);

  await sendEmail(verifyEmail);
}

async function loginUser({ email, password }) {
  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (!user) throw HttpError(401, 'Email or password is wrong');

  if (!user.verify) {
    throw HttpError(401, 'Email not verified');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) throw HttpError(401, 'Email or password is wrong');

  const payload = {
    id: user.id,
  };
  const token = createToken(payload);
  user.token = token;
  await user.save();
  return { token, subscription: user.subscription };
}

async function logoutUser(id) {
  const user = await findUser({ id });
  if (!user) throw HttpError(401, 'Not authorized');
  user.token = '';
  await user.save();
}

async function modifySubscription(id, data) {
  const user = await findUser({ id });

  if (!user) throw HttpError(401, 'Not authorized');
  await user.update({ ...user, ...data });
  return { id: user.id, email: user.email, subscription: user.subscription };
}

async function modifyUserAvatar(id, avatarURL) {
  const user = await findUser({ id });
  if (!user) throw HttpError(401, 'Not authorized');
  await user.update({ ...user, avatarURL });
  return { avatarURL };
}

export {
  registerUser,
  loginUser,
  findUser,
  logoutUser,
  modifySubscription,
  modifyUserAvatar,
  verifyUser,
  resendVerifyEmail,
};
