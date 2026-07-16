import React, { useState } from 'react';
import { chatbotApi } from '../api/chatbotApi.js';

export function ChatbotWidget({ token }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Ask me about travel or the app.' }]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next = [...messages, { role: 'user', text: trimmed }];
    setMessages(next);
    setText('');
    setLoading(true);
    try {
      const res = await chatbotApi.ask(token, { message: trimmed });
      setMessages([...next, { role: 'assistant', text: res.ok ? res.reply : res.message || 'Sorry, I could not generate a reply.' }]);
    } catch {
      setMessages([...next, { role: 'assistant', text: 'I am here, but the chat service is offline. You can still ask about routes, history, favorites, or password help.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-widget">
      {open && (
        <div className="chat-box">
          <div className="chat-title">
            <strong>Travel assistant</strong>
            <button className="icon-btn" type="button" onClick={() => setOpen(false)}>Close</button>
          </div>
          <div className="chat-log">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={message.role}>{message.text}</div>
            ))}
          </div>
          <div className="chat-compose">
            <input value={text} placeholder="Ask about places, routes, or the app" onChange={(event) => setText(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && send()} />
            <button className="primary-btn" onClick={send} disabled={loading}>{loading ? '...' : 'Send'}</button>
          </div>
        </div>
      )}
      <button className="chat-launcher" onClick={() => setOpen((value) => !value)} aria-label="Open travel assistant">
        <span className="assistant-icon" aria-hidden="true">
          <svg viewBox="0 0 48 48" role="img" focusable="false">
            <path className="assistant-bubble" d="M10 13.5C10 8.8 13.8 5 18.5 5h11C36.5 5 42 10.5 42 17.5v4C42 28.5 36.5 34 29.5 34h-7.2l-8.7 6.5c-1 .7-2.4 0-2.4-1.2V33C8.1 30.9 6 27.5 6 23.7v-2.2c0-3.2 1.6-6 4-8z" />
            <path className="assistant-route" d="M15 25.5c3.1-5.2 6.2-7.8 9.4-7.8 3.1 0 5.2 2.6 8.6 2.6 1.8 0 3.4-.7 5-2.1" />
            <circle className="assistant-pin" cx="16" cy="26" r="2.7" />
            <circle className="assistant-pin" cx="33.5" cy="20.2" r="2.7" />
            <path className="assistant-spark" d="M24 10.5l1.3 3 3.2 1.2-3.2 1.2-1.3 3-1.3-3-3.2-1.2 3.2-1.2 1.3-3z" />
          </svg>
        </span>
      </button>
    </div>
  );
}
