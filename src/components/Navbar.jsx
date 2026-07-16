import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'U';
}

export function Navbar({ user, activeTab, onTabChange, onLogout, onMenuToggle, mobileMenuOpen }) {
  const navigate = useNavigate();
  const avatarText = useMemo(() => initials(user?.name), [user?.name]);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  return (
    <header className="navbar">
      <button className="brand brand-button" onClick={() => navigate('/dashboard')} type="button">
        Smart Travel Tourist Guide
      </button>

      <button className="hamburger" type="button" onClick={onMenuToggle} aria-label="Toggle navigation">
        ☰
      </button>

      <nav className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
        <button className={activeTab === 'map' ? 'nav-link active' : 'nav-link'} onClick={() => onTabChange('map')}>
          Map
        </button>
        <button className={activeTab === 'history' ? 'nav-link active' : 'nav-link'} onClick={() => onTabChange('history')}>
          History
        </button>
      </nav>

      <div className="profile-menu" ref={dropdownRef}>
        <button
          className="profile-chip"
          type="button"
          onClick={() => setProfileOpen((value) => !value)}
          aria-label="Open profile menu"
          aria-expanded={profileOpen}
        >
          <span>{avatarText}</span>
        </button>
        <div className={`profile-dropdown ${profileOpen ? 'open' : ''}`}>
          <button className="dropdown-item" onClick={() => { setProfileOpen(false); navigate('/profile'); }}>Profile</button>
          <button className="dropdown-item" onClick={() => { setProfileOpen(false); navigate('/history'); }}>History</button>
          <button className="dropdown-item danger" onClick={() => { setProfileOpen(false); onLogout(); }}>Logout</button>
        </div>
      </div>
    </header>
  );
}
