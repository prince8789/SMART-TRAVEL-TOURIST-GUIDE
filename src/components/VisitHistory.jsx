import React, { useEffect, useMemo, useState } from 'react';
import { userApi } from '../api/userApi.js';

const historyKey = 'smartTravelVisitedPlaces';
const historyNotesKey = 'smartTravelHistoryNotes';
const favoriteKey = 'smartTravelFavoritePlaces';

const nearbySuggestions = [
  { name: 'Red Fort', type: 'Mughal fort palace', hint: 'Imperial halls, red sandstone walls, and Old Delhi heritage.' },
  { name: 'Rashtrapati Bhavan', type: 'Presidential palace', hint: 'Grand ceremonial residence with the Amrit Udyan gardens.' },
  { name: "Humayun's Tomb", type: 'Mughal royal complex', hint: 'Garden-tomb architecture and a calm historic campus.' }
];

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || fallback);
  } catch {
    return JSON.parse(fallback);
  }
}

function localHistory() {
  return readJson(historyKey, '[]');
}

function localNotes() {
  return readJson(historyNotesKey, '{}');
}

function localFavorites() {
  return readJson(favoriteKey, '{}');
}

function entryKey(item = {}) {
  return item._id || item.id || (item.visitedAt ? String(new Date(item.visitedAt).getTime()) : `${item.placeName}-${item.lat || ''}-${item.lng || ''}`);
}

function saveLocalOnly(items) {
  localStorage.setItem(historyKey, JSON.stringify(items.filter((item) => item.id)));
}

export function VisitHistory({ token }) {
  const [items, setItems] = useState(localHistory());
  const [notes, setNotes] = useState(localNotes());
  const [favorites, setFavorites] = useState(localFavorites());
  const [selectedKey, setSelectedKey] = useState('');
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    userApi.history(token)
      .then((res) => {
        if (!alive) return;
        if (res.ok) {
          setItems([...(res.visitedPlaces || []), ...localHistory()]);
          setError('');
        } else {
          setError(res.message || 'Could not load server history.');
        }
      })
      .catch(() => {
        if (alive) setError('Showing saved local history because the server is unavailable.');
      });
    return () => {
      alive = false;
    };
  }, [token]);

  const sortedItems = useMemo(() => {
    const seen = new Set();
    return [...items]
      .filter((item) => {
        const key = `${item.placeName}-${item.lat}-${item.lng}-${item.visitedAt}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => new Date(b.visitedAt) - new Date(a.visitedAt));
  }, [items]);

  const selectedItem = useMemo(
    () => sortedItems.find((item) => entryKey(item) === selectedKey) || sortedItems[0] || null,
    [selectedKey, sortedItems]
  );

  const updateNote = (key, value) => {
    setNotes((current) => {
      const next = { ...current, [key]: value };
      localStorage.setItem(historyNotesKey, JSON.stringify(next));
      return next;
    });
    setItems((current) => current.map((item) => entryKey(item) === key ? { ...item, note: value } : item));
    if (token) userApi.updateHistory(token, key, { note: value }).catch(() => {});
  };

  const deleteItem = async (item) => {
    const key = entryKey(item);
    setItems((current) => {
      const next = current.filter((historyItem) => entryKey(historyItem) !== key);
      saveLocalOnly(next);
      return next;
    });
    setSelectedKey('');
    if (token && item._id) await userApi.deleteHistory(token, key).catch(() => {});
  };

  const toggleFavorite = (item) => {
    const key = entryKey(item);
    const nextValue = !(favorites[key] ?? item.favorite);
    setFavorites((current) => {
      const next = { ...current, [key]: nextValue };
      localStorage.setItem(favoriteKey, JSON.stringify(next));
      return next;
    });
    setItems((current) => current.map((historyItem) => entryKey(historyItem) === key ? { ...historyItem, favorite: nextValue } : historyItem));
    if (token && item._id) userApi.updateHistory(token, key, { favorite: nextValue }).catch(() => {});
    if (nextValue) {
      setToast('Favorite place saved successfully.');
      window.setTimeout(() => setToast(''), 3000);
    }
  };

  return (
    <div className="content-wrap history-wrap">
      <section className="history">
        <div className="section-head">
          <div>
            <p className="eyebrow">Travel Log</p>
            <h2>Viewed places</h2>
          </div>
        </div>
        {error && <p className="history-note">{error}</p>}
        {toast && <div className="toast-message">{toast}</div>}

        <div className="history-layout">
          <div className="history-list timeline">
            {sortedItems.length === 0 && (
              <div className="empty-state">
                <h3>You haven't visited any places; your history is empty</h3>
                <p>Open the dashboard and select a tourist place to start your travel log.</p>
              </div>
            )}

            {sortedItems.map((item, index) => {
              const key = entryKey(item);
              const saved = favorites[key] ?? item.favorite;
              return (
                <article key={`${key}-${index}`} className={key === entryKey(selectedItem) ? 'history-item-card history-entry active' : 'history-item-card history-entry'} onClick={() => setSelectedKey(key)}>
                  <button className="history-main" type="button">
                    <strong>{item.placeName}</strong>
                    <p>{item.category || 'Tourist place'}</p>
                    <span>{item.visitedAt ? new Date(item.visitedAt).toLocaleString() : 'Just now'}</span>
                  </button>
                  <div className="history-actions">
                    <button className={saved ? 'heart-btn saved' : 'heart-btn'} type="button" aria-label="Toggle favorite" onClick={(event) => {
                      event.stopPropagation();
                      toggleFavorite(item);
                    }}>
                      {saved ? '♥' : '♡'}
                    </button>
                    <button className="icon-btn danger" type="button" onClick={(event) => {
                      event.stopPropagation();
                      deleteItem(item);
                    }}>
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {selectedItem && (
            <aside className="history-detail">
              <p className="eyebrow">Visit details</p>
              <h3>{selectedItem.placeName}</h3>
              <p>{selectedItem.category || 'Tourist place'}</p>
              {selectedItem.summary && <p className="detail-summary">{selectedItem.summary}</p>}
              <div className="detail-time">
                <span>Visit date</span>
                <strong>{selectedItem.visitedAt ? new Date(selectedItem.visitedAt).toLocaleDateString() : 'Today'}</strong>
                <span>Visit time</span>
                <strong>{selectedItem.visitedAt ? new Date(selectedItem.visitedAt).toLocaleTimeString() : 'Just now'}</strong>
              </div>
              <label className="note-field">
                <span>Notes for this place</span>
                <textarea
                  value={notes[entryKey(selectedItem)] || selectedItem.note || ''}
                  onChange={(event) => updateNote(entryKey(selectedItem), event.target.value)}
                  placeholder="Add reminders, food spots, ticket details, or what to see next time."
                />
              </label>
            </aside>
          )}
        </div>

        {sortedItems.length === 0 && (
          <div className="suggestion-strip">
            <h3>Nearby tourist attractions</h3>
            <div className="suggestion-grid">
              {nearbySuggestions.map((place) => (
                <article key={place.name} className="suggestion-card">
                  <strong>{place.name}</strong>
                  <span>{place.type}</span>
                  <p>{place.hint}</p>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
