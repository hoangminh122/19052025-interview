const { config } = require("dotenv");

config();
module.exports = {
   development: {
      username: process.env.DB_USER || '',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || '',
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT) || 5432,
      dialect: 'postgres',
      force: true,
      timezone: '+07:00',
      logging: console.log,
    },
    production: {
      username: process.env.DB_USER || '',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || '',
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT) || 5432,
      dialect: 'postgres',
      logging: false,
      force: true,
      timezone: '+07:00',
    },
    test: {
      username: process.env.DB_USER || '',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || '',
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT) || 5432,
      dialect: 'postgres',
      logging: false,
      force: true,
      timezone: '+07:00',
    },
 };