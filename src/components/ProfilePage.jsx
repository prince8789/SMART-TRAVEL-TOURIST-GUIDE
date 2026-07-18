import React, { useEffect, useMemo, useState } from 'react';
import { profileApi } from '../api/profileApi.js';
import { userApi } from '../api/userApi.js';

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'U';
}

export function ProfilePage({ token, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [viewed, setViewed] = useState([]);

  useEffect(() => {
    profileApi.me(token).then((res) => {
      if (res.ok) setProfile(res.user);
    });
    userApi.history(token).then((res) => {
      if (res.ok) setHistory(res.visitedPlaces || []);
    });
    userApi.viewedPlaces(token).then((res) => {
      if (res.ok) setViewed(res.viewedPlaces || []);
    });
  }, [token]);

  const favoriteCount = useMemo(() => {
    return new Set(history.filter((item) => item.favorite).map((item) => item.placeName)).size;
  }, [history]);

  const favoriteHistory = useMemo(() => {
    return history.filter((item) => item.favorite);
  }, [history]);

  if (!profile) {
    return <div className="content-wrap"><div className="profile-card">Loading profile...</div></div>;
  }

  return (
    <div className="content-wrap">
      <section className="profile-grid">
        <article className="profile-card profile-hero">
          <div className="avatar-lg">{initials(profile.name)}</div>
          <div>
            <p className="eyebrow">Traveler profile</p>
            <h1>{profile.name}</h1>
            <p>{profile.email}</p>
          </div>
        </article>

        <article className="profile-card stats-card">
          <h2>Joined</h2>
          <p>{profile.joinedAt ? new Date(profile.joinedAt).toLocaleDateString() : 'Unknown'}</p>
        </article>

        <article className="profile-card stats-card">
          <h2>Favorite places</h2>
          <p>{favoriteCount}</p>
        </article>

        <article className="profile-card stats-card">
          <h2>Visited places</h2>
          <p>{history.length}</p>
        </article>

        <article className="profile-card stats-card">
          <h2>Viewed places</h2>
          <p>{viewed.length}</p>
        </article>
      </section>

      <section className="profile-card">
        <div className="section-head"><div><p className="eyebrow">Research list</p><h2>Viewed places</h2></div></div>
        <div className="history-list">
          {viewed.map((item) => <div className="history-item-card" key={item._id || `${item.placeName}-${item.viewedAt}`}><div><strong>{item.placeName}</strong><p>{item.category || 'Tourist place'}</p></div><span>{new Date(item.viewedAt).toLocaleString()}</span></div>)}
          {viewed.length === 0 && <div className="empty-state"><h3>No viewed places yet</h3><p>Select a place or inspect it on the map to save it here.</p></div>}
        </div>
      </section>

      <section className="profile-card">
        <div className="section-head">
          <h2>Favorite places</h2>
          <button className="secondary-btn" onClick={onLogout}>Logout</button>
        </div>
        <div className="history-list">
          {favoriteHistory.map((item, index) => (
            <div className="history-item-card" key={`${item.placeName}-${index}`}>
              <strong>{item.placeName}</strong>
              <span>{new Date(item.visitedAt).toLocaleString()}</span>
            </div>
          ))}
          {favoriteHistory.length === 0 && (
            <div className="empty-state">
              <h3>No favorites yet</h3>
              <p>Open History and tap the heart beside a place to save it here.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
