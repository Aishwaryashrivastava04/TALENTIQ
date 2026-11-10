import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Cpu,
  Calculator,
  Layers,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Table,
  HelpCircle,
  FileQuestion,
  X,
  Compass,
  ShieldCheck,
  Building,
  MapPin,
  GraduationCap
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import SectionHeading from '../components/SectionHeading';
import { mlService } from '../services/api';

export default function SalaryPrediction({ user }) {
  const [formData, setFormData] = useState({
    experience_years: 4.5,
    education_level: 'MCA',
    job_role: 'Full Stack Developer',
    technical_skills_count: 6,
    location: 'Bengaluru',
    company_size: 'ENTERPRISE',
    algorithm: 'random_forest' // 'linear_regression' | 'random_forest'
  });

  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [modelMetrics, setModelMetrics] = useState(null);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState(null);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const res = await mlService.getModelMetrics();
        if (res.data && res.data.metrics) {
          setModelMetrics(res.data.metrics);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadMetrics();
    // Run an initial default prediction for immediate interactive display
    handlePredict();
  }, []);

  const handlePredict = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await mlService.predictSalary({
        experience_years: parseFloat(formData.experience_years),
        education_level: formData.education_level,
        job_role: formData.job_role,
        technical_skills_count: parseInt(formData.technical_skills_count, 10),
        location: formData.location,
        company_size: formData.company_size
      });
      if (res.data) {
        setPredictionResult(res.data);
      }
    } catch (err) {
      alert('Error predicting salary: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuestions = async () => {
    setQuestionsLoading(true);
    setShowQuestionsModal(true);
    try {
      const res = await mlService.generateInterviewQuestions({
        candidate_skills: ['Python', 'React.js', 'Node.js', 'MySQL', 'Docker'],
        job_role: formData.job_role,
        missing_skills: ['Kubernetes', 'Redis Architecture']
      });
      if (res.data && res.data.data) {
        setGeneratedQuestions(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setQuestionsLoading(false);
    }
  };

  const selectedSalary = formData.algorithm === 'linear_regression'
    ? (predictionResult?.linear_regression?.predicted_salary_inr || 1420000)
    : (predictionResult?.random_forest?.predicted_salary_inr || 1480000);

  const selectedLPA = (selectedSalary / 100000).toFixed(2);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Section Heading */}
      <SectionHeading
        title="SALARY PREDICTION WORKSPACE"
        subtitle="Multi-model compensation benchmarking comparing Ordinary Least Squares Regression with Random Forest ensembles."
        action={
          <button
            onClick={handleGenerateQuestions}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Sparkles size={14} color="#0060A8" /> Generate AI Interview Questions
          </button>
        }
      />

      {/* Main Two-Panel Workspace */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* LEFT PANEL: Candidate Input Form */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #E5EAF0', paddingBottom: '0.85rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0060A8', textTransform: 'uppercase', margin: 0 }}>
              Feature Inputs
            </h3>
            <div style={{ fontSize: '0.78rem', color: '#6C6C6C', marginTop: '2px' }}>
              Candidate attributes encoded into predictive compensation model
            </div>
          </div>

          <form onSubmit={handlePredict} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {/* Algorithm Selector */}
            <div>
              <label className="form-label">Predictive Estimation Model</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, algorithm: 'random_forest' })}
                  style={{
                    padding: '0.65rem',
                    borderRadius: '8px',
                    border: formData.algorithm === 'random_forest' ? '2px solid #0060A8' : '1px solid #E5EAF0',
                    backgroundColor: formData.algorithm === 'random_forest' ? 'rgba(0, 96, 168, 0.06)' : '#FFFFFF',
                    color: formData.algorithm === 'random_forest' ? '#0060A8' : '#6C6C6C',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  Random Forest (100 Trees)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, algorithm: 'linear_regression' })}
                  style={{
                    padding: '0.65rem',
                    borderRadius: '8px',
                    border: formData.algorithm === 'linear_regression' ? '2px solid #0060A8' : '1px solid #E5EAF0',
                    backgroundColor: formData.algorithm === 'linear_regression' ? 'rgba(0, 96, 168, 0.06)' : '#FFFFFF',
                    color: formData.algorithm === 'linear_regression' ? '#0060A8' : '#6C6C6C',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  Linear Regression (OLS)
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label">Experience (Years) *</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="30"
                  required
                  className="form-control"
                  value={formData.experience_years}
                  onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Education Degree *</label>
                <select
                  className="form-control"
                  value={formData.education_level}
                  onChange={(e) => setFormData({ ...formData, education_level: e.target.value })}
                >
                  <option value="BCA">BCA (Undergraduate)</option>
                  <option value="MCA">MCA (Master of Computer Apps)</option>
                  <option value="BTECH">B.Tech (Engineering)</option>
                  <option value="MTECH">M.Tech (Advanced Engineering)</option>
                  <option value="PHD">Ph.D (Doctorate)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="form-label">Standard Job Role *</label>
              <select
                className="form-control"
                value={formData.job_role}
                onChange={(e) => setFormData({ ...formData, job_role: e.target.value })}
              >
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="ML Engineer">ML Engineer / AI Specialist</option>
                <option value="Java Developer">Java Developer / Enterprise</option>
                <option value="Data Analyst">Data Analyst / BI Specialist</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="DevOps Engineer">DevOps & Cloud Engineer</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label">Skills Count *</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  required
                  className="form-control"
                  value={formData.technical_skills_count}
                  onChange={(e) => setFormData({ ...formData, technical_skills_count: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Company Tier *</label>
                <select
                  className="form-control"
                  value={formData.company_size}
                  onChange={(e) => setFormData({ ...formData, company_size: e.target.value })}
                >
                  <option value="STARTUP">Startup (1-50 employees)</option>
                  <option value="MID_SIZE">Mid-Size (50-500 employees)</option>
                  <option value="ENTERPRISE">Enterprise (500+ employees)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="form-label">Location / Tier *</label>
              <select
                className="form-control"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              >
                <option value="Bengaluru">Bengaluru (Tier 1 Primary)</option>
                <option value="Hyderabad">Hyderabad (Tier 1 Tech)</option>
                <option value="Pune">Pune (Tech & Banking)</option>
                <option value="Mumbai">Mumbai (Financial Capital)</option>
                <option value="Delhi-NCR">Delhi-NCR (Enterprise Hub)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', height: '46px', marginTop: '0.75rem' }}
            >
              {loading ? 'Evaluating ML Inference...' : 'Calculate Predicted Compensation'}
            </button>
          </form>
        </div>

        {/* RIGHT PANEL: Prediction Results & Model Comparison */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Main Compensation Output Card */}
          <div className="card" style={{
            borderLeft: '4px solid #0060A8',
            padding: '2rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="badge badge-blue">
                  {formData.algorithm === 'random_forest' ? 'Random Forest Model' : 'Linear Regression Model'}
                </span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#6C6C6C', textTransform: 'uppercase', marginTop: '0.5rem', marginBottom: '0.2rem' }}>
                  Predicted Annual Compensation
                </h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0060A8', letterSpacing: '-0.03em' }}>
                  ₹{parseInt(selectedSalary, 10).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#16845B', marginTop: '2px' }}>
                  ₹{selectedLPA} LPA (Lakhs Per Annum)
                </div>
              </div>

              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: '#F1F5F8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0060A8'
              }}>
                <TrendingUp size={28} />
              </div>
            </div>

            {/* Model Comparison Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginTop: '1.75rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid #E5EAF0'
            }}>
              <div style={{ padding: '0.85rem', backgroundColor: '#F1F5F8', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.74rem', color: '#6C6C6C' }}>Linear Regression (OLS)</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#031120', marginTop: '2px' }}>
                  ₹{(predictionResult?.linear_regression?.predicted_salary_lpa || 14.2).toFixed(2)} LPA
                </div>
                <div style={{ fontSize: '0.7rem', color: '#0060A8', fontWeight: 600, marginTop: '2px' }}>
                  CV R² = 94.99% (±0.004)
                </div>
              </div>

              <div style={{ padding: '0.85rem', backgroundColor: '#F1F5F8', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.74rem', color: '#6C6C6C' }}>Random Forest (100 Trees)</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#031120', marginTop: '2px' }}>
                  ₹{(predictionResult?.random_forest?.predicted_salary_lpa || 14.8).toFixed(2)} LPA
                </div>
                <div style={{ fontSize: '0.7rem', color: '#16845B', fontWeight: 600, marginTop: '2px' }}>
                  CV R² = 93.12% (±0.014)
                </div>
              </div>
            </div>
          </div>

          {/* Explainable Decomposition Breakdown Table */}
          {predictionResult?.linear_regression?.explainable_decomposition && (
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0060A8', textTransform: 'uppercase', margin: 0 }}>
                  Explainable Feature Decomposition (OLS)
                </h4>
                <div style={{ fontSize: '0.74rem', color: '#6C6C6C', marginTop: '2px' }}>
                  Additive decomposition: Base Pay + Experience + Degree + Role + Tier
                </div>
              </div>

              <div className="table-responsive" style={{ border: 'none' }}>
                <table className="table-custom">
                  <thead>
                    <tr>
                      <th>Model Component</th>
                      <th>Feature Detail</th>
                      <th style={{ textAlign: 'right' }}>Contribution (INR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {predictionResult.linear_regression.explainable_decomposition.map((row, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{row.component}</td>
                        <td style={{ color: '#6C6C6C', fontSize: '0.8rem' }}>{row.detail}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: row.contribution_inr >= 0 ? '#0060A8' : '#D94C4C' }}>
                          {row.contribution_inr >= 0 ? '+' : ''}₹{row.contribution_inr.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Academic Integrity Disclaimer */}
          <div style={{
            padding: '1rem 1.25rem',
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            border: '1px solid #E5EAF0',
            borderLeft: '4px solid #D99524',
            display: 'flex',
            gap: '0.75rem',
            fontSize: '0.8rem',
            color: '#6C6C6C',
            lineHeight: 1.5
          }}>
            <ShieldAlert size={18} color="#D99524" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Institutional Compensation Advisory:</strong> Predicted figures are statistical estimates derived from 1,500 training records. They do not constitute guaranteed wage compensation and must be evaluated alongside candidate interviews and organizational budget frameworks.
            </div>
          </div>
        </div>
      </div>

      {/* Modal: AI Interview Questions Generator */}
      {showQuestionsModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E5EAF0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: '#0060A8', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#031120', margin: 0 }}>
                    AI Interview Questions Generator
                  </h3>
                  <div style={{ fontSize: '0.74rem', color: '#6C6C6C' }}>Role-tailored interview curriculum for {formData.job_role}</div>
                </div>
              </div>
              <button onClick={() => setShowQuestionsModal(false)} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {questionsLoading ? (
                <div style={{ padding: '2.5rem', textAlign: 'center', color: '#9CA3AF' }}>
                  Synthesizing questions across technical competency, system architecture, and behavioral assessment...
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Technical Questions */}
                  <div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0060A8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      1. Core Technical Competency Questions
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {(generatedQuestions?.technical_questions || [
                        'Explain your approach to optimizing slow MySQL queries involving complex multiple JOIN operations and indexing strategies.',
                        'How do you manage client-side vs server-side state in complex React.js frontends to minimize unnecessary DOM re-renders?'
                      ]).map((q, i) => (
                        <div key={i} style={{ padding: '0.75rem', backgroundColor: '#F1F5F8', borderRadius: '8px', fontSize: '0.82rem', color: '#031120' }}>
                          <strong>Q{i+1}:</strong> {q}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Architecture Questions */}
                  <div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0060A8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      2. System Architecture & Scalability
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {(generatedQuestions?.architecture_questions || [
                        'How would you architect a resilient REST API with database fallback when external microservices encounter rate limits?',
                        'Describe how you enforce ACID transactions across multiple relational entities during an atomic candidate hire workflow.'
                      ]).map((q, i) => (
                        <div key={i} style={{ padding: '0.75rem', backgroundColor: '#F1F5F8', borderRadius: '8px', fontSize: '0.82rem', color: '#031120' }}>
                          <strong>Q{i+1}:</strong> {q}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Behavioral Questions */}
                  <div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0060A8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      3. Behavioral & Delivery Focus
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {(generatedQuestions?.behavioral_questions || [
                        'Tell us about a time when you had to balance urgent product delivery deadlines with long-term software maintainability and test coverage.',
                        'How do you mentor junior developers while reviewing pull requests for database query performance and security vulnerabilities?'
                      ]).map((q, i) => (
                        <div key={i} style={{ padding: '0.75rem', backgroundColor: '#F1F5F8', borderRadius: '8px', fontSize: '0.82rem', color: '#031120' }}>
                          <strong>Q{i+1}:</strong> {q}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button onClick={() => setShowQuestionsModal(false)} className="btn btn-secondary btn-sm">
                  Close Generator
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
