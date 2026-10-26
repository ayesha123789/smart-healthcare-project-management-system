import React, { useState, useEffect } from 'react';
import { FileText, Users, Award, CheckCircle, Flag, ShieldCheck } from 'lucide-react';
import { projectAPI, userAPI, milestoneAPI } from '../services/api';

const ProjectInitiation = () => {
  const [project, setProject] = useState(null);
  const [team, setTeam] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [closureText, setClosureText] = useState('');
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    fetchInitiationData();
  }, []);

  const fetchInitiationData = async () => {
    try {
      setLoading(true);
      const [projRes, userRes, msRes] = await Promise.all([
        projectAPI.get(),
        userAPI.getAll(),
        milestoneAPI.getAll()
      ]);
      setProject(projRes.data.data);
      setTeam(userRes.data.data);
      setMilestones(msRes.data.data);
      if (projRes.data.data?.closureSummary) {
        setClosureText(projRes.data.data.closureSummary);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseProject = async () => {
    if (!window.confirm('Are you sure you want to officially transition this project to Closed status?')) return;
    try {
      setIsClosing(true);
      await projectAPI.close({
        closureSummary: closureText || 'All 5 hospital nodes operational and validated against ISO 25010 standards.',
        lessonsLearned: [
          'Concurrency locking must be architected into appointment slots early in design.',
          'Unique medical record indexes require composite hospital identifiers.',
          'Change Control Board approvals must precede any developer coding.'
        ]
      });
      alert('Project officially closed!');
      fetchInitiationData();
    } catch (err) {
      alert('Error closing project: ' + err.message);
    } finally {
      setIsClosing(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Project Charter...</div>;

  return (
    <div>
      {/* Project Charter Card */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <FileText size={20} color="#0284c7" />
            Official Project Charter — Smart Healthcare System for 5 Hospitals
          </h2>
          <span className={`badge ${project?.status === 'Closed' ? 'badge-purple' : 'badge-success'}`}>
            Status: {project?.status}
          </span>
        </div>

        <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>PROJECT TITLE</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{project?.title}</div>
            <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.35rem' }}>{project?.description}</p>
          </div>

          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div className="grid-2">
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Original Duration</span>
                <div style={{ fontWeight: 800, color: '#0284c7' }}>{project?.baselineDurationWeeks} Weeks</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Original Baseline Budget</span>
                <div style={{ fontWeight: 800, color: '#10b981' }}>PKR {(project?.baselineBudget || 0).toLocaleString()}</div>
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Revised Duration</span>
                <div style={{ fontWeight: 800, color: project?.revisedDurationWeeks > 16 ? '#f59e0b' : '#0284c7' }}>
                  {project?.revisedDurationWeeks} Weeks
                </div>
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Revised Budget</span>
                <div style={{ fontWeight: 800, color: project?.revisedBudget > 5000000 ? '#f59e0b' : '#10b981' }}>
                  PKR {(project?.revisedBudget || 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Objectives */}
        <div style={{ marginBottom: '1.25rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>Strategic Project Objectives:</h4>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {project?.objectives?.map((obj, i) => (
              <li key={i}>{obj}</li>
            ))}
          </ul>
        </div>

        {/* Stakeholders & Governance */}
        <div style={{ background: '#f0f9ff', padding: '0.85rem', borderRadius: '8px', border: '1px solid #bae6fd', fontSize: '0.8rem', color: '#0369a1' }}>
          <strong>Key Stakeholders: </strong>
          {project?.stakeholders?.join(' • ')}
        </div>
      </div>

      {/* Team RACI Responsibilities (7 Members from Paper) */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <Users size={20} color="#0284c7" />
            Project Team & Responsibility Matrix (7 Core Members)
          </h2>
          <span className="badge badge-primary">Paper Scenario Team</span>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Member Name</th>
                <th>Prescribed Paper Role</th>
                <th>Email Contact</th>
                <th>Core Responsibilities / Modules Managed</th>
              </tr>
            </thead>
            <tbody>
              {team.map((m, idx) => (
                <tr key={m._id || idx}>
                  <td style={{ fontWeight: 700 }}>{m.name}</td>
                  <td>
                    <span className={`badge ${
                      m.role === 'Project Manager' ? 'badge-purple' :
                      m.role.includes('Backend') ? 'badge-primary' :
                      m.role.includes('Frontend') ? 'badge-success' :
                      m.role.includes('Database') ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {m.role}
                    </span>
                  </td>
                  <td style={{ color: '#64748b' }}>{m.email}</td>
                  <td style={{ fontSize: '0.8rem' }}>{m.responsibilities}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Milestones Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <Award size={20} color="#0284c7" />
            Major Milestone Deliverables Schedule
          </h2>
          <span className="badge badge-purple">5 Gateways</span>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Milestone ID</th>
                <th>Target Week</th>
                <th>Milestone Deliverable</th>
                <th>Target Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {milestones.map(ms => (
                <tr key={ms._id}>
                  <td style={{ fontWeight: 700 }}>{ms.milestoneId}</td>
                  <td><strong>Week {ms.targetWeek}</strong></td>
                  <td>{ms.deliverable}</td>
                  <td>{new Date(ms.targetDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${ms.status === 'Achieved' ? 'badge-success' : ms.status === 'In Progress' ? 'badge-primary' : 'badge-gray'}`}>
                      {ms.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Closure Section */}
      <div className="card" style={{ borderColor: project?.status === 'Closed' ? '#a855f7' : '#e2e8f0' }}>
        <div className="card-header">
          <h2 className="card-title">
            <CheckCircle size={20} color="#8b5cf6" />
            Project Closure Sign-off & Post-Mortem Audit
          </h2>
          {project?.status === 'Closed' && <span className="badge badge-purple">Officially Closed</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Final Closure Summary & Handover Audit:</label>
          <textarea
            className="form-control"
            rows="3"
            value={closureText}
            onChange={(e) => setClosureText(e.target.value)}
            placeholder="Document formal acceptance from the 5 hospitals, operational sign-off, and warranty period..."
          ></textarea>
        </div>

        {project?.lessonsLearned && project.lessonsLearned.length > 0 && (
          <div style={{ marginBottom: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>Documented Lessons Learned:</h4>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.8rem', color: '#475569' }}>
              {project.lessonsLearned.map((ll, idx) => (
                <li key={idx}>{ll}</li>
              ))}
            </ul>
          </div>
        )}

        {project?.status !== 'Closed' && (
          <button 
            onClick={handleCloseProject}
            disabled={isClosing}
            className="btn btn-primary"
            style={{ background: '#8b5cf6' }}
          >
            <ShieldCheck size={16} />
            {isClosing ? 'Closing Project...' : 'Formally Mark Project as Closed'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectInitiation;
