import Task from '../models/Task.js';

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo').sort({ startDate: 1 });
    
    // Check dynamic delay condition
    const today = new Date();
    let updatedAny = false;

    const analyzedTasks = tasks.map(task => {
      const isPastDue = task.endDate && new Date(task.endDate) < today;
      if (isPastDue && task.progress < 100 && task.status !== 'Delayed' && task.status !== 'Completed') {
        task.status = 'Delayed';
        updatedAny = true;
      }
      return task;
    });

    if (updatedAny) {
      // Save updated statuses in background
      for (const t of analyzedTasks) {
        if (t.status === 'Delayed') {
          await Task.findByIdAndUpdate(t._id, { status: 'Delayed' });
        }
      }
    }

    res.json({ success: true, count: analyzedTasks.length, data: analyzedTasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { taskId, name, description, startDate, endDate, durationDays, assignedTo, dependencies, priority, plannedCost } = req.body;
    
    if (!name || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Task name, start date, and end date are required' });
    }
    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ success: false, message: 'Start date cannot be after end date' });
    }
    if (plannedCost < 0) {
      return res.status(400).json({ success: false, message: 'Planned cost cannot be negative' });
    }

    const task = new Task({
      taskId: taskId || `TSK-${Date.now().toString().slice(-4)}`,
      name,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      durationDays: Number(durationDays) || Math.max(1, Math.round((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))),
      assignedTo: assignedTo || null,
      dependencies: Array.isArray(dependencies) ? dependencies : [],
      priority: priority || 'Medium',
      progress: 0,
      plannedCost: Number(plannedCost) || 0,
      actualCost: 0,
      status: 'Not Started'
    });

    await task.save();
    const populated = await Task.findById(task._id).populate('assignedTo');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { progress, actualCost, status, dependencies, taskId } = req.body;

    if (dependencies && taskId && dependencies.includes(taskId)) {
      return res.status(400).json({ success: false, message: 'A task cannot depend on itself' });
    }

    if (progress !== undefined && (progress < 0 || progress > 100)) {
      return res.status(400).json({ success: false, message: 'Progress must be between 0% and 100%' });
    }
    if (actualCost !== undefined && actualCost < 0) {
      return res.status(400).json({ success: false, message: 'Actual cost cannot be negative' });
    }

    const updated = await Task.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).populate('assignedTo');
    if (!updated) return res.status(404).json({ success: false, message: 'Task not found' });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Task.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
