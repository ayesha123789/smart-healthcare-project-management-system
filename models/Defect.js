import mongoose from 'mongoose';

const defectSchema = new mongoose.Schema({
  defectId: { type: String, required: true, unique: true },
  title: { type: String, required: [true, 'Defect title is required'] },
  description: { type: String, required: true },
  moduleArea: { 
    type: String, 
    required: true,
    enum: [
      'Appointment Scheduling',
      'Patient Record Management',
      'Electronic Medical Records (EMR)',
      'Laboratory Reports',
      'Doctor Schedules',
      'Online Consultations / Telemedicine',
      'Billing Management',
      'System Architecture / Other'
    ]
  },
  severity: { 
    type: String, 
    enum: ['Critical', 'High', 'Medium', 'Low'],
    default: 'Medium' 
  },
  priority: { 
    type: String, 
    enum: ['P1 - Blocker', 'P2 - Urgent', 'P3 - Normal', 'P4 - Low'],
    default: 'P2 - Urgent' 
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reportedDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['Open', 'In Progress', 'Fixed', 'Retest', 'Closed'],
    default: 'Open' 
  },
  resolutionDetails: { type: String, default: '' },
  resolvedDate: { type: Date }
}, { timestamps: true });

export default mongoose.model('Defect', defectSchema);
