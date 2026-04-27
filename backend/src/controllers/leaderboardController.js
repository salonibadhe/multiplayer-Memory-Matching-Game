import Leaderboard from '../models/Leaderboard.js';

export const getLeaderboard = async (_req, res) => {
  const rows = await Leaderboard.find().sort({ rating: -1, bestScore: -1 }).limit(100);
  res.json(rows);
};
