const nodemailer = require('nodemailer');
const config = require('./env');

function createTransporter() {
  if (!config.smtp.host || !config.smtp.user || !config.smtp.password) return null;
  return nodemailer.createTransport({ host: config.smtp.host, port: config.smtp.port, secure: config.smtp.port === 465, auth: { user: config.smtp.user, pass: config.smtp.password } });
}

async function sendEmail({ to, subject, text, html }) {
  const transporter = createTransporter();
  if (!transporter) {
    if (config.nodeEnv === 'production') throw new Error('SMTP is not configured');
    return { skipped: true };
  }
  return transporter.sendMail({ from: config.smtp.from, to, subject, text, html });
}

module.exports = { sendEmail };
