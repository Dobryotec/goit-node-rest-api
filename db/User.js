import { DataTypes } from 'sequelize';

import { sequelize } from './sequelize.js';

import { valuesList } from '../constants/users.js';

export const User = sequelize.define('user', {
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      args: true,
      msg: 'Email in use',
    },
  },
  subscription: {
    type: DataTypes.ENUM,
    values: valuesList,
    defaultValue: 'starter',
  },
  token: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  avatarURL: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.sync({ alter: true });
