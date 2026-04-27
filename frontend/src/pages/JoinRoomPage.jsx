import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

export default function JoinRoomPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const nav = useNavigate();

  const join = async () => {
    try {
      await client.post('/rooms/join', { code: code.toUpperCase() });
      nav(`/game/${code.toUpperCase()}`);
    } catch (e) {
      setError(e.response?.data?.message || 'Cannot join room');
    }
  };

  return (
    <main className="panel">
      <h2>Join Room</h2>
      <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Room Code" />
      <button onClick={join}>Join</button>
      {error && <p>{error}</p>}
    </main>
  );
}
