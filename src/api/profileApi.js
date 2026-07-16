const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

async function json(res) {
  return { ok: res.ok, status: res.status, ...(await res.json()) };
}

export const profileApi = {
  me: (token) => fetch(`${base}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } }).then(json)
};
