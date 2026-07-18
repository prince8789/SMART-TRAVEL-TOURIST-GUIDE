import React, { useEffect, useState } from 'react';
import { userApi } from '../api/userApi.js';

export function PlaceDetailModal({ token, place, userCenter, onClose }) {
  const [extra, setExtra] = useState(null);
  const [route, setRoute] = useState(null);

  useEffect(() => {
    let alive = true;
    userApi.lookupPlaceExtra({ placeName: place.name, lat: place.lat, lng: place.lng }).then((res) => {
      if (alive && res.ok) setExtra(res);
    });
    fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/user/route-estimate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ fromLat: userCenter[0], fromLng: userCenter[1], toLat: place.lat, toLng: place.lng })
    })
      .then((res) => res.json())
      .then((data) => {
        if (alive) setRoute(data);
      });
    return () => {
      alive = false;
    };
  }, [place, token, userCenter]);

  const distanceKm = route?.walk?.distance ? (route.walk.distance / 1000).toFixed(1) : 'N/A';

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="section-head">
          <div>
            <p className="eyebrow">Place details</p>
            <h2>{place.name}</h2>
          </div>
          <button className="secondary-btn" onClick={onClose}>Close</button>
        </div>
        <div className="profile-card" style={{ marginTop: 12 }}>
          <p><strong>Category:</strong> {place.category}</p>
          <p><strong>Description:</strong> {extra?.customDescription || place.tags?.description || 'No description available'}</p>
          <p><strong>Distance:</strong> {distanceKm} km</p>
          <p><strong>Walking time:</strong> {route?.walk?.duration ? `${Math.round(route.walk.duration / 60)} min` : 'N/A'}</p>
          <p><strong>Driving time:</strong> {route?.drive?.duration ? `${Math.round(route.drive.duration / 60)} min` : 'N/A'}</p>
          <p><strong>Opening hours:</strong> {extra?.customOpeningHours || place.tags?.opening_hours || 'Not available'}</p>
          <p><strong>Images:</strong> {(extra?.images || []).length ? extra.images.join(', ') : 'Placeholder image'}</p>
          <button
            className="primary-btn"
            onClick={async () => {
              await userApi.viewed(token, { placeName: place.name, lat: place.lat, lng: place.lng, category: place.category });
            }}
          >
            Save to Viewed
          </button>
        </div>
      </div>
    </div>
  );
}
