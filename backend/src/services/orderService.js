const crypto = require('crypto');
function createOrderId() { return `PS-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`; }
function expireUnpaidOrders(orders, now = new Date(), ageMs = 2 * 60 * 60 * 1000) { return orders.filter((order) => order.status === 'Awaiting Payment' && order.paymentState !== 'confirmed' && now - new Date(order.createdAt) >= ageMs && !order.expiredAt); }
module.exports = { createOrderId, expireUnpaidOrders };
