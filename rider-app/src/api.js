const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
let accessToken = sessionStorage.getItem('primestar-rider-token') || '';

export function setToken(token) {
  accessToken = token || '';
  if (accessToken) sessionStorage.setItem('primestar-rider-token', accessToken);
  else sessionStorage.removeItem('primestar-rider-token');
}

export function hasToken() { return Boolean(accessToken); }

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}), ...(options.headers || {}) }
  });
  const payload = await response.json().catch(() => ({}));
  if (response.status === 401) {
    setToken('');
    const error = new Error(payload.error?.message || 'Your session has expired. Please sign in again.');
    error.code = 'UNAUTHORIZED';
    throw error;
  }
  if (!response.ok) throw new Error(payload.error?.message || 'Request failed');
  return payload.data;
}

export const api = {
  login: (body) => request('/auth/rider/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/riders/me'),
  setOnline: (online) => request('/riders/online', { method: 'PATCH', body: JSON.stringify({ online }) }),
  orders: () => request('/riders/orders'),
  updateOrder: (orderId, status) => request(`/riders/orders/${encodeURIComponent(orderId)}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  float: () => request('/riders/float')
};
