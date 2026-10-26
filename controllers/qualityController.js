import QualityChecklist from '../models/QualityChecklist.js';

export const getQualityChecklist = async (req, res) => {
  try {
    const items = await QualityChecklist.find().sort({ itemCode: 1 });
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateQualityItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;
    let updates = { status, remarks };
    if (status === 'Passed' || status === 'Failed') {
      updates.verifiedDate = new Date();
    }
    const updated = await QualityChecklist.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Checklist item not found' });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const createQualityItem = async (req, res) => {
  try {
    const item = new QualityChecklist(req.body);
    await item.save();
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
