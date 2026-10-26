import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Clock, AlertTriangle, CheckCircle, ArrowRight, UserCheck, Trash2 } from 'lucide-react';
import { taskAPI, userAPI } from '../services/api';

const ScheduleTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTask, setEditTask] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    assignedTo: '',
    dependencies: '',
    priority: 'Medium',
    plannedCost: 350000
  });

  const fetchTasksAndUsers = async () => {
    try {
      setLoading(true);
      const [taskRes, userRes] = await Promise.all([
        taskAPI.getAll(),
        userAPI.getAll()
      ]);
      setTasks(taskRes.data.data);
      setUsers(userRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasksAndUsers();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        dependencies: formData.dependencies ? formData.dependencies.split(',').map(s => s.trim()) : []
      };
      await taskAPI.create(payload);
      setShowAddModal(false);
      fetchTasksAndUsers();
    } catch (err) {
      alert('Error creating task: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleQuickUpdate = async (id, updates) => {
    try {
      await taskAPI.update(id, updates);
      fetchTasksAndUsers();
    } catch (err) {
      alert('Error updating task: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await taskAPI.delete(id);
      fetchTasksAndUsers();
    } catch (err) {
      alert('Error deleting task: ' + err.message);
    }
  };

  const delayedTasks = tasks.filter(t => t.status === 'Delayed');

  return (
    <div>
      {/* Auto-Delay Warning Notice */}
      {delayedTasks.length > 0 && (
        <div className="alert-banner alert-danger">
          <AlertTriangle size={20} style={{ flexShrink: 0 }} />
          <div>
            <strong>Automatic Delay Detection Triggered: </strong>
            {delayedTasks.length} task(s) have exceeded their planned completion date with progress &lt; 100%!
            Downstream dependent tasks may experience schedule slippage.
          </div>
        </div>
      )}

      {/* Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Schedule & Activity Management</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Work packages mapped across 16-week baseline with dependency tracking</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <Plus size={16} /> Create Task
        </button>
      </div>

      {/* Tasks Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Calendar size={20} color="#0284c7" />
            Project Schedule Activities ({tasks.length})
          </h3>
          <span className="badge badge-primary">
            {delayedTasks.length} Delayed / {tasks.filter(t => t.status === 'Completed').length} Completed
          </span>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading schedule activities...</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Task ID</th>
                  <th>Activity Name</th>
                  <th>Dates (Start - End)</th>
                  <th>Assignee</th>
                  <th>Predecessors</th>
                  <th>Progress</th>
                  <th>Planned / Actual Cost</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(t => (
                  <tr key={t._id} style={{ background: t.status === 'Delayed' ? '#fff5f5' : '#ffffff' }}>
                    <td style={{ fontWeight: 800, fontFamily: 'monospace' }}>{t.taskId}</td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{t.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.description}</div>
                    </td>
                    <td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                      <div>{new Date(t.startDate).toLocaleDateString()}</div>
                      <div style={{ color: '#64748b' }}>to {new Date(t.endDate).toLocaleDateString()}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t.assignedTo?.name || 'Unassigned'}</span>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{t.assignedTo?.role || t.assignedRole}</span>
                    </td>
                    <td>
                      {t.dependencies && t.dependencies.length > 0 ? (
                        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                          {t.dependencies.map((dep, idx) => (
                            <span key={idx} className="badge badge-purple" style={{ fontSize: '0.65rem' }}>
                              {dep}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>None</span>
                      )}
                    </td>
                    <td style={{ minWidth: '120px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                        <span>{t.progress}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={t.progress}
                        onChange={(e) => handleQuickUpdate(t._id, { progress: Number(e.target.value) })}
                        style={{ width: '100%', cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>
                      <div>P: <strong>PKR {t.plannedCost?.toLocaleString()}</strong></div>
                      <div style={{ color: t.actualCost > t.plannedCost ? '#dc2626' : '#166534' }}>
                        A: <strong>PKR {t.actualCost?.toLocaleString()}</strong>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        t.status === 'Completed' ? 'badge-success' :
                        t.status === 'Delayed' ? 'badge-danger' :
                        t.status === 'In Progress' ? 'badge-primary' : 'badge-gray'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        {t.status !== 'Completed' && (
                          <button
                            onClick={() => handleQuickUpdate(t._id, { progress: 100, status: 'Completed' })}
                            className="btn btn-sm btn-success"
                            title="Mark 100% Complete"
                          >
                            <CheckCircle size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(t._id)}
                          className="btn btn-sm btn-outline"
                          title="Delete task"
                        >
                          <Trash2 size={14} color="#ef4444" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem' }}>
              Create Schedule Activity
            </h3>
            <form onSubmit={handleCreateSubmit}>
              <div className="form-group">
                <label className="form-label">Task Name *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Doctor Roster Conflict Validation API"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Start Date *</label>
                  <input
                    type="date"
                    required
                    className="form-control"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date *</label>
                  <input
                    type="date"
                    required
                    className="form-control"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Assign to Team Member</label>
                  <select
                    className="form-control"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  >
                    <option value="">Select Team Member</option>
                    {users.map(u => (
                      <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Predecessors (comma-separated Task IDs)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. TSK-01, TSK-02"
                    value={formData.dependencies}
                    onChange={(e) => setFormData({ ...formData, dependencies: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Planned Cost (PKR)</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={formData.plannedCost}
                    onChange={(e) => setFormData({ ...formData, plannedCost: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-control"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleTasks;
