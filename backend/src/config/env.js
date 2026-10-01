const dotenv = require('dotenv');

dotenv.config();

const requiredInProduction = ['MONGODB_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];
if (process.env.NODE_ENV === 'production') {
  const missing = requiredInProduction.filter((key) => !process.env[key]);
  if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/primestar',
  jwtSecret: process.env.JWT_SECRET || 'development-access-secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'development-refresh-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  admin: { username: process.env.ADMIN_USERNAME, password: process.env.ADMIN_PASSWORD, email: process.env.ADMIN_EMAIL },
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || process.env.SMPT_PORT || 587),
    user: process.env.SMTP_USER || process.env.SMPT_USER,
    password: process.env.SMTP_PASSWORD || process.env.SMPT_PASSWORD,
    from: process.env.SMTP_FROM || process.env.SMPT_FROM
  },
  whatsapp: { number: process.env.WHATSAPP_NUMBER || '09123031088', baseUrl: process.env.WHATSAPP_BASE_URL || 'https://wa.me' },
  corsOrigins: [process.env.CLIENT_URL, process.env.RIDER_APP_URL, process.env.ADMIN_APP_URL].filter(Boolean)
};
