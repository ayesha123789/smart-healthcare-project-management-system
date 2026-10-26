import mongoose from 'mongoose';

const wbsItemSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // e.g. "1.0", "1.1", "3.1.1"
  name: { type: String, required: true },
  parentCode: { type: String, default: null },
  level: { type: Number, required: true, default: 1 },
  category: { type: String, required: true },
  estimatedCost: { type: Number, default: 0, min: 0 },
  estimatedDuration: { type: String, default: '1 week' },
  isChangeRequestItem: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('WbsItem', wbsItemSchema);
