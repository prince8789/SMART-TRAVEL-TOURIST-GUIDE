import React, { useState } from 'react';
import { authApi } from '../api/authApi.js';

export function Register({ onRegistered, onGoLogin }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [msg, setMsg] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    const res = await authApi.register(form);
    setMsg(res.message || 'Registered');
    if (res.ok && res.token) onRegistered(res);
  };
  return (
    <div className="auth-card">
      <p className="eyebrow">Sign up</p>
      <h2>Create your account</h2>
      <form onSubmit={submit} className="auth-form">
        <input placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Set your own password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <button className="primary-btn auth-submit">Create account</button>
      </form>
      <p className="form-message">{msg}</p>
      <div className="row">
        <button className="secondary-btn" onClick={onGoLogin}>Login</button>
      </div>
    </div>
  );
}
