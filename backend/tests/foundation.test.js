const request = require('supertest');
const app = require('../src/app');
const { calculateDeliveryFee, matchZone } = require('../src/services/deliveryService');
const { normalizeNumber, createWhatsAppLink, messages } = require('../src/services/whatsappService');
const { eligibleRiders } = require('../src/services/riderService');
const { expireUnpaidOrders } = require('../src/services/orderService');
const { hashPassword, comparePassword, signAccessToken, verifyAccessToken } = require('../src/utils/auth');
const { orderStatuses } = require('../src/models/Order');
const { nextRiderStatus } = require('../src/services/riderOrderService');

describe('Phase 1 foundation', () => {
  test('health endpoint reports a running service without requiring MongoDB', async () => { const response = await request(app).get('/api/health'); expect(response.status).toBe(200); expect(response.body.data.status).toBe('ok'); });
  test('protected admin route rejects missing authentication', async () => { const response = await request(app).get('/api/admin/me'); expect(response.status).toBe(401); });
  test('passwords hash and access tokens verify', async () => { const hash = await hashPassword('correct horse battery staple'); expect(hash).not.toContain('correct horse'); expect(await comparePassword('correct horse battery staple', hash)).toBe(true); const token = signAccessToken({ sub: 'abc', type: 'admin' }); expect(verifyAccessToken(token).type).toBe('admin'); });
  test('delivery fee prefers a matching fixed-fee zone', () => { const zones = [{ name: 'NDDC', active: true, fixedFee: 700, radiusKm: 10, center: { latitude: 4.82, longitude: 7.03 } }]; expect(matchZone({ latitude: 4.82, longitude: 7.03 }, zones).name).toBe('NDDC'); expect(calculateDeliveryFee({ destination: { latitude: 4.82, longitude: 7.03 }, zones, settings: { baseFee: 500, perKilometreRate: 100 } }).fee).toBe(700); });
  test('delivery formula supports multiple pickup points', () => { const result = calculateDeliveryFee({ destination: { latitude: 4.82, longitude: 7.03 }, pickupPoints: [{ latitude: 4.82, longitude: 7.03 }, { latitude: 4.85, longitude: 7.05 }], settings: { baseFee: 500, perKilometreRate: 100 } }); expect(result.source).toBe('formula'); expect(result.fee).toBeGreaterThan(500); });
  test('WhatsApp number and encoded message are reusable', () => { expect(normalizeNumber('09123031088')).toBe('2349123031088'); expect(createWhatsAppLink(messages.GENERAL)).toContain('https://wa.me/2349123031088?text='); });
  test('rider eligibility requires online active sufficient float', () => { expect(eligibleRiders([{ online: true, active: true, availableFloat: 1000 }, { online: true, active: false, availableFloat: 9999 }, { online: true, active: true, availableFloat: 100 }], 500)).toHaveLength(1); });
  test('expiration only selects old awaiting-payment orders once', () => { const old = new Date(Date.now() - 3 * 60 * 60 * 1000); expect(expireUnpaidOrders([{ status: 'Awaiting Payment', paymentState: 'awaiting_confirmation', createdAt: old }, { status: 'Awaiting Payment', paymentState: 'confirmed', createdAt: old }, { status: 'Cancelled', createdAt: old }])).toHaveLength(1); });
  test('order status enum contains required lifecycle states', () => { expect(orderStatuses).toEqual(expect.arrayContaining(['Placed', 'Awaiting Payment', 'Payment Confirmed', 'Rider Assigned', 'Picked Up', 'Out for Delivery', 'Delivered', 'Cancelled', 'Expired'])); });
  test('rider status transitions only allow the delivery handoff sequence', () => { expect(nextRiderStatus('Rider Assigned', 'Picked Up')).toBe('Picked Up'); expect(() => nextRiderStatus('Rider Assigned', 'Delivered')).toThrow(); expect(() => nextRiderStatus('Payment Confirmed', 'Picked Up')).toThrow(); });
});
