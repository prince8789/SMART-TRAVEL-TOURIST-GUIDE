import React from 'react';
import { PlaceCard } from './PlaceCard.jsx';

export function PlacesSidebar({
  loading,
  error,
  places,
  query,
  onQueryChange,
  type,
  onTypeChange,
  sortMode,
  onSortModeChange,
  categoryOptions,
  sortOptions,
  heading,
  selectedId,
  onPlaceSelect,
  placeExtras
}) {
  const trimmedQuery = query.trim();

  return (
    <aside className="sidebar">
      <div className="sidebar-head">
        <div>
          <p className="eyebrow">Subject</p>
          <h2>{heading}</h2>
        </div>
        <input className="search-input" value={query} onChange={(e) => onQueryChange(e.target.value)} placeholder="Search places" />
      </div>

      <div className="filter-panel" aria-label="Tourist spot filters">
        <label>
          <span>Category</span>
          <select className="select-input" value={type} onChange={(e) => onTypeChange(e.target.value)}>
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Sort by</span>
          <select className="select-input" value={sortMode} onChange={(e) => onSortModeChange(e.target.value)}>
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        {!loading && !error && (
          <p className="filter-count">
            {places.length} tourist spot{places.length === 1 ? '' : 's'} shown
          </p>
        )}
      </div>

      <div className="sidebar-scroll">
        {trimmedQuery && !loading && !error && (
          <div className="search-summary">
            <strong>{places.length} matching place{places.length === 1 ? '' : 's'} found</strong>
            <span>Select any result below to view distance and route on the map.</span>
          </div>
        )}

        {!trimmedQuery && sortMode === 'famous' && !loading && !error && places.length > 0 && (
          <div className="subject-panel">
            {places.map((place, index) => (
              <button
                className={place.id === selectedId ? 'subject-place active' : 'subject-place'}
                key={place.id}
                type="button"
                onClick={() => onPlaceSelect(place)}
              >
                <span className="subject-rank">{String(index + 1).padStart(2, '0')}</span>
                <span className="subject-copy">
                  <strong>{place.name}</strong>
                  <span>{place.distanceKm} km away - {place.category}</span>
                  <p>{place.summary || place.tags?.wikipedia || `A popular ${place.category} nearby.`}</p>
                </span>
                <span className="subject-arrow" aria-hidden="true">View</span>
              </button>
            ))}
          </div>
        )}

        {!trimmedQuery &&
          sortMode === 'nearest' &&
          !loading &&
          !error &&
          places.map((place, index) => (
            <button
              className={place.id === selectedId ? 'subject-place active' : 'subject-place'}
              key={place.id}
              type="button"
              onClick={() => onPlaceSelect(place)}
            >
              <span className="subject-rank">{String(index + 1).padStart(2, '0')}</span>
              <span className="subject-copy">
                <strong>{place.name}</strong>
                <span>{place.distanceKm} km away - {place.category}</span>
                <p>{place.summary || place.tags?.wikipedia || `A nearby ${place.category} worth exploring.`}</p>
              </span>
              <span className="subject-arrow" aria-hidden="true">View</span>
            </button>
          ))}
      
        {loading && (
          <div className="skeleton-list">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="place-skeleton" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="empty-state error-state">
            <h3>Could not load nearby places</h3>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && places.length === 0 && (
          <div className="empty-state">
            <h3>No places found</h3>
            <p>Try another search, change the filter, or allow location access.</p>
          </div>
        )}

        {!loading &&
          !error &&
          trimmedQuery &&
          places.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              active={place.id === selectedId}
              extra={placeExtras[place.id]}
              onView={() => onPlaceSelect(place)}
            />
          ))}
      </div>
    </aside>
  );
}
