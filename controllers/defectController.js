import Defect from '../models/Defect.js';

export const getDefects = async (req, res) => {
  try {
    const { severity, status, moduleArea } = req.query;
    let filter = {};
    if (severity) filter.severity = severity;
    if (status) filter.status = status;
    if (moduleArea) filter.moduleArea = moduleArea;

    const defects = await Defect.find(filter).populate('assignedTo').sort({ severity: 1, createdAt: -1 });
    res.json({ success: true, count: defects.length, data: defects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createDefect = async (req, res) => {
  try {
    const { defectId, title, description, moduleArea, severity, priority, assignedTo } = req.body;
    if (!title || !description || !moduleArea) {
      return res.status(400).json({ success: false, message: 'Title, description, and module area are required' });
    }
    const defect = new Defect({
      defectId: defectId || `DEF-${Date.now().toString().slice(-4)}`,
      title,
      description,
      moduleArea,
      severity: severity || 'Medium',
      priority: priority || 'P2 - Urgent',
      assignedTo: assignedTo || null,
      status: 'Open'
    });
    await defect.save();
    const populated = await Defect.findById(defect._id).populate('assignedTo');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateDefect = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolutionDetails } = req.body;
    
    let updates = { ...req.body };
    if (status === 'Closed' || status === 'Fixed') {
      updates.resolvedDate = new Date();
    }

    const updated = await Defect.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).populate('assignedTo');
    if (!updated) return res.status(404).json({ success: false, message: 'Defect not found' });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteDefect = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Defect.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Defect not found' });
    res.json({ success: true, message: 'Defect deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
