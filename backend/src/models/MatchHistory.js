import mongoose from 'mongoose';

const matchHistorySchema = new mongoose.Schema(
  {
    roomCode: String,
    mode: String,
    theme: String,
    players: [{ username: String, score: Number }],
    winner: String,
    startedAt: Date,
    endedAt: Date
  },
  { timestamps: true }
);

export default mongoose.model('MatchHistory', matchHistorySchema);
