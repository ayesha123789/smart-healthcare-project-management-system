import React, { useState, useEffect } from 'react';
import { CheckSquare, CheckCircle, XCircle, Clock, ShieldCheck, Plus } from 'lucide-react';
import { qualityAPI } from '../services/api';

const QualityChecklist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    itemCode: '',
    title: '',
    description: '',
    standard: 'ISO/IEC 25010 Software Quality Standards',
    responsibleRole: 'QA Engineer'
  });

  const fetchChecklist = async () => {
    try {
      setLoading(true);
      const res = await qualityAPI.getAll();
      setItems(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChecklist();
  }, []);

  const handleStatusToggle = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Passed' ? 'Failed' : currentStatus === 'Failed' ? 'Pending' : 'Passed';
    try {
      await qualityAPI.update(id, { status: nextStatus, remarks: `Audited on ${new Date().toLocaleDateString()}` });
      fetchChecklist();
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await qualityAPI.create(newItem);
      setShowAddModal(false);
      setNewItem({
        itemCode: '',
        title: '',
        description: '',
        standard: 'ISO/IEC 25010 Software Quality Standards',
        responsibleRole: 'QA Engineer'
      });
      fetchChecklist();
    } catch (err) {
      alert('Error creating item: ' + (err.response?.data?.message || err.message));
    }
  };

  const passedCount = items.filter(i => i.status === 'Passed').length;
  const failedCount = items.filter(i => i.status === 'Failed').length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Quality Assurance & Clinical Verification Checklist</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>ISO/IEC 25010 verification standards for 5-hospital deployment</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <Plus size={16} /> Add Checklist Item
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        <div className="metric-box">
          <div className="metric-label">Audit Items Total</div>
          <div className="metric-value">{items.length}</div>
          <div className="metric-subtext" style={{ color: '#64748b' }}>Mandatory verification criteria</div>
        </div>

        <div className="metric-box">
          <div className="metric-label">Verified Passed</div>
          <div className="metric-value" style={{ color: '#10b981' }}>{passedCount}</div>
          <div className="metric-subtext" style={{ color: '#10b981' }}>{Math.round((passedCount / (items.length || 1)) * 100)}% Compliance</div>
        </div>

        <div className="metric-box">
          <div className="metric-label">Verification Failures</div>
          <div className="metric-value" style={{ color: failedCount > 0 ? '#ef4444' : '#10b981' }}>{failedCount}</div>
          <div className="metric-subtext" style={{ color: failedCount > 0 ? '#ef4444' : '#10b981' }}>
            {failedCount > 0 ? 'Action required by QA team' : 'Zero test failures'}
          </div>
        </div>
      </div>

      {/* Checklist Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <CheckSquare size={20} color="#0284c7" />
            Clinical Verification Matrix
          </h3>
          <span className="badge badge-primary">Click status to toggle</span>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading checklist...</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Quality Verification Item</th>
                  <th>Clinical Standard</th>
                  <th>Responsible Role</th>
                  <th>Verification Date</th>
                  <th>Status (Click to toggle)</th>
                  <th>Audit Remarks</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item._id}>
                    <td style={{ fontWeight: 800, fontFamily: 'monospace' }}>{item.itemCode}</td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.description}</div>
                    </td>
                    <td style={{ fontSize: '0.75rem', color: '#475569' }}>{item.standard}</td>
                    <td>
                      <span className="badge badge-gray">{item.responsibleRole}</span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {item.verifiedDate ? new Date(item.verifiedDate).toLocaleDateString() : 'Pending'}
                    </td>
                    <td>
                      <button
                        onClick={() => handleStatusToggle(item._id, item.status)}
                        className={`btn btn-sm ${
                          item.status === 'Passed' ? 'btn-success' :
                          item.status === 'Failed' ? 'btn-danger' : 'btn-outline'
                        }`}
                        style={{ minWidth: '95px' }}
                      >
                        {item.status === 'Passed' && <CheckCircle size={14} />}
                        {item.status === 'Failed' && <XCircle size={14} />}
                        {item.status === 'Pending' && <Clock size={14} />}
                        {item.status}
                      </button>
                    </td>
                    <td style={{ fontSize: '0.75rem', color: '#334155' }}>
                      {item.remarks || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem' }}>
              Add Quality Checklist Item
            </h3>
            <form onSubmit={handleCreateSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Item Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. QC-09"
                    className="form-control"
                    value={newItem.itemCode}
                    onChange={(e) => setNewItem({ ...newItem, itemCode: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Responsible Role</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={newItem.responsibleRole}
                    onChange={(e) => setNewItem({ ...newItem, responsibleRole: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Verification Title *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Telemedicine Audio/Video Encryption Verification"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description & Standard</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QualityChecklist;
