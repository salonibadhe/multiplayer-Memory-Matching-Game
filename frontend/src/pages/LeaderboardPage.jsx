import { useEffect, useState } from 'react';
import client from '../api/client';

export default function LeaderboardPage() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    client.get('/leaderboard').then((r) => setRows(r.data));
  }, []);

  return (
    <main className="panel">
      <h2>Global Leaderboard</h2>
      <table>
        <thead><tr><th>#</th><th>Player</th><th>Rating</th><th>Best</th><th>Matches</th></tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r._id}><td>{i + 1}</td><td>{r.username}</td><td>{r.rating}</td><td>{r.bestScore}</td><td>{r.matchesPlayed}</td></tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
