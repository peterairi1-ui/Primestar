const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const { success } = require('../utils/api');
async function listVendors(req, res) { return success(res, await Vendor.find({ active: true }).sort({ displayOrder: 1, name: 1 })); }
async function listProducts(req, res) { const query = { available: true }; if (req.query.vendor) { const vendor = await Vendor.findOne({ _id: req.query.vendor, active: true }).select('_id'); if (!vendor) return success(res, []); query.vendor = vendor._id; } if (req.query.category) query.category = req.query.category; return success(res, await Product.find(query).sort({ category: 1, displayOrder: 1, name: 1 })); }
async function createVendor(req, res) { return success(res, await Vendor.create(req.body), 201); }
async function createProduct(req, res) { return success(res, await Product.create(req.body), 201); }
async function updateVendor(req, res) { return success(res, await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })); }
async function updateProduct(req, res) { return success(res, await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })); }
module.exports = { listVendors, listProducts, createVendor, createProduct, updateVendor, updateProduct };
