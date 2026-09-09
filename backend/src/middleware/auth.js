const { verifyAccessToken } = require('../utils/auth');
const Admin = require('../models/Admin');
const Rider = require('../models/Rider');
const Customer = require('../models/Customer');
function authenticate(...allowedTypes) { return async (req, res, next) => { try { const header = req.headers.authorization || ''; if (!header.startsWith('Bearer ')) return res.status(401).json({ success: false, error: { message: 'Authentication required' } }); const payload = verifyAccessToken(header.slice(7)); if (allowedTypes.length && !allowedTypes.includes(payload.type)) return res.status(403).json({ success: false, error: { message: 'Forbidden' } }); const Model = payload.type === 'admin' ? Admin : payload.type === 'rider' ? Rider : Customer; const user = await Model.findById(payload.sub); if (!user || user.active === false || user.status === 'inactive') return res.status(401).json({ success: false, error: { message: 'Invalid session' } }); req.auth = { ...payload, user }; next(); } catch (error) { return res.status(401).json({ success: false, error: { message: 'Invalid or expired token' } }); } }; }
const requireAdmin = authenticate('admin');
module.exports = { authenticate, requireAdmin };
