export default function Scoreboard({ players = [], turnIndex, turnTimeLeft, totalTimeLeft }) {
  return (
    <section className="panel">
      <h3>Scoreboard</h3>
      <p>Turn timer: {turnTimeLeft}s {totalTimeLeft !== null ? `| Mode timer: ${totalTimeLeft}s` : ''}</p>
      {players.map((p, i) => (
        <div key={p.username} className={i === turnIndex ? 'active-turn' : ''}>
          {p.username} {p.isBot ? '(AI)' : ''}: {p.score}
        </div>
      ))}
    </section>
  );
}
