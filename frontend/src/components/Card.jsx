export default function Card({ card, isFlipped, onClick }) {
  return (
    <button className={`card ${isFlipped || card.matched ? 'flipped' : ''}`} onClick={onClick}>
      <div className="card-inner">
        <div className="card-face card-front">?</div>
        <div className="card-face card-back">{card.symbol}</div>
      </div>
    </button>
  );
}
