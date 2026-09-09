const config = require('../config/env');
function normalizeNumber(value) { const digits = String(value).replace(/\D/g, ''); return digits.startsWith('0') ? `234${digits.slice(1)}` : digits; }
const messages = { GENERAL: 'Hi PRIMESTAR! I need some help.', GET4ME: "Hi PRIMESTAR! I have a GET4ME request. Here's what I need:", PACKAGE_DELIVERY: "Hi PRIMESTAR! I'd like help with a package delivery.", ORDER_SUPPORT: 'Hi PRIMESTAR! I need help with my order.' };
function createWhatsAppLink(message) { return `${config.whatsapp.baseUrl}/${normalizeNumber(config.whatsapp.number)}?text=${encodeURIComponent(message)}`; }
function orderPaymentMessage(order) { return `Hi PRIMESTAR! I have sent payment for Order ${order.orderId}. Total: NGN ${Number(order.grandTotal).toLocaleString('en-NG')}.`; }
module.exports = { normalizeNumber, createWhatsAppLink, orderPaymentMessage, messages };
