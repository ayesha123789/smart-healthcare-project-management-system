import mongoose from 'mongoose';

const requirementSchema = new mongoose.Schema({
  reqId: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },
  title: { 
    type: String, 
    required: [true, 'Requirement title is required'],
    trim: true 
  },
  description: { type: String, default: '' },
  category: { 
    type: String, 
    required: true,
    enum: [
      'Patient Registration',
      'Electronic Medical Records (EMR)',
      'Online Appointments',
      'Laboratory Reports',
      'Doctor Schedules',
      'Online Consultations / Telemedicine',
      'Billing Management',
      'Security & Non-Functional'
    ]
  },
  priority: { 
    type: String, 
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  estimatedCost: { 
    type: Number, 
    default: 0,
    min: [0, 'Estimated cost cannot be negative']
  },
  estimatedDuration: { type: String, default: '2 weeks' },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  approvalDate: { type: Date },
  remarks: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Requirement', requirementSchema);
