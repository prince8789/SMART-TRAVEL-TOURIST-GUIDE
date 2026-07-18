import React, { useEffect, useRef, useState } from 'react';
import { chatbotApi } from '../api/chatbotApi.js';

const welcome = { role: 'assistant', text: 'Hi! I’m Compass, your AI travel companion. I can create trip plans, suggest places, explain routes, or help in an emergency.' };

export function ChatbotWidget({ token }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([welcome]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const logRef = useRef(null);
  const locationRef = useRef(null);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener('smarttravel:screen-interaction', close);
    return () => window.removeEventListener('smarttravel:screen-interaction', close);
  }, []);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading, open]);

  const getLocation = () => new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = { lat: position.coords.latitude, lng: position.coords.longitude };
        locationRef.current = location;
        resolve(location);
      },
      () => resolve(locationRef.current),
      { enableHighAccuracy: true, timeout: 7000, maximumAge: 120000 }
    );
  });

  const send = async () => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next = [...messages, { role: 'user', text: trimmed }];
    setMessages(next);
    setText('');
    setLoading(true);
    try {
      const location = await getLocation();
      const res = await chatbotApi.ask(token, { message: trimmed, location, history: messages.slice(-8) });
      setMessages([...next, { role: 'assistant', text: res.ok ? res.reply : res.message || 'Sorry, I could not generate a reply.' }]);
    } catch {
      setMessages([...next, { role: 'assistant', text: 'I could not reach the travel service. For an emergency, call 112 or 108 now.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-widget">
      {open && <div className="chat-box" role="dialog" aria-label="Compass travel assistant">
        <div className="chat-title"><div><strong>Compass AI</strong><small>Your travel companion</small></div><button className="icon-btn" type="button" onClick={() => setOpen(false)}>Minimize</button></div>
        <div className="chat-log" ref={logRef} aria-live="polite">
          {messages.map((message, index) => <div key={`${message.role}-${index}`} className={message.role}>{message.text}</div>)}
          {loading && <div className="assistant typing">Compass is thinking…</div>}
        </div>
        <div className="chat-compose">
          <input value={text} placeholder="Ask in any language…" onChange={(event) => setText(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') send(); }} />
          <button className="primary-btn" onClick={send} disabled={loading}>{loading ? '…' : 'Send'}</button>
        </div>
      </div>}
      <button className="chat-launcher" onClick={() => setOpen((value) => !value)} aria-label={open ? 'Minimize Compass AI' : 'Open Compass AI'}>
        <span className="assistant-icon" aria-hidden="true"><svg viewBox="0 0 64 64" focusable="false"><path className="orbit" d="M13 37c2 12 13 20 26 18 11-1 19-10 19-21 0-9-6-17-15-20"/><path className="bot" d="M19 28c0-8 6-14 14-14s14 6 14 14v12c0 7-6 12-14 12s-14-5-14-12V28z"/><path className="antenna" d="M33 14V8m0 0 4-3m-4 3-4-3"/><circle className="eye" cx="27" cy="33" r="3"/><circle className="eye" cx="39" cy="33" r="3"/><path className="smile" d="M27 42c4 3 7 3 11 0"/><path className="pin" d="M50 13c0-4 3-7 7-7s7 3 7 7c0 6-7 12-7 12s-7-6-7-12z"/><circle className="pin-dot" cx="57" cy="13" r="2"/></svg></span>
      </button>
    </div>
  );
}
