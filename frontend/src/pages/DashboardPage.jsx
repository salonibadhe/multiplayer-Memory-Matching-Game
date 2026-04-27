import { Link } from 'react-router-dom';

export default function DashboardPage() {
  return (
    <main className="grid two">
      <section className="panel">
        <h2>Play with Friends</h2>
        <p>Create a room and share code for 2-4 players.</p>
        <Link className="btn" to="/create-room">Create Room</Link>
      </section>
      <section className="panel">
        <h2>Join Existing Room</h2>
        <p>Use invitation code to jump in instantly.</p>
        <Link className="btn" to="/join-room">Join Room</Link>
      </section>
    </main>
  );
}
