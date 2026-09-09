const mongoose = require('mongoose');
function health(req, res) { const states = ['disconnected', 'connected', 'connecting', 'disconnecting']; return res.json({ success: true, data: { service: 'primestar-backend', status: 'ok', database: states[mongoose.connection.readyState] || 'unknown', timestamp: new Date().toISOString() } }); }
module.exports = { health };
