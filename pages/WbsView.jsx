import React, { useState, useEffect } from 'react';
import { GitBranch, Plus, Layers, Sparkles, Trash2 } from 'lucide-react';
import { wbsAPI } from '../services/api';

const WbsView = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    parentCode: '',
    level: 2,
    category: 'Development',
    estimatedCost: 200000,
    estimatedDuration: '2 weeks'
  });

  const fetchWbs = async () => {
    try {
      setLoading(true);
      const res = await wbsAPI.getAll();
      setItems(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWbs();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await wbsAPI.create(formData);
      setShowAddModal(false);
      setFormData({
        code: '',
        name: '',
        parentCode: '',
        level: 2,
        category: 'Development',
        estimatedCost: 200000,
        estimatedDuration: '2 weeks'
      });
      fetchWbs();
    } catch (err) {
      alert('Error creating WBS item: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this WBS item?')) return;
    try {
      await wbsAPI.delete(id);
      fetchWbs();
    } catch (err) {
      alert('Error deleting item: ' + err.message);
    }
  };

  // Group items or sort by code
  const totalWbsCost = items.reduce((sum, item) => sum + (item.level === 1 ? (item.estimatedCost || 0) : 0), 0);

  return (
    <div>
      {/* Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Hierarchical Work Breakdown Structure</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Multi-level tree decomposition covering 100% of approved healthcare project deliverables</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <Plus size={16} /> Add Work Package
        </button>
      </div>

      {/* WBS Tree Card */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <GitBranch size={20} color="#0284c7" />
            WBS Deliverable Tree ({items.length} Packages)
          </h3>
          <span className="badge badge-primary">Total Rollup: PKR {totalWbsCost.toLocaleString()}</span>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading WBS tree...</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '120px' }}>WBS Code</th>
                  <th>Work Package Name</th>
                  <th>Category</th>
                  <th>Estimated Cost</th>
                  <th>Duration</th>
                  <th>Origin / Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => {
                  const isRoot = item.level === 1;
                  return (
                    <tr 
                      key={item._id}
                      style={{ 
                        background: isRoot ? '#f8fafc' : '#ffffff',
                        fontWeight: isRoot ? 700 : 400
                      }}
                    >
                      <td style={{ fontFamily: 'monospace', fontWeight: 700, color: isRoot ? '#0284c7' : '#334155' }}>
                        {item.code}
                      </td>
                      <td style={{ paddingLeft: `${item.level * 1.5}rem` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {isRoot ? (
                            <Layers size={16} color="#0284c7" />
                          ) : (
                            <span style={{ color: '#94a3b8' }}>└─</span>
                          )}
                          <span style={{ color: isRoot ? '#0f172a' : '#1e293b' }}>{item.name}</span>
                          {item.isChangeRequestItem && (
                            <span className="badge badge-purple" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                              <Sparkles size={11} /> Approved Change
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${
                          item.category === 'Planning' ? 'badge-primary' :
                          item.category === 'System Design' ? 'badge-purple' :
                          item.category === 'Development' ? 'badge-success' :
                          item.category === 'Testing' ? 'badge-warning' :
                          item.category === 'Change Request' ? 'badge-purple' : 'badge-gray'
                        }`}>
                          {item.category}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>PKR {item.estimatedCost?.toLocaleString()}</td>
                      <td style={{ color: '#475569' }}>{item.estimatedDuration}</td>
                      <td>
                        {item.isChangeRequestItem ? (
                          <span style={{ color: '#7c3aed', fontWeight: 600, fontSize: '0.75rem' }}>Change Request</span>
                        ) : (
                          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Baseline Scope</span>
                        )}
                      </td>
                      <td>
                        <button 
                          onClick={() => handleDelete(item._id)}
                          className="btn btn-sm btn-outline"
                          title="Delete work package"
                        >
                          <Trash2 size={13} color="#ef4444" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
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
              Add Work Package to WBS
            </h3>
            <form onSubmit={handleCreateSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">WBS Code * (e.g. 3.7 or 3.2.1)</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Hierarchy Level</label>
                  <select
                    className="form-control"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
                  >
                    <option value="1">Level 1 (Major Deliverable)</option>
                    <option value="2">Level 2 (Work Package)</option>
                    <option value="3">Level 3 (Sub-package)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Package Name *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Laboratory Sample Barcode Scanner API"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Parent Code</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 3.0"
                    value={formData.parentCode}
                    onChange={(e) => setFormData({ ...formData, parentCode: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-control"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Planning">Planning</option>
                    <option value="System Design">System Design</option>
                    <option value="Development">Development</option>
                    <option value="Testing">Testing</option>
                    <option value="Deployment">Deployment</option>
                    <option value="Change Request">Change Request</option>
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Estimated Budget (PKR)</label>
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Work Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WbsView;
