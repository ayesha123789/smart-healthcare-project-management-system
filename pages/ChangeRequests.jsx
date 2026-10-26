import React, { useState, useEffect } from 'react';
import { GitPullRequest, Plus, Check, X, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { changeRequestAPI, projectAPI } from '../services/api';

const ChangeRequests = () => {
  const [changeRequests, setChangeRequests] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [remarks, setRemarks] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requester: 'Chief Medical Officer (CMO)',
    additionalCost: 400000,
    additionalDurationWeeks: 1,
    impactScope: 'Adds clinical telemetry integration',
    impactSchedule: 'Extends deployment by 1 week',
    impactBudget: 'Requires PKR 400,000 additional budget'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [crRes, projRes] = await Promise.all([
        changeRequestAPI.getAll(),
        projectAPI.get()
      ]);
      setChangeRequests(crRes.data.data);
      setProject(projRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    const remark = prompt('Enter Change Control Board (CCB) Approval Remarks:', 'Approved by CCB after clinical value and budget feasibility audit.');
    if (remark === null) return;
    try {
      const res = await changeRequestAPI.approve(id, remark);
      alert(res.data.message);
      fetchData();
    } catch (err) {
      alert('Error approving change request: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleReject = async (id) => {
    const remark = prompt('Enter Rejection Justification Remarks:', 'Rejected: Out of current 16-week baseline budget constraints.');
    if (remark === null) return;
    try {
      const res = await changeRequestAPI.reject(id, remark);
      alert(res.data.message);
      fetchData();
    } catch (err) {
      alert('Error rejecting change request: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await changeRequestAPI.create(formData);
      setShowAddModal(false);
      setFormData({
        title: '',
        description: '',
        requester: '',
        additionalCost: 0,
        additionalDurationWeeks: 0,
        impactScope: '',
        impactSchedule: '',
        impactBudget: ''
      });
      fetchData();
    } catch (err) {
      alert('Error creating change request: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      {/* Paper Scenario Callout Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)', borderColor: '#bbf7d0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <Sparkles size={20} color="#0284c7" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                Paper Scenario: AI Diagnosis Module & Mobile Application
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#334155', maxWidth: '850px' }}>
              Original Baseline: <strong>16 Weeks</strong> | Budget: <strong>PKR 5,000,000</strong>.
              <br />
              Proposed Changes: AI Preliminary Diagnosis (+PKR 500,000, +2 wks) & Mobile App (+PKR 300,000, +1 wk).
              <br />
              <strong>Formal Rule:</strong> Approving both changes will automatically update the revised budget to <strong>PKR 5,800,000</strong>, the duration to <strong>19 Weeks</strong>, and dynamically add the corresponding activities to the WBS and Task schedule!
            </p>
          </div>

          <div style={{ textAlign: 'right', background: '#ffffff', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Active Approved Baseline:</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: project?.revisedBudget > 5000000 ? '#7c3aed' : '#0284c7' }}>
              PKR {(project?.revisedBudget || 5000000).toLocaleString()}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: project?.revisedDurationWeeks > 16 ? '#7c3aed' : '#10b981' }}>
              {project?.revisedDurationWeeks || 16} Weeks
            </div>
          </div>
        </div>
      </div>

      {/* Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>Formal Change Requests Log</h3>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <Plus size={16} /> Submit Change Request
        </button>
      </div>

      {/* Change Requests List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {changeRequests.map(cr => {
          const isPending = cr.status === 'Pending';
          const isApproved = cr.status === 'Approved';
          return (
            <div 
              key={cr._id} 
              className="card"
              style={{
                borderLeft: `6px solid ${isApproved ? '#10b981' : isPending ? '#f59e0b' : '#ef4444'}`,
                marginBottom: 0
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>{cr.crId}: {cr.title}</span>
                    <span className={`badge ${isApproved ? 'badge-success' : isPending ? 'badge-warning' : 'badge-danger'}`}>
                      {cr.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Requested by: <strong>{cr.requester}</strong>
                  </div>
                </div>

                {/* Approve/Reject Controls */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {isPending && (
                    <>
                      <button 
                        onClick={() => handleApprove(cr._id)} 
                        className="btn btn-sm btn-success"
                        title="Approve Change and Update Project Baseline"
                      >
                        <Check size={14} /> Approve & Update Baseline
                      </button>
                      <button 
                        onClick={() => handleReject(cr._id)} 
                        className="btn btn-sm btn-danger"
                        title="Reject Change"
                      >
                        <X size={14} /> Reject
                      </button>
                    </>
                  )}
                  {isApproved && (
                    <button 
                      onClick={() => handleReject(cr._id)} 
                      className="btn btn-sm btn-outline"
                      title="Revoke / Reject"
                    >
                      Revoke Approval
                    </button>
                  )}
                  {!isPending && !isApproved && (
                    <button 
                      onClick={() => handleApprove(cr._id)} 
                      className="btn btn-sm btn-outline"
                      title="Reconsider & Approve"
                    >
                      Re-approve
                    </button>
                  )}
                </div>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#334155', marginBottom: '1rem' }}>{cr.description}</p>

              {/* Impact Analysis Breakdown */}
              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>ADDITIONAL COST</span>
                  <div style={{ fontWeight: 800, color: '#d97706', fontSize: '0.95rem' }}>
                    + PKR {cr.additionalCost?.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{cr.impactBudget}</div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>SCHEDULE EXTENSION</span>
                  <div style={{ fontWeight: 800, color: '#0284c7', fontSize: '0.95rem' }}>
                    + {cr.additionalDurationWeeks} Weeks
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{cr.impactSchedule}</div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>SCOPE IMPACT</span>
                  <div style={{ fontSize: '0.8rem', color: '#334155', fontWeight: 500 }}>
                    {cr.impactScope}
                  </div>
                </div>
              </div>

              {cr.remarks && (
                <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#475569', fontStyle: 'italic' }}>
                  <strong>Decision Remarks: </strong> {cr.remarks}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Change Request Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem' }}>
              Submit Formal Change Request
            </h3>
            <form onSubmit={handleCreateSubmit}>
              <div className="form-group">
                <label className="form-label">Requested Feature / Modification Title *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Remote Patient Telemetry Vitals Monitoring"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description & Clinical Justification *</label>
                <textarea
                  required
                  className="form-control"
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Requester Stakeholder *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={formData.requester}
                  onChange={(e) => setFormData({ ...formData, requester: e.target.value })}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Estimated Additional Cost (PKR) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    className="form-control"
                    value={formData.additionalCost}
                    onChange={(e) => setFormData({ ...formData, additionalCost: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Additional Duration (Weeks) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    className="form-control"
                    value={formData.additionalDurationWeeks}
                    onChange={(e) => setFormData({ ...formData, additionalDurationWeeks: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit for CCB Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangeRequests;
