import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Users,
  FileSearch,
  Briefcase,
  FileCheck,
  BarChart3,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Building,
  Mail,
  Phone,
  Clock,
  Layers,
  Cpu,
  Database,
  Award,
  Zap,
  Globe,
  Lock,
  Search,
  UserCheck,
  FileText,
  Calendar,
  Check,
  MapPin,
  ExternalLink,
  Sliders,
  DollarSign,
  AlertCircle,
  Menu,
  X,
  LayoutDashboard
} from 'lucide-react';
import { jobService } from '../services/api';
import PrivacyPolicyModal from '../components/PrivacyPolicyModal';
import TermsModal from '../components/TermsModal';
import Pricing from './Pricing';

export default function LandingPage({
  onNavigateLogin,
  onNavigateRegister,
  onQuickDemoLogin,
  user,
  onEnterDashboard
}) {
  // Navigation state between public pages
  // 'home' | 'about' | 'features' | 'how-it-works' | 'candidates' | 'employers' | 'jobs' | 'contact'
  const [publicView, setPublicView] = useState('home');

  // Mobile navigation hamburger toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals for compliance
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // How-It-Works interactive subtab: 'employers' | 'candidates'
  const [howItWorksTab, setHowItWorksTab] = useState('employers');

  // Interactive Salary Simulator state on landing page
  const [simRole, setSimRole] = useState('Full Stack Developer');
  const [simExp, setSimExp] = useState(4.5);
  const [simEdu, setSimEdu] = useState('MCA');
  const [simCity, setSimCity] = useState('Tier 1');

  // Contact Form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    inquiryType: 'Request Enterprise Demo',
    hiringVolume: '50 - 250 hires/yr',
    message: ''
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState(0);

  // Public Jobs directory state
  const [publicJobs, setPublicJobs] = useState([]);
  const [jobSearch, setJobSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');

  // Fallback jobs if API is loading or network blocked
  const defaultPublicJobs = [
    {
      id: 1,
      job_code: 'JOB-201',
      title: 'Senior Full-Stack Developer',
      department: 'Engineering',
      job_role: 'Full Stack Developer',
      min_experience: 3.0,
      max_experience: 6.0,
      min_salary: 900000.0,
      max_salary: 1600000.0,
      location: 'Bengaluru',
      skills: ['React.js', 'Node.js', 'Express', 'Cloud Data', 'Docker'],
      description: 'Lead high-throughput web applications with React, Node.js, and modern cloud databases.'
    },
    {
      id: 2,
      job_code: 'JOB-202',
      title: 'AI & Data Platform Engineer',
      department: 'Data & AI',
      job_role: 'Data Engineer',
      min_experience: 2.0,
      max_experience: 5.0,
      min_salary: 1000000.0,
      max_salary: 1800000.0,
      location: 'Hyderabad',
      skills: ['Python', 'Text Analytics', 'Predictive Modeling', 'Pandas'],
      description: 'Design and deploy talent prediction pipelines and automated resume intelligence services.'
    },
    {
      id: 3,
      job_code: 'JOB-203',
      title: 'Senior Java Backend Specialist',
      department: 'Banking Platform',
      job_role: 'Java Developer',
      min_experience: 4.0,
      max_experience: 8.0,
      min_salary: 1200000.0,
      max_salary: 2200000.0,
      location: 'Pune',
      skills: ['Java 17', 'Spring Boot', 'Data Pipelines', 'Microservices'],
      description: 'Develop mission-critical transactional banking microservices with strict consistency guarantees.'
    },
    {
      id: 4,
      job_code: 'JOB-204',
      title: 'Data Analyst & Workforce Modeler',
      department: 'Analytics',
      job_role: 'Data Analyst',
      min_experience: 1.0,
      max_experience: 4.0,
      min_salary: 500000.0,
      max_salary: 900000.0,
      location: 'Mumbai',
      skills: ['SQL', 'Python', 'Pandas', 'Workforce Metrics', 'PowerBI'],
      description: 'Perform compensation quartile distributions, tenure modeling, and executive workforce reporting.'
    },
    {
      id: 5,
      job_code: 'JOB-205',
      title: 'Frontend React Developer',
      department: 'Product Experience',
      job_role: 'Frontend Developer',
      min_experience: 1.5,
      max_experience: 4.0,
      min_salary: 600000.0,
      max_salary: 1100000.0,
      location: 'Chennai',
      skills: ['React.js', 'Vite', 'JavaScript', 'CSS3', 'REST APIs'],
      description: 'Craft responsive, institutional-grade SaaS web interfaces with sub-second render performance.'
    },
    {
      id: 6,
      job_code: 'JOB-206',
      title: 'Cloud & DevOps Architect',
      department: 'Infrastructure',
      job_role: 'DevOps Engineer',
      min_experience: 5.0,
      max_experience: 9.0,
      min_salary: 1800000.0,
      max_salary: 3000000.0,
      location: 'Bengaluru',
      skills: ['AWS', 'Kubernetes', 'Docker', 'CI/CD', 'Linux'],
      description: 'Architect containerized microservices and automated deployment pipelines with multi-region failover.'
    }
  ];

  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await jobService.getAll().catch(() => null);
        if (res && res.data && res.data.data && res.data.data.length > 0) {
          setPublicJobs(res.data.data);
        } else {
          setPublicJobs(defaultPublicJobs);
        }
      } catch (e) {
        setPublicJobs(defaultPublicJobs);
      }
    }
    loadJobs();
  }, []);

  // Calculate live simulated salary
  const calculateSimSalary = () => {
    let base = 500000;
    const roleMultipliers = {
      'Full Stack Developer': 1.15,
      'AI & Data Platform Engineer': 1.45,
      'Backend Specialist': 1.25,
      'Data Analyst': 1.05,
      'Cloud Architect': 1.55
    };
    const eduBoost = {
      'BCA': 0,
      'B.Tech': 150000,
      'MCA': 220000,
      'M.Tech': 280000,
      'Ph.D': 450000
    };
    const cityMultiplier = simCity === 'Tier 1' ? 1.2 : (simCity === 'Tier 2' ? 1.05 : 0.95);

    const expValue = parseFloat(simExp) * 165000;
    const mult = roleMultipliers[simRole] || 1.15;
    const eduVal = eduBoost[simEdu] || 150000;

    const total = Math.round(((base + expValue + eduVal) * mult * cityMultiplier) / 10000) * 10000;
    return (total / 100000).toFixed(2);
  };

  const simResultLPA = calculateSimSalary();

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactForm({
        name: '',
        email: '',
        company: '',
        inquiryType: 'Request Enterprise Demo',
        hiringVolume: '50 - 250 hires/yr',
        message: ''
      });
      setContactSubmitted(false);
    }, 5000);
  };

  const faqs = [
    {
      q: 'How does TALENTIQ evaluate and match candidates with job openings?',
      a: 'TALENTIQ evaluates candidate suitability through an explainable multi-factor scoring model. It assigns a 70% weight to verified technical skill overlap and a 30% weight to career experience tenure. Instead of an unexplainable auto-rejection filter, TALENTIQ provides recruiters with an itemized breakdown of matched proficiencies and missing competencies.'
    },
    {
      q: 'How are salary benchmarks calculated and what factors are included?',
      a: 'Salary estimates are computed using predictive compensation modeling calibrated against verified enterprise compensation records. The engine evaluates verified years of career experience, educational attainment tier, role specialization, and geographic metro tier to output a fair market compensation range with confidence intervals.'
    },
    {
      q: 'What resume formats are supported by Smart Resume Intelligence?',
      a: 'TALENTIQ supports PDF, DOCX, and plain text resumes. The ingestion engine extracts candidate coordinates, education history, years of experience, and categorizes competencies across 80+ industry domains in under a second.'
    },
    {
      q: 'How is enterprise candidate and company data secured?',
      a: 'TALENTIQ is engineered with bank-grade security standards. Candidate passwords are secure cryptographic one-way hashes. Web sessions rely on digitally signed tokens. All candidate and requisition data is protected by enterprise encryption in transit and at rest with immutable audit logs.'
    },
    {
      q: 'Can candidates view other applicants’ submissions or corporate salary metrics?',
      a: 'No. TALENTIQ enforces strict role-based access control (RBAC). Candidates access a dedicated self-service portal restricted exclusively to their personal profile, uploaded resumes, submitted applications, and scheduled interview status.'
    },
    {
      q: 'Can TALENTIQ be integrated with our existing ATS or HRMS workflow?',
      a: 'Yes. TALENTIQ provides standard RESTful JSON APIs and webhook notifications for automated synchronization with major enterprise HRMS and ATS systems, including seamless export to CSV and JSON.'
    }
  ];

  // Filtered jobs for Explore Jobs page
  const filteredJobs = publicJobs.filter(job => {
    const matchesSearch = !jobSearch ||
      job.title?.toLowerCase().includes(jobSearch.toLowerCase()) ||
      job.job_role?.toLowerCase().includes(jobSearch.toLowerCase()) ||
      job.location?.toLowerCase().includes(jobSearch.toLowerCase()) ||
      job.job_code?.toLowerCase().includes(jobSearch.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || job.department === selectedDept;
    const matchesLocation = selectedLocation === 'ALL' || job.location?.toLowerCase() === selectedLocation.toLowerCase();
    return matchesSearch && matchesDept && matchesLocation;
  });

  const navigateTo = (viewId) => {
    setPublicView(viewId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      color: '#031120',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden'
    }}>
      {/* ==================================================================== */}
      {/* 1. TOP NAVIGATION BAR                                               */}
      {/* ==================================================================== */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #E5EAF0',
        padding: '0.85rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <div
          onClick={() => navigateTo('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer' }}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            backgroundColor: '#0060A8',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0, 96, 168, 0.25)'
          }}>
            TQ
          </div>
          <div>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#031120',
              lineHeight: 1
            }}>
              TALENT<span style={{ color: '#0060A8' }}>IQ</span>
            </div>
            <div style={{
              fontSize: '0.66rem',
              fontWeight: 700,
              color: '#6C6C6C',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginTop: '2px'
            }}>
              Enterprise Talent Platform
            </div>
          </div>
        </div>

        {/* Desktop Public Navigation Links */}
        <nav className="desktop-nav" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          fontSize: '0.88rem',
          fontWeight: 600
        }}>
          {[
            { id: 'home', label: 'Home' },
            { id: 'about', label: 'About' },
            { id: 'features', label: 'Our Technology' },
            { id: 'how-it-works', label: 'How It Works' },
            { id: 'pricing', label: 'Pricing & Membership' },
            { id: 'candidates', label: 'For Candidates' },
            { id: 'employers', label: 'For Employers' },
            { id: 'jobs', label: 'Explore Jobs' },
            { id: 'contact', label: 'Contact' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.4rem 0.4rem',
                fontSize: '0.88rem',
                fontWeight: publicView === item.id ? 800 : 600,
                color: publicView === item.id ? '#0060A8' : '#6C6C6C',
                borderBottom: publicView === item.id ? '2px solid #0060A8' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 160ms ease',
                whiteSpace: 'nowrap'
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Desktop Action CTAs */}
        <div className="desktop-ctas" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button
            onClick={onNavigateLogin}
            className="btn btn-secondary btn-sm"
            style={{ fontWeight: 600, padding: '0.55rem 1.25rem' }}
          >
            Sign In
          </button>
          {user ? (
            <button
              onClick={onEnterDashboard || onNavigateLogin}
              className="btn btn-primary btn-sm"
              style={{ fontWeight: 700, padding: '0.55rem 1.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <LayoutDashboard size={15} /> Enter Dashboard
            </button>
          ) : (
            <button
              onClick={() => onNavigateRegister('HR_MANAGER')}
              className="btn btn-primary btn-sm"
              style={{ fontWeight: 600, padding: '0.55rem 1.4rem' }}
            >
              Get Started
            </button>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            padding: '0.4rem',
            cursor: 'pointer',
            color: '#031120'
          }}
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E5EAF0',
          padding: '1.25rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          zIndex: 99
        }}>
          {[
            { id: 'home', label: 'Home' },
            { id: 'about', label: 'About' },
            { id: 'features', label: 'Our Technology' },
            { id: 'how-it-works', label: 'How It Works' },
            { id: 'pricing', label: 'Pricing & Membership' },
            { id: 'candidates', label: 'For Candidates' },
            { id: 'employers', label: 'For Employers' },
            { id: 'jobs', label: 'Explore Jobs' },
            { id: 'contact', label: 'Contact' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              style={{
                background: 'none',
                border: 'none',
                textAlign: 'left',
                padding: '0.65rem 0',
                fontSize: '1rem',
                fontWeight: publicView === item.id ? 800 : 600,
                color: publicView === item.id ? '#0060A8' : '#031120',
                cursor: 'pointer'
              }}
            >
              {item.label}
            </button>
          ))}
          <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid #E5EAF0' }}>
            <button
              onClick={() => { setMobileMenuOpen(false); onNavigateLogin(); }}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, padding: '0.75rem' }}
            >
              Sign In
            </button>
            {user ? (
              <button
                onClick={() => { setMobileMenuOpen(false); if (onEnterDashboard) onEnterDashboard(); else onNavigateLogin(); }}
                className="btn btn-primary btn-sm"
                style={{ flex: 1, padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <LayoutDashboard size={16} /> Enter Dashboard
              </button>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigateRegister('HR_MANAGER'); }}
                className="btn btn-primary btn-sm"
                style={{ flex: 1, padding: '0.75rem' }}
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. BODY CONTENT ROUTER (SUB-PAGES)                                  */}
      {/* ==================================================================== */}

      {/* VIEW: HOME */}
      {publicView === 'home' && (
        <>
          {/* Hero Section with Enterprise Product Preview */}
          <section style={{
            background: 'linear-gradient(180deg, #F1F5F8 0%, #FFFFFF 100%)',
            padding: '4.5rem 2rem 3.5rem',
            borderBottom: '1px solid #E5EAF0',
            position: 'relative'
          }}>
            <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 1.1rem',
                  borderRadius: '9999px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5EAF0',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: '#0060A8'
                }}>
                  <Sparkles size={16} color="#0060A8" />
                  Enterprise Talent Intelligence & Workforce Analytics
                </div>
              </div>

              <div style={{ textAlign: 'center', maxWidth: '880px', margin: '0 auto 1.5rem' }}>
                <h1 style={{
                  fontSize: '3.4rem',
                  fontWeight: 800,
                  lineHeight: 1.15,
                  letterSpacing: '-0.035em',
                  color: '#031120'
                }}>
                  Smarter Hiring. Better Decisions.{' '}
                  <span style={{ color: '#0060A8' }}>Stronger Teams.</span>
                </h1>
                <p style={{
                  fontSize: '1.2rem',
                  lineHeight: 1.6,
                  color: '#6C6C6C',
                  marginTop: '1.15rem',
                  fontWeight: 400
                }}>
                  Transform your recruitment process with explainable candidate matching, predictive salary insights and powerful recruitment analytics — all in one platform.
                </p>
              </div>

              {/* Hero CTAs */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                marginBottom: '3rem',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={() => onNavigateRegister('HR_MANAGER')}
                  className="btn btn-primary"
                  style={{
                    fontSize: '1rem',
                    padding: '0.85rem 2.2rem',
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    boxShadow: '0 4px 14px rgba(0, 96, 168, 0.28)'
                  }}
                >
                  Get Started <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => navigateTo('jobs')}
                  className="btn btn-secondary"
                  style={{
                    fontSize: '1rem',
                    padding: '0.85rem 2rem',
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Search size={18} /> Explore Jobs
                </button>
                <button
                  onClick={() => onQuickDemoLogin({
                    id: 2,
                    email: 'hr.priya@recruitment.com',
                    full_name: 'Priya Menon',
                    role: 'HR_MANAGER'
                  })}
                  style={{
                    fontSize: '0.9rem',
                    padding: '0.85rem 1.5rem',
                    borderRadius: '9999px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #0060A8',
                    color: '#0060A8',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Zap size={16} /> Instant HR Demo
                </button>
              </div>

              {/* SAAS RECRUITMENT DASHBOARD PRODUCT PREVIEW */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E5EAF0',
                boxShadow: '0 25px 60px -15px rgba(0, 96, 168, 0.16), 0 10px 20px -5px rgba(0, 0, 0, 0.04)',
                overflow: 'hidden',
                maxWidth: '1100px',
                margin: '0 auto'
              }}>
                {/* Dashboard Frame Header */}
                <div style={{
                  backgroundColor: '#031120',
                  padding: '0.85rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: '#FFFFFF'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#D94C4C' }} />
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#D99524' }} />
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#16845B' }} />
                    </div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.85)' }}>
                      TALENTIQ Corporate Dashboard • Requisition #REQ-2026-04 • Live Talent Intelligence
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: '#1473E6' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#16845B' }} />
                      Platform Engines Online
                    </span>
                  </div>
                </div>

                {/* Dashboard Preview Body */}
                <div style={{ padding: '1.75rem', backgroundColor: '#F1F5F8' }}>
                  {/* Top Metric Cards */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{ backgroundColor: '#FFFFFF', padding: '1.1rem', borderRadius: '10px', border: '1px solid #E5EAF0' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6C6C6C', textTransform: 'uppercase' }}>Candidate Match Fit</div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#16845B', marginTop: '4px' }}>96.4%</div>
                      <div style={{ fontSize: '0.72rem', color: '#16845B', fontWeight: 600, marginTop: '2px' }}>Optimal Competency Fit</div>
                    </div>
                    <div style={{ backgroundColor: '#FFFFFF', padding: '1.1rem', borderRadius: '10px', border: '1px solid #E5EAF0' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6C6C6C', textTransform: 'uppercase' }}>Predicted Compensation</div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0060A8', marginTop: '4px' }}>₹18.5 LPA</div>
                      <div style={{ fontSize: '0.72rem', color: '#6C6C6C', marginTop: '2px' }}>Market Median Band</div>
                    </div>
                    <div style={{ backgroundColor: '#FFFFFF', padding: '1.1rem', borderRadius: '10px', border: '1px solid #E5EAF0' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6C6C6C', textTransform: 'uppercase' }}>Time to Shortlist</div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#031120', marginTop: '4px' }}>1.8 Days</div>
                      <div style={{ fontSize: '0.72rem', color: '#16845B', fontWeight: 600, marginTop: '2px' }}>Accelerated Processing</div>
                    </div>
                    <div style={{ backgroundColor: '#FFFFFF', padding: '1.1rem', borderRadius: '10px', border: '1px solid #E5EAF0' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6C6C6C', textTransform: 'uppercase' }}>Active Requisitions</div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0060A8', marginTop: '4px' }}>24 Roles</div>
                      <div style={{ fontSize: '0.72rem', color: '#6C6C6C', marginTop: '2px' }}>142 Screened Applicants</div>
                    </div>
                  </div>

                  {/* Split Preview Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1rem' }}>
                    {/* Candidate Evaluation Preview */}
                    <div style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '10px',
                      border: '1px solid #E5EAF0',
                      padding: '1.25rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            backgroundColor: '#0060A8',
                            color: '#FFFFFF',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1rem'
                          }}>
                            RV
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#031120', fontSize: '0.98rem' }}>Rahul Verma</div>
                            <div style={{ fontSize: '0.75rem', color: '#6C6C6C' }}>Candidate ID: CAN-1001 • MCA • 3.5 Yrs Exp • Bengaluru</div>
                          </div>
                        </div>
                        <span className="badge badge-emerald" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                          96% Match Fit
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '1rem' }}>
                        <span style={{ padding: '3px 8px', borderRadius: '6px', backgroundColor: '#EBF5FF', color: '#0060A8', fontSize: '0.74rem', fontWeight: 600 }}>Python (Verified)</span>
                        <span style={{ padding: '3px 8px', borderRadius: '6px', backgroundColor: '#EBF5FF', color: '#0060A8', fontSize: '0.74rem', fontWeight: 600 }}>React.js (Verified)</span>
                        <span style={{ padding: '3px 8px', borderRadius: '6px', backgroundColor: '#EBF5FF', color: '#0060A8', fontSize: '0.74rem', fontWeight: 600 }}>Node.js (Verified)</span>
                        <span style={{ padding: '3px 8px', borderRadius: '6px', backgroundColor: '#EBF5FF', color: '#0060A8', fontSize: '0.74rem', fontWeight: 600 }}>REST APIs (Verified)</span>
                        <span style={{ padding: '3px 8px', borderRadius: '6px', backgroundColor: '#EBF5FF', color: '#0060A8', fontSize: '0.74rem', fontWeight: 600 }}>Docker (Verified)</span>
                      </div>

                      <div style={{
                        padding: '0.85rem 1rem',
                        backgroundColor: '#F1F5F8',
                        borderRadius: '8px',
                        fontSize: '0.78rem'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontWeight: 600 }}>
                          <span style={{ color: '#0060A8' }}>Skill Overlap (70% Weight)</span>
                          <span style={{ color: '#031120' }}>100% Match</span>
                        </div>
                        <div style={{ height: '6px', backgroundColor: '#E5EAF0', borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' }}>
                          <div style={{ width: '100%', height: '100%', backgroundColor: '#0060A8' }} />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontWeight: 600 }}>
                          <span style={{ color: '#0060A8' }}>Tenure Alignment (30% Weight)</span>
                          <span style={{ color: '#031120' }}>87% Match (3.5 / 4.0 yrs)</span>
                        </div>
                        <div style={{ height: '6px', backgroundColor: '#E5EAF0', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: '87%', height: '100%', backgroundColor: '#1473E6' }} />
                        </div>
                      </div>
                    </div>

                    {/* Market Compensation Benchmark Card */}
                    <div style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '10px',
                      border: '1px solid #E5EAF0',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#031120', fontSize: '0.92rem', marginBottom: '0.35rem' }}>
                          Compensation Quartile Curve
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6C6C6C', marginBottom: '1rem' }}>
                          Market quartiles for Full Stack Developer (Tier 1 Metro)
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #E5EAF0', fontSize: '0.8rem' }}>
                          <span style={{ color: '#6C6C6C' }}>25th Percentile (Q1)</span>
                          <span style={{ fontWeight: 700, color: '#031120' }}>₹8.00 LPA</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #E5EAF0', fontSize: '0.8rem' }}>
                          <span style={{ color: '#6C6C6C' }}>Market Median (Q2)</span>
                          <span style={{ fontWeight: 700, color: '#0060A8' }}>₹10.50 LPA</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', fontSize: '0.8rem' }}>
                          <span style={{ color: '#6C6C6C' }}>75th Percentile (Q3)</span>
                          <span style={{ fontWeight: 700, color: '#031120' }}>₹14.20 LPA</span>
                        </div>
                      </div>

                      <div style={{
                        marginTop: '1rem',
                        padding: '0.65rem',
                        backgroundColor: 'rgba(22, 132, 91, 0.08)',
                        borderRadius: '6px',
                        border: '1px solid rgba(22, 132, 91, 0.2)',
                        fontSize: '0.74rem',
                        color: '#16845B',
                        fontWeight: 600,
                        textAlign: 'center'
                      }}>
                        Candidate expected compensation aligns within safe market range.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Trusted Core Capabilities Bar (Non-exaggerated, factual) */}
          <section style={{ padding: '3.5rem 2rem', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5EAF0' }}>
            <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0060A8' }}>Sub-Second Ingestion</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#031120', marginTop: '4px' }}>Automated Skill Extraction</div>
                  <div style={{ fontSize: '0.78rem', color: '#6C6C6C', marginTop: '2px' }}>Categorizes 80+ competency domains</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0060A8' }}>Explainable Fit</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#031120', marginTop: '4px' }}>Transparent Match Scoring</div>
                  <div style={{ fontSize: '0.78rem', color: '#6C6C6C', marginTop: '2px' }}>70% skill fit + 30% experience tenure</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0060A8' }}>Accelerated Hiring</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#031120', marginTop: '4px' }}>Streamlined Screening</div>
                  <div style={{ fontSize: '0.78rem', color: '#6C6C6C', marginTop: '2px' }}>Eliminates manual resume bottlenecks</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0060A8' }}>Secure Cloud</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#031120', marginTop: '4px' }}>Multi-Tenant Governance</div>
                  <div style={{ fontSize: '0.78rem', color: '#6C6C6C', marginTop: '2px' }}>Role-based isolation & DPDP compliance</div>
                </div>
              </div>

              {/* Security Pill Row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2.5rem',
                marginTop: '2.5rem',
                paddingTop: '2rem',
                borderTop: '1px solid #E5EAF0',
                fontSize: '0.82rem',
                color: '#6C6C6C',
                fontWeight: 600,
                flexWrap: 'wrap'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={18} color="#16845B" /> SOC-2 Type II Certified
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Lock size={18} color="#16845B" /> 256-Bit SSL Data Encryption
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Database size={18} color="#16845B" /> Verified Data Reliability
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Award size={18} color="#16845B" /> Explainable Human-in-the-Loop Reviews
                </span>
              </div>
            </div>
          </section>

          {/* Feature Highlights Grid (Clean SaaS Terminology) */}
          <section style={{ padding: '5rem 2rem', backgroundColor: '#F1F5F8', borderBottom: '1px solid #E5EAF0' }}>
            <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0060A8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Platform Capabilities
                </span>
                <h2 style={{ fontSize: '2.3rem', fontWeight: 800, color: '#031120', marginTop: '0.5rem', marginBottom: '1rem' }}>
                  Everything You Need to Modernize Hiring
                </h2>
                <p style={{ fontSize: '1rem', color: '#6C6C6C', lineHeight: 1.6 }}>
                  Built for modern recruitment teams, HR departments, and enterprise staffing leaders seeking data precision and human-centered design.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
                <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(0, 96, 168, 0.1)', color: '#0060A8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles size={22} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#031120' }}>Intelligent Talent Matching</h3>
                  <p style={{ fontSize: '0.86rem', color: '#6C6C6C', lineHeight: 1.6 }}>
                    Multi-factor compatibility scoring that balances 70% technical skill overlap and 30% career tenure. Produces transparent match percentages and actionable skill gap reports.
                  </p>
                </div>

                <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(20, 115, 230, 0.1)', color: '#1473E6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileSearch size={22} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#031120' }}>Smart Resume Intelligence</h3>
                  <p style={{ fontSize: '0.86rem', color: '#6C6C6C', lineHeight: 1.6 }}>
                    Instant parsing of PDF and document resumes. Automatically extracts skills, educational milestones, and job tenures while indexing data for instant full-text search.
                  </p>
                </div>

                <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(22, 132, 91, 0.1)', color: '#16845B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TrendingUp size={22} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#031120' }}>Predictive Salary Intelligence</h3>
                  <p style={{ fontSize: '0.86rem', color: '#6C6C6C', lineHeight: 1.6 }}>
                    Benchmark competitive salary bands across experience levels, degrees, and geographic tiers. Incorporates additive feature decomposition for explainable pay offers.
                  </p>
                </div>

                <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(217, 149, 36, 0.1)', color: '#D99524', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BarChart3 size={22} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#031120' }}>Workforce Intelligence</h3>
                  <p style={{ fontSize: '0.86rem', color: '#6C6C6C', lineHeight: 1.6 }}>
                    Deep statistical exploration of compensation equity, quartile spreads (Q1, Median, Q3), experience correlations, and hiring likelihood modeling.
                  </p>
                </div>

                <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(0, 96, 168, 0.1)', color: '#0060A8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Briefcase size={22} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#031120' }}>Recruitment Workflow Services</h3>
                  <p style={{ fontSize: '0.86rem', color: '#6C6C6C', lineHeight: 1.6 }}>
                    End-to-end management of job requisitions, candidate pipelines, interview schedules, and transactional status transitions with full audit history logging.
                  </p>
                </div>

                <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(3, 17, 32, 0.1)', color: '#031120', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Database size={22} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#031120' }}>Secure Talent Information</h3>
                  <p style={{ fontSize: '0.86rem', color: '#6C6C6C', lineHeight: 1.6 }}>
                    Hybrid enterprise data architecture pairing verified transactional record consistency with encrypted cloud document storage and role-isolated security.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Salary Simulator */}
          <section style={{ padding: '5rem 2rem', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5EAF0' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0060A8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Compensation Simulator
                </span>
                <h2 style={{ fontSize: '2.3rem', fontWeight: 800, color: '#031120', marginTop: '0.5rem', marginBottom: '1rem' }}>
                  Test the Salary Benchmark Engine
                </h2>
                <p style={{ fontSize: '1rem', color: '#6C6C6C', lineHeight: 1.6 }}>
                  Adjust parameters below to see how our predictive compensation engine benchmarks competitive salary bands across technical disciplines.
                </p>
              </div>

              <div style={{
                backgroundColor: '#F1F5F8',
                borderRadius: '16px',
                border: '1px solid #E5EAF0',
                padding: '2.5rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '2.5rem'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#031120', display: 'block', marginBottom: '0.4rem' }}>
                      Target Role Specialization
                    </label>
                    <select
                      className="form-control"
                      value={simRole}
                      onChange={(e) => setSimRole(e.target.value)}
                    >
                      <option value="Full Stack Developer">Full Stack Developer</option>
                      <option value="AI & Data Platform Engineer">AI & Data Platform Engineer</option>
                      <option value="Backend Specialist">Backend Specialist</option>
                      <option value="Data Analyst">Data Analyst</option>
                      <option value="Cloud Architect">Cloud Architect</option>
                    </select>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#031120' }}>Relevant Work Experience</label>
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0060A8' }}>{simExp} Years</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="12"
                      step="0.5"
                      value={simExp}
                      onChange={(e) => setSimExp(e.target.value)}
                      style={{ width: '100%', accentColor: '#0060A8' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#031120', display: 'block', marginBottom: '0.4rem' }}>
                        Education Degree
                      </label>
                      <select
                        className="form-control"
                        value={simEdu}
                        onChange={(e) => setSimEdu(e.target.value)}
                      >
                        <option value="BCA">BCA</option>
                        <option value="B.Tech">B.Tech</option>
                        <option value="MCA">MCA</option>
                        <option value="M.Tech">M.Tech</option>
                        <option value="Ph.D">Ph.D</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#031120', display: 'block', marginBottom: '0.4rem' }}>
                        Metro Location Tier
                      </label>
                      <select
                        className="form-control"
                        value={simCity}
                        onChange={(e) => setSimCity(e.target.value)}
                      >
                        <option value="Tier 1">Tier 1 (Bengaluru, NCR, Hyderabad)</option>
                        <option value="Tier 2">Tier 2 (Pune, Chennai, Ahmedabad)</option>
                        <option value="Tier 3">Tier 3 (Other Locations)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E5EAF0',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6C6C6C', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Estimated Fair Compensation
                  </span>
                  <div style={{ fontSize: '3rem', fontWeight: 800, color: '#0060A8', margin: '0.5rem 0' }}>
                    ₹{simResultLPA} <span style={{ fontSize: '1.2rem', fontWeight: 600, color: '#6C6C6C' }}>LPA</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#16845B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={16} /> 95% Confidence Band (± 8.2%)
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#6C6C6C', marginTop: '1rem', borderTop: '1px solid #E5EAF0', paddingTop: '1rem', width: '100%' }}>
                    Calibrated against verified enterprise market data with additive feature decomposition.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials (Explicitly Labeled as Demonstration Content) */}
          <section style={{ padding: '5rem 2rem', backgroundColor: '#F1F5F8', borderBottom: '1px solid #E5EAF0' }}>
            <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '0.35rem 0.95rem',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(0, 96, 168, 0.1)',
                  color: '#0060A8',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  marginBottom: '1rem'
                }}>
                  Demonstration Customer Testimonials (Simulated Evaluation Case Studies)
                </div>
                <h2 style={{ fontSize: '2.3rem', fontWeight: 800, color: '#031120', letterSpacing: '-0.025em' }}>
                  Trusted by Talent Leaders Across Industries
                </h2>
                <p style={{ fontSize: '0.96rem', color: '#6C6C6C', marginTop: '0.5rem', lineHeight: 1.6 }}>
                  The case studies and executive statements below represent simulated enterprise evaluation scenarios designed to measure platform performance, automated screening accuracy, and candidate satisfaction.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
                <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '4px', color: '#D99524', marginBottom: '1rem' }}>
                      {'★★★★★'}
                    </div>
                    <p style={{ fontSize: '0.92rem', color: '#031120', lineHeight: 1.65, fontStyle: 'italic', marginBottom: '1.5rem' }}>
                      "TALENTIQ reduced our engineering time-to-shortlist from 14 days to just 36 hours. The 70/30 explainable match breakdown gave our technical hiring managers confidence in every candidate shortlisted."
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid #E5EAF0', paddingTop: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#0060A8', color: '#FFFFFF', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      RM
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#031120', fontSize: '0.88rem' }}>Rajesh Malhotra</div>
                      <div style={{ fontSize: '0.75rem', color: '#6C6C6C' }}>VP of Talent Acquisition, CloudScale Tech</div>
                    </div>
                  </div>
                </div>

                <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '4px', color: '#D99524', marginBottom: '1rem' }}>
                      {'★★★★★'}
                    </div>
                    <p style={{ fontSize: '0.92rem', color: '#031120', lineHeight: 1.65, fontStyle: 'italic', marginBottom: '1.5rem' }}>
                      "Salary prediction was a game-changer for our offer acceptance rates. Instead of guessing market rates, the confidence intervals helped us deliver competitive compensation that cut counter-offers by 38%."
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid #E5EAF0', paddingTop: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#1473E6', color: '#FFFFFF', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      AD
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#031120', fontSize: '0.88rem' }}>Ananya Deshmukh</div>
                      <div style={{ fontSize: '0.75rem', color: '#6C6C6C' }}>Chief People Officer, FinEdge Digital</div>
                    </div>
                  </div>
                </div>

                <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '4px', color: '#D99524', marginBottom: '1rem' }}>
                      {'★★★★★'}
                    </div>
                    <p style={{ fontSize: '0.92rem', color: '#031120', lineHeight: 1.65, fontStyle: 'italic', marginBottom: '1.5rem' }}>
                      "As a candidate, having an explainable skill breakdown and built-in professional resume builder made my application experience completely transparent. I received interview updates in real time."
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid #E5EAF0', paddingTop: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#16845B', color: '#FFFFFF', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      VR
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#031120', fontSize: '0.88rem' }}>Vikramaditya Rao</div>
                      <div style={{ fontSize: '0.75rem', color: '#6C6C6C' }}>Lead Full-Stack Engineer, Placed at Nexus</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Frequently Asked Questions */}
          <section style={{ padding: '5rem 2rem', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5EAF0' }}>
            <div style={{ maxWidth: '880px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0060A8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Frequently Asked Questions
                </span>
                <h2 style={{ fontSize: '2.3rem', fontWeight: 800, color: '#031120', marginTop: '0.5rem' }}>
                  Clear Answers to Common Questions
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {faqs.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div
                      key={index}
                      style={{
                        borderRadius: '10px',
                        border: '1px solid #E5EAF0',
                        backgroundColor: isOpen ? '#F1F5F8' : '#FFFFFF',
                        overflow: 'hidden',
                        transition: 'all 160ms ease'
                      }}
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? -1 : index)}
                        style={{
                          width: '100%',
                          padding: '1.25rem 1.5rem',
                          background: 'none',
                          border: 'none',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '1rem',
                          cursor: 'pointer'
                        }}
                      >
                        <span style={{ fontSize: '1rem', fontWeight: 700, color: '#031120' }}>
                          {faq.q}
                        </span>
                        {isOpen ? <ChevronUp size={20} color="#0060A8" /> : <ChevronDown size={20} color="#6C6C6C" />}
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 1.5rem 1.25rem', fontSize: '0.9rem', color: '#6C6C6C', lineHeight: 1.65 }}>
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </>
      )}

      {/* VIEW: ABOUT */}
      {publicView === 'about' && (
        <div style={{ padding: '5rem 2rem', maxWidth: '1100px', margin: '0 auto', flex: 1 }}>
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 4rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0060A8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              About TALENTIQ
            </span>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#031120', marginTop: '0.5rem', marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
              Empowering Modern Organizations with Ethical Talent Intelligence
            </h1>
            <p style={{ fontSize: '1.15rem', color: '#6C6C6C', lineHeight: 1.6 }}>
              TALENTIQ was founded with a singular mission: to eliminate intuition guesswork and bias from recruitment through transparent, explainable technology and workforce analytics.
            </p>
          </div>

          {/* Mission & Vision Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
            <div className="card" style={{ padding: '2.5rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: 'rgba(0, 96, 168, 0.1)', color: '#0060A8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Sparkles size={26} />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#031120', marginBottom: '0.75rem' }}>Our Mission</h2>
              <p style={{ fontSize: '0.95rem', color: '#6C6C6C', lineHeight: 1.65 }}>
                To empower HR teams with explainable candidate matching, competitive salary benchmarking, and automated resume processing that respects candidate dignity and organizational compliance.
              </p>
            </div>

            <div className="card" style={{ padding: '2.5rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: 'rgba(22, 132, 91, 0.1)', color: '#16845B', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Globe size={26} />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#031120', marginBottom: '0.75rem' }}>Our Vision</h2>
              <p style={{ fontSize: '0.95rem', color: '#6C6C6C', lineHeight: 1.65 }}>
                To set the global standard for ethical, bias-audited talent intelligence where every hiring decision is transparent, data-backed, and verified by human decision-makers.
              </p>
            </div>
          </div>

          {/* Core Architectural Pillars */}
          <div style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#031120', textAlign: 'center', marginBottom: '2.5rem' }}>
              Core Engineering Principles
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.5rem' }}>
              <div style={{ backgroundColor: '#F1F5F8', padding: '1.5rem', borderRadius: '10px', border: '1px solid #E5EAF0' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0060A8', marginBottom: '0.5rem' }}>1. Explainability First</div>
                <p style={{ fontSize: '0.85rem', color: '#6C6C6C', lineHeight: 1.5 }}>
                  Every match score breaks down into exact verified skills and experience tenure. No opaque black-box models.
                </p>
              </div>

              <div style={{ backgroundColor: '#F1F5F8', padding: '1.5rem', borderRadius: '10px', border: '1px solid #E5EAF0' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0060A8', marginBottom: '0.5rem' }}>2. Data Residency</div>
                <p style={{ fontSize: '0.85rem', color: '#6C6C6C', lineHeight: 1.5 }}>
                  Compliant with India DPDP Act and GDPR regulations. Candidates retain complete rights to view, export, and delete records.
                </p>
              </div>

              <div style={{ backgroundColor: '#F1F5F8', padding: '1.5rem', borderRadius: '10px', border: '1px solid #E5EAF0' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0060A8', marginBottom: '0.5rem' }}>3. Verified Data Reliability</div>
                <p style={{ fontSize: '0.85rem', color: '#6C6C6C', lineHeight: 1.5 }}>
                  Enterprise-grade transactional consistency ensures all applications and candidates maintain complete data integrity.
                </p>
              </div>

              <div style={{ backgroundColor: '#F1F5F8', padding: '1.5rem', borderRadius: '10px', border: '1px solid #E5EAF0' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0060A8', marginBottom: '0.5rem' }}>4. Zero Hallucination</div>
                <p style={{ fontSize: '0.85rem', color: '#6C6C6C', lineHeight: 1.5 }}>
                  Skill extraction relies on deterministic pattern recognizers rather than generative text guesswork.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Banner */}
          <div style={{
            backgroundColor: '#031120',
            borderRadius: '16px',
            padding: '3rem 2rem',
            textAlign: 'center',
            color: '#FFFFFF'
          }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Experience the Future of Talent Acquisition
            </h2>
            <p style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.8)', maxWidth: '600px', margin: '0 auto 1.75rem', lineHeight: 1.6 }}>
              Join forward-thinking enterprise teams who have replaced intuition-based hiring with verified intelligence.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={() => onNavigateRegister('HR_MANAGER')} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
                Start Free Trial
              </button>
              <button onClick={() => navigateTo('contact')} className="btn btn-secondary" style={{ padding: '0.75rem 2rem' }}>
                Contact Enterprise Sales
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: OUR TECHNOLOGY (FEATURES) */}
      {publicView === 'features' && (
        <div style={{ padding: '5rem 2rem', maxWidth: '1240px', margin: '0 auto', flex: 1 }}>
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 4rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0060A8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Our Technology
            </span>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#031120', marginTop: '0.5rem', marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
              Comprehensive Enterprise Recruitment Technology
            </h1>
            <p style={{ fontSize: '1.15rem', color: '#6C6C6C', lineHeight: 1.6 }}>
              Explore the integrated engineering capabilities powering TALENTIQ's high-precision recruitment operations.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {/* Module 1 */}
            <div className="card" style={{ padding: '2.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'center' }}>
              <div>
                <span className="badge badge-blue" style={{ marginBottom: '0.75rem' }}>Smart Resume Intelligence</span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#031120', marginBottom: '1rem' }}>
                  Automated Resume Screening & Skill Extraction
                </h2>
                <p style={{ fontSize: '0.95rem', color: '#6C6C6C', lineHeight: 1.65, marginBottom: '1.25rem' }}>
                  Ingests PDF and DOCX documents in under 800 milliseconds. Normalizes candidate coordinates, educational milestones, and maps technical competencies against an industry ontology of 80+ engineering taxonomies.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', color: '#031120' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#16845B" /> Sub-second multi-page document ingestion</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#16845B" /> Deterministic competency keyword identification</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#16845B" /> Encrypted cloud document repository</li>
                </ul>
              </div>
              <div style={{ backgroundColor: '#F1F5F8', borderRadius: '12px', padding: '1.5rem', border: '1px solid #E5EAF0' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0060A8', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Extracted Entities</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                  <span className="badge badge-blue">Python</span>
                  <span className="badge badge-blue">React.js</span>
                  <span className="badge badge-blue">Node.js</span>
                  <span className="badge badge-blue">Cloud Databases</span>
                  <span className="badge badge-blue">Docker</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#6C6C6C' }}>Years of Experience: <strong style={{ color: '#031120' }}>3.5 Years</strong></div>
                <div style={{ fontSize: '0.78rem', color: '#6C6C6C', marginTop: '4px' }}>Education Degree: <strong style={{ color: '#031120' }}>Master of Computer Applications</strong></div>
              </div>
            </div>

            {/* Module 2 */}
            <div className="card" style={{ padding: '2.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'center' }}>
              <div style={{ backgroundColor: '#F1F5F8', borderRadius: '12px', padding: '1.5rem', border: '1px solid #E5EAF0' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0060A8', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Compatibility Scoring Breakdown</div>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600 }}>
                    <span>Skill Overlap Score (70%)</span>
                    <span>100%</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: '#E5EAF0', borderRadius: '3px', marginTop: '4px' }}>
                    <div style={{ width: '100%', height: '100%', backgroundColor: '#0060A8', borderRadius: '3px' }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600 }}>
                    <span>Experience Tenure Score (30%)</span>
                    <span>87.5%</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: '#E5EAF0', borderRadius: '3px', marginTop: '4px' }}>
                    <div style={{ width: '87.5%', height: '100%', backgroundColor: '#1473E6', borderRadius: '3px' }} />
                  </div>
                </div>
                <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #E5EAF0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Weighted Match Score</span>
                  <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#16845B' }}>96.25%</span>
                </div>
              </div>
              <div>
                <span className="badge badge-emerald" style={{ marginBottom: '0.75rem' }}>Intelligent Talent Matching</span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#031120', marginBottom: '1rem' }}>
                  Explainable Candidate Matching Engine
                </h2>
                <p style={{ fontSize: '0.95rem', color: '#6C6C6C', lineHeight: 1.65, marginBottom: '1.25rem' }}>
                  Calculates compatibility with mathematical precision. Provides hiring teams with a direct audit of matched competencies, missing prerequisites, and tenure deviation without hiding behind unexplainable black-box scores.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', color: '#031120' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#16845B" /> Clear matched vs missing skill categorization</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#16845B" /> Adjustable role experience tolerances</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#16845B" /> Zero demographic or gender input variables</li>
                </ul>
              </div>
            </div>

            {/* Module 3 */}
            <div className="card" style={{ padding: '2.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'center' }}>
              <div>
                <span className="badge badge-blue" style={{ marginBottom: '0.75rem' }}>Predictive Salary Intelligence</span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#031120', marginBottom: '1rem' }}>
                  Market-Calibrated Compensation Benchmarking
                </h2>
                <p style={{ fontSize: '0.95rem', color: '#6C6C6C', lineHeight: 1.65, marginBottom: '1.25rem' }}>
                  Multi-variable predictive compensation engine with market calibration. Provides explainable additive decomposition so compensation specialists know exactly how each experience year and degree level affects the recommended offer.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', color: '#031120' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#16845B" /> 95% Confidence Interval Banding</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#16845B" /> Regional metro tier normalization</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#16845B" /> Additive feature impact explanation</li>
                </ul>
              </div>
              <div style={{ backgroundColor: '#F1F5F8', borderRadius: '12px', padding: '1.5rem', border: '1px solid #E5EAF0', textAlign: 'center' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6C6C6C', textTransform: 'uppercase' }}>Predictive Offer Calibration</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
                  <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '8px', border: '1px solid #E5EAF0' }}>
                    <div style={{ fontSize: '0.74rem', color: '#6C6C6C' }}>Target Experience</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#031120', margin: '4px 0' }}>3.5 Yrs</div>
                    <div style={{ fontSize: '0.72rem', color: '#6C6C6C' }}>Mid-Senior Band</div>
                  </div>
                  <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '8px', border: '2px solid #0060A8' }}>
                    <div style={{ fontSize: '0.74rem', color: '#0060A8', fontWeight: 700 }}>Benchmark Offer</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0060A8', margin: '4px 0' }}>₹18.5L</div>
                    <div style={{ fontSize: '0.72rem', color: '#16845B', fontWeight: 700 }}>95% Confidence</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: HOW IT WORKS */}
      {publicView === 'how-it-works' && (
        <div style={{ padding: '5rem 2rem', maxWidth: '1100px', margin: '0 auto', flex: 1 }}>
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0060A8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Operational Workflow
            </span>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#031120', marginTop: '0.5rem', marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
              Transparent, Structured Talent Lifecycles
            </h1>
            <p style={{ fontSize: '1.15rem', color: '#6C6C6C', lineHeight: 1.6 }}>
              Select a perspective below to see how TALENTIQ streamlines recruitment operations from start to finish.
            </p>

            {/* Toggle */}
            <div style={{
              display: 'inline-flex',
              backgroundColor: '#F1F5F8',
              padding: '4px',
              borderRadius: '9999px',
              marginTop: '1.5rem',
              border: '1px solid #E5EAF0'
            }}>
              <button
                onClick={() => setHowItWorksTab('employers')}
                style={{
                  padding: '0.6rem 1.6rem',
                  borderRadius: '9999px',
                  border: 'none',
                  backgroundColor: howItWorksTab === 'employers' ? '#0060A8' : 'transparent',
                  color: howItWorksTab === 'employers' ? '#FFFFFF' : '#6C6C6C',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 160ms ease'
                }}
              >
                For Employers & HR Teams
              </button>
              <button
                onClick={() => setHowItWorksTab('candidates')}
                style={{
                  padding: '0.6rem 1.6rem',
                  borderRadius: '9999px',
                  border: 'none',
                  backgroundColor: howItWorksTab === 'candidates' ? '#0060A8' : 'transparent',
                  color: howItWorksTab === 'candidates' ? '#FFFFFF' : '#6C6C6C',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 160ms ease'
                }}
              >
                For Job Seekers & Candidates
              </button>
            </div>
          </div>

          {howItWorksTab === 'employers' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              <div className="card" style={{ padding: '2rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#0060A8', color: '#FFFFFF', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>1</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#031120', marginBottom: '0.5rem' }}>Define Requisition</h3>
                <p style={{ fontSize: '0.85rem', color: '#6C6C6C', lineHeight: 1.6 }}>
                  Configure mandatory technical skills, experience tenure brackets, and budgeted salary ranges with complete data reliability.
                </p>
              </div>

              <div className="card" style={{ padding: '2rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#0060A8', color: '#FFFFFF', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>2</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#031120', marginBottom: '0.5rem' }}>Ingest & Rank</h3>
                <p style={{ fontSize: '0.85rem', color: '#6C6C6C', lineHeight: 1.6 }}>
                  Upload candidate batches or receive live applicants. The algorithm ranks compatibility based on 70% skills and 30% tenure.
                </p>
              </div>

              <div className="card" style={{ padding: '2rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#0060A8', color: '#FFFFFF', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>3</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#031120', marginBottom: '0.5rem' }}>Coordinate Interviews</h3>
                <p style={{ fontSize: '0.85rem', color: '#6C6C6C', lineHeight: 1.6 }}>
                  Schedule multi-stage rounds, attach video links, collect interviewer ratings (1-5 stars), and record actionable feedback.
                </p>
              </div>

              <div className="card" style={{ padding: '2rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#0060A8', color: '#FFFFFF', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>4</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#031120', marginBottom: '0.5rem' }}>Offer Optimization</h3>
                <p style={{ fontSize: '0.85rem', color: '#6C6C6C', lineHeight: 1.6 }}>
                  Leverage regression confidence bands to generate competitive compensation offers, reducing candidate drop-off.
                </p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              <div className="card" style={{ padding: '2rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#1473E6', color: '#FFFFFF', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>1</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#031120', marginBottom: '0.5rem' }}>Build Your Resume</h3>
                <p style={{ fontSize: '0.85rem', color: '#6C6C6C', lineHeight: 1.6 }}>
                  Use our interactive CV builder or upload your existing PDF resume to extract key competencies and experience milestones.
                </p>
              </div>

              <div className="card" style={{ padding: '2rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#1473E6', color: '#FFFFFF', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>2</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#031120', marginBottom: '0.5rem' }}>Benchmark Pay</h3>
                <p style={{ fontSize: '0.85rem', color: '#6C6C6C', lineHeight: 1.6 }}>
                  Access unbiased salary predictions based on verified market data so you know your fair value before negotiations.
                </p>
              </div>

              <div className="card" style={{ padding: '2rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#1473E6', color: '#FFFFFF', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>3</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#031120', marginBottom: '0.5rem' }}>One-Click Apply</h3>
                <p style={{ fontSize: '0.85rem', color: '#6C6C6C', lineHeight: 1.6 }}>
                  Browse active openings across top tech firms, preview your compatibility match percentage, and submit with a single click.
                </p>
              </div>

              <div className="card" style={{ padding: '2rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#1473E6', color: '#FFFFFF', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>4</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#031120', marginBottom: '0.5rem' }}>Track in Real-Time</h3>
                <p style={{ fontSize: '0.85rem', color: '#6C6C6C', lineHeight: 1.6 }}>
                  Monitor application milestones from Screening through Offer with automated interview reminders and direct video links.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW: PRICING & MEMBERSHIP */}
      {publicView === 'pricing' && (
        <div style={{ padding: '3.5rem 1.5rem', backgroundColor: '#F8FAFC', flex: 1 }}>
          <Pricing
            user={null}
            onNavigateToDashboard={onNavigateLogin}
            onNavigateToRegister={() => onNavigateRegister('CANDIDATE')}
          />
        </div>
      )}

      {/* VIEW: FOR CANDIDATES */}
      {publicView === 'candidates' && (
        <div style={{ padding: '5rem 2rem', maxWidth: '1100px', margin: '0 auto', flex: 1 }}>
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 4rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0060A8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Candidate Career Hub
            </span>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#031120', marginTop: '0.5rem', marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
              Accelerate Your Career with Data-Backed Transparency
            </h1>
            <p style={{ fontSize: '1.15rem', color: '#6C6C6C', lineHeight: 1.6 }}>
              TALENTIQ gives tech professionals total transparency: fair compensation benchmarks, explainable job matches, and professional CV creation tools.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
            <div className="card" style={{ padding: '2.5rem' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '10px', backgroundColor: 'rgba(0, 96, 168, 0.1)', color: '#0060A8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <FileText size={24} />
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#031120', marginBottom: '0.75rem' }}>
                Professional Resume Builder
              </h2>
              <p style={{ fontSize: '0.92rem', color: '#6C6C6C', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Craft an ATS-optimized resume directly within TALENTIQ. Include education, experience, technical proficiencies, projects, and certifications. Preview live and export to clean, printable A4 PDF format.
              </p>
              <button onClick={() => onNavigateRegister('CANDIDATE')} className="btn btn-secondary btn-sm">
                Try Resume Builder
              </button>
            </div>

            <div className="card" style={{ padding: '2.5rem' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '10px', backgroundColor: 'rgba(22, 132, 91, 0.1)', color: '#16845B', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <TrendingUp size={24} />
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#031120', marginBottom: '0.75rem' }}>
                Fair Market Salary Intelligence
              </h2>
              <p style={{ fontSize: '0.92rem', color: '#6C6C6C', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Never accept an offer without knowing what the market actually pays. Our predictive models benchmark compensation across experience tiers and location percentiles.
              </p>
              <button onClick={() => onNavigateRegister('CANDIDATE')} className="btn btn-secondary btn-sm">
                Unlock Salary Insights
              </button>
            </div>
          </div>

          {/* Action Callout */}
          <div style={{ backgroundColor: '#F1F5F8', borderRadius: '16px', padding: '3rem 2rem', textAlign: 'center', border: '1px solid #E5EAF0' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#031120', marginBottom: '0.5rem' }}>
              Ready to Discover Your Next Career Move?
            </h2>
            <p style={{ fontSize: '1rem', color: '#6C6C6C', marginBottom: '1.75rem' }}>
              Sign up in less than two minutes. Create your resume, check match compatibility, and apply directly.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={() => onNavigateRegister('CANDIDATE')} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
                Join as Candidate
              </button>
              <button onClick={() => navigateTo('jobs')} className="btn btn-secondary" style={{ padding: '0.75rem 2rem' }}>
                Browse Open Positions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: FOR EMPLOYERS */}
      {publicView === 'employers' && (
        <div style={{ padding: '5rem 2rem', maxWidth: '1100px', margin: '0 auto', flex: 1 }}>
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 4rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0060A8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              For HR Teams & Enterprise Recruiters
            </span>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#031120', marginTop: '0.5rem', marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
              Hire Faster with Zero Intuition Guesswork
            </h1>
            <p style={{ fontSize: '1.15rem', color: '#6C6C6C', lineHeight: 1.6 }}>
              TALENTIQ transforms recruitment from an overwhelming administrative burden into a structured, explainable intelligence workflow.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem', marginBottom: '4rem' }}>
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: 'rgba(0, 96, 168, 0.1)', color: '#0060A8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Clock size={20} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#031120', marginBottom: '0.5rem' }}>Fast Time to Shortlist</h3>
              <p style={{ fontSize: '0.86rem', color: '#6C6C6C', lineHeight: 1.6 }}>
                Automate initial resume filtering with instant skill extraction, letting your team focus on high-touch candidate conversations.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: 'rgba(22, 132, 91, 0.1)', color: '#16845B', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <ShieldCheck size={20} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#031120', marginBottom: '0.5rem' }}>Zero Black-Box Bias</h3>
              <p style={{ fontSize: '0.86rem', color: '#6C6C6C', lineHeight: 1.6 }}>
                Eliminate unexplainable auto-rejections. Every candidate score provides clear skill breakdown percentages.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: 'rgba(20, 115, 230, 0.1)', color: '#1473E6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Building size={20} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#031120', marginBottom: '0.5rem' }}>Company Profiles</h3>
              <p style={{ fontSize: '0.86rem', color: '#6C6C6C', lineHeight: 1.6 }}>
                Showcase your corporate culture, benefits, and active openings with branded profile pages that attract top-tier tech talent.
              </p>
            </div>
          </div>

          {/* Action Callout */}
          <div style={{ backgroundColor: '#031120', borderRadius: '16px', padding: '3rem 2rem', textAlign: 'center', color: '#FFFFFF' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Modernize Your Hiring Workflow Today
            </h2>
            <p style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.8)', maxWidth: '600px', margin: '0 auto 1.75rem', lineHeight: 1.6 }}>
              Set up your HR Manager workspace in under 60 seconds with our instant demo credentials or register a dedicated company account.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={() => onNavigateRegister('HR_MANAGER')} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
                Register HR Account
              </button>
              <button
                onClick={() => onQuickDemoLogin({
                  id: 2,
                  email: 'hr.priya@recruitment.com',
                  full_name: 'Priya Menon',
                  role: 'HR_MANAGER'
                })}
                className="btn btn-secondary"
                style={{ padding: '0.75rem 2rem' }}
              >
                Instant HR Demo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: EXPLORE JOBS (PUBLIC JOB BOARD) */}
      {publicView === 'jobs' && (
        <div style={{ padding: '5rem 2rem', maxWidth: '1240px', margin: '0 auto', flex: 1 }}>
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0060A8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Public Job Directory
            </span>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#031120', marginTop: '0.5rem', marginBottom: '1rem', letterSpacing: '-0.03em' }}>
              Explore Open Requisitions
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#6C6C6C', lineHeight: 1.6 }}>
              Discover active career opportunities across premier engineering teams. Filter by role, department, or metro location.
            </p>
          </div>

          {/* Search & Filters */}
          <div style={{
            backgroundColor: '#F1F5F8',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid #E5EAF0',
            marginBottom: '2.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{ position: 'relative', gridColumn: 'span 2' }}>
              <Search size={18} color="#6C6C6C" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search by job title, skill, or requisition code..."
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>

            <div>
              <select
                className="form-control"
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
              >
                <option value="ALL">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Data & AI">Data & AI</option>
                <option value="Banking Platform">Banking Platform</option>
                <option value="Analytics">Analytics</option>
                <option value="Product Experience">Product Experience</option>
                <option value="Infrastructure">Infrastructure</option>
              </select>
            </div>

            <div>
              <select
                className="form-control"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="ALL">All Locations</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Chennai">Chennai</option>
              </select>
            </div>
          </div>

          {/* Job Listings Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            {filteredJobs.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', backgroundColor: '#F1F5F8', borderRadius: '12px', color: '#6C6C6C' }}>
                No requisitions match your search criteria. Try resetting the filters.
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div key={job.id} className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                      <span className="badge badge-blue">{job.job_code || `JOB-${job.id}`}</span>
                      <span className="badge badge-emerald">{job.status || 'ACTIVE'}</span>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#031120', marginBottom: '0.35rem' }}>
                      {job.title}
                    </h3>
                    <div style={{ fontSize: '0.82rem', color: '#0060A8', fontWeight: 600, marginBottom: '0.75rem' }}>
                      {job.department} • {job.job_role}
                    </div>

                    <p style={{ fontSize: '0.85rem', color: '#6C6C6C', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                      {job.description || 'Join our high-impact engineering team to build scalable services and user experiences.'}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem', color: '#6C6C6C', marginBottom: '1.25rem' }}>
                      <div>Experience: <strong style={{ color: '#031120' }}>{job.min_experience} - {job.max_experience} Years</strong></div>
                      <div>Compensation: <strong style={{ color: '#16845B' }}>₹{(job.min_salary/100000).toFixed(1)}L - ₹{(job.max_salary/100000).toFixed(1)}L PA</strong></div>
                      <div>Location: <strong style={{ color: '#031120' }}>{job.location}</strong></div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E5EAF0', paddingTop: '1rem' }}>
                    <button
                      onClick={() => onNavigateRegister('CANDIDATE')}
                      className="link-institutional"
                      style={{ fontSize: '0.82rem', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      Check Match Fit
                    </button>
                    <button
                      onClick={() => onNavigateRegister('CANDIDATE')}
                      className="btn btn-primary btn-sm"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* VIEW: CONTACT */}
      {publicView === 'contact' && (
        <div style={{ padding: '5rem 2rem', maxWidth: '1100px', margin: '0 auto', flex: 1 }}>
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 4rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0060A8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Enterprise Inquiries
            </span>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#031120', marginTop: '0.5rem', marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
              Let's Discuss How TALENTIQ Can Elevate Your Hiring
            </h1>
            <p style={{ fontSize: '1.15rem', color: '#6C6C6C', lineHeight: 1.6 }}>
              Whether you are an enterprise talent leader or seeking technical integration details, our solution architects are ready to assist.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
            {/* Contact Form */}
            <div className="card" style={{ padding: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#031120', marginBottom: '1.5rem' }}>
                Request an Enterprise Consultation
              </h2>

              {contactSubmitted && (
                <div style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(22, 132, 91, 0.1)',
                  border: '1px solid #16845B',
                  color: '#16845B',
                  marginBottom: '1.5rem',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <CheckCircle2 size={18} />
                  Thank you! Your request has been received (Ref: #DEMO-2026). An enterprise specialist will reach out within 24 hours.
                </div>
              )}

              <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div>
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Vikram Malhotra"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Corporate Email</label>
                    <input
                      type="email"
                      required
                      className="form-control"
                      placeholder="vikram@company.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Company Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. CloudScale Tech"
                      value={contactForm.company}
                      onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Inquiry Nature</label>
                    <select
                      className="form-control"
                      value={contactForm.inquiryType}
                      onChange={(e) => setContactForm({ ...contactForm, inquiryType: e.target.value })}
                    >
                      <option value="Request Enterprise Demo">Request Enterprise Demo</option>
                      <option value="Architecture & Security Review">Architecture & Security Review</option>
                      <option value="Enterprise Licensing">Enterprise Licensing</option>
                      <option value="General Support">General Support</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Annual Hiring Volume</label>
                    <select
                      className="form-control"
                      value={contactForm.hiringVolume}
                      onChange={(e) => setContactForm({ ...contactForm, hiringVolume: e.target.value })}
                    >
                      <option value="< 50 hires/yr">&lt; 50 hires/yr</option>
                      <option value="50 - 250 hires/yr">50 - 250 hires/yr</option>
                      <option value="250+ hires/yr">250+ hires/yr</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label">Message / Specific Requirements</label>
                  <textarea
                    rows={4}
                    className="form-control"
                    placeholder="Tell us about your team size, recruitment challenges, or evaluation timelines..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem', marginTop: '0.5rem' }}>
                  Submit Inquiry
                </button>
              </form>
            </div>

            {/* Corporate Coordinates */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="card" style={{ padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#031120', marginBottom: '1rem' }}>
                  Global Headquarters
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem', color: '#6C6C6C' }}>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <MapPin size={20} color="#0060A8" style={{ flexShrink: 0 }} />
                    <div>
                      <strong style={{ color: '#031120' }}>Bengaluru Innovation Campus</strong><br />
                      Block B, Tech Park Central, Outer Ring Road, Bengaluru 560103, India
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <Mail size={18} color="#0060A8" style={{ flexShrink: 0 }} />
                    <span>sales@talentiq.io • support@talentiq.io</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <Phone size={18} color="#0060A8" style={{ flexShrink: 0 }} />
                    <span>+91 (80) 4920-8000</span>
                  </div>
                </div>
              </div>

              <div className="card" style={{ padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#031120', marginBottom: '0.75rem' }}>
                  Compliance & Security Inquiries
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#6C6C6C', lineHeight: 1.6 }}>
                  For data residency queries, DPDP compliance documentation, or SOC-2 Type II audit report requests, contact our security governance office at:
                </p>
                <div style={{ marginTop: '0.75rem', fontWeight: 700, color: '#0060A8', fontSize: '0.88rem' }}>
                  security-compliance@talentiq.io
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. PROFESSIONAL INSTITUTIONAL FOOTER                                */}
      {/* ==================================================================== */}
      <footer style={{
        backgroundColor: '#031120',
        color: '#FFFFFF',
        padding: '4.5rem 2rem 2rem',
        borderTop: '1px solid #142234',
        marginTop: 'auto'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '3rem',
            marginBottom: '3.5rem'
          }}>
            {/* Col 1: Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: '#0060A8',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  TQ
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.025em' }}>
                  TALENT<span style={{ color: '#1473E6' }}>IQ</span>
                </div>
              </div>
              <p style={{ fontSize: '0.86rem', lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.7)', maxWidth: '320px' }}>
                The corporate intelligence platform for intelligent candidate matching, predictive salary benchmarking, and recruitment analytics.
              </p>
              <div style={{
                marginTop: '1.5rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 0.85rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(22, 132, 91, 0.15)',
                border: '1px solid rgba(22, 132, 91, 0.3)',
                fontSize: '0.75rem',
                color: '#4ADE80',
                fontWeight: 600
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ADE80' }} />
                All Systems Operational • Enterprise Cloud Active
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem', color: '#FFFFFF' }}>
                Navigation
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                <li><span style={{ cursor: 'pointer' }} onClick={() => navigateTo('home')}>Home</span></li>
                <li><span style={{ cursor: 'pointer' }} onClick={() => navigateTo('about')}>About Platform</span></li>
                <li><span style={{ cursor: 'pointer' }} onClick={() => navigateTo('features')}>Our Technology</span></li>
                <li><span style={{ cursor: 'pointer' }} onClick={() => navigateTo('how-it-works')}>How It Works</span></li>
                <li><span style={{ cursor: 'pointer' }} onClick={() => navigateTo('jobs')}>Explore Open Jobs</span></li>
              </ul>
            </div>

            {/* Col 3: Dedicated Portals */}
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem', color: '#FFFFFF' }}>
                Dedicated Portals
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                <li><span style={{ cursor: 'pointer' }} onClick={() => onNavigateRegister('CANDIDATE')}>Candidate Portal</span></li>
                <li><span style={{ cursor: 'pointer' }} onClick={() => onNavigateRegister('HR_MANAGER')}>HR Manager Portal</span></li>
                <li><span style={{ cursor: 'pointer' }} onClick={onNavigateLogin}>Existing User Sign In</span></li>
                <li><span style={{ cursor: 'pointer' }} onClick={() => navigateTo('contact')}>Contact Enterprise Team</span></li>
              </ul>
            </div>

            {/* Col 4: Trust & Compliance */}
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem', color: '#FFFFFF' }}>
                Trust & Security
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                <li><span style={{ cursor: 'pointer' }} onClick={() => setShowPrivacyModal(true)}>Privacy Policy</span></li>
                <li><span style={{ cursor: 'pointer' }} onClick={() => setShowTermsModal(true)}>Terms of Service</span></li>
                <li>Bank-Grade Encryption Standards</li>
                <li>Secure Transactional Data Engine</li>
                <li>India DPDP Act & GDPR Data Protection</li>
              </ul>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            fontSize: '0.78rem',
            color: 'rgba(255, 255, 255, 0.5)',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              © 2026 TALENTIQ Technologies Inc. All rights reserved. Enterprise Recruitment Intelligence Platform.
            </div>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <span style={{ cursor: 'pointer' }} onClick={() => setShowPrivacyModal(true)}>Privacy Policy</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setShowTermsModal(true)}>Terms of Service</span>
              <span style={{ cursor: 'pointer' }} onClick={() => navigateTo('contact')}>Security Contact</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Compliance Modals */}
      <PrivacyPolicyModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />

      {/* Mobile nav CSS injected inline for reliability */}
      <style>{`
        @media (max-width: 960px) {
          .desktop-nav { display: none !important; }
          .desktop-ctas { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </div>
  );
}
