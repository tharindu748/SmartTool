import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    seen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ✅ Check if model already exists
export default mongoose.models.Chat || mongoose.model('Chat', chatSchema);
