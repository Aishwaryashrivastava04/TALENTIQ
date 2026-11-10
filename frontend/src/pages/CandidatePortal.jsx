import React, { useState, useEffect } from 'react';
import {
  User,
  Briefcase,
  FileCheck,
  TrendingUp,
  Upload,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  MapPin,
  GraduationCap,
  Award,
  Search,
  AlertCircle,
  ShieldCheck,
  Send,
  Calendar,
  Video,
  FileText,
  Star,
  Crown,
  Lock,
  Unlock,
  CreditCard,
  Check,
  RotateCcw,
  Receipt,
  BookOpen,
  X
} from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import ResumeBuilder from '../components/ResumeBuilder';
import SalaryInsights from './SalaryInsights';
import {
  jobService,
  applicationService,
  mlService,
  candidateService,
  membershipService
} from '../services/api';

export default function CandidatePortal({ user }) {
  // 'overview' | 'resume-builder' | 'jobs' | 'applications' | 'interviews' | 'salary-insights' | 'profile' | 'membership'
  const [activeSubTab, setActiveSubTab] = useState('overview');

  const [profile, setProfile] = useState({
    first_name: user?.full_name?.split(' ')[0] || 'Rahul',
    last_name: user?.full_name?.split(' ').slice(1).join(' ') || 'Verma',
    email: user?.email || 'candidate.rahul@gmail.com',
    phone: user?.phone || '+91 9912345672',
    experience_years: 3.5,
    education_level: 'MCA',
    current_salary: 720000,
    expected_salary: 1000000,
    location: 'Bengaluru',
    skills: ['Python', 'React.js', 'Node.js', 'MySQL', 'MongoDB', 'Docker'],
  });

  const [jobs, setJobs] = useState([]);
  const [jobSearch, setJobSearch] = useState('');
  const [jobDeptFilter, setJobDeptFilter] = useState('');
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [parsingLoading, setParsingLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [applySuccess, setApplySuccess] = useState('');
  const [loading, setLoading] = useState(true);

  // Premium Membership State
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [subLoading, setSubLoading] = useState(false);
  const [activePremiumTool, setActivePremiumTool] = useState('interview'); // 'interview' | 'resume' | 'roadmap' | 'invoices'
  const [mockInterviewData, setMockInterviewData] = useState(null);
  const [mockInterviewLoading, setMockInterviewLoading] = useState(false);
  const [targetMockRole, setTargetMockRole] = useState('Full Stack Developer');
  const [resumeReviewData, setResumeReviewData] = useState(null);
  const [resumeReviewLoading, setResumeReviewLoading] = useState(false);
  const [careerRoadmapData, setCareerRoadmapData] = useState(null);
  const [careerRoadmapLoading, setCareerRoadmapLoading] = useState(false);
  const [targetSalaryLpa, setTargetSalaryLpa] = useState('18.0');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [upgradeCycle, setUpgradeCycle] = useState('MONTHLY');
  const [upgrading, setUpgrading] = useState(false);

  // Fallback simulated interview rounds for candidate
  const defaultCandidateInterviews = [
    {
      id: 1,
      application_id: 1,
      job_title: 'Senior Full-Stack Developer',
      candidate_name: 'Rahul Verma',
      round_number: 1,
      round_name: 'Technical Screening & Architecture',
      scheduled_at: '2026-11-12T14:30:00Z',
      interviewer_name: 'Vikram Malhotra (Lead Architect)',
      interview_type: 'VIDEO',
      meeting_url: 'https://meet.google.com/tq-tech-eval',
      status: 'SCHEDULED',
      feedback: 'Upcoming technical assessment focusing on React 18, Node.js concurrency, and MySQL transactional constraints.'
    },
    {
      id: 2,
      application_id: 2,
      job_title: 'AI & Machine Learning Engineer',
      candidate_name: 'Rahul Verma',
      round_number: 2,
      round_name: 'System Design & Model Optimization',
      scheduled_at: '2026-11-15T11:00:00Z',
      interviewer_name: 'Dr. Sameer Sen (Head of AI)',
      interview_type: 'VIDEO',
      meeting_url: 'https://meet.google.com/tq-ai-round',
      status: 'SCHEDULED',
      feedback: 'Candidate demonstrated strong engineering architecture and data modeling competencies during Round 1.'
    }
  ];

  const loadSubscription = async () => {
    setSubLoading(true);
    try {
      const res = await membershipService.getMySubscription();
      if (res.data?.data) {
        setSubscriptionData(res.data.data);
      }
    } catch (e) {
      console.warn('Membership load error:', e);
    } finally {
      setSubLoading(false);
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [jobsRes, appsRes, intRes, subRes] = await Promise.all([
          jobService.getAll().catch(() => null),
          applicationService.getAll().catch(() => null),
          applicationService.getAllInterviews().catch(() => null),
          membershipService.getMySubscription().catch(() => null)
        ]);

        if (jobsRes && jobsRes.data && jobsRes.data.data) {
          setJobs(jobsRes.data.data);
        }
        if (appsRes && appsRes.data && appsRes.data.data) {
          setApplications(appsRes.data.data);
        }
        if (intRes && intRes.data && intRes.data.data && intRes.data.data.length > 0) {
          setInterviews(intRes.data.data);
        } else {
          setInterviews(defaultCandidateInterviews);
        }
        if (subRes && subRes.data && subRes.data.data) {
          setSubscriptionData(subRes.data.data);
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Premium feature loaders
  const handleLoadMockInterview = async () => {
    setMockInterviewLoading(true);
    try {
      const res = await membershipService.getAiMockInterview({
        role: targetMockRole,
        experience_years: profile.experience_years
      });
      if (res.data?.data) {
        setMockInterviewData(res.data.data);
      }
    } catch (e) {
      alert('Mock interview generation failed: ' + (e.response?.data?.message || e.message));
    } finally {
      setMockInterviewLoading(false);
    }
  };

  const handleLoadResumeReview = async () => {
    setResumeReviewLoading(true);
    try {
      const res = await membershipService.getAiResumeReview({
        skills: profile.skills,
        experience_years: profile.experience_years,
        target_role: 'Full Stack Developer'
      });
      if (res.data?.data) {
        setResumeReviewData(res.data.data);
      }
    } catch (e) {
      alert('Resume review failed: ' + (e.response?.data?.message || e.message));
    } finally {
      setResumeReviewLoading(false);
    }
  };

  const handleLoadCareerRoadmap = async () => {
    setCareerRoadmapLoading(true);
    try {
      const res = await membershipService.getCareerRoadmap({
        current_role: 'Full Stack Developer',
        target_salary_lpa: parseFloat(targetSalaryLpa) || 18.0,
        experience_years: profile.experience_years
      });
      if (res.data?.data) {
        setCareerRoadmapData(res.data.data);
      }
    } catch (e) {
      alert('Roadmap generation failed: ' + (e.response?.data?.message || e.message));
    } finally {
      setCareerRoadmapLoading(false);
    }
  };

  const handleUpgradeSimulated = async (cycle) => {
    setUpgrading(true);
    try {
      const res = await membershipService.simulateTestPayment({
        plan_code: cycle === 'YEARLY' ? 'PREMIUM_YEARLY' : 'PREMIUM_MONTHLY',
        billing_cycle: cycle,
        userName: `${profile.first_name} ${profile.last_name}`,
        userEmail: profile.email
      });
      if (res.data?.success) {
        setApplySuccess('🎉 TALENTIQ Premium activated successfully!');
        setTimeout(() => setApplySuccess(''), 4500);
        await loadSubscription();
      }
    } catch (e) {
      alert('Upgrade error: ' + (e.response?.data?.message || e.message));
    } finally {
      setUpgrading(false);
    }
  };

  const handleCancelAutoRenew = async () => {
    if (!window.confirm('Are you sure you want to cancel auto-renewal? Your Premium benefits will remain active until the end of your billing cycle.')) return;
    try {
      const res = await membershipService.cancelSubscription();
      if (res.data?.success) {
        setApplySuccess('Subscription auto-renewal cancelled.');
        setTimeout(() => setApplySuccess(''), 4500);
        await loadSubscription();
      }
    } catch (e) {
      alert('Error: ' + (e.response?.data?.message || e.message));
    }
  };

  const handleMatchWithJob = async (job) => {
    setSelectedJob(job);
    setMatchResult(null);

    const roleSkillsMap = {
      'Full Stack Developer': ['React.js', 'Node.js', 'MySQL', 'JavaScript', 'REST APIs', 'Git'],
      'ML Engineer': ['Python', 'Scikit-learn', 'TensorFlow', 'NLP', 'Pandas', 'Flask'],
      'Java Developer': ['Java', 'Spring Boot', 'MySQL', 'JDBC', 'Microservices', 'REST APIs'],
      'Data Analyst': ['SQL', 'Python', 'Pandas', 'PowerBI', 'Tableau', 'Statistics'],
    };
    const reqSkills = roleSkillsMap[job.job_role] || ['Python', 'SQL', 'Git'];

    try {
      const res = await mlService.matchCandidate({
        candidate_skills: profile.skills,
        candidate_experience: profile.experience_years,
        job_required_skills: reqSkills,
        job_min_experience: job.min_experience,
        job_max_experience: job.max_experience,
      });

      if (res.data && res.data.data) {
        setMatchResult(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleApplyToJob = async (job) => {
    try {
      await applicationService.create({
        candidate_id: 4,
        job_id: job.id,
        match_score: matchResult?.final_match_score || 88,
        status: 'APPLIED',
        notes: 'Applied through Candidate Self-Service Workspace'
      });
      setApplySuccess(`Application successfully submitted for ${job.title}!`);
      setTimeout(() => setApplySuccess(''), 4000);
      const appsRes = await applicationService.getAll();
      if (appsRes.data && appsRes.data.data) {
        setApplications(appsRes.data.data);
      }
    } catch (e) {
      alert('Application failed: ' + (e.response?.data?.message || e.message));
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setResumeFile(file);
    setParsingLoading(true);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await mlService.parseResume(formData);
      if (res.data && res.data.data) {
        const parsed = res.data.data;
        setProfile(prev => ({
          ...prev,
          experience_years: parsed.experience_years || prev.experience_years,
          education_level: parsed.education_level || prev.education_level,
          skills: parsed.skills?.length > 0 ? parsed.skills : prev.skills
        }));
        setSaveSuccess('Resume parsed! Profile skills and experience updated.');
        setTimeout(() => setSaveSuccess(''), 4000);
      }
    } catch (err) {
      alert('Error parsing resume: ' + err.message);
    } finally {
      setParsingLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Toast Alert */}
      {(applySuccess || saveSuccess) && (
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
          fontSize: '0.86rem'
        }}>
          <CheckCircle2 size={18} />
          <span>{applySuccess || saveSuccess}</span>
        </div>
      )}

      {/* Section Heading with 7-Tab Navigation */}
      <SectionHeading
        title="CANDIDATE SELF-SERVICE WORKSPACE"
        subtitle={`Welcome back, ${profile.first_name}. Explore corporate requisitions, preview AI match fit, coordinate interviews, and craft your resume.`}
        action={
          <div style={{
            display: 'flex',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5EAF0',
            borderRadius: '9999px',
            padding: '3px',
            flexWrap: 'wrap',
            gap: '2px'
          }}>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'resume-builder', label: 'Resume Builder' },
              { id: 'jobs', label: 'Browse Jobs' },
              { id: 'applications', label: 'My Applications' },
              { id: 'interviews', label: 'Interview Schedule' },
              { id: 'salary-insights', label: 'Salary Insights' },
              { id: 'membership', label: 'TALENTIQ Premium', isPremiumBadge: true },
              { id: 'profile', label: 'Profile Dossier' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                style={{
                  padding: '0.45rem 0.95rem',
                  borderRadius: '9999px',
                  border: 'none',
                  backgroundColor: activeSubTab === tab.id ? '#0060A8' : 'transparent',
                  color: activeSubTab === tab.id ? '#FFFFFF' : '#6C6C6C',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 160ms ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                {tab.isPremiumBadge ? (
                  <>
                    <Sparkles size={13} color={activeSubTab === tab.id ? '#FFFFFF' : '#D99524'} />
                    <span>{tab.label}</span>
                    <span style={{
                      fontSize: '0.65rem',
                      padding: '1px 5px',
                      borderRadius: '4px',
                      backgroundColor: activeSubTab === tab.id ? 'rgba(255,255,255,0.25)' : 'rgba(217, 149, 36, 0.15)',
                      color: activeSubTab === tab.id ? '#FFFFFF' : '#D99524',
                      fontWeight: 800
                    }}>PRO</span>
                  </>
                ) : (
                  tab.label
                )}
              </button>
            ))}
          </div>
        }
      />

      {/* ================================================================ */}
      {/* SUBTAB 1: OVERVIEW */}
      {/* ================================================================ */}
      {activeSubTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* TALENTIQ Premium Quick Access Banner */}
          <div style={{
            padding: '1.25rem 1.5rem',
            borderRadius: '12px',
            backgroundColor: subscriptionData?.is_premium ? 'rgba(22, 132, 91, 0.05)' : 'rgba(0, 96, 168, 0.04)',
            border: subscriptionData?.is_premium ? '1px solid rgba(22, 132, 91, 0.25)' : '1px solid rgba(0, 96, 168, 0.2)',
            borderLeft: subscriptionData?.is_premium ? '5px solid #16845B' : '5px solid #0060A8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: subscriptionData?.is_premium ? 'rgba(22, 132, 91, 0.15)' : 'rgba(0, 96, 168, 0.1)',
                color: subscriptionData?.is_premium ? '#16845B' : '#0060A8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {subscriptionData?.is_premium ? <Crown size={22} /> : <Sparkles size={22} />}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#031120', margin: 0 }}>
                    {subscriptionData?.is_premium ? 'TALENTIQ Premium Active Membership' : 'TALENTIQ Premium – Accelerate Your Career'}
                  </h4>
                  <span className={`badge ${subscriptionData?.is_premium ? 'badge-emerald' : 'badge-blue'}`}>
                    {subscriptionData?.is_premium ? 'PRO ACTIVE' : 'FREE TIER'}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '3px 0 0' }}>
                  {subscriptionData?.is_premium 
                    ? `Your benefits are active through ${subscriptionData.subscription?.expires_at ? new Date(subscriptionData.subscription.expires_at).toLocaleDateString() : 'Active'}. Full access to AI Mock Interviews, Resume Audits, and Roadmaps.`
                    : 'Unlock interactive AI mock interviews, deep ATS resume reviews, bullet rewrites, and your 90-day upskilling roadmap.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveSubTab('membership')}
              className={`btn btn-sm ${subscriptionData?.is_premium ? 'btn-secondary' : 'btn-primary'}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }}
            >
              <Sparkles size={14} />
              <span>{subscriptionData?.is_premium ? 'Open Premium Suite' : 'Explore Membership & Upgrade'}</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Profile Strength & Completion Progress Meter */}
          <div className="card" style={{ padding: '1.5rem', backgroundColor: '#FFFFFF', border: '1px solid #E5EAF0', borderLeft: '4px solid #0060A8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#0060A8', textTransform: 'uppercase' }}>Candidate Profile Readiness</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#031120', margin: '3px 0 0' }}>Profile Completeness: 85%</h3>
              </div>
              <span className="badge badge-emerald">ATS-Optimized Profile</span>
            </div>

            <div style={{ height: '8px', backgroundColor: '#E5EAF0', borderRadius: '9999px', overflow: 'hidden', marginBottom: '1.1rem' }}>
              <div style={{ width: '85%', height: '100%', background: 'linear-gradient(90deg, #0060A8, #1473E6)', borderRadius: '9999px' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.75rem', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16845B', fontWeight: 600 }}>
                <CheckCircle2 size={16} /> <span>Contact & Bio Verified</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16845B', fontWeight: 600 }}>
                <CheckCircle2 size={16} /> <span>6 Technical Competencies</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16845B', fontWeight: 600 }}>
                <CheckCircle2 size={16} /> <span>Salary Benchmark Set</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0060A8', fontWeight: 600 }}>
                <Sparkles size={16} />
                <button
                  type="button"
                  onClick={() => setActiveSubTab('resume-builder')}
                  style={{ background: 'none', border: 'none', color: '#0060A8', fontWeight: 700, cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                >
                  Generate Professional ATS Resume
                </button>
              </div>
            </div>
          </div>

          {/* Status KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem' }}>
            <div className="status-card">
              <div>
                <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#6C6C6C', textTransform: 'uppercase' }}>Applications Active</div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#031120', margin: '0.2rem 0' }}>{applications.length || 3}</div>
                <div style={{ fontSize: '0.72rem', color: '#0060A8', fontWeight: 600 }}>Active Recruitment Pipeline</div>
              </div>
              <div className="status-card-icon-wrap">
                <FileCheck size={20} />
              </div>
            </div>

            <div className="status-card">
              <div>
                <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#6C6C6C', textTransform: 'uppercase' }}>Interviews Scheduled</div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0060A8', margin: '0.2rem 0' }}>{interviews.length || 2}</div>
                <div style={{ fontSize: '0.72rem', color: '#16845B', fontWeight: 600 }}>Video Conferences Confirmed</div>
              </div>
              <div className="status-card-icon-wrap">
                <Calendar size={20} />
              </div>
            </div>

            <div className="status-card">
              <div>
                <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#6C6C6C', textTransform: 'uppercase' }}>Verified Skills</div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#031120', margin: '0.2rem 0' }}>{profile.skills.length}</div>
                <div style={{ fontSize: '0.72rem', color: '#0060A8', fontWeight: 600 }}>Verified via Smart Parser</div>
              </div>
              <div className="status-card-icon-wrap">
                <Sparkles size={20} />
              </div>
            </div>

            <div className="status-card">
              <div>
                <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#6C6C6C', textTransform: 'uppercase' }}>Expected Salary</div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0060A8', margin: '0.2rem 0' }}>₹{(profile.expected_salary/100000).toFixed(1)} LPA</div>
                <div style={{ fontSize: '0.72rem', color: '#6C6C6C', fontWeight: 600 }}>Base: ₹{(profile.current_salary/100000).toFixed(1)} LPA</div>
              </div>
              <div className="status-card-icon-wrap">
                <TrendingUp size={20} />
              </div>
            </div>
          </div>

          {/* Quick Match Showcase */}
          <div className="card" style={{ borderLeft: '4px solid #0060A8', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <span className="badge badge-blue">Recommended Requisitions</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#031120', marginTop: '0.35rem' }}>
                  Positions Matching Your Profile
                </h3>
              </div>
              <button onClick={() => setActiveSubTab('jobs')} className="btn btn-secondary btn-sm">
                View All {jobs.length} Openings
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              {jobs.slice(0, 2).map((j) => (
                <div key={j.id} style={{ padding: '1.25rem', backgroundColor: '#F1F5F8', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span className="badge badge-blue" style={{ marginBottom: '0.4rem' }}>{j.job_code}</span>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#031120', margin: '0.2rem 0' }}>{j.title}</h4>
                    <div style={{ fontSize: '0.78rem', color: '#6C6C6C', marginBottom: '0.85rem' }}>
                      {j.department} • ₹{(j.min_salary/100000).toFixed(1)}L - ₹{(j.max_salary/100000).toFixed(1)}L PA
                    </div>
                  </div>
                  <button onClick={() => { setActiveSubTab('jobs'); handleMatchWithJob(j); }} className="btn btn-primary btn-sm">
                    Review Compatibility & Apply
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* SUBTAB 2: RESUME BUILDER (FULL ATS CV GENERATOR)                 */}
      {/* ================================================================ */}
      {activeSubTab === 'resume-builder' && (
        <ResumeBuilder
          candidateProfile={profile}
          onSaveProfile={(updated) => {
            setProfile(prev => ({ ...prev, ...updated }));
            setSaveSuccess('Resume data synchronized with Candidate Profile!');
            setTimeout(() => setSaveSuccess(''), 4000);
          }}
        />
      )}

      {/* ================================================================ */}
      {/* SUBTAB 3: BROWSE JOBS                                            */}
      {/* ================================================================ */}
      {activeSubTab === 'jobs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Job Filter Toolbar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            padding: '1rem 1.25rem',
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            border: '1px solid #E5EAF0'
          }}>
            <div style={{ display: 'flex', gap: '0.75rem', flex: 1, minWidth: '280px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                <Search size={16} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search by job title, specialization, or role..."
                  value={jobSearch}
                  onChange={e => setJobSearch(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '2.25rem' }}
                />
              </div>

              <select
                value={jobDeptFilter}
                onChange={e => setJobDeptFilter(e.target.value)}
                className="form-control"
                style={{ width: '180px' }}
              >
                <option value="">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Data & AI">Data & AI</option>
                <option value="Banking Platform">Banking Platform</option>
                <option value="Analytics">Analytics</option>
              </select>
            </div>

            <div style={{ fontSize: '0.82rem', color: '#6C6C6C', fontWeight: 600 }}>
              Showing <strong>{jobs.filter(j => (!jobSearch || (j.title || '').toLowerCase().includes(jobSearch.toLowerCase()) || (j.job_role || '').toLowerCase().includes(jobSearch.toLowerCase())) && (!jobDeptFilter || j.department === jobDeptFilter)).length}</strong> Openings
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
            {jobs
              .filter(j => (!jobSearch || (j.title || '').toLowerCase().includes(jobSearch.toLowerCase()) || (j.job_role || '').toLowerCase().includes(jobSearch.toLowerCase())) && (!jobDeptFilter || j.department === jobDeptFilter))
              .map((job) => (
              <div key={job.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <span className="badge badge-blue">{job.job_code}</span>
                    <span className="badge badge-emerald">{job.status}</span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#031120', marginBottom: '0.35rem' }}>
                    {job.title}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#6C6C6C', marginBottom: '1rem' }}>
                    {job.department} • <strong style={{ color: '#0060A8' }}>{job.job_role}</strong>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.82rem', color: '#6C6C6C', marginBottom: '1rem' }}>
                    <div>Experience: <strong style={{ color: '#031120' }}>{job.min_experience} - {job.max_experience} Yrs</strong></div>
                    <div>Compensation: <strong style={{ color: '#16845B' }}>₹{(job.min_salary/100000).toFixed(1)}L - ₹{(job.max_salary/100000).toFixed(1)}L PA</strong></div>
                    <div>Location: <strong style={{ color: '#031120' }}>{job.location}</strong></div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E5EAF0', paddingTop: '0.85rem' }}>
                  <button onClick={() => handleMatchWithJob(job)} className="link-institutional" style={{ fontSize: '0.8rem', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>
                    Check AI Match
                  </button>
                  <button onClick={() => handleApplyToJob(job)} className="btn btn-primary btn-sm">
                    Submit Application
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Match Result Drawer/Card */}
          {matchResult && selectedJob && (
            <div className="card" style={{ borderLeft: '4px solid #0060A8', padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <span className="badge badge-blue">Compatibility Analysis</span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#031120', marginTop: '0.3rem' }}>
                    Match Assessment for {selectedJob.title}
                  </h3>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0060A8' }}>
                  {matchResult.final_match_score}%
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: '#F1F5F8', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.74rem', color: '#6C6C6C' }}>Skill Fit (70% Weight)</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#031120' }}>{matchResult.skill_match_score}%</div>
                </div>
                <div style={{ padding: '0.75rem', backgroundColor: '#F1F5F8', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.74rem', color: '#6C6C6C' }}>Experience Fit (30% Weight)</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#031120' }}>{matchResult.experience_score}%</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button onClick={() => setMatchResult(null)} className="btn btn-secondary btn-sm">Close</button>
                <button onClick={() => handleApplyToJob(selectedJob)} className="btn btn-primary btn-sm">Confirm & Submit Application</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================================================================ */}
      {/* SUBTAB 4: MY APPLICATIONS                                        */}
      {/* ================================================================ */}
      {activeSubTab === 'applications' && (
        <div className="table-responsive">
          <table className="table-custom">
            <thead>
              <tr>
                <th>Requisition Title</th>
                <th>Department</th>
                <th>Match Score</th>
                <th>Recruitment Status</th>
                <th>Applied On</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 700, color: '#031120' }}>{app.job_title || 'Full Stack Developer'}</td>
                  <td>{app.department || 'Engineering'}</td>
                  <td>
                    <span className="badge badge-emerald">{app.match_score || 88}%</span>
                  </td>
                  <td>
                    <span className="badge badge-blue">{app.status || 'APPLIED'}</span>
                  </td>
                  <td style={{ color: '#6C6C6C', fontSize: '0.8rem' }}>{app.created_at ? new Date(app.created_at).toLocaleDateString() : 'Recent'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================================================================ */}
      {/* SUBTAB 5: INTERVIEW SCHEDULE                                     */}
      {/* ================================================================ */}
      {activeSubTab === 'interviews' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
            {interviews.map((item) => (
              <div key={item.id} className="card" style={{ padding: '1.75rem', borderLeft: '4px solid #0060A8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="badge badge-blue">Round {item.round_number}: {item.round_name || 'Interview Round'}</span>
                  <span className="badge badge-emerald">{item.status}</span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#031120', marginBottom: '0.35rem' }}>
                  {item.job_title || 'Full Stack Developer'}
                </h3>
                <div style={{ fontSize: '0.82rem', color: '#6C6C6C', marginBottom: '1.25rem' }}>
                  Interviewer: <strong style={{ color: '#031120' }}>{item.interviewer_name || 'Technical Panel'}</strong>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem', color: '#6C6C6C', backgroundColor: '#F1F5F8', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={16} color="#0060A8" />
                    <span>Scheduled: <strong style={{ color: '#031120' }}>{item.scheduled_at ? new Date(item.scheduled_at).toLocaleString() : 'TBD'}</strong></span>
                  </div>
                  {item.feedback && (
                    <div style={{ marginTop: '0.25rem', fontSize: '0.78rem', color: '#6C6C6C', fontStyle: 'italic' }}>
                      "{item.feedback}"
                    </div>
                  )}
                </div>

                {item.meeting_url && (
                  <a
                    href={item.meeting_url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textDecoration: 'none' }}
                  >
                    <Video size={16} /> Join Video Interview
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* SUBTAB 6: SALARY INSIGHTS (EMBEDDED)                              */}
      {/* ================================================================ */}
      {activeSubTab === 'salary-insights' && (
        <SalaryInsights user={user} />
      )}

      {/* ================================================================ */}
      {/* SUBTAB 7: PROFILE & UPLOAD                                       */}
      {/* ================================================================ */}
      {activeSubTab === 'profile' && (
        <div className="grid-cols-2">
          {/* Left: Upload & NLP Parsing */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0060A8', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Upload Resume (PDF)
            </h3>
            <div style={{
              border: '2px dashed #E5EAF0',
              borderRadius: '10px',
              padding: '2rem',
              textAlign: 'center',
              backgroundColor: '#F1F5F8'
            }}>
              <Upload size={32} color="#0060A8" style={{ margin: '0 auto 0.5rem' }} />
              <div style={{ fontWeight: 700, color: '#031120' }}>{resumeFile ? resumeFile.name : 'Upload Latest Resume'}</div>
              <div style={{ fontSize: '0.74rem', color: '#6C6C6C', marginTop: '2px' }}>Supported formats: PDF (under 5MB)</div>
              <input type="file" accept=".pdf" id="candPdf" style={{ display: 'none' }} onChange={handleResumeUpload} />
              <label htmlFor="candPdf" className="btn btn-secondary btn-sm" style={{ marginTop: '1rem', cursor: 'pointer', display: 'inline-flex' }}>
                {parsingLoading ? 'Extracting Skills...' : 'Browse PDF Document'}
              </label>
            </div>
          </div>

          {/* Right: Candidate Profile Details */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0060A8', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Profile Dossier
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">First Name</label>
                  <input type="text" className="form-control" value={profile.first_name} onChange={(e) => setProfile({ ...profile, first_name: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Last Name</label>
                  <input type="text" className="form-control" value={profile.last_name} onChange={(e) => setProfile({ ...profile, last_name: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={profile.email} readOnly style={{ backgroundColor: '#E5EAF0' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Experience (Years)</label>
                  <input type="number" step="0.5" className="form-control" value={profile.experience_years} onChange={(e) => setProfile({ ...profile, experience_years: parseFloat(e.target.value) })} />
                </div>
                <div>
                  <label className="form-label">Education Degree</label>
                  <input type="text" className="form-control" value={profile.education_level} onChange={(e) => setProfile({ ...profile, education_level: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="form-label">Skills (Extracted)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.25rem' }}>
                  {profile.skills.map((s, i) => (
                    <span key={i} className="badge badge-blue">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* SUBTAB 8: TALENTIQ PREMIUM – CAREER GROWTH MEMBERSHIP            */}
      {/* ================================================================ */}
      {activeSubTab === 'membership' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Subscription Status Header Banner */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            border: subscriptionData?.is_premium ? '2px solid #0060A8' : '1px solid #E5EAF0',
            borderLeft: subscriptionData?.is_premium ? '6px solid #0060A8' : '6px solid #64748B',
            padding: '1.75rem',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                backgroundColor: subscriptionData?.is_premium ? '#0060A8' : '#F1F5F8',
                color: subscriptionData?.is_premium ? '#FFFFFF' : '#64748B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: subscriptionData?.is_premium ? '0 4px 12px rgba(0, 96, 168, 0.25)' : 'none',
                flexShrink: 0
              }}>
                {subscriptionData?.is_premium ? <Crown size={28} /> : <Lock size={26} />}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#031120', margin: 0 }}>
                    {subscriptionData?.is_premium ? 'TALENTIQ Premium Active' : 'Basic Career Explorer (Free Tier)'}
                  </h3>
                  <span className={`badge ${subscriptionData?.is_premium ? 'badge-emerald' : 'badge-blue'}`} style={{ fontWeight: 800 }}>
                    {subscriptionData?.is_premium ? 'SUBSCRIPTION ACTIVE' : 'FREE PLAN'}
                  </span>
                  {subscriptionData?.subscription?.billing_cycle && (
                    <span className="badge badge-warning" style={{ fontWeight: 700 }}>
                      {subscriptionData.subscription.billing_cycle} BILLING
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  {subscriptionData?.is_premium ? (
                    <>
                      <span><strong>Expires:</strong> {new Date(subscriptionData.subscription.expires_at).toLocaleDateString()}</span>
                      <span>•</span>
                      <span><strong>Days Remaining:</strong> {subscriptionData.subscription.days_remaining} days</span>
                      <span>•</span>
                      <span><strong>Auto-Renewal:</strong> {subscriptionData.subscription.auto_renew ? 'Active' : 'Disabled'}</span>
                    </>
                  ) : (
                    <span>Standard candidate account with essential search and application capabilities. Upgrade to unlock AI interview prep and resume reviews.</span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              {subscriptionData?.is_premium ? (
                <>
                  <button
                    type="button"
                    onClick={handleCancelAutoRenew}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.8rem', color: '#D94C4C' }}
                  >
                    Cancel Auto-Renewal
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpgradeSimulated('YEARLY')}
                    className="btn btn-primary btn-sm"
                    style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <RefreshCw size={13} /> Renew / Extend Plan
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    disabled={upgrading}
                    onClick={() => handleUpgradeSimulated('MONTHLY')}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.82rem', fontWeight: 700 }}
                  >
                    {upgrading ? 'Processing...' : 'Monthly (₹299/mo)'}
                  </button>
                  <button
                    type="button"
                    disabled={upgrading}
                    onClick={() => handleUpgradeSimulated('YEARLY')}
                    className="btn btn-primary btn-sm"
                    style={{ fontSize: '0.82rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 2px 8px rgba(0, 96, 168, 0.25)' }}
                  >
                    <Sparkles size={14} /> Upgrade Annual (₹1,999/yr)
                  </button>
                </>
              )}
            </div>
          </div>

          {/* FAIR RECRUITMENT POLICY BANNER */}
          <div style={{
            padding: '1rem 1.25rem',
            borderRadius: '10px',
            backgroundColor: 'rgba(22, 132, 91, 0.05)',
            border: '1px solid rgba(22, 132, 91, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.82rem',
            color: '#031120',
            lineHeight: 1.5
          }}>
            <ShieldCheck size={20} color="#16845B" style={{ flexShrink: 0 }} />
            <div>
              <strong>Fair Recruitment Guarantee:</strong> TALENTIQ Premium tools are engineered strictly for personal career readiness, resume optimization, and interview practice. In compliance with merit-based hiring regulations, <strong>subscription status never alters match compatibility scores, candidate rankings, or recruiter shortlisting decisions.</strong>
            </div>
          </div>

          {/* FREE USER: LOCKED FEATURE PREVIEWS & UPGRADE PROMPT */}
          {!subscriptionData?.is_premium ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              <div style={{
                textAlign: 'center',
                padding: '2.5rem 1.5rem',
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E5EAF0'
              }}>
                <Sparkles size={36} color="#0060A8" style={{ marginBottom: '0.75rem' }} />
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#031120', margin: '0 0 0.5rem' }}>
                  Unlock the Complete TALENTIQ Premium Suite
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#64748B', maxWidth: '620px', margin: '0 auto 1.75rem', lineHeight: 1.55 }}>
                  Subscribers gain immediate access to real-time AI mock interviews with STAR feedback, automated resume bullet rewrites, and custom 90-day technical roadmaps.
                </p>

                {/* Instant Test Mode Simulator Box */}
                <div style={{
                  maxWidth: '520px',
                  margin: '0 auto 2rem',
                  padding: '1rem',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '10px',
                  border: '1px dashed #0060A8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0060A8' }}>
                      ⚡ Razorpay Test Sandbox Available
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                      Simulate instantaneous cryptographic activation with 1 click.
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={upgrading}
                    onClick={() => handleUpgradeSimulated('MONTHLY')}
                    className="btn btn-primary btn-sm"
                    style={{ fontWeight: 800 }}
                  >
                    {upgrading ? 'Activating...' : 'Activate Pro (Test Mode)'}
                  </button>
                </div>

                {/* Locked Tool Cards Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '1.25rem',
                  textAlign: 'left'
                }}>
                  <div style={{ padding: '1.5rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E5EAF0', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <Video size={22} color="#0060A8" />
                      <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <Lock size={11} /> PRO ONLY
                      </span>
                    </div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#031120', margin: '0 0 0.4rem' }}>
                      AI Mock Interview Simulator
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: 1.45, margin: 0 }}>
                      Practice role-specific interview questions on microservices, React concurrency, and database locks with real-time STAR guidelines.
                    </p>
                  </div>

                  <div style={{ padding: '1.5rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E5EAF0', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <FileText size={22} color="#0060A8" />
                      <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <Lock size={11} /> PRO ONLY
                      </span>
                    </div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#031120', margin: '0 0 0.4rem' }}>
                      Deep AI Resume ATS Audit
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: 1.45, margin: 0 }}>
                      Identify missing high-demand keywords and rewrite generic bullet points into high-impact metrics with latency and throughput percentages.
                    </p>
                  </div>

                  <div style={{ padding: '1.5rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E5EAF0', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <TrendingUp size={22} color="#0060A8" />
                      <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <Lock size={11} /> PRO ONLY
                      </span>
                    </div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#031120', margin: '0 0 0.4rem' }}>
                      90-Day Career & CTC Roadmap
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: 1.45, margin: 0 }}>
                      Structured 3-phase execution plan designed to accelerate technical competency and achieve your target ₹15-20 LPA compensation.
                    </p>
                  </div>

                  <div style={{ padding: '1.5rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E5EAF0', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <Receipt size={22} color="#0060A8" />
                      <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <Lock size={11} /> PRO ONLY
                      </span>
                    </div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#031120', margin: '0 0 0.4rem' }}>
                      GST Invoices & Audit Ledger
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: 1.45, margin: 0 }}>
                      Permanent digital receipts with tax breakdown and downloadable PDF records for corporate expense reimbursement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ACTIVE PREMIUM USER: INTERACTIVE TOOLS SUITE */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              
              {/* Tool Selector Tabs */}
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                backgroundColor: '#FFFFFF',
                padding: '0.5rem',
                borderRadius: '12px',
                border: '1px solid #E5EAF0',
                flexWrap: 'wrap'
              }}>
                {[
                  { id: 'interview', label: 'AI Mock Interview Simulator', icon: Video },
                  { id: 'resume', label: 'Deep AI Resume Review', icon: FileText },
                  { id: 'roadmap', label: '90-Day Career Roadmap', icon: TrendingUp },
                  { id: 'invoices', label: 'Payment History & Invoices', icon: Receipt },
                ].map(tool => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => setActivePremiumTool(tool.id)}
                      className={`btn btn-sm ${activePremiumTool === tool.id ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
                    >
                      <Icon size={15} />
                      <span>{tool.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* TOOL 1: AI MOCK INTERVIEW SIMULATOR */}
              {activePremiumTool === 'interview' && (
                <div style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1px solid #E5EAF0',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#031120', margin: '0 0 0.35rem' }}>
                        AI Mock Interview Practice Simulator
                      </h4>
                      <p style={{ fontSize: '0.84rem', color: '#64748B', margin: 0 }}>
                        Generate real-world technical and system architecture questions tailored to verified enterprise requisitions.
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <select
                        value={targetMockRole}
                        onChange={(e) => setTargetMockRole(e.target.value)}
                        className="form-control"
                        style={{ width: '220px', height: '38px', fontSize: '0.82rem' }}
                      >
                        <option value="Full Stack Developer">Full Stack Developer</option>
                        <option value="Data Platform & AI Engineer">Data Platform & AI Engineer</option>
                      </select>

                      <button
                        type="button"
                        disabled={mockInterviewLoading}
                        onClick={handleLoadMockInterview}
                        className="btn btn-primary btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
                      >
                        {mockInterviewLoading ? 'Synthesizing...' : 'Generate New Questions'}
                      </button>
                    </div>
                  </div>

                  {!mockInterviewData && !mockInterviewLoading && (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px dashed #CBD5E1' }}>
                      <Video size={36} color="#0060A8" style={{ marginBottom: '0.75rem' }} />
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#031120', marginBottom: '0.35rem' }}>
                        Ready for Your Mock Technical Screening
                      </div>
                      <p style={{ fontSize: '0.84rem', color: '#64748B', maxWidth: '420px', margin: '0 auto 1.25rem' }}>
                        Select your target role above and click 'Generate New Questions' to simulate technical rounds.
                      </p>
                      <button
                        type="button"
                        onClick={handleLoadMockInterview}
                        className="btn btn-primary btn-sm"
                      >
                        Launch Mock Interview Simulator
                      </button>
                    </div>
                  )}

                  {mockInterviewLoading && (
                    <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748B' }}>
                      <div style={{ width: '36px', height: '36px', border: '3px solid #E5EAF0', borderTopColor: '#0060A8', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
                      <p style={{ margin: 0, fontWeight: 600 }}>Synthesizing technical interview scenarios from enterprise requisitions...</p>
                    </div>
                  )}

                  {mockInterviewData && !mockInterviewLoading && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div style={{
                        padding: '0.85rem 1.25rem',
                        backgroundColor: '#F1F5F8',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: '#031120'
                      }}>
                        <span>Target Role: <strong>{mockInterviewData.role}</strong> ({mockInterviewData.experience_target})</span>
                        <span style={{ color: '#0060A8' }}>{mockInterviewData.total_questions} Questions Generated</span>
                      </div>

                      {mockInterviewData.questions.map((q, idx) => (
                        <div key={q.id || idx} style={{
                          padding: '1.25rem',
                          borderRadius: '10px',
                          border: '1px solid #E5EAF0',
                          backgroundColor: '#FFFFFF',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.75rem'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                backgroundColor: '#0060A8',
                                color: '#FFFFFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: 800
                              }}>
                                {idx + 1}
                              </span>
                              <span className="badge badge-blue">{q.category}</span>
                            </div>
                            <span className="badge badge-emerald">{q.difficulty}</span>
                          </div>

                          <h5 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#031120', margin: 0, lineHeight: 1.45 }}>
                            {q.question}
                          </h5>

                          <div style={{
                            padding: '0.85rem',
                            backgroundColor: '#F8FAFC',
                            borderRadius: '8px',
                            borderLeft: '4px solid #D99524',
                            fontSize: '0.8rem',
                            color: '#334155',
                            lineHeight: 1.45
                          }}>
                            <strong>Architectural Hint:</strong> {q.hint}
                          </div>

                          <div style={{
                            padding: '0.85rem',
                            backgroundColor: 'rgba(22, 132, 91, 0.05)',
                            borderRadius: '8px',
                            borderLeft: '4px solid #16845B',
                            fontSize: '0.8rem',
                            color: '#031120',
                            lineHeight: 1.45
                          }}>
                            <strong>STAR Guideline:</strong> {q.star_guideline}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                            <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>Key Competencies:</span>
                            {q.key_competencies?.map((comp, ci) => (
                              <span key={ci} style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#F1F5F8', color: '#0060A8', fontWeight: 700 }}>
                                {comp}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TOOL 2: DEEP AI RESUME REVIEW & ATS OPTIMIZER */}
              {activePremiumTool === 'resume' && (
                <div style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1px solid #E5EAF0',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#031120', margin: '0 0 0.35rem' }}>
                        Deep AI Resume Review & ATS Keyword Optimizer
                      </h4>
                      <p style={{ fontSize: '0.84rem', color: '#64748B', margin: 0 }}>
                        Audit your profile competencies against high-demand enterprise requisitions and review bullet rewrites.
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={resumeReviewLoading}
                      onClick={handleLoadResumeReview}
                      className="btn btn-primary btn-sm"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
                    >
                      {resumeReviewLoading ? 'Auditing Resume...' : 'Run Deep AI Resume Audit'}
                    </button>
                  </div>

                  {!resumeReviewData && !resumeReviewLoading && (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px dashed #CBD5E1' }}>
                      <FileText size={36} color="#0060A8" style={{ marginBottom: '0.75rem' }} />
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#031120', marginBottom: '0.35rem' }}>
                        Analyze Your Resume with ATS Intelligence
                      </div>
                      <p style={{ fontSize: '0.84rem', color: '#64748B', maxWidth: '420px', margin: '0 auto 1.25rem' }}>
                        Click the button below to audit your current skills and generate high-impact quantified bullet points.
                      </p>
                      <button
                        type="button"
                        onClick={handleLoadResumeReview}
                        className="btn btn-primary btn-sm"
                      >
                        Start Deep Resume Audit
                      </button>
                    </div>
                  )}

                  {resumeReviewLoading && (
                    <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748B' }}>
                      <div style={{ width: '36px', height: '36px', border: '3px solid #E5EAF0', borderTopColor: '#0060A8', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
                      <p style={{ margin: 0, fontWeight: 600 }}>Scanning resume content against verified corporate requisitions...</p>
                    </div>
                  )}

                  {resumeReviewData && !resumeReviewLoading && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      
                      {/* ATS Score Card */}
                      <div style={{
                        padding: '1.5rem',
                        borderRadius: '12px',
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #E5EAF0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem'
                      }}>
                        <div>
                          <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#0060A8', textTransform: 'uppercase' }}>
                            ATS Compatibility Rating
                          </div>
                          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#031120', margin: '4px 0' }}>
                            {resumeReviewData.ats_compatibility_score} / 100
                          </div>
                          <span className="badge badge-emerald" style={{ fontWeight: 800 }}>
                            {resumeReviewData.score_grade} MATCH FIT
                          </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '240px' }}>
                          <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                            <strong>Matched Skills:</strong> {resumeReviewData.matched_high_demand_skills?.join(', ')}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#D94C4C' }}>
                            <strong>Missing High-Demand:</strong> {resumeReviewData.missing_critical_skills?.join(', ') || 'None!'}
                          </div>
                        </div>
                      </div>

                      {/* Bullet Point Rewrites */}
                      <div>
                        <h5 style={{ fontSize: '1rem', fontWeight: 800, color: '#031120', margin: '0 0 0.85rem' }}>
                          Automated Bullet Point Optimizations (Before vs. After)
                        </h5>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {resumeReviewData.bullet_rewrites?.map((item, idx) => (
                            <div key={idx} style={{
                              padding: '1.25rem',
                              borderRadius: '10px',
                              border: '1px solid #E5EAF0',
                              backgroundColor: '#FFFFFF',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.75rem'
                            }}>
                              <div style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '6px', borderLeft: '4px solid #94A3B8', fontSize: '0.82rem', color: '#64748B' }}>
                                <strong>Original:</strong> {item.original}
                              </div>
                              <div style={{ padding: '0.75rem', backgroundColor: 'rgba(0, 96, 168, 0.05)', borderRadius: '6px', borderLeft: '4px solid #0060A8', fontSize: '0.84rem', color: '#031120', fontWeight: 600 }}>
                                <strong>TALENTIQ Optimized:</strong> {item.improved}
                              </div>
                              <div style={{ fontSize: '0.74rem', color: '#16845B', fontWeight: 600 }}>
                                ✓ {item.impact_metrics}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              )}

              {/* TOOL 3: 90-DAY CAREER & CTC ROADMAP */}
              {activePremiumTool === 'roadmap' && (
                <div style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1px solid #E5EAF0',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#031120', margin: '0 0 0.35rem' }}>
                        Personalized 90-Day Career Acceleration Roadmap
                      </h4>
                      <p style={{ fontSize: '0.84rem', color: '#64748B', margin: 0 }}>
                        Milestone-based preparation strategy calibrated to your MCA qualifications and target CTC band.
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#031120' }}>Target:</span>
                        <input
                          type="text"
                          value={targetSalaryLpa}
                          onChange={(e) => setTargetSalaryLpa(e.target.value)}
                          className="form-control"
                          style={{ width: '80px', height: '36px', textAlign: 'center', fontWeight: 700 }}
                        />
                        <span style={{ fontSize: '0.8rem', color: '#64748B' }}>LPA</span>
                      </div>

                      <button
                        type="button"
                        disabled={careerRoadmapLoading}
                        onClick={handleLoadCareerRoadmap}
                        className="btn btn-primary btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
                      >
                        {careerRoadmapLoading ? 'Generating...' : 'Regenerate Roadmap'}
                      </button>
                    </div>
                  </div>

                  {!careerRoadmapData && !careerRoadmapLoading && (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px dashed #CBD5E1' }}>
                      <TrendingUp size={36} color="#0060A8" style={{ marginBottom: '0.75rem' }} />
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#031120', marginBottom: '0.35rem' }}>
                        Build Your 90-Day Compensation Roadmap
                      </div>
                      <p style={{ fontSize: '0.84rem', color: '#64748B', maxWidth: '420px', margin: '0 auto 1.25rem' }}>
                        Structured roadmap to take your profile from ₹7.2 LPA to ₹18.0 LPA in 90 days.
                      </p>
                      <button
                        type="button"
                        onClick={handleLoadCareerRoadmap}
                        className="btn btn-primary btn-sm"
                      >
                        Generate 90-Day Plan
                      </button>
                    </div>
                  )}

                  {careerRoadmapLoading && (
                    <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748B' }}>
                      <div style={{ width: '36px', height: '36px', border: '3px solid #E5EAF0', borderTopColor: '#0060A8', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
                      <p style={{ margin: 0, fontWeight: 600 }}>Calibrating roadmap milestones against Indian tech industry market percentiles...</p>
                    </div>
                  )}

                  {careerRoadmapData && !careerRoadmapLoading && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {careerRoadmapData.phases?.map((phase, idx) => (
                        <div key={idx} style={{
                          padding: '1.5rem',
                          borderRadius: '10px',
                          border: '1px solid #E5EAF0',
                          backgroundColor: '#FFFFFF',
                          borderLeft: idx === 0 ? '5px solid #0060A8' : idx === 1 ? '5px solid #1473E6' : '5px solid #16845B',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.75rem'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0060A8', textTransform: 'uppercase' }}>
                              {phase.phase}
                            </span>
                            <span className="badge badge-blue">Target: {careerRoadmapData.target_salary}</span>
                          </div>

                          <h5 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#031120', margin: 0 }}>
                            {phase.title}
                          </h5>

                          <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.84rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            {phase.objectives?.map((obj, oi) => (
                              <li key={oi}>{obj}</li>
                            ))}
                          </ul>

                          <div style={{
                            marginTop: '0.5rem',
                            padding: '0.75rem 1rem',
                            backgroundColor: '#F8FAFC',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            color: '#16845B',
                            fontWeight: 700
                          }}>
                            🎯 Phase Milestone: {phase.milestone}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TOOL 4: PAYMENT HISTORY & INVOICES */}
              {activePremiumTool === 'invoices' && (
                <div style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1px solid #E5EAF0',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem'
                }}>
                  <div>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#031120', margin: '0 0 0.35rem' }}>
                      Payment History & Tax Invoices
                    </h4>
                    <p style={{ fontSize: '0.84rem', color: '#64748B', margin: 0 }}>
                      Verified Razorpay transaction ledger with downloadable GST tax receipts.
                    </p>
                  </div>

                  <div className="table-responsive">
                    <table className="table-custom">
                      <thead>
                        <tr>
                          <th>Invoice No.</th>
                          <th>Order Reference</th>
                          <th>Payment ID</th>
                          <th>Billing Cycle</th>
                          <th>Amount (INR)</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th style={{ textAlign: 'right' }}>Tax Receipt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscriptionData.payment_history?.length === 0 ? (
                          <tr>
                            <td colSpan="8" style={{ textAlign: 'center', padding: '2.5rem', color: '#94A3B8' }}>
                              No transactions recorded yet.
                            </td>
                          </tr>
                        ) : (
                          subscriptionData.payment_history?.map((pay) => (
                            <tr key={pay.id}>
                              <td style={{ fontWeight: 700, color: '#0060A8' }}>
                                {pay.invoice_number}
                              </td>
                              <td style={{ fontSize: '0.78rem', color: '#64748B' }}>
                                {pay.order_id}
                              </td>
                              <td style={{ fontSize: '0.78rem', color: '#64748B' }}>
                                {pay.payment_id || '—'}
                              </td>
                              <td>
                                <span className="badge badge-blue">{pay.billing_cycle}</span>
                              </td>
                              <td style={{ fontWeight: 800, color: '#031120' }}>
                                ₹{pay.amount}
                              </td>
                              <td>
                                <span className={`badge ${pay.status === 'SUCCESS' ? 'badge-emerald' : 'badge-danger'}`}>
                                  {pay.status}
                                </span>
                              </td>
                              <td style={{ fontSize: '0.78rem', color: '#64748B' }}>
                                {pay.paid_at ? new Date(pay.paid_at).toLocaleDateString() : new Date(pay.created_at).toLocaleDateString()}
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <button
                                  type="button"
                                  onClick={() => setSelectedInvoice(pay)}
                                  className="btn btn-secondary btn-sm"
                                  style={{ fontSize: '0.74rem' }}
                                >
                                  View Invoice
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* INVOICE MODAL */}
          {selectedInvoice && (
            <div className="modal-overlay">
              <div className="modal-content" style={{ maxWidth: '580px' }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E5EAF0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Receipt size={20} color="#0060A8" />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#031120', margin: 0 }}>
                      Tax Invoice • {selectedInvoice.invoice_number}
                    </h3>
                  </div>
                  <button onClick={() => setSelectedInvoice(null)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                    <X size={18} />
                  </button>
                </div>

                <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0060A8' }}>TALENTIQ TECHNOLOGIES PVT. LTD.</div>
                      <div style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '2px' }}>
                        Enterprise SaaS Recruitment Platform<br />
                        GSTIN: 29AAACT9876Q1Z2 • Bengaluru, Karnataka
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.78rem', color: '#64748B' }}>
                      <strong>Date:</strong> {new Date(selectedInvoice.paid_at || selectedInvoice.created_at).toLocaleDateString()}<br />
                      <strong>Status:</strong> <span style={{ color: '#16845B', fontWeight: 700 }}>PAID</span>
                    </div>
                  </div>

                  <div style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '8px', fontSize: '0.8rem', color: '#334155' }}>
                    <strong>Billed To:</strong> {profile.first_name} {profile.last_name} ({profile.email})<br />
                    <strong>Gateway Order:</strong> {selectedInvoice.order_id}<br />
                    <strong>Transaction Reference:</strong> {selectedInvoice.payment_id}
                  </div>

                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #E5EAF0', textAlign: 'left', color: '#64748B' }}>
                        <th style={{ padding: '0.5rem 0' }}>Description</th>
                        <th style={{ textAlign: 'right', padding: '0.5rem 0' }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #E5EAF0' }}>
                        <td style={{ padding: '0.75rem 0' }}>
                          TALENTIQ Premium Career Growth Membership ({selectedInvoice.billing_cycle})
                        </td>
                        <td style={{ textAlign: 'right', padding: '0.75rem 0', fontWeight: 700 }}>
                          ₹{(selectedInvoice.amount / 1.18).toFixed(2)}
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #E5EAF0', color: '#64748B', fontSize: '0.78rem' }}>
                        <td style={{ padding: '0.4rem 0' }}>IGST / CGST+SGST (18%)</td>
                        <td style={{ textAlign: 'right', padding: '0.4rem 0' }}>
                          ₹{(selectedInvoice.amount - selectedInvoice.amount / 1.18).toFixed(2)}
                        </td>
                      </tr>
                      <tr style={{ fontWeight: 800, fontSize: '0.98rem' }}>
                        <td style={{ padding: '0.75rem 0' }}>Total Paid</td>
                        <td style={{ textAlign: 'right', padding: '0.75rem 0', color: '#0060A8' }}>
                          ₹{selectedInvoice.amount}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontWeight: 700 }}
                  >
                    Print Tax Invoice (PDF)
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
