const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const ca = fs.readFileSync(path.join(__dirname, '../certs/ca.pem')).toString();

// Parsear la URL manualmente
const dbUrl = new URL(process.env.DATABASE_URL);

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: dbUrl.hostname,
  port: dbUrl.port,
  username: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.slice(1),
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: true,
      ca,
    },
  },
  logging: false
});

module.exports = sequelize;
