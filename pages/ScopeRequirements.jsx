import React, { useState, useEffect } from 'react';
import { Plus, Check, X, ShieldAlert, Filter, Trash2, ListTodo } from 'lucide-react';
import { requirementAPI } from '../services/api';

const ScopeRequirements = () => {
  const [requirements, setRequirements] = useState([]);
  const [filter, setFilter] = useState('ALL'); // ALL, APPROVED, PENDING, REJECTED
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New Requirement Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Patient Registration',
    priority: 'High',
    estimatedCost: 500000,
    estimatedDuration: '2 weeks'
  });

  const fetchRequirements = async () => {
    try {
      setLoading(true);
      const params = filter === 'APPROVED' ? { approvedOnly: 'true' } : filter !== 'ALL' ? { status: filter } : {};
      const res = await requirementAPI.getAll(params);
      setRequirements(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, [filter]);

  const handleApprovalChange = async (id, newStatus) => {
    try {
      await requirementAPI.setApproval(id, newStatus, `Updated via Scope Gatekeeper by Project Manager`);
      fetchRequirements();
    } catch (err) {
      alert('Error updating approval status: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this requirement from scope tracking?')) return;
    try {
      await requirementAPI.delete(id);
      fetchRequirements();
    } catch (err) {
      alert('Error deleting requirement: ' + err.message);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }
    try {
      await requirementAPI.create(formData);
      setShowAddModal(false);
      setFormData({
        title: '',
        description: '',
        category: 'Patient Registration',
        priority: 'Medium',
        estimatedCost: 300000,
        estimatedDuration: '2 weeks'
      });
      fetchRequirements();
    } catch (err) {
      alert('Error adding requirement: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      {/* Scope Gatekeeper Rule Banner */}
      <div className="alert-banner alert-info" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldAlert size={22} style={{ flexShrink: 0 }} />
          <div>
            <strong>Mandatory Scope Gatekeeper Rule: </strong>
            Only requirements marked as <strong>Approved</strong> are incorporated into the official scope baseline. Unapproved/Pending items (e.g., AI and Mobile App) do not alter the baseline budget or scheduled WBS until formal approval.
          </div>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary btn-sm" style={{ flexShrink: 0, marginLeft: '1rem' }}>
          <Plus size={16} /> Add Requirement
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {[
          { id: 'ALL', label: 'All Requirements' },
          { id: 'APPROVED', label: 'Approved Scope Baseline' },
          { id: 'Pending', label: 'Pending Evaluation' },
          { id: 'Rejected', label: 'Rejected Scope' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`btn btn-sm ${filter === tab.id ? 'btn-primary' : 'btn-outline'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Requirements Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <ListTodo size={20} color="#0284c7" />
            Project Requirements Specification ({requirements.length})
          </h2>
          <span className="badge badge-primary">
            {filter === 'APPROVED' ? 'Approved Baseline Only' : 'Scope Register'}
          </span>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading requirements...</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Req ID</th>
                  <th>Title & Description</th>
                  <th>Module Category</th>
                  <th>Priority</th>
                  <th>Estimated Cost</th>
                  <th>Duration</th>
                  <th>Approval Status</th>
                  <th>Scope Baseline</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requirements.map(req => (
                  <tr key={req._id}>
                    <td style={{ fontWeight: 800 }}>{req.reqId}</td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{req.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{req.description}</div>
                    </td>
                    <td><span className="badge badge-gray">{req.category}</span></td>
                    <td>
                      <span className={`badge ${req.priority === 'High' ? 'badge-danger' : req.priority === 'Medium' ? 'badge-warning' : 'badge-primary'}`}>
                        {req.priority}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>PKR {req.estimatedCost?.toLocaleString()}</td>
                    <td style={{ color: '#475569' }}>{req.estimatedDuration}</td>
                    <td>
                      <span className={`badge ${req.status === 'Approved' ? 'badge-success' : req.status === 'Pending' ? 'badge-warning' : 'badge-danger'}`}>
                        {req.status}
                      </span>
                    </td>
                    <td>
                      {req.status === 'Approved' ? (
                        <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.8rem' }}>✓ Included</span>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>✗ Excluded</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        {req.status !== 'Approved' && (
                          <button 
                            onClick={() => handleApprovalChange(req._id, 'Approved')} 
                            className="btn btn-sm btn-success" 
                            title="Approve into baseline"
                          >
                            <Check size={14} />
                          </button>
                        )}
                        {req.status !== 'Rejected' && (
                          <button 
                            onClick={() => handleApprovalChange(req._id, 'Rejected')} 
                            className="btn btn-sm btn-danger" 
                            title="Reject requirement"
                          >
                            <X size={14} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(req._id)} 
                          className="btn btn-sm btn-outline" 
                          title="Delete requirement"
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

      {/* Add Requirement Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem', color: '#0f172a' }}>
              Add New Project Requirement
            </h3>
            <form onSubmit={handleCreateSubmit}>
              <div className="form-group">
                <label className="form-label">Requirement Title *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Telemedicine High-Definition Video Feed"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Detailed functional requirement specifications..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Healthcare Category</label>
                  <select
                    className="form-control"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Patient Registration">Patient Registration</option>
                    <option value="Electronic Medical Records (EMR)">Electronic Medical Records (EMR)</option>
                    <option value="Online Appointments">Online Appointments</option>
                    <option value="Laboratory Reports">Laboratory Reports</option>
                    <option value="Doctor Schedules">Doctor Schedules</option>
                    <option value="Online Consultations / Telemedicine">Online Consultations / Telemedicine</option>
                    <option value="Billing Management">Billing Management</option>
                    <option value="Security & Non-Functional">Security & Non-Functional</option>
                  </select>
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

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Estimated Cost (PKR)</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={formData.estimatedCost}
                    onChange={(e) => setFormData({ ...formData, estimatedCost: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Estimated Duration</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.estimatedDuration}
                    onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Requirement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScopeRequirements;
