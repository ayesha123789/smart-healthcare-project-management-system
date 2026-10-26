import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  taskId: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: [true, 'Task name is required'], trim: true },
  description: { type: String, default: '' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  durationDays: { type: Number, required: true, min: 1 },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedRole: { type: String, default: '' },
  dependencies: [{ type: String }], // Array of taskIds e.g. ['TSK-01']
  priority: { 
    type: String, 
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium' 
  },
  progress: { 
    type: Number, 
    default: 0, 
    min: [0, 'Progress cannot be less than 0'], 
    max: [100, 'Progress cannot exceed 100'] 
  },
  plannedCost: { 
    type: Number, 
    default: 0, 
    min: [0, 'Planned cost cannot be negative'] 
  },
  actualCost: { 
    type: Number, 
    default: 0, 
    min: [0, 'Actual cost cannot be negative'] 
  },
  status: { 
    type: String, 
    enum: ['Not Started', 'In Progress', 'Completed', 'Delayed', 'Blocked'],
    default: 'Not Started'
  },
  isChangeRequestTask: { type: Boolean, default: false },
  moduleCategory: { type: String, default: 'General' }
}, { timestamps: true });

// Pre-save hook for auto-delay detection if past end date and not completed
taskSchema.pre('save', function (next) {
  const today = new Date();
  if (this.status !== 'Completed' && this.endDate && new Date(this.endDate) < today) {
    if (this.progress < 100) {
      this.status = 'Delayed';
    }
  }
  next();
});

export default mongoose.model('Task', taskSchema);
