import Project from '../models/Project.js';
import User from '../models/User.js';

export const getProject = async (req, res) => {
  try {
    let project = await Project.findOne().populate('projectManager');
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    let project = await Project.findOne();
    if (!project) {
      project = new Project(req.body);
    } else {
      Object.assign(project, req.body);
    }
    await project.save();
    const updated = await Project.findById(project._id).populate('projectManager');
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const closeProject = async (req, res) => {
  try {
    const { closureSummary, lessonsLearned } = req.body;
    const project = await Project.findOne();
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    project.status = 'Closed';
    project.closureSummary = closureSummary || 'All 5 hospital nodes successfully operational.';
    if (lessonsLearned && Array.isArray(lessonsLearned)) {
      project.lessonsLearned = lessonsLearned;
    }
    await project.save();
    res.json({ success: true, message: 'Project officially marked as Closed', data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
