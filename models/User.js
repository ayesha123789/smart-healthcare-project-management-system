import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { 
    type: String, 
    required: true,
    enum: [
      'Project Manager',
      'Backend Developer',
      'Frontend Developer',
      'Database Developer',
      'QA Engineer',
      'Stakeholder'
    ]
  },
  responsibilities: { type: String, default: '' },
  avatarUrl: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
