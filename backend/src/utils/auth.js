const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config/env');

async function hashPassword(password) { return bcrypt.hash(password, 12); }
async function comparePassword(password, hash) { return bcrypt.compare(password, hash); }
function signAccessToken(payload) { return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn }); }
function signRefreshToken(payload) { return jwt.sign(payload, config.jwtRefreshSecret, { expiresIn: config.jwtRefreshExpiresIn }); }
function verifyAccessToken(token) { return jwt.verify(token, config.jwtSecret); }
function verifyRefreshToken(token) { return jwt.verify(token, config.jwtRefreshSecret); }
function randomToken() { return crypto.randomBytes(32).toString('hex'); }
function hashToken(token) { return crypto.createHash('sha256').update(token).digest('hex'); }
function generateOtp() { return String(crypto.randomInt(100000, 1000000)); }
module.exports = { hashPassword, comparePassword, signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken, randomToken, hashToken, generateOtp };
