import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Bug, 
  Layers, 
  GitPullRequest,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { evmAPI, projectAPI, changeRequestAPI, defectAPI, milestoneAPI } from '../services/api';

const Dashboard = () => {
  const [evmData, setEvmData] = useState(null);
  const [project, setProject] = useState(null);
  const [changeRequests, setChangeRequests] = useState([]);
  const [defects, setDefects] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [evmRes, projRes, crRes, defRes, msRes] = await Promise.all([
        evmAPI.getMetrics(),
        projectAPI.get(),
        changeRequestAPI.getAll(),
        defectAPI.getAll(),
        milestoneAPI.getAll()
      ]);
      setEvmData(evmRes.data.data);
      setProject(projRes.data.data);
      setChangeRequests(crRes.data.data);
      setDefects(defRes.data.data);
      setMilestones(msRes.data.data);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading project management telemetry...</div>;
  }

  const pendingCRs = changeRequests.filter(cr => cr.status === 'Pending');
  const approvedCRs = changeRequests.filter(cr => cr.status === 'Approved');
  const criticalDefects = defects.filter(d => d.severity === 'Critical' && d.status !== 'Closed');

  // Chart Data
  const evmChartData = [
    { name: 'Planned Value (PV)', amount: evmData?.PV || 0, fill: '#0284c7' },
    { name: 'Earned Value (EV)', amount: evmData?.EV || 0, fill: '#10b981' },
    { name: 'Actual Cost (AC)', amount: evmData?.AC || 0, fill: '#f59e0b' }
  ];

  const taskStatusData = [
    { name: 'Completed', value: evmData?.completedTasks || 0, color: '#10b981' },
    { name: 'In Progress', value: evmData?.inProgressTasks || 0, color: '#0284c7' },
    { name: 'Delayed', value: evmData?.delayedTasks || 0, color: '#ef4444' },
    { name: 'Not Started', value: (evmData?.taskCount || 0) - (evmData?.completedTasks || 0) - (evmData?.inProgressTasks || 0) - (evmData?.delayedTasks || 0), color: '#94a3b8' }
  ];

  return (
    <div>
      {/* Automated Warnings Banner Section */}
      {evmData?.warnings && evmData.warnings.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          {evmData.warnings.map((w, idx) => (
            <div key={idx} className={`alert-banner ${w.type === 'DANGER' ? 'alert-danger' : 'alert-warning'}`}>
              <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>[System Alert: {w.code}]: </strong>
                {w.message}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Top KPI Cards (4 columns) */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="metric-box">
          <div className="metric-label">Approved Budget</div>
          <div className="metric-value">PKR {(evmData?.revisedBudget || 5000000).toLocaleString()}</div>
          <div className="metric-subtext" style={{ color: '#0284c7' }}>
            <span>Baseline: PKR {(evmData?.baselineBudget || 5000000).toLocaleString()}</span>
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-label">Actual Expenditure (AC)</div>
          <div className="metric-value" style={{ color: (evmData?.AC || 0) > (evmData?.EV || 0) ? '#dc2626' : '#10b981' }}>
            PKR {(evmData?.AC || 0).toLocaleString()}
          </div>
          <div className="metric-subtext" style={{ color: '#64748b' }}>
            <span>CV: PKR {(evmData?.CV || 0).toLocaleString()}</span>
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-label">Cost Index (CPI)</div>
          <div className="metric-value" style={{ color: (evmData?.CPI || 0) < 1 ? '#d97706' : '#10b981' }}>
            {evmData?.CPIDisplay || 'N/A'}
          </div>
          <div className="metric-subtext">
            {(evmData?.CPI || 0) < 1 ? (
              <span style={{ color: '#d97706' }}>Spend exceeds value earned</span>
            ) : (
              <span style={{ color: '#10b981' }}>Cost-effective performance</span>
            )}
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-label">Schedule Index (SPI)</div>
          <div className="metric-value" style={{ color: (evmData?.SPI || 0) < 1 ? '#ef4444' : '#10b981' }}>
            {evmData?.SPIDisplay || 'N/A'}
          </div>
          <div className="metric-subtext">
            {(evmData?.SPI || 0) < 1 ? (
              <span style={{ color: '#ef4444' }}>Lagging behind 16-wk plan</span>
            ) : (
              <span style={{ color: '#10b981' }}>On track with schedule</span>
            )}
          </div>
        </div>
      </div>

      {/* Progress & Secondary KPIs */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="metric-box">
          <div className="metric-label">Earned Value Progress</div>
          <div className="metric-value" style={{ color: '#0284c7' }}>{evmData?.overallProgressPercent || 0}%</div>
          <div style={{ background: '#e2e8f0', borderRadius: '999px', height: '6px', marginTop: '0.5rem', overflow: 'hidden' }}>
            <div style={{ background: '#0284c7', width: `${evmData?.overallProgressPercent || 0}%`, height: '100%' }}></div>
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-label">Delayed Tasks</div>
          <div className="metric-value" style={{ color: (evmData?.delayedTasks || 0) > 0 ? '#ef4444' : '#10b981' }}>
            {evmData?.delayedTasks || 0}
          </div>
          <div className="metric-subtext" style={{ color: '#64748b' }}>
            Out of {evmData?.taskCount || 0} scheduled tasks
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-label">Critical Open Defects</div>
          <div className="metric-value" style={{ color: criticalDefects.length > 0 ? '#ef4444' : '#10b981' }}>
            {criticalDefects.length}
          </div>
          <div className="metric-subtext" style={{ color: '#64748b' }}>
            Appointment & EMR modules
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-label">Change Requests (AI/App)</div>
          <div className="metric-value">
            <span style={{ color: '#f59e0b' }}>{pendingCRs.length} Pend</span> / <span style={{ color: '#10b981' }}>{approvedCRs.length} App</span>
          </div>
          <div className="metric-subtext" style={{ color: '#64748b' }}>
            Approved adds +PKR 800k & +3 wks
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid-2">
        {/* EVM Comparison Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <TrendingUp size={18} color="#0284c7" />
              EVM Financial Metrics (PV vs EV vs AC)
            </h3>
          </div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={evmChartData} margin={{ top: 10, right: 20, left: 20, bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(val) => `PKR ${(val / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(val) => [`PKR ${val.toLocaleString()}`, 'Amount']} />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                  {evmChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Breakdown Pie Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Layers size={18} color="#0284c7" />
              Task Execution Status Distribution
            </h3>
          </div>
          <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Milestone Trackers & Critical Issues */}
      <div className="grid-2">
        {/* Major Milestones */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Clock size={18} color="#0284c7" />
              Project Milestones (Target: 16 Weeks)
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {milestones.map(m => (
              <div key={m._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{m.milestoneId}: {m.title}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Target Week: Week {m.targetWeek} ({new Date(m.targetDate).toLocaleDateString()})</div>
                </div>
                <span className={`badge ${m.status === 'Achieved' ? 'badge-success' : m.status === 'In Progress' ? 'badge-primary' : m.status === 'Delayed' ? 'badge-danger' : 'badge-gray'}`}>
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Defect Spotlight */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ color: '#ef4444' }}>
              <Bug size={18} color="#ef4444" />
              Critical Blocker Defects (Appointments & Records)
            </h3>
          </div>
          {criticalDefects.length === 0 ? (
            <div style={{ color: '#10b981', textAlign: 'center', padding: '2rem' }}>
              <CheckCircle2 size={36} style={{ margin: '0 auto 0.5rem', display: 'block' }} />
              No critical defects open! Core healthcare workflows stable.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {criticalDefects.map(d => (
                <div key={d._id} style={{ padding: '0.85rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#991b1b' }}>{d.defectId}: {d.title}</span>
                    <span className="badge badge-danger">{d.severity}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#7f1d1d', marginBottom: '0.35rem' }}>{d.description}</div>
                  <div style={{ fontSize: '0.7rem', color: '#b91c1c', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Module: <strong>{d.moduleArea}</strong></span>
                    <span>Status: <strong>{d.status}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
