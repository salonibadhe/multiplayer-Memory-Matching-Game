import { useState } from 'react';

export default function ChatBox({ messages, onSend, onReaction }) {
  const [text, setText] = useState('');
  return (
    <section className="panel">
      <h3>Room Chat</h3>
      <div className="chat-scroll">
        {messages.map((m, i) => (
          <div key={i}><b>{m.user}:</b> {m.text}</div>
        ))}
      </div>
      <div className="row">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type message" />
        <button onClick={() => { if (text.trim()) onSend(text); setText(''); }}>Send</button>
      </div>
      <div className="row">
        {['🔥', '👏', '😮', '😂'].map((emoji) => (
          <button key={emoji} onClick={() => onReaction(emoji)}>{emoji}</button>
        ))}
      </div>
    </section>
  );
}
