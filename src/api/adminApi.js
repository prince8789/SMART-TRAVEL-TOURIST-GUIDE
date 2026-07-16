const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const headers = (token) => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` });
async function json(res) { return { ok: res.ok, status: res.status, ...(await res.json()) }; }
export const adminApi = {
  login: (body) => fetch(`${base}/api/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(json),
  list: (token) => fetch(`${base}/api/admin/place-extra`, { headers: { Authorization: `Bearer ${token}` } }).then(json),
  save: (token, body) => fetch(`${base}/api/admin/place-extra`, { method: 'POST', headers: headers(token), body: JSON.stringify(body) }).then(json),
  remove: (token, id) => fetch(`${base}/api/admin/place-extra/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }).then(json)
};
