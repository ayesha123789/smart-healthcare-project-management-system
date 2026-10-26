import React, { useState, useEffect } from 'react';
import { Bug, Plus, AlertCircle, CheckCircle, ShieldAlert, Trash2 } from 'lucide-react';
import { defectAPI, userAPI } from '../services/api';

const DefectTracker = () => {
  const [defects, setDefects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editResolutionId, setEditResolutionId] = useState(null);
  const [resolutionText, setResolutionText] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    moduleArea: 'Appointment Scheduling',
    severity: 'Critical',
    priority: 'P1 - Blocker',
    assignedTo: ''
  });

  const fetchDefects = async () => {
    try {
      setLoading(true);
      const [defRes, userRes] = await Promise.all([
        defectAPI.getAll(),
        userAPI.getAll()
      ]);
      setDefects(defRes.data.data);
      setUsers(userRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDefects();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await defectAPI.update(id, { status });
      fetchDefects();
    } catch (err) {
      alert('Error updating defect status: ' + err.message);
    }
  };

  const handleSaveResolution = async (id) => {
    try {
      await defectAPI.update(id, { resolutionDetails: resolutionText, status: 'Fixed' });
      setEditResolutionId(null);
      setResolutionText('');
      fetchDefects();
    } catch (err) {
      alert('Error saving resolution: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this defect record?')) return;
    try {
      await defectAPI.delete(id);
      fetchDefects();
    } catch (err) {
      alert('Error deleting defect: ' + err.message);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await defectAPI.create(formData);
      setShowAddModal(false);
      setFormData({
        title: '',
        description: '',
        moduleArea: 'Appointment Scheduling',
        severity: 'Medium',
        priority: 'P2 - Urgent',
        assignedTo: ''
      });
      fetchDefects();
    } catch (err) {
      alert('Error logging defect: ' + (err.response?.data?.message || err.message));
    }
  };

  const criticalOpen = defects.filter(d => d.severity === 'Critical' && d.status !== 'Closed');

  return (
    <div>
      {/* Paper Highlight Banner */}
      <div className="alert-banner alert-danger">
        <ShieldAlert size={22} style={{ flexShrink: 0 }} />
        <div>
          <strong>Paper Quality Focus Areas: </strong>
          The paper identifies <strong>Appointment Scheduling</strong> (concurrency race conditions) and <strong>Patient Record Management</strong> (duplicate records across 5 hospitals) as critical quality bottlenecks.
          Currently, <strong>{criticalOpen.length} critical defect(s)</strong> are blocking final milestone deployment.
        </div>
      </div>

      {/* Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Software Defect Tracking & Bug Lifecycle</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>ISO/IEC 25010 Defect tracking across all 5 hospital software modules</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <Plus size={16} /> Log New Defect
        </button>
      </div>

      {/* Defects Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Bug size={20} color="#ef4444" />
            Defect Register ({defects.length})
          </h3>
          <span className="badge badge-danger">{criticalOpen.length} Critical Open</span>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading defect register...</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Defect ID</th>
                  <th>Title & Description</th>
                  <th>Module Area</th>
                  <th>Severity</th>
                  <th>Priority</th>
                  <th>Assignee</th>
                  <th>Status</th>
                  <th>Resolution / Root Cause</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {defects.map(d => (
                  <tr key={d._id} style={{ background: d.severity === 'Critical' && d.status !== 'Closed' ? '#fff5f5' : '#ffffff' }}>
                    <td style={{ fontWeight: 800, fontFamily: 'monospace' }}>{d.defectId}</td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{d.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', maxWidth: '320px' }}>{d.description}</div>
                    </td>
                    <td>
                      <span className="badge badge-gray">{d.moduleArea}</span>
                    </td>
                    <td>
                      <span className={`badge ${
                        d.severity === 'Critical' ? 'badge-danger' :
                        d.severity === 'High' ? 'badge-warning' :
                        d.severity === 'Medium' ? 'badge-primary' : 'badge-gray'
                      }`}>
                        {d.severity}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.75rem', fontWeight: 600 }}>{d.priority}</td>
                    <td>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{d.assignedTo?.name || 'Unassigned'}</span>
                    </td>
                    <td>
                      <select
                        className="form-control"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', width: 'auto' }}
                        value={d.status}
                        onChange={(e) => handleStatusChange(d._id, e.target.value)}
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Fixed">Fixed</option>
                        <option value="Retest">Retest</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td style={{ fontSize: '0.75rem', maxWidth: '240px' }}>
                      {d.resolutionDetails ? (
                        <div style={{ color: '#065f46' }}>{d.resolutionDetails}</div>
                      ) : (
                        <button
                          onClick={() => { setEditResolutionId(d._id); setResolutionText(''); }}
                          className="btn btn-sm btn-outline"
                          style={{ fontSize: '0.7rem' }}
                        >
                          Add Resolution
                        </button>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(d._id)}
                        className="btn btn-sm btn-outline"
                        title="Delete defect"
                      >
                        <Trash2 size={13} color="#ef4444" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Resolution Modal */}
      {editResolutionId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Add Defect Resolution Details
            </h3>
            <div className="form-group">
              <label className="form-label">Root Cause Analysis & Fix Summary:</label>
              <textarea
                className="form-control"
                rows="3"
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
                placeholder="Describe code changes, distributed locking added, or database unique indexes created..."
              ></textarea>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button onClick={() => setEditResolutionId(null)} className="btn btn-outline">Cancel</button>
              <button onClick={() => handleSaveResolution(editResolutionId)} className="btn btn-success">Save & Mark Fixed</button>
            </div>
          </div>
        </div>
      )}

      {/* Log Defect Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem' }}>
              Log Software Defect
            </h3>
            <form onSubmit={handleCreateSubmit}>
              <div className="form-group">
                <label className="form-label">Defect Title *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Appointment Slot Concurrency Conflict"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Reproduction Steps / Description *</label>
                <textarea
                  required
                  className="form-control"
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Module Area *</label>
                  <select
                    className="form-control"
                    value={formData.moduleArea}
                    onChange={(e) => setFormData({ ...formData, moduleArea: e.target.value })}
                  >
                    <option value="Appointment Scheduling">Appointment Scheduling</option>
                    <option value="Patient Record Management">Patient Record Management</option>
                    <option value="Electronic Medical Records (EMR)">Electronic Medical Records (EMR)</option>
                    <option value="Laboratory Reports">Laboratory Reports</option>
                    <option value="Doctor Schedules">Doctor Schedules</option>
                    <option value="Online Consultations / Telemedicine">Online Consultations / Telemedicine</option>
                    <option value="Billing Management">Billing Management</option>
                    <option value="System Architecture / Other">System Architecture / Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Severity Level</label>
                  <select
                    className="form-control"
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                  >
                    <option value="Critical">Critical (Blocker)</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-control"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="P1 - Blocker">P1 - Blocker</option>
                    <option value="P2 - Urgent">P2 - Urgent</option>
                    <option value="P3 - Normal">P3 - Normal</option>
                    <option value="P4 - Low">P4 - Low</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Assign Developer</label>
                  <select
                    className="form-control"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  >
                    <option value="">Select Assignee</option>
                    {users.map(u => (
                      <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">Log Defect</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DefectTracker;
