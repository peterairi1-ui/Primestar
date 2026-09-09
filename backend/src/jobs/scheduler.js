const cron = require('node-cron');
const Order = require('../models/Order');
async function expireOrders(now = new Date()) { const cutoff = new Date(now.getTime() - 2 * 60 * 60 * 1000); const result = await Order.updateMany({ status: 'Awaiting Payment', paymentState: { $ne: 'confirmed' }, createdAt: { $lte: cutoff }, expiredAt: { $exists: false } }, { $set: { status: 'Expired', expiredAt: now } }); return result.modifiedCount; }
function startJobs() { cron.schedule('*/15 * * * *', () => expireOrders().catch((error) => console.error('Order expiration job failed:', error.message))); }
module.exports = { expireOrders, startJobs };
