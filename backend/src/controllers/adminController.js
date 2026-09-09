const Admin = require('../models/Admin');
const { hashPassword } = require('../utils/auth');
const { success } = require('../utils/api');
async function seedAdmin() { if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD || !process.env.ADMIN_EMAIL) return null; const existing = await Admin.findOne({ username: process.env.ADMIN_USERNAME }); if (existing) return existing; return Admin.create({ username: process.env.ADMIN_USERNAME, email: process.env.ADMIN_EMAIL, passwordHash: await hashPassword(process.env.ADMIN_PASSWORD), role: 'super_admin' }); }
async function getMe(req, res) { return success(res, { id: req.auth.user._id, username: req.auth.user.username, role: req.auth.user.role, email: req.auth.user.email }); }
module.exports = { seedAdmin, getMe };
