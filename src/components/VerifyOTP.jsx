import React, { useState } from 'react';
import { authApi } from '../api/authApi.js';

export function VerifyOTP({ email, onVerified, onBack }) {
  const [otp, setOtp] = useState('');
  const [msg, setMsg] = useState('');
  const submit = async (e) => { e.preventDefault(); const res = await authApi.verifyOtp({ email, otp }); setMsg(res.message); if (res.ok) onVerified(); };
  return (
    <div className="auth-card">
      <p className="eyebrow">Verification</p>
      <h2>Enter OTP</h2>
      <form onSubmit={submit} className="auth-form">
        <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="6-digit code" />
        <button className="primary-btn auth-submit">Verify</button>
      </form>
      <div className="row">
        <button className="secondary-btn" onClick={async () => setMsg((await authApi.resendOtp({ email })).message)}>Resend OTP</button>
        <button className="secondary-btn" onClick={onBack}>Back</button>
      </div>
      <p className="form-message">{msg}</p>
    </div>
  );
}
