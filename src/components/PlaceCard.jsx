import React from 'react';

const categoryLabel = {
  museum: 'Museum',
  attraction: 'Attraction',
  viewpoint: 'Viewpoint',
  historic: 'Historic site',
  park: 'Park',
  gallery: 'Gallery',
  'theme park': 'Theme park',
  'Mughal fort palace': 'Mughal fort palace',
  'Presidential palace': 'Presidential palace',
  'Fort palace': 'Fort palace',
  'Mughal royal complex': 'Mughal royal complex',
  'Heritage fort palace': 'Heritage fort palace',
  'Jat fort palace': 'Jat fort palace'
};

function categoryInitial(category = 'Place') {
  return category.trim().charAt(0).toUpperCase() || 'P';
}

export function PlaceCard({ place, active, extra, onView }) {
  const label = categoryLabel[place.category] || place.category;
  const description =
    extra?.customDescription ||
    place.summary ||
    place.tags?.description ||
    place.tags?.wikipedia ||
    `Nearby ${label.toLowerCase()} located around your current map area.`;

  return (
    <article className={active ? 'place-card active' : 'place-card'} onClick={onView}>
      <div className="place-card-head">
        <div className="place-icon" aria-hidden="true">{categoryInitial(label)}</div>
        <div>
          <h3>{place.name}</h3>
          <p>{label}</p>
        </div>
      </div>
      <p className="place-description">{description}</p>
      <div className="place-meta">
        <span>{place.distanceKm === null ? 'Location required for distance' : `${place.distanceKm} km away`}</span>
        <span>{label}</span>
        {place.rating && <span>Info: {place.rating}</span>}
      </div>
      <button className="primary-btn" type="button" onClick={(event) => {
        event.stopPropagation();
        onView();
      }}>
        View route
      </button>
    </article>
  );
}
