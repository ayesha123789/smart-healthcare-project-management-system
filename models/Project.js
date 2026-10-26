import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Project title is required'],
    trim: true 
  },
  description: { type: String, default: '' },
  objectives: [{ type: String }],
  hospitalsCount: { type: Number, default: 5 },
  baselineBudget: { 
    type: Number, 
    required: true, 
    default: 5000000,
    min: [0, 'Budget cannot be negative']
  },
  revisedBudget: { 
    type: Number, 
    default: 5000000,
    min: [0, 'Budget cannot be negative']
  },
  baselineDurationWeeks: { 
    type: Number, 
    required: true, 
    default: 16,
    min: [1, 'Duration must be at least 1 week']
  },
  revisedDurationWeeks: { 
    type: Number, 
    default: 16,
    min: [1, 'Duration must be at least 1 week']
  },
  startDate: { type: Date, default: () => new Date('2026-08-01') },
  plannedEndDate: { type: Date, default: () => new Date('2026-11-21') }, // 16 weeks later
  status: { 
    type: String, 
    enum: ['Initiation', 'Planning', 'Execution', 'Monitoring & Controlling', 'Closing', 'Closed'],
    default: 'Execution'
  },
  projectManager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  stakeholders: [{ type: String }],
  charterApproved: { type: Boolean, default: true },
  charterApprovalDate: { type: Date, default: () => new Date('2026-08-03') },
  closureSummary: { type: String, default: '' },
  lessonsLearned: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
