const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
async function json(res) { return { ok: res.ok, status: res.status, ...(await res.json()) }; }
export const chatbotApi = {
  ask: (token, body) => fetch(`${base}/api/chatbot/ask`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) }).then(json)
};
