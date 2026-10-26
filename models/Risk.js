import mongoose from 'mongoose';

const riskSchema = new mongoose.Schema({
  riskId: { type: String, required: true, unique: true },
  title: { type: String, required: [true, 'Risk title is required'] },
  description: { type: String, required: true },
  likelihood: { 
    type: Number, 
    required: true, 
    min: [1, 'Likelihood must be between 1 and 5'], 
    max: [5, 'Likelihood must be between 1 and 5'] 
  },
  impact: { 
    type: Number, 
    required: true, 
    min: [1, 'Impact must be between 1 and 5'], 
    max: [5, 'Impact must be between 1 and 5'] 
  },
  riskScore: { type: Number, default: 0 },
  category: { 
    type: String, 
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium' 
  },
  failureMode: { type: String, default: '' },
  preventiveAction: { type: String, required: true },
  contingencyPlan: { type: String, required: true },
  owner: { type: String, default: 'Project Manager' },
  status: { 
    type: String, 
    enum: ['Active', 'Mitigated', 'Closed'],
    default: 'Active' 
  }
}, { timestamps: true });

// Auto-calculate riskScore and category before save
riskSchema.pre('save', function (next) {
  this.riskScore = this.likelihood * this.impact;
  if (this.riskScore >= 15) {
    this.category = 'High';
  } else if (this.riskScore >= 6) {
    this.category = 'Medium';
  } else {
    this.category = 'Low';
  }
  next();
});

export default mongoose.model('Risk', riskSchema);
