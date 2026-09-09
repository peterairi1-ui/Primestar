const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');
let latestProductRequest = 0;
export function assetUrl(value) { return value?.startsWith('/') ? `${API_ORIGIN}${value}` : value; }

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, { headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error?.message || 'Something went wrong. Please try again.');
  return payload.data;
}

export const api = {
  vendors: () => request('/vendors'),
  products: (vendorId) => { const requestId = ++latestProductRequest; return request(`/products${vendorId ? `?vendor=${encodeURIComponent(vendorId)}` : ''}`).then((items) => requestId === latestProductRequest ? items : new Promise(() => {})); },
  calculateFee: (body) => request('/delivery-fees/calculate', { method: 'POST', body: JSON.stringify(body) }),
  createOrder: (body) => request('/orders/guest', { method: 'POST', body: JSON.stringify(body) }),
  submitPayment: (orderId) => request(`/orders/${orderId}/payment-submitted`, { method: 'POST' }),
  get4meRequest: (body) => request('/get4me', { method: 'POST', body: JSON.stringify(body) }),
  packageRequest: (body) => request('/package-delivery', { method: 'POST', body: JSON.stringify(body) })
};
