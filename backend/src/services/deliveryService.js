function validateCoordinates(latitude, longitude) { return Number.isFinite(Number(latitude)) && Number.isFinite(Number(longitude)) && Number(latitude) >= -90 && Number(latitude) <= 90 && Number(longitude) >= -180 && Number(longitude) <= 180; }
function distanceKm(a, b) { const rad = (value) => value * Math.PI / 180; const dLat = rad(b.latitude - a.latitude); const dLon = rad(b.longitude - a.longitude); const x = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLon / 2) ** 2; return 6371 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x)); }
function matchZone(destination, zones) { if (!validateCoordinates(destination.latitude, destination.longitude)) return null; return zones.find((zone) => zone.active !== false && zone.center && zone.radiusKm != null && distanceKm(destination, zone.center) <= zone.radiusKm) || null; }
function calculateDeliveryFee({ destination, zones = [], settings = {}, pickupPoints = [] }) {
  const zone = matchZone(destination, zones);
  if (zone && zone.fixedFee != null) return { fee: zone.fixedFee, source: 'zone', zone: zone.name };
  const points = pickupPoints.length ? [...pickupPoints, destination] : [destination];
  const distance = points.reduce((total, point, index) => index ? total + distanceKm(points[index - 1], point) : total, 0);
  if (settings.maxDistanceKm != null && distance > settings.maxDistanceKm) throw new Error('Delivery is outside the configured service distance');
  return { fee: Math.round(Number(settings.baseFee || 0) + distance * Number(settings.perKilometreRate || 0)), source: 'formula', distanceKm: Number(distance.toFixed(2)) };
}
module.exports = { validateCoordinates, distanceKm, matchZone, calculateDeliveryFee };
