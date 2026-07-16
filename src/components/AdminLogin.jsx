import React, { useState } from 'react';
import { adminApi } from '../api/adminApi.js';

export function AdminLogin({ onLogin, onBack }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const submit = async (e) => { e.preventDefault(); const res = await adminApi.login(form); if (res.token) onLogin(res); };
  return (
    <div className="auth-card">
      <p className="eyebrow">Admin access</p>
      <h2>Admin login</h2>
      <form onSubmit={submit} className="auth-form">
        <input placeholder="Email address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <button className="primary-btn auth-submit">Login</button>
      </form>
      <button className="secondary-btn" onClick={onBack}>Back</button>
    </div>
  );
}
