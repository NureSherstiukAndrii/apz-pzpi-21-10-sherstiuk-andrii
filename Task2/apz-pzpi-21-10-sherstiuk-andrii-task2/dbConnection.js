require("dotenv").config();

const dbConfig = {
  server: process.env.SERVER_NAME,
  port: Number(process.env.PORT_DB),
  user: process.env.USERNAME_DB,
  password: process.env.USER_PASSWORD,
  database: process.env.DATABASE_NAME,
  options: {
    trustedConnection: true,
    encrypt: true,
    trustServerCertificate: true,
  }
};

module.exports = dbConfig;

