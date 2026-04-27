import User from '../models/User.js';
import MatchHistory from '../models/MatchHistory.js';

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  const history = await MatchHistory.find({ 'players.username': user.username }).sort({ createdAt: -1 }).limit(20);
  res.json({ user, history });
};
