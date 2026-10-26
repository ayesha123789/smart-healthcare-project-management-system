import User from '../models/User.js';
import Milestone from '../models/Milestone.js';

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ role: 1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getMilestones = async (req, res) => {
  try {
    const milestones = await Milestone.find().sort({ targetWeek: 1 });
    res.json({ success: true, count: milestones.length, data: milestones });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMilestone = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Milestone.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Milestone not found' });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
