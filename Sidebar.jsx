import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  ListTodo, 
  GitBranch, 
  GitPullRequest, 
  Calendar, 
  BarChart3, 
  DollarSign, 
  Bug, 
  CheckSquare, 
  AlertTriangle, 
  FileSpreadsheet,
  Activity
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'initiation', label: 'Initiation & Charter', icon: FileText },
    { id: 'requirements', label: 'Scope & Requirements', icon: ListTodo },
    { id: 'wbs', label: 'Hierarchical WBS', icon: GitBranch },
    { id: 'changes', label: 'Change Management', icon: GitPullRequest, badge: 'AI & App' },
    { id: 'schedule', label: 'Schedule & Tasks', icon: Calendar },
    { id: 'gantt', label: 'Gantt Timeline', icon: BarChart3 },
    { id: 'evm', label: 'EVM Performance', icon: DollarSign, badge: 'CPI/SPI' },
    { id: 'defects', label: 'Defect Tracking', icon: Bug, badge: 'Critical' },
    { id: 'quality', label: 'Quality Checklist', icon: CheckSquare },
    { id: 'risks', label: '5x5 Risk & PDPC', icon: AlertTriangle },
    { id: 'reports', label: 'Audit & Reports', icon: FileSpreadsheet }
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ background: '#0284c7', color: '#fff', borderRadius: '8px', padding: '0.4rem', display: 'flex' }}>
          <Activity size={22} />
        </div>
        <div>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1.2 }}>SmartHealth SPM</h2>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>5-Hospital Project System</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav style={{ padding: '1rem 0.75rem', flex: 1 }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', padding: '0.5rem 0.75rem', letterSpacing: '0.05em' }}>
          Core Modules
        </div>
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.7rem 0.85rem',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? '#0284c7' : 'transparent',
                color: isActive ? '#ffffff' : '#cbd5e1',
                fontSize: '0.85rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                textAlign: 'left',
                marginBottom: '0.25rem',
                transition: 'background 0.15s, color 0.15s'
              }}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              <span style={{ flex: 1 }} className="sidebar-text">{item.label}</span>
              {item.badge && (
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.45rem',
                  borderRadius: '999px',
                  background: isActive ? '#ffffff' : '#334155',
                  color: isActive ? '#0284c7' : '#94a3b8'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Meta */}
      <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #1e293b', fontSize: '0.75rem', color: '#64748b' }}>
        <div>Scenario: 5 Hospitals</div>
        <div style={{ color: '#10b981', fontWeight: 600 }}>Baseline: 16 Wks / PKR 5M</div>
      </div>
    </aside>
  );
};

export default Sidebar;
