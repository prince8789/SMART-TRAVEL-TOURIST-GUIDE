import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Register } from './components/Register.jsx';
import { Login } from './components/Login.jsx';
import { MapPage } from './components/MapPage.jsx';
import { VisitHistory } from './components/VisitHistory.jsx';
import { ChatbotWidget } from './components/ChatbotWidget.jsx';
import { AdminLogin } from './components/AdminLogin.jsx';
import { AdminPanel } from './components/AdminPanel.jsx';
import { Navbar } from './components/Navbar.jsx';
import { ProfilePage } from './components/ProfilePage.jsx';
import { profileApi } from './api/profileApi.js';
import { AuthLayout } from './components/AuthLayout.jsx';

function AuthGate({ token, children }) {
  return token ? children : <Navigate to="/login" replace />;
}

function DashboardShell({ token, user, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeTab = useMemo(() => {
    if (location.pathname.startsWith('/history')) return 'history';
    if (location.pathname.startsWith('/profile')) return 'profile';
    return 'map';
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <Navbar
        user={user}
        activeTab={activeTab}
        onTabChange={(tab) => {
          navigate(tab === 'history' ? '/history' : tab === 'profile' ? '/profile' : '/dashboard');
          setMobileMenuOpen(false);
        }}
        onLogout={onLogout}
        onMenuToggle={() => setMobileMenuOpen((value) => !value)}
        mobileMenuOpen={mobileMenuOpen}
      />
      <main className="page-content" onPointerDown={(event) => {
        if (!event.target.closest('.chat-widget')) window.dispatchEvent(new Event('smarttravel:screen-interaction'));
      }}>
        {activeTab === 'history' ? (
          <VisitHistory token={token} />
        ) : activeTab === 'profile' ? (
          <ProfilePage token={token} user={user} onLogout={onLogout} />
        ) : (
          <MapPage token={token} user={user} />
        )}
      </main>
      <ChatbotWidget token={token} />
    </div>
  );
}

function LoginPage({ onLogin, goRegister }) {
  return (
    <AuthLayout variant="login">
      <Login onLogin={onLogin} onGoRegister={goRegister} />
    </AuthLayout>
  );
}

function RegisterPage({ onRegistered, goLogin }) {
  return (
    <AuthLayout variant="register">
      <Register onRegistered={onRegistered} onGoLogin={goLogin} />
    </AuthLayout>
  );
}

function AdminLoginPage({ onLogin, goRegister }) {
  return (
    <AuthLayout variant="admin">
      <AdminLogin onLogin={onLogin} onBack={goRegister} />
    </AuthLayout>
  );
}

function AdminPage({ token, onLogout }) {
  return (
    <AuthLayout variant="admin">
      <AdminPanel token={token} onLogout={onLogout} />
    </AuthLayout>
  );
}

export default function App() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('userToken') || '');
  const [user, setUser] = useState(null);
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || '');

  useEffect(() => {
    if (!token) return;
    profileApi.me(token).then((res) => {
      if (res.ok && res.user) setUser(res.user);
    });
  }, [token]);

  const handleUserLogin = (data) => {
    localStorage.setItem('userToken', data.token);
    setToken(data.token);
    setUser(data.user || null);
    navigate('/dashboard');
  };

  const handleUserLogout = () => {
    localStorage.removeItem('userToken');
    setToken('');
    setUser(null);
    navigate('/login');
  };

  const handleAdminLogin = (data) => {
    localStorage.setItem('adminToken', data.token);
    setAdminToken(data.token);
    navigate('/admin');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken('');
    navigate('/login');
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage onLogin={handleUserLogin} goRegister={() => navigate('/register')} />} />
      <Route
        path="/register"
        element={
          <RegisterPage
            onRegistered={handleUserLogin}
            goLogin={() => navigate('/login')}
          />
        }
      />
      <Route path="/admin-login" element={<AdminLoginPage onLogin={handleAdminLogin} goRegister={() => navigate('/register')} />} />
      <Route
        path="/admin"
        element={
          adminToken ? (
            <AdminPage token={adminToken} onLogout={handleAdminLogout} />
          ) : (
            <Navigate to="/admin-login" replace />
          )
        }
      />
      <Route
        path="/dashboard/*"
        element={
          <AuthGate token={token}>
            <DashboardShell token={token} user={user} onLogout={handleUserLogout} />
          </AuthGate>
        }
      />
      <Route
        path="/history"
        element={
          <AuthGate token={token}>
            <DashboardShell token={token} user={user} onLogout={handleUserLogout} />
          </AuthGate>
        }
      />
      <Route
        path="/profile"
        element={
          <AuthGate token={token}>
            <DashboardShell token={token} user={user} onLogout={handleUserLogout} />
          </AuthGate>
        }
      />
      <Route path="/" element={<Navigate to={token ? '/dashboard' : '/login'} replace />} />
      <Route path="*" element={<Navigate to={token ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}
