const config = require('./env');

async function sendEmail({ to, subject, text, html }) {
  const apiKey = process.env.EMAIL_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) {
    if (config.nodeEnv === 'production') throw new Error('Email API is not configured');
    return { skipped: true };
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, subject, text, html })
  });
  if (!response.ok) throw new Error('Email delivery failed');
  return response.json();
}

module.exports = { sendEmail };
