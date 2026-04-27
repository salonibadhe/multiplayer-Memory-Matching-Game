import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
    username: String,
    rating: { type: Number, default: 1000 },
    bestScore: { type: Number, default: 0 },
    matchesPlayed: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Leaderboard', leaderboardSchema);
