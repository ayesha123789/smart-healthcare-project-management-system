import Requirement from '../models/Requirement.js';

export const getRequirements = async (req, res) => {
  try {
    const { status, approvedOnly } = req.query;
    let filter = {};
    if (approvedOnly === 'true') {
      filter.status = 'Approved';
    } else if (status) {
      filter.status = status;
    }
    const requirements = await Requirement.find(filter).sort({ reqId: 1 });
    res.json({ success: true, count: requirements.length, data: requirements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createRequirement = async (req, res) => {
  try {
    const { reqId, title, description, category, priority, estimatedCost, estimatedDuration } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Requirement title cannot be empty' });
    }
    if (estimatedCost < 0) {
      return res.status(400).json({ success: false, message: 'Estimated cost cannot be negative' });
    }
    const requirement = new Requirement({
      reqId: reqId || `REQ-${Date.now().toString().slice(-4)}`,
      title,
      description,
      category,
      priority: priority || 'Medium',
      estimatedCost: Number(estimatedCost) || 0,
      estimatedDuration: estimatedDuration || '2 weeks',
      status: 'Pending' // Mandatory: defaults to Pending until formally approved
    });
    await requirement.save();
    res.status(201).json({ success: true, data: requirement });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateRequirement = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Requirement.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Requirement not found' });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateApprovalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body; // 'Approved' or 'Rejected' or 'Pending'
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid approval status' });
    }
    const requirement = await Requirement.findById(id);
    if (!requirement) return res.status(404).json({ success: false, message: 'Requirement not found' });

    requirement.status = status;
    if (status === 'Approved') {
      requirement.approvalDate = new Date();
    } else {
      requirement.approvalDate = null;
    }
    if (remarks) requirement.remarks = remarks;

    await requirement.save();
    res.json({ 
      success: true, 
      message: `Requirement ${status === 'Approved' ? 'approved into Scope Baseline' : status.toLowerCase()}`, 
      data: requirement 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteRequirement = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Requirement.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Requirement not found' });
    res.json({ success: true, message: 'Requirement deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
