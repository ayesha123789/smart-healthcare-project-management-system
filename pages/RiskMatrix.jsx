import React, { useState, useEffect } from 'react';
import { AlertTriangle, Plus, ShieldAlert, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { riskAPI } from '../services/api';

const RiskMatrix = () => {
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('MATRIX'); // 'MATRIX' or 'PDPC'
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    likelihood: 4,
    impact: 4,
    failureMode: '',
    preventiveAction: '',
    contingencyPlan: '',
    owner: 'Project Manager'
  });

  const fetchRisks = async () => {
    try {
      setLoading(true);
      const res = await riskAPI.getAll();
      setRisks(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRisks();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await riskAPI.create(formData);
      setShowAddModal(false);
      setFormData({
        title: '',
        description: '',
        likelihood: 3,
        impact: 3,
        failureMode: '',
        preventiveAction: '',
        contingencyPlan: '',
        owner: 'Project Manager'
      });
      fetchRisks();
    } catch (err) {
      alert('Error adding risk: ' + (err.response?.data?.message || err.message));
    }
  };

  const highRisks = risks.filter(r => r.category === 'High');
  const mediumRisks = risks.filter(r => r.category === 'Medium');
  const lowRisks = risks.filter(r => r.category === 'Low');

  return (
    <div>
      {/* Header & Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Risk Management & PDPC Contingency Response</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>5x5 Likelihood-Impact Exposure Matrix & Process Decision Program Chart</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => setActiveTab('MATRIX')} 
            className={`btn btn-sm ${activeTab === 'MATRIX' ? 'btn-primary' : 'btn-outline'}`}
          >
            5x5 Heatmap Matrix
          </button>
          <button 
            onClick={() => setActiveTab('PDPC')} 
            className={`btn btn-sm ${activeTab === 'PDPC' ? 'btn-primary' : 'btn-outline'}`}
          >
            PDPC Response Plan
          </button>
          <button onClick={() => setShowAddModal(true)} className="btn btn-sm btn-primary">
            <Plus size={16} /> Add Risk
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        <div className="metric-box" style={{ borderColor: '#fca5a5' }}>
          <div className="metric-label" style={{ color: '#dc2626' }}>High Exposure Risks (Score 15-25)</div>
          <div className="metric-value" style={{ color: '#dc2626' }}>{highRisks.length}</div>
          <div className="metric-subtext" style={{ color: '#ef4444' }}>
            Appointment failure & Patient duplication
          </div>
        </div>

        <div className="metric-box" style={{ borderColor: '#fde68a' }}>
          <div className="metric-label" style={{ color: '#d97706' }}>Medium Risks (Score 6-14)</div>
          <div className="metric-value" style={{ color: '#d97706' }}>{mediumRisks.length}</div>
          <div className="metric-subtext" style={{ color: '#d97706' }}>
            Schedule slips & Doctor adoption
          </div>
        </div>

        <div className="metric-box" style={{ borderColor: '#86efac' }}>
          <div className="metric-label" style={{ color: '#16a34a' }}>Low Risks (Score 1-5)</div>
          <div className="metric-value" style={{ color: '#16a34a' }}>{lowRisks.length}</div>
          <div className="metric-subtext" style={{ color: '#16a34a' }}>
            Minor UI / terminal latency
          </div>
        </div>
      </div>

      {activeTab === 'MATRIX' ? (
        <div className="grid-2">
          {/* 5x5 Heatmap Matrix Visual */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <ShieldAlert size={18} color="#0284c7" />
                5x5 Likelihood vs Impact Matrix
              </h3>
              <span className="badge badge-purple">Risk Score = L × I</span>
            </div>

            <div style={{ position: 'relative', padding: '1rem' }}>
              <div style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.5rem' }}>
                IMPACT (1 to 5) ──►
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '30px 1fr', gap: '0.5rem', alignItems: 'center' }}>
                {/* Y-Axis Label */}
                <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', textAlign: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>
                  LIKELIHOOD (5 to 1) ──►
                </div>

                {/* 5x5 Grid */}
                <div className="matrix-grid">
                  {[5, 4, 3, 2, 1].map(l => (
                    [1, 2, 3, 4, 5].map(i => {
                      const score = l * i;
                      const cellClass = score >= 15 ? 'cell-high' : score >= 6 ? 'cell-medium' : 'cell-low';
                      const cellRisks = risks.filter(r => r.likelihood === l && r.impact === i);

                      return (
                        <div 
                          key={`${l}-${i}`} 
                          className={`matrix-cell ${cellClass}`}
                          title={`Likelihood: ${l}, Impact: ${i}, Score: ${score}`}
                        >
                          <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{score}</div>
                          {cellRisks.length > 0 && (
                            <div style={{ marginTop: '2px', display: 'flex', gap: '2px', flexWrap: 'wrap', justifyContent: 'center' }}>
                              {cellRisks.map(r => (
                                <span 
                                  key={r._id} 
                                  style={{ 
                                    background: '#0f172a', 
                                    color: '#ffffff', 
                                    borderRadius: '999px', 
                                    padding: '1px 5px', 
                                    fontSize: '0.65rem', 
                                    fontWeight: 800 
                                  }}
                                  title={`${r.riskId}: ${r.title}`}
                                >
                                  {r.riskId}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Risks Breakdown List */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <AlertTriangle size={18} color="#0284c7" />
                Prioritized Risk Log ({risks.length})
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '420px', overflowY: 'auto' }}>
              {risks.map(r => (
                <div 
                  key={r._id} 
                  style={{ 
                    padding: '0.85rem', 
                    borderRadius: '8px', 
                    border: '1px solid #e2e8f0',
                    borderLeft: `5px solid ${r.category === 'High' ? '#ef4444' : r.category === 'Medium' ? '#f59e0b' : '#10b981'}`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a' }}>
                      {r.riskId}: {r.title}
                    </span>
                    <span className={`badge ${r.category === 'High' ? 'badge-danger' : r.category === 'Medium' ? 'badge-warning' : 'badge-success'}`}>
                      Score: {r.riskScore} ({r.category})
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>{r.description}</p>
                  <div style={{ fontSize: '0.7rem', color: '#475569', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Likelihood: <strong>{r.likelihood}/5</strong> | Impact: <strong>{r.impact}/5</strong></span>
                    <span>Owner: <strong>{r.owner}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* PDPC View (Process Decision Program Chart) */
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <CheckCircle2 size={20} color="#0284c7" />
              Process Decision Program Chart (PDPC) & Response Strategy
            </h3>
            <span className="badge badge-primary">ISO/PMI Risk Response</span>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '100px' }}>Risk ID</th>
                  <th>Potential Risk Event</th>
                  <th>Potential Failure Mode</th>
                  <th>Preventive Countermeasure</th>
                  <th>Contingency Fallback Plan</th>
                  <th>Action Owner</th>
                </tr>
              </thead>
              <tbody>
                {risks.map(r => (
                  <tr key={r._id}>
                    <td style={{ fontWeight: 800, fontFamily: 'monospace' }}>{r.riskId}</td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{r.title}</div>
                      <span className={`badge ${r.category === 'High' ? 'badge-danger' : r.category === 'Medium' ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: '0.65rem' }}>
                        Score: {r.riskScore}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#991b1b', maxWidth: '240px' }}>
                      {r.failureMode || 'System interruption affecting hospital operations.'}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#065f46', maxWidth: '240px' }}>
                      {r.preventiveAction}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#0369a1', maxWidth: '240px' }}>
                      {r.contingencyPlan}
                    </td>
                    <td style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                      {r.owner}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Risk Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem' }}>
              Add Project Risk & Contingency
            </h3>
            <form onSubmit={handleCreateSubmit}>
              <div className="form-group">
                <label className="form-label">Risk Title *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Hospital Firewall WebRTC Port Blockage"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Description *</label>
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
                  <label className="form-label">Likelihood (1 to 5) *</label>
                  <select
                    className="form-control"
                    value={formData.likelihood}
                    onChange={(e) => setFormData({ ...formData, likelihood: Number(e.target.value) })}
                  >
                    <option value="1">1 - Rare</option>
                    <option value="2">2 - Unlikely</option>
                    <option value="3">3 - Moderate</option>
                    <option value="4">4 - Likely</option>
                    <option value="5">5 - Almost Certain</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Impact (1 to 5) *</label>
                  <select
                    className="form-control"
                    value={formData.impact}
                    onChange={(e) => setFormData({ ...formData, impact: Number(e.target.value) })}
                  >
                    <option value="1">1 - Insignificant</option>
                    <option value="2">2 - Minor</option>
                    <option value="3">3 - Moderate</option>
                    <option value="4">4 - Major</option>
                    <option value="5">5 - Catastrophic</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Potential Failure Mode</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="What specifically breaks if this risk materializes?"
                  value={formData.failureMode}
                  onChange={(e) => setFormData({ ...formData, failureMode: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Preventive Action *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="What proactive step prevents this?"
                  value={formData.preventiveAction}
                  onChange={(e) => setFormData({ ...formData, preventiveAction: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contingency Plan *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="What is the fallback if it happens anyway?"
                  value={formData.contingencyPlan}
                  onChange={(e) => setFormData({ ...formData, contingencyPlan: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Responsible Owner</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Risk</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskMatrix;
