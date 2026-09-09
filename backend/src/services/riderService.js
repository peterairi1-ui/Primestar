function eligibleRiders(riders, itemSubtotal) { return riders.filter((rider) => rider.online && rider.active && Number(rider.availableFloat) >= Number(itemSubtotal)); }
function chooseRoundRobin(riders, itemSubtotal) { const eligible = eligibleRiders(riders, itemSubtotal).sort((a, b) => new Date(a.lastAssignedAt || 0) - new Date(b.lastAssignedAt || 0)); return eligible[0] || null; }
module.exports = { eligibleRiders, chooseRoundRobin };
