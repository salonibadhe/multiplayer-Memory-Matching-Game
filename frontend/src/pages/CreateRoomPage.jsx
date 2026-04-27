import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

export default function CreateRoomPage() {
  const [mode, setMode] = useState('classic');
  const [theme, setTheme] = useState('emojis');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const nav = useNavigate();

  const create = async () => {
    const { data } = await client.post('/rooms/create', { mode, theme, maxPlayers });
    nav(`/game/${data.code}`);
  };

  return (
    <main className="panel form-grid">
      <h2>Create Room</h2>
      <label>Mode
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="classic">Classic</option>
          <option value="time">Time Challenge</option>
          <option value="survival">Survival</option>
          <option value="theme">Theme</option>
        </select>
      </label>
      <label>Theme
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="animals">Animals</option>
          <option value="fruits">Fruits</option>
          <option value="marvel">Marvel</option>
          <option value="emojis">Emojis</option>
          <option value="anime">Anime</option>
        </select>
      </label>
      <label>Players
        <input type="number" min="2" max="4" value={maxPlayers} onChange={(e) => setMaxPlayers(+e.target.value)} />
      </label>
      <button onClick={create}>Create & Start</button>
    </main>
  );
}
