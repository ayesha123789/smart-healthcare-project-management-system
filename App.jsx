import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ProjectInitiation from './pages/ProjectInitiation';
import ScopeRequirements from './pages/ScopeRequirements';
import WbsView from './pages/WbsView';
import ChangeRequests from './pages/ChangeRequests';
import ScheduleTasks from './pages/ScheduleTasks';
import GanttChart from './pages/GanttChart';
import EvmAnalysis from './pages/EvmAnalysis';
import DefectTracker from './pages/DefectTracker';
import QualityChecklist from './pages/QualityChecklist';
import RiskMatrix from './pages/RiskMatrix';
import Reports from './pages/Reports';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Executive Project Management Dashboard';
      case 'initiation': return 'Project Initiation & Integration Management';
      case 'requirements': return 'Scope & Requirements Management';
      case 'wbs': return 'Hierarchical Work Breakdown Structure (WBS)';
      case 'changes': return 'Change Request Management (AI & Mobile App)';
      case 'schedule': return 'Schedule & Resource Management';
      case 'gantt': return 'Project Schedule Gantt Chart';
      case 'evm': return 'Cost & Earned Value Management (EVM)';
      case 'defects': return 'Defect Tracking & Software Quality Assurance';
      case 'quality': return 'Clinical Quality Verification Checklist';
      case 'risks': return '5x5 Risk Likelihood-Impact Matrix & PDPC';
      case 'reports': return 'Project Performance & Verification Reports';
      default: return 'Smart Healthcare SPM';
    }
  };

  const handleDataRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="main-content">
        <Navbar activeTitle={getPageTitle()} onDataRefresh={handleDataRefresh} />
        <main className="content-body" key={refreshKey}>
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'initiation' && <ProjectInitiation />}
          {activeTab === 'requirements' && <ScopeRequirements />}
          {activeTab === 'wbs' && <WbsView />}
          {activeTab === 'changes' && <ChangeRequests />}
          {activeTab === 'schedule' && <ScheduleTasks />}
          {activeTab === 'gantt' && <GanttChart />}
          {activeTab === 'evm' && <EvmAnalysis />}
          {activeTab === 'defects' && <DefectTracker />}
          {activeTab === 'quality' && <QualityChecklist />}
          {activeTab === 'risks' && <RiskMatrix />}
          {activeTab === 'reports' && <Reports />}
        </main>
      </div>
    </div>
  );
}

export default App;
