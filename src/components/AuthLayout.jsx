import React from 'react';

export function AuthLayout({ children, variant = 'login' }) {
  return (
    <div className={`auth-page auth-${variant}`}>
      <section className="auth-hero">
        <div className="auth-brand">Smart Travel Tourist Guide</div>
        <div className="auth-hero-copy">
          <p className="eyebrow light">Explore. Discover. Experience.</p>
          <h1>Plan every trip with confidence.</h1>
          <p>
            Find nearby attractions, save the places you love, and keep your travel notes in one calm, tidy place.
          </p>
        </div>
      </section>
      <section className="auth-panel">{children}</section>
    </div>
  );
}
