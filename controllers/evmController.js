import Project from '../models/Project.js';
import Task from '../models/Task.js';
import Defect from '../models/Defect.js';

export const getEvmMetrics = async (req, res) => {
  try {
    const project = await Project.findOne();
    const tasks = await Task.find();
    const criticalDefects = await Defect.countDocuments({ severity: 'Critical', status: { $ne: 'Closed' } });

    const BAC = project ? project.revisedBudget : 5000000;
    const today = new Date();

    let PV = 0;
    let EV = 0;
    let AC = 0;

    tasks.forEach(task => {
      const planned = task.plannedCost || 0;
      const actual = task.actualCost || 0;
      const progress = (task.progress || 0) / 100;

      // EV calculation: Planned Value earned based on verified progress
      EV += (planned * progress);
      AC += actual;

      // PV calculation: Scheduled work value based on timeline
      if (task.endDate && new Date(task.endDate) <= today) {
        PV += planned;
      } else if (task.startDate && new Date(task.startDate) <= today && task.endDate) {
        const totalDuration = new Date(task.endDate) - new Date(task.startDate);
        const elapsed = today - new Date(task.startDate);
        const ratio = totalDuration > 0 ? Math.min(1, Math.max(0, elapsed / totalDuration)) : 1;
        PV += (planned * ratio);
      }
    });

    PV = Math.round(PV);
    EV = Math.round(EV);
    AC = Math.round(AC);

    // Variances
    const CV = EV - AC;
    const SV = EV - PV;

    // Performance Indices with Zero-division safety
    let CPI = null;
    let CPIDisplay = 'N/A';
    if (AC > 0) {
      CPI = Number((EV / AC).toFixed(3));
      CPIDisplay = CPI.toFixed(2);
    }

    let SPI = null;
    let SPIDisplay = 'N/A';
    if (PV > 0) {
      SPI = Number((EV / PV).toFixed(3));
      SPIDisplay = SPI.toFixed(2);
    }

    // Forecasting
    let EAC = BAC;
    if (CPI && CPI > 0) {
      EAC = Math.round(BAC / CPI);
    }
    const ETC = Math.max(0, EAC - AC);
    const VAC = BAC - EAC;

    // Overall Progress %
    const totalPlanned = tasks.reduce((sum, t) => sum + (t.plannedCost || 0), 0);
    const overallProgressPercent = totalPlanned > 0 
      ? Number(((EV / totalPlanned) * 100).toFixed(1))
      : 0;

    // Automated Health Warnings
    const warnings = [];
    if (AC > BAC * 0.9) {
      warnings.push({
        type: 'DANGER',
        code: 'BUDGET_OVERRUN',
        message: `Actual cost (PKR ${AC.toLocaleString()}) has utilized over 90% of the approved budget (PKR ${BAC.toLocaleString()})!`
      });
    } else if (CPI !== null && CPI < 0.95) {
      warnings.push({
        type: 'WARNING',
        code: 'COST_INEFFICIENCY',
        message: `CPI is ${CPIDisplay} (< 1.0) indicating that project is spending faster than earning value!`
      });
    }

    if (SPI !== null && SPI < 0.92) {
      warnings.push({
        type: 'WARNING',
        code: 'SCHEDULE_DELAY',
        message: `SPI is ${SPIDisplay} (< 1.0) indicating development progress is lagging behind scheduled plan!`
      });
    }

    if (criticalDefects > 0) {
      warnings.push({
        type: 'DANGER',
        code: 'CRITICAL_DEFECTS',
        message: `${criticalDefects} critical open defect(s) unresolved in core healthcare modules!`
      });
    }

    res.json({
      success: true,
      data: {
        BAC,
        baselineBudget: project ? project.baselineBudget : 5000000,
        revisedBudget: BAC,
        PV,
        EV,
        AC,
        CV,
        SV,
        CPI,
        CPIDisplay,
        SPI,
        SPIDisplay,
        EAC,
        ETC,
        VAC,
        overallProgressPercent,
        warnings,
        taskCount: tasks.length,
        completedTasks: tasks.filter(t => t.status === 'Completed').length,
        delayedTasks: tasks.filter(t => t.status === 'Delayed').length,
        inProgressTasks: tasks.filter(t => t.status === 'In Progress').length,
        criticalDefectsCount: criticalDefects
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
