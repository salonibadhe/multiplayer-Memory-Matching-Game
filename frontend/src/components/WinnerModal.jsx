export default function WinnerModal({ winner, onRestart }) {
  if (!winner) return null;
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>🏆 Winner: {winner}</h2>
        <button onClick={onRestart}>Restart Match</button>
      </div>
    </div>
  );
}
