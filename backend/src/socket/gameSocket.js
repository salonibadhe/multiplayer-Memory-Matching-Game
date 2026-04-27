import GameRoom from '../models/GameRoom.js';
import MatchHistory from '../models/MatchHistory.js';
import Leaderboard from '../models/Leaderboard.js';
import User from '../models/User.js';
import { buildInitialState, isFinished, nextTurn, scoreDelta } from '../services/gameEngine.js';

const liveGames = new Map();

const broadcast = (io, roomCode) => io.to(roomCode).emit('game:update', liveGames.get(roomCode));

const botPlay = (io, roomCode) => {
  const game = liveGames.get(roomCode);
  if (!game) return;
  const player = game.players[game.turnIndex];
  if (!player?.isBot) return;

  const hidden = game.deck.filter((c) => !c.matched && !game.flipped.includes(c.id));
  if (hidden.length < 2) return;
  const pick = hidden.sort(() => Math.random() - 0.5).slice(0, 2).map((c) => c.id);
  game.flipped = pick;
  const [a, b] = pick.map((id) => game.deck[id]);
  const match = a.symbol === b.symbol;

  setTimeout(() => {
    if (match) {
      a.matched = true;
      b.matched = true;
      player.score += 10;
    } else {
      player.score += scoreDelta(game.mode, false);
      nextTurn(game);
    }
    game.flipped = [];
    if (isFinished(game)) finishGame(io, roomCode);
    else broadcast(io, roomCode);
  }, 1200);
};

const finishGame = async (io, roomCode) => {
  const game = liveGames.get(roomCode);
  if (!game) return;
  game.status = 'finished';
  const sorted = [...game.players].sort((a, b) => b.score - a.score);
  const winner = sorted[0]?.username ?? 'No winner';
  await MatchHistory.create({
    roomCode,
    mode: game.mode,
    theme: game.theme,
    players: game.players,
    winner,
    startedAt: new Date(Date.now() - 1),
    endedAt: new Date()
  });

  for (const p of game.players.filter((x) => !x.isBot)) {
    const user = await User.findOne({ username: p.username });
    if (!user) continue;
    user.totalScore += p.score;
    if (p.username === winner) user.wins += 1;
    else user.losses += 1;
    await user.save();

    await Leaderboard.findOneAndUpdate(
      { userId: user._id },
      {
        $set: { username: user.username },
        $max: { bestScore: p.score },
        $inc: { matchesPlayed: 1, rating: p.username === winner ? 15 : -5 }
      },
      { upsert: true }
    );
  }

  io.to(roomCode).emit('game:finished', { winner, players: sorted });
  broadcast(io, roomCode);
};

export const registerGameSocket = (io, socket) => {
  socket.on('room:join', async ({ roomCode, username }) => {
    const room = await GameRoom.findOne({ code: roomCode });
    if (!room) return socket.emit('error:message', 'Room not found');
    socket.join(roomCode);

    if (room.players.length === 1) {
      room.players.push({ username: 'MindBot', isBot: true, score: 0 });
      await room.save();
    }

    if (!liveGames.has(roomCode)) {
      liveGames.set(roomCode, buildInitialState(room));
    }

    io.to(roomCode).emit('room:players', liveGames.get(roomCode).players);
    socket.emit('chat:system', `${username} joined ${roomCode}`);
    broadcast(io, roomCode);
    botPlay(io, roomCode);
  });

  socket.on('game:flip', ({ roomCode, cardId, username }) => {
    const game = liveGames.get(roomCode);
    if (!game || game.status !== 'active') return;
    const player = game.players[game.turnIndex];
    if (player.username !== username) return;

    const card = game.deck[cardId];
    if (!card || card.matched || game.flipped.includes(cardId)) return;
    game.flipped.push(cardId);

    if (game.flipped.length === 2) {
      const [a, b] = game.flipped.map((id) => game.deck[id]);
      const match = a.symbol === b.symbol;
      if (match) {
        a.matched = true;
        b.matched = true;
        player.score += scoreDelta(game.mode, true);
        game.flipped = [];
      } else {
        player.score += scoreDelta(game.mode, false);
        setTimeout(() => {
          nextTurn(game);
          broadcast(io, roomCode);
          botPlay(io, roomCode);
        }, 900);
      }
    }

    if (isFinished(game)) finishGame(io, roomCode);
    else broadcast(io, roomCode);
  });

  socket.on('chat:send', ({ roomCode, user, text }) => {
    const game = liveGames.get(roomCode);
    if (!game) return;
    game.chat.push({ user, text, at: Date.now() });
    io.to(roomCode).emit('chat:new', { user, text });
  });

  socket.on('reaction:send', ({ roomCode, user, emoji }) => {
    const game = liveGames.get(roomCode);
    if (!game) return;
    game.reactions.push({ user, emoji, at: Date.now() });
    io.to(roomCode).emit('reaction:new', { user, emoji });
  });

  socket.on('game:restart', ({ roomCode }) => {
    const game = liveGames.get(roomCode);
    if (!game) return;
    game.deck.forEach((c) => {
      c.matched = false;
    });
    game.deck.sort(() => Math.random() - 0.5);
    game.players.forEach((p) => (p.score = 0));
    game.turnIndex = 0;
    game.status = 'active';
    broadcast(io, roomCode);
  });
};

export const startGameTicker = (io) => {
  setInterval(() => {
    for (const [roomCode, game] of liveGames.entries()) {
      if (game.status !== 'active') continue;
      game.turnTimeLeft -= 1;
      if (game.totalTimeLeft !== null) game.totalTimeLeft -= 1;
      if (game.turnTimeLeft <= 0) {
        nextTurn(game);
        botPlay(io, roomCode);
      }
      if (isFinished(game)) finishGame(io, roomCode);
      else broadcast(io, roomCode);
    }
  }, 1000);
};
