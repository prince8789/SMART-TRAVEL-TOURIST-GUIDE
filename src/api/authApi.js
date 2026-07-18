const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
async function request(path, body) {
  const res = await fetch(`${base}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return { ok: res.ok, status: res.status, ...(await res.json()) };
}
export const authApi = {
  register: (body) => request('/api/auth/register', body),
  forgotPassword: (body) => request('/api/auth/forgot-password', body),
  resetPassword: (body) => request('/api/auth/reset-password', body),
  login: (body) => request('/api/auth/login', body)
};
