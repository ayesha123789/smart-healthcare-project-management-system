import React from 'react';
import { RotateCcw, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { systemAPI } from '../services/api';

const Navbar = ({ activeTitle, onDataRefresh }) => {
  const [reloading, setReloading] = React.useState(false);

  const handleReseed = async () => {
    if (window.confirm('Reset and re-seed database with authentic paper scenario data? This resets baseline to PKR 5,000,000 and 16 weeks.')) {
      try {
        setReloading(true);
        await systemAPI.reseed();
        alert('Database successfully reset to original paper scenario!');
        if (onDataRefresh) onDataRefresh();
      } catch (err) {
        alert('Error resetting data: ' + err.message);
      } finally {
        setReloading(false);
      }
    }
  };

  return (
    <header className="top-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>{activeTitle}</h1>
        <span className="badge badge-primary">5 Regional Hospitals</span>
        <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <CheckCircle2 size={12} /> Active SDLC
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Dr. Asim Raza (PM)</span>
          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Project Manager / Gov</span>
        </div>

        <button 
          onClick={handleReseed} 
          disabled={reloading}
          className="btn btn-outline btn-sm"
          title="Reset database to initial paper state"
        >
          <RotateCcw size={14} className={reloading ? 'spin' : ''} />
          {reloading ? 'Resetting...' : 'Reset Paper Data'}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
