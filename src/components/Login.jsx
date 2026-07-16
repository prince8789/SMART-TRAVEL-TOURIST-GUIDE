import React, { useState } from 'react';
import { authApi } from '../api/authApi.js';

export function Login({ onLogin, onGoRegister }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [resetForm, setResetForm] = useState({ email: '', otp: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [mode, setMode] = useState('login');
  const [msg, setMsg] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    const res = await authApi.login(form);
    if (res.ok && res.token) onLogin(res);
    else setMsg(res.message || 'Login failed');
  };
  const requestReset = async (e) => {
    e.preventDefault();
    const email = resetForm.email || form.email;
    const res = await authApi.forgotPassword({ email });
    setResetForm((current) => ({ ...current, email }));
    setMsg(res.message || (res.ok ? 'Verification code sent' : 'Could not send code'));
    if (res.ok) setMode('reset');
  };
  const resetPassword = async (e) => {
    e.preventDefault();
    const res = await authApi.resetPassword(resetForm);
    setMsg(res.message || (res.ok ? 'Password updated' : 'Could not reset password'));
    if (res.ok) {
      setForm({ email: resetForm.email, password: '' });
      setMode('login');
    }
  };

  return (
    <div className="auth-card">
      {mode === 'login' && (
        <>
          <p className="eyebrow">Welcome back</p>
          <h2>Login</h2>
          <form onSubmit={submit} className="auth-form">
            <input placeholder="Email address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <div className="password-field">
              <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              <button type="button" className="icon-btn" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <button className="primary-btn auth-submit">Login</button>
          </form>
          <button className="link-btn" type="button" onClick={() => {
            setResetForm((current) => ({ ...current, email: form.email }));
            setMode('forgot');
            setMsg('');
          }}>
            Forgot password?
          </button>
        </>
      )}

      {mode === 'forgot' && (
        <>
          <p className="eyebrow">Password help</p>
          <h2>Verify your email</h2>
          <form onSubmit={requestReset} className="auth-form">
            <input placeholder="Email address" value={resetForm.email} onChange={e => setResetForm({ ...resetForm, email: e.target.value })} />
            <button className="primary-btn auth-submit">Send verification code</button>
          </form>
        </>
      )}

      {mode === 'reset' && (
        <>
          <p className="eyebrow">Create new password</p>
          <h2>Reset password</h2>
          <form onSubmit={resetPassword} className="auth-form">
            <input placeholder="Email address" value={resetForm.email} onChange={e => setResetForm({ ...resetForm, email: e.target.value })} />
            <input placeholder="Verification code" value={resetForm.otp} onChange={e => setResetForm({ ...resetForm, otp: e.target.value })} />
            <div className="password-field">
              <input type={showResetPassword ? 'text' : 'password'} placeholder="New password" value={resetForm.password} onChange={e => setResetForm({ ...resetForm, password: e.target.value })} />
              <button type="button" className="icon-btn" onClick={() => setShowResetPassword((value) => !value)} aria-label={showResetPassword ? 'Hide password' : 'Show password'}>
                {showResetPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <button className="primary-btn auth-submit">Update password</button>
          </form>
        </>
      )}

      <p className="form-message">{msg}</p>
      <div className="row">
        {mode !== 'login' && <button className="secondary-btn" onClick={() => setMode('login')}>Back to login</button>}
        <button className="secondary-btn" onClick={onGoRegister}>Register</button>
      </div>
    </div>
  );
}
