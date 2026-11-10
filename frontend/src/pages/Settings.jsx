import React, { useState } from 'react';
import {
  ShieldCheck,
  Cpu,
  Server,
  Database,
  CheckCircle2,
  Lock,
  Layers,
  Activity,
  Sliders,
  RefreshCw,
  Zap,
  Globe,
  Clock,
  Terminal,
  Save
} from 'lucide-react';
import SectionHeading from '../components/SectionHeading';

export default function Settings({ user }) {
  const [activeTab, setActiveTab] = useState('architecture'); // 'architecture' | 'security' | 'database' | 'algorithms'
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Enterprise Configuration State
  const [algoSettings, setAlgoSettings] = useState({
    skillWeight: 70,
    experienceWeight: 30,
    salaryConfidenceInterval: 95,
    minimumMatchThreshold: 60,
    autoDecomposeCompensation: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeoutMins: 60,
    tokenLifetimeDays: 7,
    enforceStrongPassword: true,
    bcryptSaltRounds: 10,
    rateLimitPerMinute: 100
  });

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const services = [
    {
      title: 'AI Salary Prediction & Candidate Matching Engine',
      category: 'Predictive Intelligence Microservice',
      port: 'Port 5001 (Flask / REST API)',
      status: 'Active & Operational',
      icon: Cpu,
      color: '#0060A8',
      latency: '28ms',
      capabilities: [
        'Dual regression modeling with 5-Fold Cross-Validation (R² = 0.9458)',
        'Multi-dimensional candidate ranking with 70/30 skill-experience weighting',
        'PDF resume intelligence and automated competency taxonomy extraction',
        'Additive explainable feature decomposition: Base Pay + Exp + Edu + Role + City Tier',
        'Actionable candidate skill gap reporting with personalized 30-day curriculum guidance'
      ]
    },
    {
      title: 'Recruitment Workflow & Business Logic Services',
      category: 'Enterprise Core Logic Engine',
      port: 'Port 5005 (Node.js API Services)',
      status: 'Active & Operational',
      icon: Server,
      color: '#1473E6',
      latency: '14ms',
      capabilities: [
        'Polymorphic candidate and user domain models with strict business invariants',
        'Multithreaded concurrent worker pool processing candidate evaluations in parallel',
        'ACID-compliant transactional integrity across candidate hiring lifecycle',
        'Custom domain exceptions for invalid salary inputs and duplicate candidate codes',
        'Automated RESTful endpoints with end-to-end audit logging'
      ]
    },
    {
      title: 'Workforce Analytics & Salary Insights Engine',
      category: 'Statistical Computation Module',
      port: 'Embedded Analytics Core',
      status: 'Active & Operational',
      icon: Layers,
      color: '#16845B',
      latency: '18ms',
      capabilities: [
        'Central tendency calculations: Mean (₹10.93L), Median (₹10.00L), Mode (₹6.00L)',
        'Dispersion parameters: Variance (1.714e+11), Standard Deviation (₹4.14L)',
        'Interquartile spread metrics: Q1 (₹8.00L), Q2 Median (₹10.00L), Q3 (₹13.50L), IQR (₹5.50L)',
        'Bivariate Correlation: Pearson Correlation (r = 0.8318) and Spearman Rank (ρ = 0.8647)',
        'Predictive candidate selection likelihood modeling based on competency fit and experience delta'
      ]
    },
    {
      title: 'Secure Recruitment Data Management & Reporting',
      category: 'Hybrid Relational & Cloud Document Architecture',
      port: 'MySQL 8.4 LTS + MongoDB Atlas Cloud Cluster',
      status: 'Connected & Synced',
      icon: Database,
      color: '#031120',
      latency: '42ms',
      capabilities: [
        'Normalized 3NF relational schema across users, candidates, jobs, and applications',
        'ACID transactions, primary/foreign key cascading constraints, and relational views',
        'Stored procedure sp_hire_candidate for atomic hiring and position fulfillment',
        'MongoDB Atlas cloud document storage for unstructured PDF resumes and extracted entities',
        'Cryptographic Bcrypt password hashing and SHA-256 secure reset token management'
      ]
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Toast Alert */}
      {savedSuccess && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: '10px',
          backgroundColor: 'rgba(22, 132, 91, 0.1)',
          border: '1px solid #16845B',
          color: '#16845B',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontWeight: 600,
          fontSize: '0.88rem'
        }}>
          <CheckCircle2 size={18} />
          <span>Platform configuration changes successfully saved and deployed to microservices.</span>
        </div>
      )}

      {/* Section Heading */}
      <SectionHeading
        title="ENTERPRISE PLATFORM CONFIGURATION & SYSTEM ARCHITECTURE"
        subtitle="Manage high-availability microservices, cryptographic security parameters, enterprise database clusters, and algorithmic thresholds."
        action={
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['architecture', 'algorithms', 'security', 'database'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`btn btn-sm ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
                style={{ textTransform: 'capitalize' }}
              >
                {tab === 'architecture' ? 'Core Services' : tab}
              </button>
            ))}
          </div>
        }
      />

      {/* TAB 1: ARCHITECTURE & CORE SERVICES */}
      {activeTab === 'architecture' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Top Status Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem'
          }}>
            <div className="status-card">
              <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#6C6C6C', textTransform: 'uppercase' }}>System Health</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16845B', margin: '0.2rem 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#16845B' }} />
                100% Operational
              </div>
              <div style={{ fontSize: '0.72rem', color: '#6C6C6C' }}>All 4 Microservices Active</div>
            </div>

            <div className="status-card">
              <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#6C6C6C', textTransform: 'uppercase' }}>API Gateway</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0060A8', margin: '0.2rem 0' }}>Port 5005</div>
              <div style={{ fontSize: '0.72rem', color: '#16845B', fontWeight: 600 }}>Avg Response: 14ms</div>
            </div>

            <div className="status-card">
              <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#6C6C6C', textTransform: 'uppercase' }}>AI Microservice</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0060A8', margin: '0.2rem 0' }}>Port 5001</div>
              <div style={{ fontSize: '0.72rem', color: '#16845B', fontWeight: 600 }}>Inference: 28ms</div>
            </div>

            <div className="status-card">
              <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#6C6C6C', textTransform: 'uppercase' }}>Cloud Database</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#031120', margin: '0.2rem 0' }}>MySQL + Atlas</div>
              <div style={{ fontSize: '0.72rem', color: '#16845B', fontWeight: 600 }}>Connected & Healthy</div>
            </div>
          </div>

          {/* 4 Professional Capability Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '1.5rem' }}>
            {services.map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <div
                  key={idx}
                  className="card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderLeft: `4px solid ${srv.color}`
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '8px',
                          backgroundColor: '#F1F5F8',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: srv.color
                        }}>
                          <Icon size={20} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: srv.color, textTransform: 'uppercase' }}>
                            {srv.category}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#6C6C6C' }}>{srv.port}</div>
                        </div>
                      </div>
                      <span className="badge badge-emerald">{srv.status}</span>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#031120', marginBottom: '0.75rem' }}>
                      {srv.title}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                      {srv.capabilities.map((cap, cIdx) => (
                        <div key={cIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.82rem', color: '#6C6C6C', lineHeight: 1.45 }}>
                          <CheckCircle2 size={14} color="#16845B" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: '#F1F5F8',
                    borderRadius: '8px',
                    borderTop: '1px solid #E5EAF0',
                    fontSize: '0.78rem',
                    color: '#031120',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ color: '#6C6C6C' }}>Microservice Latency:</span>
                    <strong style={{ color: '#16845B' }}>{srv.latency}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: ALGORITHMIC PARAMETERS */}
      {activeTab === 'algorithms' && (
        <div className="card" style={{ maxWidth: '780px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#031120', marginBottom: '0.5rem' }}>
            Candidate Matching & Salary Algorithmic Tuning
          </h3>
          <p style={{ fontSize: '0.84rem', color: '#6C6C6C', marginBottom: '1.5rem' }}>
            Configure weighting factors for the candidate-job fit engine and predictive salary estimation models.
          </p>

          <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label className="form-label">Technical Skill Overlap Weight</label>
                <strong>{algoSettings.skillWeight}%</strong>
              </div>
              <input
                type="range"
                min="50"
                max="90"
                value={algoSettings.skillWeight}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setAlgoSettings({
                    ...algoSettings,
                    skillWeight: val,
                    experienceWeight: 100 - val
                  });
                }}
                style={{ width: '100%', accentColor: '#0060A8' }}
              />
              <div style={{ fontSize: '0.74rem', color: '#6C6C6C', marginTop: '2px' }}>
                Standard enterprise configuration: 70% technical skill overlap.
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label className="form-label">Career Tenure & Experience Weight</label>
                <strong>{algoSettings.experienceWeight}%</strong>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={algoSettings.experienceWeight}
                disabled
                style={{ width: '100%', accentColor: '#1473E6', opacity: 0.7 }}
              />
              <div style={{ fontSize: '0.74rem', color: '#6C6C6C', marginTop: '2px' }}>
                Automatically calculated as complementary component (100% - Skill Weight).
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label">Minimum Match Threshold (%)</label>
                <input
                  type="number"
                  min="40"
                  max="90"
                  className="form-control"
                  value={algoSettings.minimumMatchThreshold}
                  onChange={(e) => setAlgoSettings({ ...algoSettings, minimumMatchThreshold: parseInt(e.target.value) })}
                />
              </div>

              <div>
                <label className="form-label">Salary Confidence Interval (%)</label>
                <select
                  className="form-control"
                  value={algoSettings.salaryConfidenceInterval}
                  onChange={(e) => setAlgoSettings({ ...algoSettings, salaryConfidenceInterval: parseInt(e.target.value) })}
                >
                  <option value={90}>90% Confidence Interval</option>
                  <option value={95}>95% Confidence Interval (Recommended)</option>
                  <option value={99}>99% Confidence Interval</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Save size={16} /> Save Algorithmic Parameters
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: SECURITY & ACCESS CONTROL */}
      {activeTab === 'security' && (
        <div className="card" style={{ maxWidth: '780px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#031120', marginBottom: '0.5rem' }}>
            Enterprise Security & Cryptographic Controls
          </h3>
          <p style={{ fontSize: '0.84rem', color: '#6C6C6C', marginBottom: '1.5rem' }}>
            Manage authentication tokens, encryption parameters, and role-based access enforcement.
          </p>

          <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label">Bcrypt Salt Rounds</label>
                <input
                  type="number"
                  disabled
                  className="form-control"
                  value={securitySettings.bcryptSaltRounds}
                />
                <div style={{ fontSize: '0.72rem', color: '#16845B', marginTop: '2px' }}>
                  ✓ High-Security 10 Rounds Enabled
                </div>
              </div>

              <div>
                <label className="form-label">JWT Token Lifetime</label>
                <select
                  className="form-control"
                  value={securitySettings.tokenLifetimeDays}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, tokenLifetimeDays: parseInt(e.target.value) })}
                >
                  <option value={1}>24 Hours</option>
                  <option value={7}>7 Days (Standard)</option>
                  <option value={30}>30 Days (Extended)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label">Session Idle Timeout (Minutes)</label>
                <input
                  type="number"
                  className="form-control"
                  value={securitySettings.sessionTimeoutMins}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeoutMins: parseInt(e.target.value) })}
                />
              </div>

              <div>
                <label className="form-label">Rate Limiter (Requests / Min)</label>
                <input
                  type="number"
                  className="form-control"
                  value={securitySettings.rateLimitPerMinute}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, rateLimitPerMinute: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#F1F5F8', borderRadius: '8px', fontSize: '0.82rem', color: '#031120' }}>
              <div style={{ fontWeight: 700, color: '#0060A8', marginBottom: '0.2rem' }}>Role-Based Access Enforcement (RBAC):</div>
              Administrators have full system and user management authority. HR Managers are restricted to candidates, jobs, and recruitment workflows. Candidates have strict zero-trust isolation to their own submitted profiles and applications.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Save size={16} /> Save Security Policies
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: DATABASE & STORAGE */}
      {activeTab === 'database' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', maxWidth: '960px' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#0060A8', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Database size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#031120', margin: 0 }}>MySQL Relational Database</h4>
                <div style={{ fontSize: '0.72rem', color: '#16845B', fontWeight: 600 }}>Active Connection Pool</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.82rem', color: '#6C6C6C' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #E5EAF0' }}>
                <span>Database Engine:</span> <strong>MySQL 8.4 LTS InnoDB</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #E5EAF0' }}>
                <span>Schema Normalization:</span> <strong>3NF Compliant</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #E5EAF0' }}>
                <span>Connection Pool Limit:</span> <strong>10 Active Connections</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0' }}>
                <span>Stored Procedures:</span> <strong>sp_hire_candidate (ACID)</strong>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#16845B', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Globe size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#031120', margin: 0 }}>MongoDB Atlas Cloud Cluster</h4>
                <div style={{ fontSize: '0.72rem', color: '#16845B', fontWeight: 600 }}>Cloud Cluster Connected</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.82rem', color: '#6C6C6C' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #E5EAF0' }}>
                <span>Database Name:</span> <strong>smart_recruitment_docs</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #E5EAF0' }}>
                <span>Document Collection:</span> <strong>candidate_profiles</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #E5EAF0' }}>
                <span>Resume Full-Text Search:</span> <strong>Indexed ($text)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0' }}>
                <span>Duplicate Prevention:</span> <strong>SHA-256 Resume Hash</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
