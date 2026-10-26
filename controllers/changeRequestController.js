import ChangeRequest from '../models/ChangeRequest.js';
import Project from '../models/Project.js';
import WbsItem from '../models/WbsItem.js';
import Task from '../models/Task.js';

// Helper to recalculate project baseline based on approved CRs
const syncProjectWithApprovedChanges = async () => {
  const project = await Project.findOne();
  if (!project) return null;

  const approvedCRs = await ChangeRequest.find({ status: 'Approved' });
  const additionalCostSum = approvedCRs.reduce((sum, cr) => sum + (cr.additionalCost || 0), 0);
  const additionalDurationSum = approvedCRs.reduce((sum, cr) => sum + (cr.additionalDurationWeeks || 0), 0);

  project.revisedBudget = project.baselineBudget + additionalCostSum;
  project.revisedDurationWeeks = project.baselineDurationWeeks + additionalDurationSum;
  await project.save();
  return project;
};

export const getChangeRequests = async (req, res) => {
  try {
    const changeRequests = await ChangeRequest.find().sort({ createdAt: -1 });
    res.json({ success: true, count: changeRequests.length, data: changeRequests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createChangeRequest = async (req, res) => {
  try {
    const { crId, title, description, requester, additionalCost, additionalDurationWeeks, impactScope, impactSchedule, impactBudget } = req.body;
    if (!title || !description || !requester) {
      return res.status(400).json({ success: false, message: 'Title, description, and requester are required' });
    }
    if (additionalCost < 0 || additionalDurationWeeks < 0) {
      return res.status(400).json({ success: false, message: 'Cost and duration cannot be negative' });
    }
    const cr = new ChangeRequest({
      crId: crId || `CR-${Date.now().toString().slice(-4)}`,
      title,
      description,
      requester,
      additionalCost: Number(additionalCost) || 0,
      additionalDurationWeeks: Number(additionalDurationWeeks) || 0,
      impactScope: impactScope || 'Expands functional scope',
      impactSchedule: impactSchedule || `Increases duration by ${additionalDurationWeeks || 0} weeks`,
      impactBudget: impactBudget || `Increases budget by PKR ${additionalCost || 0}`,
      status: 'Pending' // Mandatory: unapproved changes do not affect baseline
    });
    await cr.save();
    res.status(201).json({ success: true, data: cr });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const approveChangeRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { remarks } = req.body;
    const cr = await ChangeRequest.findById(id);
    if (!cr) return res.status(404).json({ success: false, message: 'Change Request not found' });

    cr.status = 'Approved';
    cr.approvalDate = new Date();
    if (remarks) cr.remarks = remarks;
    await cr.save();

    // Recalculate Project Revised Budget & Duration
    const updatedProject = await syncProjectWithApprovedChanges();

    // Inject corresponding WBS item if it doesn't already exist
    const wbsCode = `CR-${cr.crId}`;
    const existingWbs = await WbsItem.findOne({ code: wbsCode });
    if (!existingWbs) {
      await WbsItem.create({
        code: wbsCode,
        name: `[Approved Change] ${cr.title}`,
        parentCode: '3.0', // Under Development
        level: 2,
        category: 'Change Request',
        estimatedCost: cr.additionalCost,
        estimatedDuration: `${cr.additionalDurationWeeks} weeks`,
        isChangeRequestItem: true
      });
    }

    // Inject task into Task schedule
    const taskId = `TSK-${cr.crId}`;
    const existingTask = await Task.findOne({ taskId });
    if (!existingTask) {
      const startDate = new Date('2026-10-15');
      const endDate = new Date(startDate.getTime() + (cr.additionalDurationWeeks * 7 * 24 * 60 * 60 * 1000));
      await Task.create({
        taskId,
        name: `Implement ${cr.title}`,
        description: cr.description,
        startDate,
        endDate,
        durationDays: cr.additionalDurationWeeks * 7,
        priority: 'High',
        progress: 0,
        plannedCost: cr.additionalCost,
        actualCost: 0,
        status: 'Not Started',
        isChangeRequestTask: true,
        moduleCategory: 'Change Management'
      });
    }

    res.json({ 
      success: true, 
      message: `Change request ${cr.crId} approved. Revised budget: PKR ${updatedProject.revisedBudget.toLocaleString()}, Revised duration: ${updatedProject.revisedDurationWeeks} weeks.`,
      data: cr,
      project: updatedProject 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const rejectChangeRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { remarks } = req.body;
    const cr = await ChangeRequest.findById(id);
    if (!cr) return res.status(404).json({ success: false, message: 'Change Request not found' });

    cr.status = 'Rejected';
    cr.approvalDate = null;
    if (remarks) cr.remarks = remarks;
    await cr.save();

    // Recalculate Project Revised Budget & Duration (unaffected baseline)
    const updatedProject = await syncProjectWithApprovedChanges();

    // Remove or disable any created CR task or WBS item
    const wbsCode = `CR-${cr.crId}`;
    await WbsItem.deleteOne({ code: wbsCode });
    const taskId = `TSK-${cr.crId}`;
    await Task.deleteOne({ taskId });

    res.json({ 
      success: true, 
      message: `Change request ${cr.crId} rejected. Baseline budget and duration remain unchanged.`,
      data: cr,
      project: updatedProject 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
