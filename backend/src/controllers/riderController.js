const Order = require('../models/Order');
const FloatLedger = require('../models/FloatLedger');
const { success } = require('../utils/api');
const { nextRiderStatus } = require('../services/riderOrderService');

function riderView(rider) {
  const value = rider.toObject ? rider.toObject() : { ...rider };
  delete value.passwordHash;
  return value;
}

async function getMe(req, res) {
  return success(res, riderView(req.auth.user));
}

async function setOnline(req, res) {
  req.auth.user.online = Boolean(req.body.online);
  await req.auth.user.save();
  return success(res, { online: req.auth.user.online });
}

async function listAssignedOrders(req, res) {
  const orders = await Order.find({ rider: req.auth.sub, status: { $nin: ['Delivered', 'Cancelled', 'Expired'] } })
    .sort({ createdAt: -1 })
    .populate('customer', 'name phone email')
    .populate('vendors', 'name type logoUrl')
    .populate('items.vendor', 'name type')
    .populate('pickupStops.vendor', 'name type');
  return success(res, orders);
}

async function getFloat(req, res) {
  const entries = await FloatLedger.find({ rider: req.auth.sub }).sort({ createdAt: -1 }).limit(20).populate('order', 'orderId');
  return success(res, { balance: req.auth.user.availableFloat, entries });
}

async function updateOrderStatus(req, res) {
  const order = await Order.findOne({ orderId: req.params.orderId, rider: req.auth.sub });
  if (!order) return res.status(404).json({ success: false, error: { message: 'Assigned order not found' } });
  const status = nextRiderStatus(order.status, req.body.status);
  order.status = status;
  if (status === 'Picked Up') {
    const amount = Number(order.itemSubtotal);
    const before = Number(req.auth.user.availableFloat);
    if (before < amount) return res.status(422).json({ success: false, error: { message: 'Insufficient rider float for this order' } });
    req.auth.user.availableFloat = before - amount;
    await req.auth.user.save();
    await FloatLedger.create({ rider: req.auth.sub, order: order._id, transactionType: 'debit', amount, balanceBefore: before, balanceAfter: req.auth.user.availableFloat, description: `Purchase float for ${order.orderId}`, reference: order.orderId });
  }
  await order.save();
  return success(res, order);
}

module.exports = { getMe, setOnline, listAssignedOrders, getFloat, updateOrderStatus };
