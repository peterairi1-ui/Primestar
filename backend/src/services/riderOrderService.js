const riderTransitions = {
  'Rider Assigned': 'Picked Up',
  'Picked Up': 'Out for Delivery',
  'Out for Delivery': 'Delivered'
};

function nextRiderStatus(currentStatus, requestedStatus) {
  if (riderTransitions[currentStatus] !== requestedStatus) {
    const error = new Error(`Riders can only move ${currentStatus} orders to ${riderTransitions[currentStatus] || 'a later delivery status'}`);
    error.statusCode = 422;
    throw error;
  }
  return requestedStatus;
}

module.exports = { riderTransitions, nextRiderStatus };
