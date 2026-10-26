import mongoose from 'mongoose';

const qualityChecklistSchema = new mongoose.Schema({
  itemCode: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  standard: { type: String, default: 'ISO/IEC 25010 Software Quality Standards' },
  responsibleRole: { type: String, default: 'QA Engineer' },
  status: { 
    type: String, 
    enum: ['Pending', 'Passed', 'Failed'],
    default: 'Pending' 
  },
  verifiedDate: { type: Date },
  remarks: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('QualityChecklist', qualityChecklistSchema);
