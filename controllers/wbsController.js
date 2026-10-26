import WbsItem from '../models/WbsItem.js';

export const getWbsItems = async (req, res) => {
  try {
    const items = await WbsItem.find().sort({ code: 1 });
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createWbsItem = async (req, res) => {
  try {
    const { code, name, parentCode, level, category, estimatedCost, estimatedDuration, isChangeRequestItem } = req.body;
    if (!code || !name) {
      return res.status(400).json({ success: false, message: 'WBS code and name are required' });
    }
    const existing = await WbsItem.findOne({ code });
    if (existing) {
      return res.status(400).json({ success: false, message: `WBS item code ${code} already exists` });
    }
    const item = new WbsItem({
      code,
      name,
      parentCode: parentCode || null,
      level: level || 1,
      category: category || 'Development',
      estimatedCost: Number(estimatedCost) || 0,
      estimatedDuration: estimatedDuration || '1 week',
      isChangeRequestItem: !!isChangeRequestItem
    });
    await item.save();
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateWbsItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await WbsItem.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'WBS item not found' });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteWbsItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await WbsItem.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'WBS item not found' });
    res.json({ success: true, message: 'WBS item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
