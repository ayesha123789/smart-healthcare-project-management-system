import Risk from '../models/Risk.js';

export const getRisks = async (req, res) => {
  try {
    const { category, status } = req.query;
    let filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    const risks = await Risk.find(filter).sort({ riskScore: -1 });
    res.json({ success: true, count: risks.length, data: risks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createRisk = async (req, res) => {
  try {
    const { riskId, title, description, likelihood, impact, failureMode, preventiveAction, contingencyPlan, owner } = req.body;
    if (!title || !description || !preventiveAction || !contingencyPlan) {
      return res.status(400).json({ success: false, message: 'Title, description, preventive action, and contingency plan are required' });
    }
    const risk = new Risk({
      riskId: riskId || `RSK-${Date.now().toString().slice(-4)}`,
      title,
      description,
      likelihood: Number(likelihood) || 3,
      impact: Number(impact) || 3,
      failureMode: failureMode || '',
      preventiveAction,
      contingencyPlan,
      owner: owner || 'Project Manager',
      status: 'Active'
    });
    await risk.save();
    res.status(201).json({ success: true, data: risk });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateRisk = async (req, res) => {
  try {
    const { id } = req.params;
    const { likelihood, impact } = req.body;

    const risk = await Risk.findById(id);
    if (!risk) return res.status(404).json({ success: false, message: 'Risk not found' });

    Object.assign(risk, req.body);
    if (likelihood !== undefined || impact !== undefined) {
      risk.riskScore = risk.likelihood * risk.impact;
      if (risk.riskScore >= 15) risk.category = 'High';
      else if (risk.riskScore >= 6) risk.category = 'Medium';
      else risk.category = 'Low';
    }

    await risk.save();
    res.json({ success: true, data: risk });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteRisk = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Risk.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Risk not found' });
    res.json({ success: true, message: 'Risk deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
