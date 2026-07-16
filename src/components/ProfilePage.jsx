import React, { useEffect, useMemo, useState } from 'react';
import { profileApi } from '../api/profileApi.js';
import { userApi } from '../api/userApi.js';

const favoriteKey = 'smartTravelFavoritePlaces';
const historyKey = 'smartTravelVisitedPlaces';

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
  const [localFavorites, setLocalFavorites] = useState({});

  useEffect(() => {
    profileApi.me(token).then((res) => {
      if (res.ok) setProfile(res.user);
    });
    userApi.history(token).then((res) => {
      let localHistory = [];
      try {
        localHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
      } catch {
        localHistory = [];
      }
      if (res.ok) setHistory([...(res.visitedPlaces || []), ...localHistory]);
      else setHistory(localHistory);
    });
    try {
      setLocalFavorites(JSON.parse(localStorage.getItem(favoriteKey) || '{}'));
    } catch {
      setLocalFavorites({});
    }
  }, [token]);

  const favoriteCount = useMemo(() => {
    const serverFavorites = history.filter((item) => item.favorite).map((item) => item.placeName);
    const localFavoriteNames = history
      .filter((item) => localFavorites[item._id || item.id || String(new Date(item.visitedAt).getTime())])
      .map((item) => item.placeName);
    return new Set([...serverFavorites, ...localFavoriteNames]).size;
  }, [history, localFavorites]);

  const favoriteHistory = useMemo(() => {
    return history.filter((item) => item.favorite || localFavorites[item._id || item.id || String(new Date(item.visitedAt).getTime())]);
  }, [history, localFavorites]);

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
