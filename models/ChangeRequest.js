import mongoose from 'mongoose';

const changeRequestSchema = new mongoose.Schema({
  crId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  requester: { type: String, required: true },
  additionalCost: { 
    type: Number, 
    required: true, 
    min: [0, 'Additional cost cannot be negative'] 
  },
  additionalDurationWeeks: { 
    type: Number, 
    required: true, 
    min: [0, 'Additional duration cannot be negative'] 
  },
  impactScope: { type: String, required: true },
  impactSchedule: { type: String, required: true },
  impactBudget: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },
  remarks: { type: String, default: '' },
  approvalDate: { type: Date }
}, { timestamps: true });

export default mongoose.model('ChangeRequest', changeRequestSchema);
