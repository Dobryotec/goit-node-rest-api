import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
  dialect: process.env.DATABASE_DIALECT,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  dialectOptions: {
    ssl: true,
  },
});

try {
  await sequelize.authenticate();
  console.log('Database connection successful');
} catch (error) {
  console.error('Unable to connect to the database:', error);
  process.exit(1);
}
