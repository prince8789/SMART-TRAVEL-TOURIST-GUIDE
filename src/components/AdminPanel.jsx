import React, { useEffect, useState } from 'react';
import { adminApi } from '../api/adminApi.js';

export function AdminPanel({ token, onLogout }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ placeName: '', lat: '', lng: '', images: '', customDescription: '', customOpeningHours: '' });
  const load = async () => setItems(await adminApi.list(token));
  useEffect(() => { load(); }, []);
  const save = async (e) => {
    e.preventDefault();
    await adminApi.save(token, { ...form, lat: Number(form.lat), lng: Number(form.lng), images: form.images.split(',').map(s => s.trim()).filter(Boolean) });
    setForm({ placeName: '', lat: '', lng: '', images: '', customDescription: '', customOpeningHours: '' });
    load();
  };
  return <div className="admin-panel"><button onClick={onLogout}>Logout</button><form onSubmit={save}><input placeholder="Place name" value={form.placeName} onChange={e => setForm({ ...form, placeName: e.target.value })} /><input placeholder="Latitude" value={form.lat} onChange={e => setForm({ ...form, lat: e.target.value })} /><input placeholder="Longitude" value={form.lng} onChange={e => setForm({ ...form, lng: e.target.value })} /><input placeholder="Image URLs comma separated" value={form.images} onChange={e => setForm({ ...form, images: e.target.value })} /><input placeholder="Description" value={form.customDescription} onChange={e => setForm({ ...form, customDescription: e.target.value })} /><input placeholder="Opening hours" value={form.customOpeningHours} onChange={e => setForm({ ...form, customOpeningHours: e.target.value })} /><button>Save</button></form><div>{items.map(item => <div key={item._id}><strong>{item.placeName}</strong><button onClick={async () => { await adminApi.remove(token, item._id); load(); }}>Delete</button></div>)}</div></div>;
}

