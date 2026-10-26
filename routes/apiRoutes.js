import express from 'express';
import { getProject, updateProject, closeProject } from '../controllers/projectController.js';
import { getUsers, createUser, getMilestones, updateMilestone } from '../controllers/userController.js';
import { getRequirements, createRequirement, updateRequirement, updateApprovalStatus, deleteRequirement } from '../controllers/requirementController.js';
import { getWbsItems, createWbsItem, updateWbsItem, deleteWbsItem } from '../controllers/wbsController.js';
import { getChangeRequests, createChangeRequest, approveChangeRequest, rejectChangeRequest } from '../controllers/changeRequestController.js';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController.js';
import { getEvmMetrics } from '../controllers/evmController.js';
import { getDefects, createDefect, updateDefect, deleteDefect } from '../controllers/defectController.js';
import { getQualityChecklist, createQualityItem, updateQualityItem } from '../controllers/qualityController.js';
import { getRisks, createRisk, updateRisk, deleteRisk } from '../controllers/riskController.js';
import { seedDatabase } from '../seedData.js';

const router = express.Router();

// Project Routes
router.get('/project', getProject);
router.put('/project', updateProject);
router.post('/project/close', closeProject);

// Users & Milestones
router.get('/users', getUsers);
router.post('/users', createUser);
router.get('/milestones', getMilestones);
router.put('/milestones/:id', updateMilestone);

// Requirements (Scope baseline gatekeeper)
router.get('/requirements', getRequirements);
router.post('/requirements', createRequirement);
router.put('/requirements/:id', updateRequirement);
router.patch('/requirements/:id/approval', updateApprovalStatus);
router.delete('/requirements/:id', deleteRequirement);

// WBS (Work Breakdown Structure)
router.get('/wbs', getWbsItems);
router.post('/wbs', createWbsItem);
router.put('/wbs/:id', updateWbsItem);
router.delete('/wbs/:id', deleteWbsItem);

// Change Requests (AI Module & Mobile App)
router.get('/change-requests', getChangeRequests);
router.post('/change-requests', createChangeRequest);
router.patch('/change-requests/:id/approve', approveChangeRequest);
router.patch('/change-requests/:id/reject', rejectChangeRequest);

// Tasks & Schedule (Auto-delay detection)
router.get('/tasks', getTasks);
router.post('/tasks', createTask);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

// Earned Value Management (EVM)
router.get('/evm', getEvmMetrics);

// Defects Tracking
router.get('/defects', getDefects);
router.post('/defects', createDefect);
router.put('/defects/:id', updateDefect);
router.delete('/defects/:id', deleteDefect);

// Quality Checklist
router.get('/quality', getQualityChecklist);
router.post('/quality', createQualityItem);
router.put('/quality/:id', updateQualityItem);

// Risks & 5x5 Matrix & PDPC
router.get('/risks', getRisks);
router.post('/risks', createRisk);
router.put('/risks/:id', updateRisk);
router.delete('/risks/:id', deleteRisk);

// One-Click Seed Endpoint for instant testing and demos
router.post('/seed', async (req, res) => {
  try {
    const result = await seedDatabase();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
