import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <main className="hero">
      <h1>MindMatch Arena</h1>
      <p>Real-time multiplayer concentration game with neon style, chat, reactions, and AI bot support.</p>
      <div className="row">
        <Link className="btn" to="/auth">Start Playing</Link>
        <Link className="btn ghost" to="/leaderboard">View Leaderboard</Link>
      </div>
    </main>
  );
}
