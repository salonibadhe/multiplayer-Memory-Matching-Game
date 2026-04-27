import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import Card from '../components/Card';
import Scoreboard from '../components/Scoreboard';
import ChatBox from '../components/ChatBox';
import WinnerModal from '../components/WinnerModal';
import { useAuth } from '../context/AuthContext';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

export default function GameBoardPage() {
  const { roomCode } = useParams();
  const { user } = useAuth();
  const [game, setGame] = useState(null);
  const [messages, setMessages] = useState([]);
  const [winner, setWinner] = useState('');
  const [reaction, setReaction] = useState('');

  useEffect(() => {
    socket.emit('room:join', { roomCode, username: user.username });

    socket.on('game:update', setGame);
    socket.on('game:finished', ({ winner: w }) => setWinner(w));
    socket.on('chat:new', (m) => setMessages((prev) => [...prev, m]));
    socket.on('reaction:new', ({ user: u, emoji }) => {
      setReaction(`${u}: ${emoji}`);
      setTimeout(() => setReaction(''), 1600);
    });

    return () => {
      socket.off('game:update');
      socket.off('game:finished');
      socket.off('chat:new');
      socket.off('reaction:new');
    };
  }, [roomCode, user.username]);

  const meTurn = useMemo(
    () => game?.players?.[game.turnIndex]?.username === user.username,
    [game, user.username]
  );

  if (!game) return <main className="panel">Loading room {roomCode}...</main>;

  return (
    <main className="grid game-layout">
      <section className="panel">
        <h2>Room: {roomCode}</h2>
        <p>{meTurn ? 'Your turn' : `Waiting for ${game.players[game.turnIndex]?.username}`}</p>
        {reaction && <p className="reaction-toast">{reaction}</p>}
        <div className="deck">
          {game.deck.map((card) => (
            <Card
              key={card.id}
              card={card}
              isFlipped={game.flipped.includes(card.id)}
              onClick={() => socket.emit('game:flip', { roomCode, cardId: card.id, username: user.username })}
            />
          ))}
        </div>
      </section>
      <Scoreboard
        players={game.players}
        turnIndex={game.turnIndex}
        turnTimeLeft={game.turnTimeLeft}
        totalTimeLeft={game.totalTimeLeft}
      />
      <ChatBox
        messages={messages}
        onSend={(text) => socket.emit('chat:send', { roomCode, user: user.username, text })}
        onReaction={(emoji) => socket.emit('reaction:send', { roomCode, user: user.username, emoji })}
      />
      <WinnerModal winner={winner} onRestart={() => socket.emit('game:restart', { roomCode })} />
    </main>
  );
}
