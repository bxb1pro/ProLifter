module.exports = {
  username: process.env.DB_USERNAME || 'default_username',
  password: process.env.DB_PASSWORD || 'default_password',
  database: process.env.DB_NAME || 'mydatabase',
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || '5431',
  dialect: 'postgres',
};