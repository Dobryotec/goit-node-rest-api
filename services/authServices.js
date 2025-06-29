import bcrypt from 'bcrypt';

import { User } from '../db/User.js';
import HttpError from '../helpers/HttpError.js';
import { createToken } from '../helpers/jwt.js';

function findUser(query) {
  return User.findOne({
    where: query,
  });
}

async function registerUser(payload) {
  const hashPassword = await bcrypt.hash(payload.password, 10);
  return User.create({ ...payload, password: hashPassword });
}

async function loginUser({ email, password }) {
  const user = await User.findOne({
    where: {
      email,
    },
  });
  if (!user) throw HttpError(401, 'Email or password is wrong');

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

export { registerUser, loginUser, findUser, logoutUser, modifySubscription };
