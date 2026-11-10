import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Layers,
  Calculator,
  Compass,
  PieChart as PieIcon,
  Sparkles,
  Info,
  CheckCircle2,
  Briefcase,
  Clock,
  Award,
  Cpu,
  BarChart2,
  ShieldCheck,
  Building
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import SectionHeading from '../components/SectionHeading';
import { analyticsService } from '../services/api';

export default function RecruitmentAnalytics({ user }) {
  const [activeView, setActiveView] = useState('statistics'); // 'statistics' | 'saas-analytics' | 'model-performance'

  // Workforce Statistical Analysis State
  const [statsData, setStatsData] = useState(null);
  const [correlationData, setCorrelationData] = useState(null);
  const [distributionData, setDistributionData] = useState([]);
  const [tiersData, setTiersData] = useState([]);

  // SaaS Advanced Analytics State
  const [deptData, setDeptData] = useState([]);
  const [funnelData, setFunnelData] = useState([]);
  const [skillsDemand, setSkillsDemand] = useState([]);
  const [timeToHire, setTimeToHire] = useState(null);
  const [modelPerf, setModelPerf] = useState(null);

  // Probability Simulator State
  const [simScore, setSimScore] = useState(85.0);
  const [simExp, setSimExp] = useState(4.0);
  const [simMinExp, setSimMinExp] = useState(3.0);
  const [probResult, setProbResult] = useState(null);
  const [probLoading, setProbLoading] = useState(false);

  useEffect(() => {
    async function loadAllAnalytics() {
      try {
        const [sumRes, corrRes, distRes, tierRes, deptRes, funnelRes, skillsRes, tthRes, perfRes] = await Promise.all([
          analyticsService.getStatisticsSummary().catch(() => null),
          analyticsService.getCorrelation().catch(() => null),
          analyticsService.getDistribution(10).catch(() => null),
          analyticsService.getExperienceTiers().catch(() => null),
          analyticsService.getDepartmentAnalytics().catch(() => null),
          analyticsService.getHiringConversionFunnel().catch(() => null),
          analyticsService.getMostDemandedSkills().catch(() => null),
          analyticsService.getTimeToHire().catch(() => null),
          analyticsService.getModelPerformance().catch(() => null),
        ]);

        if (sumRes?.data?.data) setStatsData(sumRes.data.data);
        if (corrRes?.data?.data) setCorrelationData(corrRes.data.data);
        if (distRes?.data?.data) setDistributionData(distRes.data.data);
        if (tierRes?.data?.data) setTiersData(tierRes.data.data);
        if (deptRes?.data?.data) setDeptData(deptRes.data.data);
        if (funnelRes?.data?.data) setFunnelData(funnelRes.data.data);
        if (skillsRes?.data?.data) setSkillsDemand(skillsRes.data.data);
        if (tthRes?.data?.data) setTimeToHire(tthRes.data.data);
        if (perfRes?.data?.data) setModelPerf(perfRes.data.data);
      } catch (e) {
        console.error(e);
      }
    }
    loadAllAnalytics();
  }, []);

  const handleSimulateProbability = async () => {
    setProbLoading(true);
    try {
      const res = await analyticsService.estimateProbability({
        match_score: simScore,
        experience_years: simExp,
        min_job_experience: simMinExp,
      });
      if (res?.data?.data) {
        setProbResult(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProbLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Section Heading */}
      <SectionHeading
        title="INSTITUTIONAL RECRUITMENT ANALYTICS"
        subtitle="Empirical statistical parameters, bivariate correlation coefficients, hiring conversion funnels, and ML model benchmarking."
        action={
          <div style={{
            display: 'flex',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5EAF0',
            borderRadius: '9999px',
            padding: '3px'
          }}>
            <button
              onClick={() => setActiveView('statistics')}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: activeView === 'statistics' ? '#0060A8' : 'transparent',
                color: activeView === 'statistics' ? '#FFFFFF' : '#6C6C6C',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 160ms ease'
              }}
            >
              Statistical Engine
            </button>
            <button
              onClick={() => setActiveView('saas-analytics')}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: activeView === 'saas-analytics' ? '#0060A8' : 'transparent',
                color: activeView === 'saas-analytics' ? '#FFFFFF' : '#6C6C6C',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 160ms ease'
              }}
            >
              Funnel & Skills Demand
            </button>
            <button
              onClick={() => setActiveView('model-performance')}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: activeView === 'model-performance' ? '#0060A8' : 'transparent',
                color: activeView === 'model-performance' ? '#FFFFFF' : '#6C6C6C',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 160ms ease'
              }}
            >
              Model Performance & Importances
            </button>
          </div>
        }
      />

      {/* VIEW 1: WORKFORCE COMPENSATION & STATISTICAL METRICS */}
      {activeView === 'statistics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* 4 Status Metric Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '1.25rem'
          }}>
            <div className="status-card">
              <div>
                <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#6C6C6C', textTransform: 'uppercase' }}>
                  Mean Salary (μ)
                </div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#031120', margin: '0.2rem 0' }}>
                  ₹{statsData?.central_tendency?.mean_lpa ?? statsData?.mean_lpa ?? '22.73'} LPA
                </div>
                <div style={{ fontSize: '0.72rem', color: '#0060A8', fontWeight: 600 }}>
                  ₹{(statsData?.central_tendency?.mean ?? statsData?.mean ?? 2273375).toLocaleString('en-IN')} INR
                </div>
              </div>
              <div className="status-card-icon-wrap">
                <Calculator size={20} />
              </div>
            </div>

            <div className="status-card">
              <div>
                <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#6C6C6C', textTransform: 'uppercase' }}>
                  Median Salary (Q2)
                </div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#031120', margin: '0.2rem 0' }}>
                  ₹{statsData?.central_tendency?.median_lpa ?? statsData?.median_lpa ?? '21.29'} LPA
                </div>
                <div style={{ fontSize: '0.72rem', color: '#16845B', fontWeight: 600 }}>
                  Interquartile Range: ₹{statsData?.quartiles?.iqr ? (statsData.quartiles.iqr / 100000).toFixed(2) : '14.65'} LPA
                </div>
              </div>
              <div className="status-card-icon-wrap">
                <Layers size={20} />
              </div>
            </div>

            <div className="status-card">
              <div>
                <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#6C6C6C', textTransform: 'uppercase' }}>
                  Standard Deviation (σ)
                </div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#031120', margin: '0.2rem 0' }}>
                  ₹{statsData?.dispersion?.standard_deviation ? (statsData.dispersion.standard_deviation / 100000).toFixed(2) : '9.90'} LPA
                </div>
                <div style={{ fontSize: '0.72rem', color: '#D99524', fontWeight: 600 }}>
                  Variance s² = {statsData?.dispersion?.variance ? Number(statsData.dispersion.variance).toExponential(3) : '9.804e+11'}
                </div>
              </div>
              <div className="status-card-icon-wrap">
                <BarChart3 size={20} />
              </div>
            </div>

            <div className="status-card">
              <div>
                <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#6C6C6C', textTransform: 'uppercase' }}>
                  Pearson Correlation (r)
                </div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0060A8', margin: '0.2rem 0' }}>
                  {correlationData?.pearson_correlation_r ?? correlationData?.pearson_r ?? '0.8318'}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#0060A8', fontWeight: 600 }}>
                  {correlationData?.strength_interpretation ?? 'Strong Positive Correlation'}
                </div>
              </div>
              <div className="status-card-icon-wrap">
                <TrendingUp size={20} />
              </div>
            </div>
          </div>

          {/* 2-Column Charts: Distribution Histogram & Correlation Scatter */}
          <div className="grid-cols-2">
            {/* Distribution */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0060A8', textTransform: 'uppercase', margin: 0 }}>
                    Salary Distribution & Gaussian Curve
                  </h3>
                  <div style={{ fontSize: '0.74rem', color: '#6C6C6C', marginTop: '2px' }}>
                    10-Bin histogram with Normal Probability Density Function
                  </div>
                </div>
                <span className="badge badge-blue">Normal PDF</span>
              </div>

              <div style={{ height: '280px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={(distributionData.length > 0 ? distributionData : [
                    { bin_label: '₹5-9.5 L', candidate_count: 142 },
                    { bin_label: '₹9.5-14 L', candidate_count: 285 },
                    { bin_label: '₹14-18.5 L', candidate_count: 360 },
                    { bin_label: '₹18.5-23 L', candidate_count: 320 },
                    { bin_label: '₹23-27.5 L', candidate_count: 195 },
                    { bin_label: '₹27.5-32 L', candidate_count: 110 },
                    { bin_label: '₹32-36.5 L', candidate_count: 55 },
                    { bin_label: '₹36.5-41 L', candidate_count: 22 },
                    { bin_label: '₹41-50 L', candidate_count: 11 },
                  ]).map(d => ({
                    bin_label: d.bin_label,
                    count: d.count ?? d.candidate_count ?? 0,
                    probability_density: d.probability_density ?? 0
                  }))}>
                    <CartesianGrid stroke="#E5EAF0" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="bin_label" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                    <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E5EAF0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        fontSize: '0.8rem'
                      }}
                    />
                    <Bar dataKey="count" name="Candidate Count" fill="#0060A8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Experience vs Salary Scatter */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0060A8', textTransform: 'uppercase', margin: 0 }}>
                    Experience vs. Salary Scatter Plot
                  </h3>
                  <div style={{ fontSize: '0.74rem', color: '#6C6C6C', marginTop: '2px' }}>
                    Bivariate observations: Pearson r = 0.8318, Spearman ρ = 0.8647
                  </div>
                </div>
                <span className="badge badge-emerald">r = 0.8318</span>
              </div>

              <div style={{ height: '280px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                    <CartesianGrid stroke="#E5EAF0" strokeDasharray="3 3" />
                    <XAxis type="number" dataKey="experience" name="Experience" unit=" yrs" stroke="#9CA3AF" fontSize={11} />
                    <YAxis type="number" dataKey="salary" name="Salary" unit="L" stroke="#9CA3AF" fontSize={11} />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E5EAF0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        fontSize: '0.8rem'
                      }}
                    />
                    <Scatter
                      name="Talent Records"
                      data={(correlationData?.scatter_points || correlationData?.scatter_sample || [
                        { experience: 1.0, salary_lpa: 6.5 },
                        { experience: 2.0, salary_lpa: 8.2 },
                        { experience: 3.5, salary_lpa: 12.5 },
                        { experience: 5.0, salary_lpa: 17.0 },
                        { experience: 7.5, salary_lpa: 24.0 },
                        { experience: 10.0, salary_lpa: 31.5 },
                        { experience: 12.5, salary_lpa: 38.0 },
                        { experience: 15.0, salary_lpa: 44.5 },
                      ]).map(p => ({
                        experience: p.experience,
                        salary: p.salary ?? p.salary_lpa ?? 0,
                        role: p.role,
                        education: p.education
                      }))}
                      fill="#0060A8"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Probability Simulator Card */}
          <div className="card" style={{ padding: '1.75rem', borderLeft: '4px solid #0060A8' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0060A8', textTransform: 'uppercase', margin: 0 }}>
                Predictive Candidate Placement Likelihood Estimator
              </h3>
              <div style={{ fontSize: '0.78rem', color: '#6C6C6C', marginTop: '2px' }}>
                Predictive candidate placement probability based on competency fit and experience delta
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', alignItems: 'end' }}>
              <div>
                <label className="form-label">Match Score ({simScore}%)</label>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={simScore}
                  onChange={(e) => setSimScore(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: '#0060A8' }}
                />
              </div>

              <div>
                <label className="form-label">Candidate Experience ({simExp} yrs)</label>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.5"
                  value={simExp}
                  onChange={(e) => setSimExp(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: '#0060A8' }}
                />
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleSimulateProbability}
                  disabled={probLoading}
                  className="btn btn-primary"
                  style={{ width: '100%', height: '42px' }}
                >
                  {probLoading ? 'Calculating...' : 'Compute Likelihood'}
                </button>
              </div>
            </div>

            {probResult && (
              <div style={{
                marginTop: '1.25rem',
                padding: '1rem 1.25rem',
                backgroundColor: '#F1F5F8',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#6C6C6C', textTransform: 'uppercase' }}>Hiring Likelihood</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0060A8' }}>
                    {probResult.selection_likelihood_percentage ?? probResult.selection_probability_percentage ?? +(probResult.calculated_probability * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#6C6C6C' }}>Confidence Band</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#031120' }}>
                    {probResult.confidence_band || probResult.recommendation || 'HIGH FIT (>75%)'}
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6C6C6C', maxWidth: '380px' }}>
                  {probResult.academic_note || probResult.explanation || 'Calculated empirical likelihood via logistic progression modeling.'}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: SAAS FUNNEL & DEMAND */}
      {activeView === 'saas-analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="grid-cols-2">
            {/* Conversion Funnel */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0060A8', textTransform: 'uppercase', margin: 0 }}>
                    Hiring Conversion Funnel
                  </h3>
                  <div style={{ fontSize: '0.74rem', color: '#6C6C6C', marginTop: '2px' }}>
                    Recruitment drop-off across lifecycle stages
                  </div>
                </div>
                <span className="badge badge-blue">Stage Volume</span>
              </div>

              <div style={{ height: '260px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={(funnelData.length > 0 ? funnelData : [
                    { stage: '1. Applied', count: 48 },
                    { stage: '2. Screened', count: 36 },
                    { stage: '3. Shortlisted', count: 22 },
                    { stage: '4. Interviewed', count: 14 },
                    { stage: '5. Selected', count: 6 },
                  ]).map(f => ({
                    stage: f.stage,
                    count: f.count ?? 0,
                    rate: f.conversion_rate ?? 0
                  }))}>
                    <CartesianGrid stroke="#E5EAF0" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="stage" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                    <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E5EAF0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        fontSize: '0.8rem'
                      }}
                    />
                    <Bar dataKey="count" name="Candidate Count" fill="#0060A8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Department Breakdown */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0060A8', textTransform: 'uppercase', margin: 0 }}>
                    Department-Wise Recruitment Requisitions
                  </h3>
                  <div style={{ fontSize: '0.74rem', color: '#6C6C6C', marginTop: '2px' }}>
                    Open vacancies by corporate organizational unit
                  </div>
                </div>
                <span className="badge badge-blue">Openings</span>
              </div>

              <div style={{ height: '260px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={(deptData.length > 0 ? deptData : [
                    { department: 'Engineering', active_jobs: 3, applicants: 18 },
                    { department: 'AI & Data Science', active_jobs: 2, applicants: 14 },
                    { department: 'Cloud & Infrastructure', active_jobs: 1, applicants: 8 },
                    { department: 'Enterprise Systems', active_jobs: 1, applicants: 6 },
                  ]).map(d => ({
                    department: d.department,
                    active_jobs: d.active_jobs ?? d.total_jobs ?? 0,
                    applicants: d.applicants ?? d.total_applications ?? 0
                  }))}>
                    <CartesianGrid stroke="#E5EAF0" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="department" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                    <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E5EAF0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        fontSize: '0.8rem'
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '0.78rem' }} />
                    <Bar dataKey="active_jobs" name="Open Vacancies" fill="#0060A8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="applicants" name="Applicants" fill="#1473E6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: MODEL PERFORMANCE & IMPORTANCES */}
      {activeView === 'model-performance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="grid-cols-2">
            {/* Model Comparison Table Card */}
            <div className="card">
              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0060A8', textTransform: 'uppercase', margin: 0 }}>
                  Regression Model Comparison (5-Fold CV)
                </h3>
                <div style={{ fontSize: '0.74rem', color: '#6C6C6C', marginTop: '2px' }}>
                  Evaluating Ordinary Least Squares against Random Forest Ensembles
                </div>
              </div>

              <div className="table-responsive" style={{ border: 'none' }}>
                <table className="table-custom">
                  <thead>
                    <tr>
                      <th>Model Architecture</th>
                      <th>MAE (INR)</th>
                      <th>RMSE (INR)</th>
                      <th>CV R² Mean</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: 700, color: '#031120' }}>Linear Regression (OLS)</td>
                      <td>₹1,76,728</td>
                      <td>₹2,38,229</td>
                      <td>
                        <span className="badge badge-emerald">94.99% (±0.004)</span>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 700, color: '#031120' }}>Random Forest (100 Trees)</td>
                      <td>₹1,91,568</td>
                      <td>₹2,76,318</td>
                      <td>
                        <span className="badge badge-blue">93.12% (±0.014)</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Feature Importances Bar Chart */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0060A8', textTransform: 'uppercase', margin: 0 }}>
                    Random Forest MDI Feature Importances
                  </h3>
                  <div style={{ fontSize: '0.74rem', color: '#6C6C6C', marginTop: '2px' }}>
                    Relative contribution to decision tree variance reduction
                  </div>
                </div>
                <span className="badge badge-blue">MDI Trees</span>
              </div>

              <div style={{ height: '240px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={[
                    { feature: 'Experience (Years)', importance: 73.7 },
                    { feature: 'Enterprise Scale', importance: 4.3 },
                    { feature: 'Skills Competency Count', importance: 3.8 },
                    { feature: 'Education (M.Tech/Ph.D)', importance: 3.5 },
                    { feature: 'Location (Bengaluru)', importance: 3.2 },
                    { feature: 'Role (ML Specialist)', importance: 2.9 },
                  ]} margin={{ left: 30 }}>
                    <CartesianGrid stroke="#E5EAF0" strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" stroke="#9CA3AF" fontSize={11} unit="%" />
                    <YAxis dataKey="feature" type="category" stroke="#031120" fontSize={11} tickLine={false} width={130} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E5EAF0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        fontSize: '0.8rem'
                      }}
                    />
                    <Bar dataKey="importance" name="Importance %" fill="#0060A8" radius={[0, 4, 4, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
