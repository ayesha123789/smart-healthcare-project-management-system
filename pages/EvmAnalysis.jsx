import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, AlertTriangle, Calculator, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { evmAPI } from '../services/api';

const EvmAnalysis = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sandbox Calculator for Examiner Demonstration
  const [calcEV, setCalcEV] = useState(2500000);
  const [calcPV, setCalcPV] = useState(2800000);
  const [calcAC, setCalcAC] = useState(2600000);
  const [calcBAC, setCalcBAC] = useState(5000000);

  useEffect(() => {
    fetchEvm();
  }, []);

  const fetchEvm = async () => {
    try {
      setLoading(true);
      const res = await evmAPI.getMetrics();
      setData(res.data.data);
      if (res.data.data) {
        setCalcEV(res.data.data.EV);
        setCalcPV(res.data.data.PV);
        setCalcAC(res.data.data.AC);
        setCalcBAC(res.data.data.BAC);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Sandbox computations
  const sandboxCV = calcEV - calcAC;
  const sandboxSV = calcEV - calcPV;
  const sandboxCPI = calcAC > 0 ? (calcEV / calcAC).toFixed(3) : 'N/A (AC=0)';
  const sandboxSPI = calcPV > 0 ? (calcEV / calcPV).toFixed(3) : 'N/A (PV=0)';
  const sandboxEAC = calcAC > 0 && calcEV > 0 ? Math.round(calcBAC / (calcEV / calcAC)) : calcBAC;
  const sandboxVAC = calcBAC - sandboxEAC;

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Calculating EVM formulas...</div>;

  return (
    <div>
      {/* Live System EVM Metrics */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <DollarSign size={20} color="#0284c7" />
            Live Project Earned Value Performance Metrics (Programmatic EVM Engine)
          </h2>
          <span className="badge badge-primary">Database-Calculated</span>
        </div>

        {/* 6 Core EVM Metrics */}
        <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
          <div className="metric-box">
            <div className="metric-label">Planned Value (PV)</div>
            <div className="metric-value">PKR {data?.PV?.toLocaleString()}</div>
            <div className="metric-subtext" style={{ color: '#64748b' }}>
              Scheduled work value to date
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-label">Earned Value (EV)</div>
            <div className="metric-value" style={{ color: '#10b981' }}>PKR {data?.EV?.toLocaleString()}</div>
            <div className="metric-subtext" style={{ color: '#64748b' }}>
              Completed work budgeted value
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-label">Actual Cost (AC)</div>
            <div className="metric-value" style={{ color: data?.AC > data?.EV ? '#ef4444' : '#10b981' }}>
              PKR {data?.AC?.toLocaleString()}
            </div>
            <div className="metric-subtext" style={{ color: '#64748b' }}>
              Actual funds disbursed
            </div>
          </div>
        </div>

        {/* Variances & Indices */}
        <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
          <div className="metric-box">
            <div className="metric-label">Cost Variance (CV = EV - AC)</div>
            <div className="metric-value" style={{ color: data?.CV < 0 ? '#ef4444' : '#10b981' }}>
              PKR {data?.CV?.toLocaleString()}
            </div>
            <div className="metric-subtext">
              {data?.CV < 0 ? (
                <span style={{ color: '#ef4444' }}>Unfavorable: Over budget</span>
              ) : (
                <span style={{ color: '#10b981' }}>Favorable: Under budget</span>
              )}
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-label">Schedule Variance (SV = EV - PV)</div>
            <div className="metric-value" style={{ color: data?.SV < 0 ? '#ef4444' : '#10b981' }}>
              PKR {data?.SV?.toLocaleString()}
            </div>
            <div className="metric-subtext">
              {data?.SV < 0 ? (
                <span style={{ color: '#ef4444' }}>Behind planned schedule</span>
              ) : (
                <span style={{ color: '#10b981' }}>Ahead of planned schedule</span>
              )}
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-label">Cost Performance Index (CPI)</div>
            <div className="metric-value" style={{ color: data?.CPI < 1 ? '#ef4444' : '#10b981' }}>
              {data?.CPIDisplay}
            </div>
            <div className="metric-subtext" style={{ fontSize: '0.75rem' }}>
              Formula: <code>EV / AC</code> {data?.CPI < 1 ? '(Inefficient spend)' : '(Cost efficient)'}
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-label">Schedule Performance Index (SPI)</div>
            <div className="metric-value" style={{ color: data?.SPI < 1 ? '#ef4444' : '#10b981' }}>
              {data?.SPIDisplay}
            </div>
            <div className="metric-subtext" style={{ fontSize: '0.75rem' }}>
              Formula: <code>EV / PV</code> {data?.SPI < 1 ? '(Behind schedule)' : '(Ahead of schedule)'}
            </div>
          </div>
        </div>

        {/* Forecasting Metrics */}
        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>ESTIMATE AT COMPLETION (EAC = BAC / CPI)</span>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>PKR {data?.EAC?.toLocaleString()}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Projected total cost if current spend rate continues</div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>ESTIMATE TO COMPLETE (ETC = EAC - AC)</span>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0284c7' }}>PKR {data?.ETC?.toLocaleString()}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Remaining funds needed to finish all hospital nodes</div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>VARIANCE AT COMPLETION (VAC = BAC - EAC)</span>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: data?.VAC < 0 ? '#ef4444' : '#10b981' }}>
              PKR {data?.VAC?.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Projected budget surplus (+) or overrun (-)</div>
          </div>
        </div>
      </div>

      {/* Interactive EVM Scenario Sandbox (For Course Examiners) */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Calculator size={18} color="#0284c7" />
            Interactive EVM Scenario Simulator (Verification Sandbox)
          </h3>
          <span className="badge badge-purple">Test AC = 0 & Extreme Scenarios</span>
        </div>

        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
          Test paper scenarios like <strong>AC = 0</strong> (verifies division-by-zero protection returns "N/A"), or adjust values to test CPI/SPI thresholds:
        </p>

        <div className="grid-4" style={{ marginBottom: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">BAC (Budget at Completion)</label>
            <input
              type="number"
              className="form-control"
              value={calcBAC}
              onChange={(e) => setCalcBAC(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Planned Value (PV)</label>
            <input
              type="number"
              className="form-control"
              value={calcPV}
              onChange={(e) => setCalcPV(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Earned Value (EV)</label>
            <input
              type="number"
              className="form-control"
              value={calcEV}
              onChange={(e) => setCalcEV(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Actual Cost (AC)</label>
            <input
              type="number"
              className="form-control"
              value={calcAC}
              onChange={(e) => setCalcAC(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Calculated Results from Simulator */}
        <div style={{ background: '#f0f9ff', padding: '1rem', borderRadius: '8px', border: '1px solid #bae6fd', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#0369a1', fontWeight: 600 }}>SIMULATED CPI</span>
            <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#0f172a' }}>{sandboxCPI}</div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: '#0369a1', fontWeight: 600 }}>SIMULATED SPI</span>
            <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#0f172a' }}>{sandboxSPI}</div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: '#0369a1', fontWeight: 600 }}>SIMULATED CV</span>
            <div style={{ fontWeight: 800, fontSize: '1.25rem', color: sandboxCV < 0 ? '#ef4444' : '#10b981' }}>
              PKR {sandboxCV.toLocaleString()}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: '#0369a1', fontWeight: 600 }}>SIMULATED EAC</span>
            <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#0f172a' }}>
              PKR {sandboxEAC.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvmAnalysis;
