import mongoose from 'mongoose';

const themeSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true },
    cards: [String],
    isCustom: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export default mongoose.model('Theme', themeSchema);
