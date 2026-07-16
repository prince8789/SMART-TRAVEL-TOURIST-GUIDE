import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import { userApi } from '../api/userApi.js';
import { PlacesSidebar } from './PlacesSidebar.jsx';

const defaultCenter = [28.6139, 77.209];
const historyKey = 'smartTravelVisitedPlaces';

const indiaTouristPlaces = [
  {
    id: 'famous-red-fort',
    name: 'Red Fort',
    aliases: ['lal qila', 'redfort'],
    category: 'Mughal fort palace',
    lat: 28.6562,
    lng: 77.241,
    source: 'curated',
    tags: { tourism: 'attraction', historic: 'fort' },
    summary: 'A UNESCO-listed Mughal fort palace complex built with red sandstone, known for its imperial halls, gardens, and Independence Day ceremony.'
  },
  {
    id: 'india-hawa-mahal',
    name: 'Hawa Mahal',
    aliases: ['hawa mehal', 'palace of winds', 'hawamahal'],
    category: 'Rajput palace',
    lat: 26.9239,
    lng: 75.8267,
    source: 'curated',
    tags: { tourism: 'attraction', historic: 'palace' },
    summary: 'Jaipur landmark known as the Palace of Winds, with a honeycomb facade built for royal women to observe city life.'
  },
  {
    id: 'india-taj-mahal',
    name: 'Taj Mahal',
    aliases: ['tajmahal', 'taj'],
    category: 'Mughal monument',
    lat: 27.1751,
    lng: 78.0421,
    source: 'curated',
    tags: { tourism: 'attraction', historic: 'monument' },
    summary: 'Agra marble mausoleum and UNESCO World Heritage Site, celebrated for its symmetry, gardens, calligraphy, and sunrise views.'
  },
  {
    id: 'india-qutub-minar',
    name: 'Qutub Minar',
    aliases: ['qutab minar', 'qutb minar'],
    category: 'Historic monument',
    lat: 28.5245,
    lng: 77.1855,
    source: 'curated',
    tags: { tourism: 'attraction', historic: 'monument' },
    summary: 'Delhi UNESCO complex with a soaring minaret, early Indo-Islamic architecture, and the famous Iron Pillar.'
  },
  {
    id: 'india-india-gate',
    name: 'India Gate',
    aliases: ['delhi india gate'],
    category: 'War memorial',
    lat: 28.6129,
    lng: 77.2295,
    source: 'curated',
    tags: { tourism: 'attraction', historic: 'memorial' },
    summary: 'Iconic New Delhi memorial on Kartavya Path, popular for evening walks, photographs, and nearby ceremonial landmarks.'
  },
  {
    id: 'india-amer-fort',
    name: 'Amer Fort',
    aliases: ['amber fort', 'amer palace', 'amber palace'],
    category: 'Fort palace',
    lat: 26.9855,
    lng: 75.8513,
    source: 'curated',
    tags: { tourism: 'attraction', historic: 'fort' },
    summary: 'Hilltop Jaipur fort palace with courtyards, mirror work, ramparts, and views over Maota Lake.'
  },
  {
    id: 'india-city-palace-jaipur',
    name: 'City Palace Jaipur',
    aliases: ['jaipur city palace'],
    category: 'Royal palace',
    lat: 26.9258,
    lng: 75.8237,
    source: 'curated',
    tags: { tourism: 'attraction', historic: 'palace' },
    summary: 'Royal palace complex in Jaipur with museums, painted gateways, courtyards, textiles, and regal Rajput architecture.'
  },
  {
    id: 'india-mysore-palace',
    name: 'Mysore Palace',
    aliases: ['mysuru palace', 'ambavilas palace'],
    category: 'Royal palace',
    lat: 12.3052,
    lng: 76.6552,
    source: 'curated',
    tags: { tourism: 'attraction', historic: 'palace' },
    summary: 'Grand Indo-Saracenic palace in Mysuru, famous for illuminated evenings, ornate halls, and Dasara celebrations.'
  },
  {
    id: 'india-gateway-of-india',
    name: 'Gateway of India',
    aliases: ['mumbai gateway'],
    category: 'Historic monument',
    lat: 18.922,
    lng: 72.8347,
    source: 'curated',
    tags: { tourism: 'attraction', historic: 'monument' },
    summary: 'Mumbai waterfront arch overlooking the Arabian Sea, close to Colaba, ferry points, and heritage hotels.'
  },
  {
    id: 'india-elephanta-caves',
    name: 'Elephanta Caves',
    aliases: ['gharapuri caves'],
    category: 'Cave temple',
    lat: 18.9633,
    lng: 72.9315,
    source: 'curated',
    tags: { tourism: 'attraction', historic: 'archaeological_site' },
    summary: 'UNESCO-listed island cave temples near Mumbai with rock-cut sculptures dedicated mainly to Shiva.'
  },
  {
    id: 'india-ajanta-caves',
    name: 'Ajanta Caves',
    aliases: ['ajintha caves'],
    category: 'Buddhist caves',
    lat: 20.5519,
    lng: 75.7033,
    source: 'curated',
    tags: { tourism: 'attraction', historic: 'archaeological_site' },
    summary: 'Ancient Buddhist cave complex in Maharashtra known for murals, sculptures, monasteries, and dramatic horseshoe cliffs.'
  },
  {
    id: 'india-ellora-caves',
    name: 'Ellora Caves',
    aliases: ['verul caves', 'kailasa temple'],
    category: 'Cave temples',
    lat: 20.0268,
    lng: 75.1771,
    source: 'curated',
    tags: { tourism: 'attraction', historic: 'archaeological_site' },
    summary: 'Rock-cut Hindu, Buddhist, and Jain cave temples near Aurangabad, including the monumental Kailasa Temple.'
  },
  {
    id: 'india-khajuraho',
    name: 'Khajuraho Group of Monuments',
    aliases: ['khajuraho temples'],
    category: 'Temple complex',
    lat: 24.8318,
    lng: 79.9199,
    source: 'curated',
    tags: { tourism: 'attraction', historic: 'temple' },
    summary: 'UNESCO temple complex in Madhya Pradesh known for Nagara architecture and detailed sculptural art.'
  },
  {
    id: 'india-konark-sun-temple',
    name: 'Konark Sun Temple',
    aliases: ['sun temple konark'],
    category: 'Temple',
    lat: 19.8876,
    lng: 86.0945,
    source: 'curated',
    tags: { tourism: 'attraction', historic: 'temple' },
    summary: 'Odisha UNESCO temple designed as a stone chariot of the sun god, known for wheels, sculptures, and coastal setting.'
  },
  {
    id: 'india-meenakshi-temple',
    name: 'Meenakshi Amman Temple',
    aliases: ['meenakshi temple', 'madurai temple'],
    category: 'Temple',
    lat: 9.9195,
    lng: 78.1193,
    source: 'curated',
    tags: { tourism: 'attraction', historic: 'temple' },
    summary: 'Madurai temple complex with colorful gopurams, sacred halls, and a living devotional atmosphere.'
  },
  {
    id: 'india-golden-temple',
    name: 'Golden Temple',
    aliases: ['harmandir sahib', 'darbar sahib'],
    category: 'Gurdwara',
    lat: 31.62,
    lng: 74.8765,
    source: 'curated',
    tags: { tourism: 'attraction', amenity: 'place_of_worship' },
    summary: 'Amritsar spiritual landmark surrounded by the Amrit Sarovar, known for its golden sanctum and community kitchen.'
  },
  {
    id: 'india-varanasi-ghats',
    name: 'Varanasi Ghats',
    aliases: ['kashi ghats', 'dashashwamedh ghat', 'assi ghat'],
    category: 'Sacred riverfront',
    lat: 25.3069,
    lng: 83.0107,
    source: 'curated',
    tags: { tourism: 'attraction', historic: 'religious_site' },
    summary: 'Historic Ganga riverfront in Varanasi, known for boat rides, rituals, temples, and evening aarti.'
  },
  {
    id: 'india-sanchi-stupa',
    name: 'Sanchi Stupa',
    aliases: ['great stupa sanchi'],
    category: 'Buddhist monument',
    lat: 23.4793,
    lng: 77.739,
    source: 'curated',
    tags: { tourism: 'attraction', historic: 'monument' },
    summary: 'Ancient Buddhist stupa complex in Madhya Pradesh with carved gateways and important Mauryan heritage.'
  },
  {
    id: 'india-hampi',
    name: 'Hampi',
    aliases: ['hampi ruins', 'vijayanagara'],
    category: 'Heritage ruins',
    lat: 15.335,
    lng: 76.46,
    source: 'curated',
    tags: { tourism: 'attraction', historic: 'archaeological_site' },
    summary: 'Karnataka UNESCO landscape of Vijayanagara ruins, boulder hills, temples, markets, and riverside monuments.'
  },
  {
    id: 'india-munnar',
    name: 'Munnar',
    aliases: ['munnar hill station'],
    category: 'Hill station',
    lat: 10.0889,
    lng: 77.0595,
    source: 'curated',
    tags: { tourism: 'attraction', natural: 'viewpoint' },
    summary: 'Kerala hill station with tea gardens, viewpoints, waterfalls, cool weather, and easy nature drives.'
  },
  {
    id: 'india-dal-lake',
    name: 'Dal Lake',
    aliases: ['srinagar dal lake'],
    category: 'Lake viewpoint',
    lat: 34.1106,
    lng: 74.8683,
    source: 'curated',
    tags: { tourism: 'attraction', natural: 'water' },
    summary: 'Srinagar lake famous for shikara rides, houseboats, floating markets, gardens, and mountain views.'
  },
  {
    id: 'india-rann-of-kutch',
    name: 'Great Rann of Kutch',
    aliases: ['rann of kutch', 'white rann'],
    category: 'Salt desert',
    lat: 23.7337,
    lng: 69.8597,
    source: 'curated',
    tags: { tourism: 'attraction', natural: 'desert' },
    summary: 'Vast white salt desert in Gujarat, especially popular during Rann Utsav and full-moon evenings.'
  },
  {
    id: 'india-goa-baga-beach',
    name: 'Baga Beach',
    aliases: ['goa baga beach'],
    category: 'Beach',
    lat: 15.5553,
    lng: 73.7517,
    source: 'curated',
    tags: { tourism: 'attraction', natural: 'beach' },
    summary: 'Popular North Goa beach known for water sports, nightlife, cafes, shopping lanes, and lively evenings.'
  },
  {
    id: 'india-mahabalipuram',
    name: 'Mahabalipuram Shore Temple',
    aliases: ['shore temple', 'mamallapuram'],
    category: 'Temple monument',
    lat: 12.6165,
    lng: 80.1996,
    source: 'curated',
    tags: { tourism: 'attraction', historic: 'temple' },
    summary: 'Tamil Nadu coastal UNESCO monument with Pallava-era rock-cut temples, carvings, and sea-facing architecture.'
  },
  {
    id: 'india-victoria-memorial',
    name: 'Victoria Memorial',
    aliases: ['kolkata victoria memorial'],
    category: 'Museum monument',
    lat: 22.5448,
    lng: 88.3426,
    source: 'curated',
    tags: { tourism: 'museum', historic: 'monument' },
    summary: 'Kolkata marble landmark with museum galleries, colonial-era art, gardens, and a reflective water setting.'
  },
  {
    id: 'india-statue-of-unity',
    name: 'Statue of Unity',
    aliases: ['sardar patel statue'],
    category: 'Monument viewpoint',
    lat: 21.838,
    lng: 73.7191,
    source: 'curated',
    tags: { tourism: 'attraction', historic: 'monument' },
    summary: 'World-famous statue of Sardar Vallabhbhai Patel near Kevadia, with viewing galleries and Narmada valley attractions.'
  },
  {
    id: 'india-lotus-temple',
    name: 'Lotus Temple',
    aliases: ['bahai temple delhi'],
    category: 'Place of worship',
    lat: 28.5535,
    lng: 77.2588,
    source: 'curated',
    tags: { tourism: 'attraction', amenity: 'place_of_worship' },
    summary: 'Delhi Bahai temple shaped like a lotus, known for quiet meditation spaces, gardens, and contemporary architecture.'
  },
  {
    id: 'india-akshardham-delhi',
    name: 'Akshardham Temple Delhi',
    aliases: ['swaminarayan akshardham', 'akshardham'],
    category: 'Temple',
    lat: 28.6127,
    lng: 77.2773,
    source: 'curated',
    tags: { tourism: 'attraction', historic: 'temple' },
    summary: 'Large temple complex in Delhi with carved stone architecture, exhibitions, gardens, and evening water shows.'
  },
  {
    id: 'famous-rashtrapati-bhavan',
    name: 'Rashtrapati Bhavan',
    category: 'Presidential palace',
    lat: 28.6143,
    lng: 77.1994,
    source: 'curated',
    tags: { tourism: 'attraction', historic: 'palace' },
    summary: 'The official residence of the President of India, combining grand ceremonial architecture with the well-known Amrit Udyan gardens.'
  },
  {
    id: 'famous-purana-qila',
    name: 'Purana Qila',
    category: 'Fort palace',
    lat: 28.6095,
    lng: 77.2436,
    source: 'curated',
    tags: { tourism: 'attraction', historic: 'fort' },
    summary: 'One of Delhi’s oldest fort complexes, associated with Sher Shah Suri and Mughal history, with massive gateways and a lakeside setting.'
  },
  {
    id: 'famous-humayun-tomb',
    name: "Humayun's Tomb",
    category: 'Mughal royal complex',
    lat: 28.5933,
    lng: 77.2507,
    source: 'curated',
    tags: { tourism: 'attraction', historic: 'monument' },
    summary: 'A landmark Mughal garden-tomb complex whose design influenced later imperial architecture, including the Taj Mahal.'
  },
  {
    id: 'famous-neemrana-fort',
    name: 'Neemrana Fort Palace',
    category: 'Heritage fort palace',
    lat: 27.9874,
    lng: 76.386,
    source: 'curated',
    tags: { tourism: 'attraction', historic: 'castle' },
    summary: 'A restored hilltop fort palace in Rajasthan, popular for heritage stays, layered terraces, old courtyards, and sweeping views.'
  },
  {
    id: 'famous-lohagarh-fort',
    name: 'Lohagarh Fort Palace',
    category: 'Jat fort palace',
    lat: 27.2152,
    lng: 77.5012,
    source: 'curated',
    tags: { tourism: 'attraction', historic: 'fort' },
    summary: 'A strong Bharatpur fort complex known as the Iron Fort, with palace structures, museums, and a history of resisting repeated attacks.'
  }
];

const categoryOptions = [
  { value: 'all', label: 'All tourist spots' },
  { value: 'hotels', label: 'Hotels' },
  { value: 'parks', label: 'Parks' },
  { value: 'palaces', label: 'Historical palaces' },
  { value: 'temples', label: 'Temples' },
  { value: 'museums', label: 'Museums' },
  { value: 'viewpoints', label: 'Viewpoints' },
  { value: 'attractions', label: 'Attractions' }
];

const sortOptions = [
  { value: 'nearest', label: 'Nearest tourist spots' },
  { value: 'famous', label: 'Most famous tourist spots' }
];

function distanceKm(a, b) {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLon = ((b[1] - a[1]) * Math.PI) / 180;
  const lat1 = (a[0] * Math.PI) / 180;
  const lat2 = (b[0] * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

function pickName(tags = {}) {
  return tags.name || tags['name:en'] || '';
}

function readableCategory(tags = {}) {
  const raw = tags.tourism || tags.historic || tags.amenity || tags.leisure || 'tourist place';
  return raw.replaceAll('_', ' ');
}

function categoryGroup(tags = {}, category = '') {
  const values = [
    tags.tourism,
    tags.historic,
    tags.amenity,
    tags.leisure,
    tags.religion,
    category
  ].filter(Boolean).map((value) => String(value).toLowerCase());
  const haystack = values.join(' ');

  if (haystack.includes('hotel') || haystack.includes('guest_house') || haystack.includes('hostel') || haystack.includes('resort')) return 'hotels';
  if (haystack.includes('park') || haystack.includes('garden')) return 'parks';
  if (haystack.includes('palace') || haystack.includes('castle') || haystack.includes('fort')) return 'palaces';
  if (haystack.includes('temple') || haystack.includes('place_of_worship') || haystack.includes('hindu')) return 'temples';
  if (haystack.includes('museum')) return 'museums';
  if (haystack.includes('viewpoint')) return 'viewpoints';
  return 'attractions';
}

function fameScore(place) {
  let score = 0;
  if (place.source === 'curated') score += 100;
  if (place.tags?.wikidata) score += 35;
  if (place.tags?.wikipedia) score += 30;
  if (place.tags?.heritage) score += 20;
  if (place.tags?.historic) score += 12;
  if (place.tags?.tourism === 'attraction') score += 8;
  if (place.rating) score += 6;
  return score;
}

function describePlace(place, extra) {
  return (
    extra?.customDescription ||
    place?.summary ||
    place?.tags?.description ||
    place?.tags?.wikipedia ||
    place?.tags?.historic ||
    place?.tags?.tourism ||
    `A nearby ${place?.category || 'tourist place'} worth exploring.`
  );
}

function normalizeSearch(value = '') {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function editDistance(a, b) {
  if (Math.abs(a.length - b.length) > 1) return 2;
  const rows = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j += 1) rows[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      rows[i][j] = Math.min(
        rows[i - 1][j] + 1,
        rows[i][j - 1] + 1,
        rows[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return rows[a.length][b.length];
}

function matchesSearch(place, queryText) {
  const q = normalizeSearch(queryText);
  if (!q) return true;
  const haystack = normalizeSearch([
    place.name,
    place.category,
    place.summary,
    ...(place.aliases || [])
  ].filter(Boolean).join(' '));
  if (haystack.includes(q)) return true;

  const haystackTokens = new Set(haystack.split(' ').filter(Boolean));
  return q.split(' ').filter(Boolean).every((token) => (
    haystackTokens.has(token) ||
    [...haystackTokens].some((candidate) => token.length >= 4 && editDistance(token, candidate) <= 1)
  ));
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function saveLocalVisit(place) {
  const entry = {
    id: `${place.name}-${place.lat}-${place.lng}-${Date.now()}`,
    placeName: place.name,
    lat: place.lat,
    lng: place.lng,
    category: place.category,
    summary: describePlace(place),
    favorite: false,
    note: '',
    visitedAt: new Date().toISOString()
  };
  const existing = JSON.parse(localStorage.getItem(historyKey) || '[]');
  localStorage.setItem(historyKey, JSON.stringify([entry, ...existing].slice(0, 100)));
}

const userIcon = L.divIcon({
  className: 'user-location-marker',
  html: '<span></span>',
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

function placeIcon(active = false) {
  return L.divIcon({
    className: active ? 'place-pin active' : 'place-pin',
    html: '<span></span>',
    iconSize: active ? [34, 42] : [30, 38],
    iconAnchor: active ? [17, 40] : [15, 36],
    popupAnchor: [0, -34]
  });
}

export function MapPage({ token }) {
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersRef = useRef(new Map());
  const routeRef = useRef(null);
  const userMarkerRef = useRef(null);
  const [places, setPlaces] = useState([]);
  const [center, setCenter] = useState(defaultCenter);
  const [selectedId, setSelectedId] = useState('');
  const [placeExtras, setPlaceExtras] = useState({});
  const [notice, setNotice] = useState('Finding your location...');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [routeLoading, setRouteLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const [sortMode, setSortMode] = useState('nearest');

  const selectedPlace = useMemo(() => places.find((place) => place.id === selectedId) || null, [places, selectedId]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setNotice('Geolocation is unavailable. Showing New Delhi.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter([pos.coords.latitude, pos.coords.longitude]);
        setNotice('Using your current location');
      },
      () => {
        setNotice('Location permission denied. Showing New Delhi.');
      },
      { enableHighAccuracy: true, timeout: 9000, maximumAge: 120000 }
    );
  }, []);

  useEffect(() => {
    const [lat, lon] = center;
    const controller = new AbortController();
    setLoading(true);
    setError('');

    const q = `[out:json][timeout:25];(node["tourism"~"attraction|museum|gallery|viewpoint|zoo|theme_park|hotel|guest_house|hostel|resort"](around:15000,${lat},${lon});node["historic"](around:15000,${lat},${lon});node["leisure"~"park|garden"](around:15000,${lat},${lon});node["amenity"="place_of_worship"](around:15000,${lat},${lon});way["tourism"~"attraction|museum|gallery|viewpoint|zoo|theme_park|hotel|guest_house|hostel|resort"](around:15000,${lat},${lon});way["historic"](around:15000,${lat},${lon});way["leisure"~"park|garden"](around:15000,${lat},${lon});way["amenity"="place_of_worship"](around:15000,${lat},${lon}););out center tags 120;`;

    fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(q)}`, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error('Nearby places service is unavailable right now.');
        return r.json();
      })
      .then((data) => {
        const seen = new Set();
        const nearby = (data.elements || [])
          .map((el, i) => {
            const latv = el.lat || el.center?.lat;
            const lngv = el.lon || el.center?.lon;
            if (!latv || !lngv) return null;
            const tags = el.tags || {};
            const name = pickName(tags);
            if (!name) return null;
            const dedupeKey = `${name}-${latv.toFixed(4)}-${lngv.toFixed(4)}`;
            if (seen.has(dedupeKey)) return null;
            seen.add(dedupeKey);
            const category = readableCategory(tags);
            return {
              id: `${el.type}-${el.id}-${i}`,
              name,
              category,
              filterCategory: categoryGroup(tags, category),
              lat: latv,
              lng: lngv,
              tags,
              distanceKm: distanceKm(center, [latv, lngv]).toFixed(1),
              rating: tags.stars || tags.rating || tags.wikidata
            };
          })
          .filter(Boolean);

        const curated = indiaTouristPlaces.map((place) => ({
          ...place,
          filterCategory: categoryGroup(place.tags, place.category),
          distanceKm: distanceKm(center, [place.lat, place.lng]).toFixed(1),
          rating: 'Famous palace'
        }));

        const mapped = [...curated, ...nearby]
          .filter((place) => {
            const key = place.name.toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          })
          .sort((a, b) => Number(a.distanceKm) - Number(b.distanceKm));
        setPlaces(mapped);
        if (mapped[0]) setSelectedId((current) => current || mapped[0].id);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          const curated = indiaTouristPlaces.map((place) => ({
            ...place,
            filterCategory: categoryGroup(place.tags, place.category),
            distanceKm: distanceKm(center, [place.lat, place.lng]).toFixed(1),
            rating: 'Famous India destination'
          })).sort((a, b) => Number(a.distanceKm) - Number(b.distanceKm));
          setPlaces(curated);
          if (curated[0]) setSelectedId((current) => current || curated[0].id);
          setNotice('Showing curated India tourist places');
          setError('');
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [center]);

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    leafletMapRef.current = L.map(mapRef.current, {
      zoomControl: true,
      preferCanvas: true
    }).setView(center, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(leafletMapRef.current);

    requestAnimationFrame(() => leafletMapRef.current?.invalidateSize());

    return () => {
      leafletMapRef.current?.remove();
      leafletMapRef.current = null;
      markersRef.current.clear();
      routeRef.current = null;
      userMarkerRef.current = null;
    };
  }, []);

  const drawFallbackRoute = useCallback((place) => {
    const map = leafletMapRef.current;
    if (!map) return;
    if (routeRef.current) routeRef.current.remove();
    routeRef.current = L.polyline([center, [place.lat, place.lng]], {
      color: '#0b5cab',
      weight: 5,
      opacity: 0.75,
      dashArray: '8 10'
    }).addTo(map);
    map.fitBounds(routeRef.current.getBounds(), { padding: [44, 44], maxZoom: 15 });
  }, [center]);

  const drawRoadRoute = useCallback(async (place) => {
    const map = leafletMapRef.current;
    if (!map) return;
    setRouteLoading(true);
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${center[1]},${center[0]};${place.lng},${place.lat}?overview=full&geometries=geojson`;
      const data = await fetch(url).then((r) => {
        if (!r.ok) throw new Error('Route service failed');
        return r.json();
      });
      const coordinates = data.routes?.[0]?.geometry?.coordinates;
      if (!coordinates?.length) throw new Error('No road route found');
      if (routeRef.current) routeRef.current.remove();
      routeRef.current = L.polyline(coordinates.map(([lng, lat]) => [lat, lng]), {
        color: '#0b5cab',
        weight: 5,
        opacity: 0.88
      }).addTo(map);
      map.fitBounds(routeRef.current.getBounds(), { padding: [44, 44], maxZoom: 15 });
    } catch {
      drawFallbackRoute(place);
    } finally {
      setRouteLoading(false);
    }
  }, [center, drawFallbackRoute]);

  const recordVisit = useCallback(async (place) => {
    saveLocalVisit(place);
    if (!token) return;
    try {
      await userApi.visit(token, {
        placeName: place.name,
        lat: place.lat,
        lng: place.lng,
        category: place.category,
        summary: describePlace(place)
      });
    } catch {
      // Local history keeps the click visible even when the backend is offline.
    }
  }, [token]);

  const selectPlace = useCallback((place) => {
    setSelectedId(place.id);
    recordVisit(place);
    drawRoadRoute(place);

    if (!placeExtras[place.id]) {
      userApi.lookupPlaceExtra({ placeName: place.name, lat: place.lat, lng: place.lng })
        .then((res) => {
          if (res.ok) setPlaceExtras((current) => ({ ...current, [place.id]: res }));
        })
        .catch(() => {});
    }
  }, [drawRoadRoute, placeExtras, recordVisit]);

  const filteredPlaces = useMemo(() => {
    const filtered = places.filter((place) => {
      const matchesQuery = matchesSearch(place, query);
      const matchesType = type === 'all' || place.filterCategory === type;
      return matchesQuery && matchesType;
    });
    return [...filtered].sort((a, b) => {
      if (sortMode === 'famous') {
        const scoreDiff = fameScore(b) - fameScore(a);
        if (scoreDiff !== 0) return scoreDiff;
      }
      return Number(a.distanceKm) - Number(b.distanceKm);
    });
  }, [places, query, sortMode, type]);

  useEffect(() => {
    const map = leafletMapRef.current;
    if (map) map.setView(center, 13);
  }, [center]);

  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    if (!userMarkerRef.current) {
      userMarkerRef.current = L.marker(center, { icon: userIcon, title: 'You are here', zIndexOffset: 900 }).addTo(map);
      userMarkerRef.current.bindPopup('<strong>You are here</strong>');
    } else {
      userMarkerRef.current.setLatLng(center);
    }

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    filteredPlaces.forEach((place) => {
      const active = place.id === selectedId;
      const extra = placeExtras[place.id];
      const marker = L.marker([place.lat, place.lng], {
        icon: placeIcon(active),
        title: place.name,
        zIndexOffset: active ? 500 : 0
      }).addTo(map);

      marker.bindPopup(`
        <div class="place-popup">
          <strong>${escapeHtml(place.name)}</strong>
          <span>${escapeHtml(place.category)}</span>
          <p>${escapeHtml(describePlace(place, extra))}</p>
          ${place.rating ? `<small>Rating/info: ${escapeHtml(place.rating)}</small>` : ''}
        </div>
      `);

      marker.on('click', () => selectPlace(place));
      if (active) marker.openPopup();
      markersRef.current.set(place.id, marker);
    });

    requestAnimationFrame(() => map.invalidateSize());
  }, [center, filteredPlaces, placeExtras, selectPlace, selectedId]);

  useEffect(() => {
    if (!selectedPlace || !leafletMapRef.current) return;
    const marker = markersRef.current.get(selectedPlace.id);
    if (marker) marker.openPopup();
  }, [selectedPlace]);

  const activeCategoryLabel = categoryOptions.find((option) => option.value === type)?.label || 'Tourist spots';
  const resultHeading = query.trim()
    ? `Search results for "${query.trim()}"`
    : sortMode === 'famous'
      ? 'Most famous tourist spots'
      : type === 'all'
        ? 'Nearest tourist spots'
        : activeCategoryLabel;

  return (
    <div className="dashboard-grid">
      <section className="map-shell">
        <div className="map-toolbar">
          <div>
            <p className="eyebrow">Interactive Map</p>
            <h1>Explore places around you</h1>
          </div>
          <div className="map-status">
            {routeLoading && <span className="notice-pill">Drawing route...</span>}
            {notice && <span className="notice-pill">{notice}</span>}
          </div>
        </div>

        <div className="map-card">
          <div ref={mapRef} className="map" />
          {loading && (
            <div className="map-overlay">
              <div className="spinner" />
              <p>Loading nearby tourist places...</p>
            </div>
          )}
        </div>
      </section>

      <PlacesSidebar
        loading={loading}
        error={error}
        places={filteredPlaces}
        query={query}
        onQueryChange={setQuery}
        type={type}
        onTypeChange={setType}
        sortMode={sortMode}
        onSortModeChange={setSortMode}
        categoryOptions={categoryOptions}
        sortOptions={sortOptions}
        heading={resultHeading}
        selectedId={selectedId}
        onPlaceSelect={selectPlace}
        placeExtras={placeExtras}
      />
    </div>
  );
}
