const Get4MeRequest = require('../models/Get4MeRequest');
const crypto = require('crypto');
const { success } = require('../utils/api');

async function createRequest(req, res) {
  const request = await Get4MeRequest.create({
    ...req.body,
    customer: req.auth?.type === 'customer' ? req.auth.sub : undefined,
    requestId: `GET-${Date.now()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`
  });
  return success(res, request, 201);
}

module.exports = { createRequest };
