import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
  milestoneId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  targetWeek: { type: Number, required: true },
  targetDate: { type: Date, required: true },
  deliverable: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'Achieved', 'Delayed'],
    default: 'Pending'
  },
  achievedDate: { type: Date }
}, { timestamps: true });

export default mongoose.model('Milestone', milestoneSchema);
