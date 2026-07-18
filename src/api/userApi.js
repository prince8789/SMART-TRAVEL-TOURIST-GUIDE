const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const authHeaders = (token) => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` });
async function json(res) {
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text || 'Unexpected server response' };
  }
  return { ok: res.ok, status: res.status, ...data };
}
export const userApi = {
  visit: (token, body) => fetch(`${base}/api/user/visit`, { method: 'POST', headers: authHeaders(token), body: JSON.stringify(body) }).then(json),
  viewed: (token, body) => fetch(`${base}/api/user/viewed`, { method: 'POST', headers: authHeaders(token), body: JSON.stringify(body) }).then(json),
  history: (token) => fetch(`${base}/api/user/history`, { headers: { Authorization: `Bearer ${token}` } }).then(json),
  viewedPlaces: (token) => fetch(`${base}/api/user/viewed`, { headers: { Authorization: `Bearer ${token}` } }).then(json),
  updateHistory: (token, visitId, body) => fetch(`${base}/api/user/history/${visitId}`, { method: 'PATCH', headers: authHeaders(token), body: JSON.stringify(body) }).then(json),
  deleteHistory: (token, visitId) => fetch(`${base}/api/user/history/${visitId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }).then(json),
  lookupPlaceExtra: (query) => fetch(`${base}/api/admin/place-extra/lookup?${new URLSearchParams(query)}`).then(json)
};
