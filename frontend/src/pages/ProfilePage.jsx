import { useEffect, useState } from 'react';
import client from '../api/client';

export default function ProfilePage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    client.get('/profile').then((r) => setData(r.data));
  }, []);

  if (!data) return <main className="panel">Loading...</main>;

  return (
    <main className="grid two">
      <section className="panel">
        <h2>{data.user.username}</h2>
        <p>Wins: {data.user.wins} | Losses: {data.user.losses}</p>
        <p>Total Score: {data.user.totalScore}</p>
      </section>
      <section className="panel">
        <h3>Recent Matches</h3>
        {data.history.map((m) => <p key={m._id}>{m.roomCode} | Winner: {m.winner} | {m.mode}</p>)}
      </section>
    </main>
  );
}
