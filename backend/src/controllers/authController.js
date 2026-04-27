import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Leaderboard from '../models/Leaderboard.js';
import { signToken } from '../utils/jwt.js';

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists) return res.status(400).json({ message: 'User exists' });

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hash });
  await Leaderboard.create({ userId: user._id, username: user.username });

  const token = signToken({ id: user._id, username: user.username, isAdmin: user.isAdmin });
  res.status(201).json({ token, user: { id: user._id, username: user.username, email: user.email } });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = signToken({ id: user._id, username: user.username, isAdmin: user.isAdmin });
  res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
};
