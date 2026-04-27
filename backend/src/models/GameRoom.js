import mongoose from 'mongoose';

const roomPlayerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: String,
    score: { type: Number, default: 0 },
    isBot: { type: Boolean, default: false }
  },
  { _id: false }
);

const gameRoomSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    mode: { type: String, enum: ['classic', 'time', 'survival', 'theme'], default: 'classic' },
    theme: { type: String, default: 'emojis' },
    status: { type: String, enum: ['waiting', 'active', 'finished'], default: 'waiting' },
    players: [roomPlayerSchema],
    maxPlayers: { type: Number, default: 4 },
    winner: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model('GameRoom', gameRoomSchema);
