const express = require('express');
const path = require('node:path');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const config = require('./config/env');
const { health } = require('./controllers/healthController');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const catalogRoutes = require('./routes/catalogRoutes');
const orderRoutes = require('./routes/orderRoutes');
const zoneRoutes = require('./routes/zoneRoutes');
const packageRoutes = require('./routes/packageRoutes');
const adminRoutes = require('./routes/adminRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const adminOperationsRoutes = require('./routes/adminOperationsRoutes');

function createApp() {
  const app = express();
  app.set('trust proxy', 1);
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: config.corsOrigins.length ? config.corsOrigins : true }));
  app.use(express.json({ limit: '1mb' }));
  app.use('/assets', (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  }, express.static(path.resolve(__dirname, '../../assets')));
  app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 50, standardHeaders: true, legacyHeaders: false }), authRoutes);
  app.get('/api/health', health);
  app.use('/api', catalogRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/customers', require('./routes/customerRoutes'));
  app.use('/api/riders', require('./routes/riderRoutes'));
  app.use('/api/admin', adminRoutes);
  app.use('/api/admin', adminOperationsRoutes);
  app.use('/api/zones', zoneRoutes);
  app.use('/api/settings', settingsRoutes);
  app.use('/api/delivery-fees', deliveryRoutes);
  app.use('/api/package-delivery', packageRoutes);
  app.use('/api/get4me', require('./routes/get4meRoutes'));
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
module.exports = createApp();
