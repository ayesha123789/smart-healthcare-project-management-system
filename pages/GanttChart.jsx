import React, { useState, useEffect } from 'react';
import { BarChart3, Calendar, AlertCircle } from 'lucide-react';
import { taskAPI } from '../services/api';

const GanttChart = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const res = await taskAPI.getAll();
        setTasks(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Generating Gantt timeline...</div>;

  // Timeline boundaries (July 2026 to November 2026 for 16-19 weeks)
  const startDate = new Date('2026-07-01').getTime();
  const endDate = new Date('2026-11-20').getTime();
  const totalDuration = endDate - startDate;

  const weeks = Array.from({ length: 18 }, (_, i) => `W${i + 1}`);

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <BarChart3 size={20} color="#0284c7" />
            Project Schedule Gantt Chart (16 Weeks Baseline Timeline)
          </h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span className="badge badge-success">Completed</span>
            <span className="badge badge-primary">In Progress</span>
            <span className="badge badge-danger">Delayed</span>
          </div>
        </div>

        <div style={{ overflowX: 'auto', background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ minWidth: '950px' }}>
            {/* Header Timeline Weeks */}
            <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', background: '#f8fafc', padding: '0.75rem 0' }}>
              <div style={{ width: '280px', paddingLeft: '1rem', fontWeight: 800, fontSize: '0.8rem', color: '#475569' }}>
                TASK ACTIVITY
              </div>
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(18, 1fr)', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
                {weeks.map((w, idx) => (
                  <div key={idx} style={{ borderLeft: '1px solid #f1f5f9' }}>{w}</div>
                ))}
              </div>
            </div>

            {/* Task Rows */}
            {tasks.map(task => {
              const taskStart = new Date(task.startDate).getTime();
              const taskEnd = new Date(task.endDate).getTime();

              const leftPercent = Math.max(0, Math.min(100, ((taskStart - startDate) / totalDuration) * 100));
              const widthPercent = Math.max(4, Math.min(100 - leftPercent, ((taskEnd - taskStart) / totalDuration) * 100));

              const isDelayed = task.status === 'Delayed';
              const isCompleted = task.status === 'Completed';

              return (
                <div 
                  key={task._id} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    padding: '0.65rem 0', 
                    borderBottom: '1px solid #f1f5f9',
                    background: isDelayed ? '#fff5f5' : '#ffffff'
                  }}
                >
                  {/* Task Label Column */}
                  <div style={{ width: '280px', paddingLeft: '1rem', paddingRight: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.75rem', fontFamily: 'monospace', color: '#0284c7' }}>
                        {task.taskId}
                      </span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {task.name}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', display: 'flex', gap: '0.5rem' }}>
                      <span>{task.progress}%</span>
                      <span>•</span>
                      <span>{task.status}</span>
                      {task.dependencies?.length > 0 && (
                        <span>• Dep: {task.dependencies.join(', ')}</span>
                      )}
                    </div>
                  </div>

                  {/* Gantt Bar Chart Column */}
                  <div style={{ flex: 1, position: 'relative', height: '28px', background: '#fafafa', borderLeft: '1px solid #e2e8f0' }}>
                    <div
                      style={{
                        position: 'absolute',
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                        height: '24px',
                        top: '2px',
                        borderRadius: '6px',
                        background: isDelayed ? '#ef4444' : isCompleted ? '#10b981' : '#0284c7',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 0.5rem',
                        color: '#ffffff',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        overflow: 'hidden'
                      }}
                      title={`${task.name}: ${task.progress}% (${new Date(task.startDate).toLocaleDateString()} - ${new Date(task.endDate).toLocaleDateString()})`}
                    >
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {task.progress}%
                      </span>
                      {isDelayed && <AlertCircle size={12} />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
