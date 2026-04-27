import { v4 as uuid } from 'uuid';
import GameRoom from '../models/GameRoom.js';

const code = () => uuid().slice(0, 6).toUpperCase();

export const createRoom = async (req, res) => {
  const { mode = 'classic', theme = 'emojis', maxPlayers = 4 } = req.body;
  const room = await GameRoom.create({
    code: code(),
    mode,
    theme,
    maxPlayers,
    players: [{ userId: req.user.id, username: req.user.username }]
  });
  res.status(201).json(room);
};

export const joinRoom = async (req, res) => {
  const room = await GameRoom.findOne({ code: req.body.code });
  if (!room) return res.status(404).json({ message: 'Room not found' });
  if (room.players.find((p) => p.username === req.user.username)) return res.json(room);
  if (room.players.length >= room.maxPlayers) return res.status(400).json({ message: 'Room full' });
  room.players.push({ userId: req.user.id, username: req.user.username });
  await room.save();
  res.json(room);
};

export const getRoom = async (req, res) => {
  const room = await GameRoom.findOne({ code: req.params.code });
  if (!room) return res.status(404).json({ message: 'Room not found' });
  res.json(room);
};
