import User from '../models/User.js';
import Theme from '../models/Theme.js';
import MatchHistory from '../models/MatchHistory.js';

export const getUsers = async (_req, res) => res.json(await User.find().select('-password'));

export const createTheme = async (req, res) => {
  const theme = await Theme.create({ ...req.body, createdBy: req.user.id, isCustom: true });
  res.status(201).json(theme);
};

export const getStats = async (_req, res) => {
  const [users, themes, games] = await Promise.all([
    User.countDocuments(),
    Theme.countDocuments(),
    MatchHistory.countDocuments()
  ]);
  res.json({ users, themes, games });
};
