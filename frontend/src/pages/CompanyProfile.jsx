import React, { useState, useEffect } from 'react';
import {
  Building,
  Globe,
  MapPin,
  Users,
  Briefcase,
  CheckCircle2,
  Calendar,
  Sparkles,
  Edit3,
  Save,
  ArrowRight,
  ExternalLink,
  Plus,
  Trash2,
  ShieldCheck,
  Heart,
  Award,
  DollarSign,
  Laptop,
  Check,
  Share2,
  Search,
  X,
  Filter,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { companyService, jobService } from '../services/api';

export default function CompanyProfile({ user }) {
  const isCandidate = user?.role === 'CANDIDATE';
  const isAdminOrHR = user?.role === 'ADMIN' || user?.role === 'HR_MANAGER' || user?.role === 'RECRUITER';

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState('');
  const [activeProfileTab, setActiveProfileTab] = useState('overview'); // 'overview' | 'jobs' | 'perks'
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState(1);
  const [companyList, setCompanyList] = useState([]);
  const [jobSearch, setJobSearch] = useState('');
  const [jobDeptFilter, setJobDeptFilter] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Standard Company Profile State
  const [company, setCompany] = useState({
    id: 1,
    name: 'CloudScale Technologies Pvt Ltd',
    tagline: 'Next-Generation Cloud, Microservices & AI Engineering Platforms',
    logo_initials: 'CS',
    logo_color: '#0060A8',
    industry: 'Enterprise Software & Cloud Platforms',
    website: 'https://cloudscale.tech',
    location: 'Bengaluru, Karnataka (Whitefield Hub)',
    company_size: 'ENTERPRISE',
    employee_count: '500-1,000 Employees',
    founded_year: 2018,
    work_policy: 'Flexible Hybrid & Remote',
    description: 'CloudScale Technologies is an institutional cloud engineering and enterprise AI platform provider. We engineer high-throughput microservices, distributed data platforms, and predictive intelligence systems for Fortune 500 enterprises and hyper-growth scale-ups across North America, Europe, and Asia-Pacific.',
    culture: 'We value deep engineering rigor, inclusive problem-solving, transparent communication, and continuous technical mastery. Every engineer has the autonomy to contribute to architectural roadmaps.',
    benefits: [
      'Comprehensive Medical & Family Health Insurance',
      'Flexible Hybrid & Remote Work Policy',
      'Annual Learning Stipend & Technical Certification Grants',
      'Performance Incentive Bonus & Equity Sharing',
      'Ergonomic Home Office Setup Allowance',
      'Mental Health Support & Wellness Days',
      'Generous Paid Parental & Family Leave'
    ],
    active_jobs: [
      { id: 1, job_code: 'JOB-201', title: 'Senior Full-Stack Developer', department: 'Engineering', job_role: 'Full Stack Developer', min_experience: 3.0, max_experience: 6.0, min_salary: 900000, max_salary: 1600000, location: 'Bengaluru', status: 'OPEN', applicants_count: 5 },
      { id: 2, job_code: 'JOB-202', title: 'AI & Data Platform Engineer', department: 'Data & AI', job_role: 'ML Engineer', min_experience: 2.0, max_experience: 5.0, min_salary: 1000000, max_salary: 1800000, location: 'Bengaluru', status: 'OPEN', applicants_count: 4 },
      { id: 3, job_code: 'JOB-203', title: 'Senior Java Backend Specialist', department: 'Banking Platform', job_role: 'Java Developer', min_experience: 4.0, max_experience: 8.0, min_salary: 1200000, max_salary: 2200000, location: 'Pune', status: 'OPEN', applicants_count: 3 },
      { id: 4, job_code: 'JOB-204', title: 'Data Analytics & BI Specialist', department: 'Analytics', job_role: 'Data Analyst', min_experience: 2.0, max_experience: 4.5, min_salary: 750000, max_salary: 1300000, location: 'Bengaluru', status: 'OPEN', applicants_count: 2 }
    ]
  });

  const [newBenefit, setNewBenefit] = useState('');

  // Form state for creating a new partner company
  const [newCompanyForm, setNewCompanyForm] = useState({
    name: '',
    tagline: '',
    industry: 'Enterprise Software',
    website: 'https://',
    location: 'Bengaluru, Karnataka',
    company_size: 'MID_SIZE',
    employee_count: '100-500 Employees',
    founded_year: 2021,
    work_policy: 'Flexible Hybrid & Remote',
    logo_color: '#0060A8',
    description: '',
    culture: ''
  });

  // Load companies on mount
  useEffect(() => {
    async function fetchCompanies() {
      try {
        const [allRes, myRes] = await Promise.all([
          companyService.getAll().catch(() => null),
          companyService.getMyCompany().catch(() => null)
        ]);

        if (allRes?.data?.data && allRes.data.data.length > 0) {
          setCompanyList(allRes.data.data);
        }

        if (myRes?.data?.data) {
          const myData = myRes.data.data;
          setCompany(prev => ({
            ...prev,
            ...myData,
            benefits: myData.benefits || prev.benefits,
            active_jobs: myData.active_jobs || prev.active_jobs
          }));
          setSelectedCompanyId(myData.id || 1);
        }
      } catch (err) {
        console.warn('Company profile load notice:', err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCompanies();
  }, []);

  // Handle Switching Company in Directory
  const handleSelectCompany = async (comp) => {
    setSelectedCompanyId(comp.id);
    setIsEditing(false);
    try {
      const res = await companyService.getById(comp.id);
      if (res?.data?.data) {
        const fullData = res.data.data;
        setCompany(prev => ({
          ...prev,
          ...fullData,
          benefits: fullData.benefits || comp.benefits || prev.benefits,
          active_jobs: fullData.active_jobs || comp.active_jobs || prev.active_jobs
        }));
        return;
      }
    } catch (e) {
      console.warn('Load company detail notice:', e.message);
    }
    setCompany(prev => ({
      ...prev,
      ...comp,
      benefits: comp.benefits || prev.benefits,
      active_jobs: comp.active_jobs || prev.active_jobs
    }));
  };

  // Save changes to backend API
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let updatedCompany;
      if (company.id) {
        const res = await companyService.update(company.id, company);
        updatedCompany = res?.data?.data || company;
      } else {
        const res = await companyService.updateMyCompany(company);
        updatedCompany = res?.data?.data || company;
      }

      setCompany(prev => ({ ...prev, ...updatedCompany }));
      setCompanyList(prev => prev.map(c => c.id === updatedCompany.id ? { ...c, ...updatedCompany } : c));
      setSavedNotice('Company profile successfully updated and saved.');
      setIsEditing(false);
      setTimeout(() => setSavedNotice(''), 4000);
    } catch (err) {
      alert('Error updating company profile: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  // Add a benefit tag
  const handleAddBenefit = (benefitText) => {
    const textToAdd = (benefitText || newBenefit).trim();
    if (!textToAdd) return;
    if (company.benefits?.includes(textToAdd)) return;

    setCompany(prev => ({
      ...prev,
      benefits: [...(prev.benefits || []), textToAdd]
    }));
    setNewBenefit('');
  };

  // Remove a benefit tag
  const handleRemoveBenefit = (index) => {
    setCompany(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, idx) => idx !== index)
    }));
  };

  // Create a new partner company
  const handleCreateCompany = async (e) => {
    e.preventDefault();
    if (!newCompanyForm.name.trim()) return;

    try {
      const res = await companyService.create({
        ...newCompanyForm,
        benefits: [
          'Comprehensive Medical & Family Health Insurance',
          'Flexible Hybrid & Remote Work Policy',
          'Annual Learning & Professional Upskilling Grants',
          'Performance Incentive Bonus'
        ]
      });

      if (res?.data?.data) {
        const created = res.data.data;
        setCompanyList(prev => [...prev, created]);
        setCompany(created);
        setSelectedCompanyId(created.id);
        setShowAddCompanyModal(false);
        setSavedNotice(`New employer organization '${created.name}' registered successfully!`);
        setNewCompanyForm({
          name: '',
          tagline: '',
          industry: 'Enterprise Software',
          website: 'https://',
          location: 'Bengaluru, Karnataka',
          company_size: 'MID_SIZE',
          employee_count: '100-500 Employees',
          founded_year: 2021,
          work_policy: 'Flexible Hybrid & Remote',
          logo_color: '#0060A8',
          description: '',
          culture: ''
        });
        setTimeout(() => setSavedNotice(''), 4000);
      }
    } catch (err) {
      alert('Failed to register employer: ' + (err.response?.data?.message || err.message));
    }
  };

  // Share profile
  const handleShareLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  // Filtered jobs
  const filteredJobs = (company.active_jobs || []).filter(j => {
    const matchesSearch = !jobSearch || (j.title || '').toLowerCase().includes(jobSearch.toLowerCase()) ||
                          (j.job_role || '').toLowerCase().includes(jobSearch.toLowerCase());
    const matchesDept = !jobDeptFilter || j.department === jobDeptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Toast Notice */}
      {savedNotice && (
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
          <span>{savedNotice}</span>
        </div>
      )}

      {/* Page Title & Section Heading */}
      <SectionHeading
        title="COMPANY PROFILE & EMPLOYER BRANDING"
        subtitle="Manage verified enterprise employer profiles, publish workplace culture, highlight benefits, and showcase career requisitions."
        action={
          isAdminOrHR && (
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setShowAddCompanyModal(true)}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Plus size={15} /> Add Employer
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className={`btn btn-sm ${isEditing ? 'btn-secondary' : 'btn-primary'}`}
                style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
              >
                {isEditing ? <CheckCircle2 size={15} /> : <Edit3 size={15} />}
                {isEditing ? 'Exit Edit Mode' : 'Edit Company Profile'}
              </button>
            </div>
          )
        }
      />

      {/* ==================================================================== */}
      {/* SECTION 1: VERIFIED EMPLOYER DIRECTORY (Tabs / Selectable Cards)     */}
      {/* ==================================================================== */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#031120', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Verified Employer Directory ({companyList.length})
          </span>
          <span style={{ fontSize: '0.74rem', color: '#6C6C6C' }}>
            Select an enterprise to view their public profile and active job openings
          </span>
        </div>

        {companyList.length === 0 ? (
          <div style={{
            padding: '2rem',
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E5EAF0',
            textAlign: 'center',
            color: '#6C6C6C',
            fontSize: '0.86rem'
          }}>
            <Building size={28} color="#9CA3AF" style={{ margin: '0 auto 0.5rem' }} />
            <div>No enterprise employers registered yet.</div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '0.85rem'
          }}>
            {companyList.map((c) => {
              const isSelected = selectedCompanyId === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSelectCompany(c)}
                  style={{
                    textAlign: 'left',
                    padding: '0.85rem 1rem',
                    borderRadius: '10px',
                    border: isSelected ? '2px solid #0060A8' : '1px solid #E5EAF0',
                    backgroundColor: isSelected ? '#F1F5F8' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 140ms ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    boxShadow: isSelected ? '0 2px 8px rgba(0, 96, 168, 0.08)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      minWidth: '38px',
                      borderRadius: '8px',
                      backgroundColor: c.logo_color || '#0060A8',
                      color: '#FFFFFF',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {c.logo_initials || 'CO'}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{
                        fontWeight: 800,
                        fontSize: '0.88rem',
                        color: isSelected ? '#0060A8' : '#031120',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {c.name}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#6C6C6C', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {c.industry || 'Technology'}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <span style={{ color: '#0060A8', flexShrink: 0 }}>
                      <CheckCircle2 size={16} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* SECTION 2: COMPANY IDENTITY CARD (NO OVERLAPPING BANNER!)            */}
      {/* ==================================================================== */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '14px',
        border: '1px solid #E5EAF0',
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)'
      }}>
        {/* Brand Banner Strip (Dedicated container, zero spill-over) */}
        <div style={{
          height: '100px',
          background: 'linear-gradient(135deg, #004d87 0%, #0060A8 60%, #1473E6 100%)',
          padding: '1rem 1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.18)',
            color: '#FFFFFF',
            fontSize: '0.75rem',
            fontWeight: 700
          }}>
            <Building size={14} /> {company.company_size || 'ENTERPRISE'} ORG
          </div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 14px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.22)',
            color: '#FFFFFF',
            fontSize: '0.75rem',
            fontWeight: 700
          }}>
            <ShieldCheck size={14} /> Verified Employer Account
          </div>
        </div>

        {/* Identity Block - Clean Flexbox in Natural Document Flow (NO NEGATIVE MARGIN!) */}
        <div style={{ padding: '1.5rem 1.75rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
            marginBottom: '1.25rem'
          }}>
            {/* Logo + Identity Information */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1, minWidth: '280px', flexWrap: 'wrap' }}>
              {/* Company Logo Box */}
              <div style={{
                width: '76px',
                height: '76px',
                minWidth: '76px',
                borderRadius: '12px',
                backgroundColor: company.logo_color || '#0060A8',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '1.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                border: '1px solid #E5EAF0'
              }}>
                {company.logo_initials || 'CS'}
              </div>

              {/* Company Name, Badges & Tagline */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: '1.55rem', fontWeight: 800, color: '#031120', margin: 0, letterSpacing: '-0.02em' }}>
                    {company.name}
                  </h1>
                  <span className="badge badge-blue">{company.industry}</span>
                  <span className="badge badge-emerald">Verified</span>
                </div>

                <div style={{ fontSize: '0.9rem', color: '#0060A8', fontWeight: 600 }}>
                  {company.tagline}
                </div>

                {/* Quick Meta Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.8rem', color: '#6C6C6C', marginTop: '2px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} color="#0060A8" /> {company.location}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={13} color="#0060A8" /> {company.employee_count}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} color="#0060A8" /> Est. {company.founded_year}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Briefcase size={13} color="#16845B" /> {company.work_policy || 'Hybrid Work Policy'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleShareLink}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                {copiedLink ? <Check size={14} color="#16845B" /> : <Share2 size={14} />}
                {copiedLink ? 'Link Copied' : 'Share Profile'}
              </button>

              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
                >
                  <Globe size={14} /> Website <ExternalLink size={12} />
                </a>
              )}

              {isAdminOrHR && (
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className={`btn btn-sm ${isEditing ? 'btn-secondary' : 'btn-primary'}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
                >
                  {isEditing ? <CheckCircle2 size={15} /> : <Edit3 size={15} />}
                  {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </button>
              )}
            </div>
          </div>

          {/* Institutional Navigation Sub-Tabs */}
          {!isEditing && (
            <div style={{
              display: 'flex',
              borderBottom: '1px solid #E5EAF0',
              marginTop: '1.25rem',
              gap: '1.5rem',
              overflowX: 'auto'
            }}>
              {[
                { id: 'overview', label: 'Company Overview & Culture' },
                { id: 'jobs', label: `Open Positions (${company.active_jobs?.length || 4})` },
                { id: 'perks', label: `Benefits & Perks (${company.benefits?.length || 7})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveProfileTab(tab.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '0.65rem 0',
                    borderBottom: activeProfileTab === tab.id ? '3px solid #0060A8' : '3px solid transparent',
                    color: activeProfileTab === tab.id ? '#0060A8' : '#6C6C6C',
                    fontWeight: activeProfileTab === tab.id ? 800 : 600,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 140ms ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SECTION 3: EDIT MODE FORM (ADMIN & HR ONLY)                          */}
      {/* ==================================================================== */}
      {isEditing && isAdminOrHR ? (
        <form onSubmit={handleSave} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5EAF0', paddingBottom: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0060A8', textTransform: 'uppercase', margin: 0 }}>
                Edit Enterprise Profile Information
              </h3>
              <div style={{ fontSize: '0.75rem', color: '#6C6C6C' }}>All updates persist directly to the system backend database</div>
            </div>
            <span className="badge badge-blue">Profile Editor</span>
          </div>

          {/* Logo Color Accent Selector */}
          <div>
            <label className="form-label">Brand Color Accent</label>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              {[
                { label: 'Institutional Blue', color: '#0060A8' },
                { label: 'Cobalt', color: '#1473E6' },
                { label: 'Emerald Green', color: '#16845B' },
                { label: 'Deep Purple', color: '#7C3AED' },
                { label: 'Amber Gold', color: '#D99524' }
              ].map(c => (
                <button
                  key={c.color}
                  type="button"
                  onClick={() => setCompany({ ...company, logo_color: c.color })}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: c.color,
                    border: company.logo_color === c.color ? '3px solid #031120' : '2px solid #FFFFFF',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    cursor: 'pointer'
                  }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Company Name *</label>
              <input
                type="text"
                required
                className="form-control"
                value={company.name}
                onChange={e => setCompany({ ...company, name: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Corporate Tagline</label>
              <input
                type="text"
                className="form-control"
                value={company.tagline}
                onChange={e => setCompany({ ...company, tagline: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Industry Sector</label>
              <input
                type="text"
                className="form-control"
                value={company.industry}
                onChange={e => setCompany({ ...company, industry: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Official Website URL</label>
              <input
                type="url"
                className="form-control"
                value={company.website}
                onChange={e => setCompany({ ...company, website: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Headquarters Location</label>
              <input
                type="text"
                className="form-control"
                value={company.location}
                onChange={e => setCompany({ ...company, location: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Company Size Band</label>
              <select
                className="form-control"
                value={company.company_size}
                onChange={e => setCompany({ ...company, company_size: e.target.value })}
              >
                <option value="STARTUP">Startup (1-50)</option>
                <option value="MID_SIZE">Mid-Size (50-500)</option>
                <option value="ENTERPRISE">Enterprise (500+)</option>
              </select>
            </div>
            <div>
              <label className="form-label">Employee Count</label>
              <input
                type="text"
                className="form-control"
                value={company.employee_count}
                onChange={e => setCompany({ ...company, employee_count: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Founded Year</label>
              <input
                type="number"
                className="form-control"
                value={company.founded_year}
                onChange={e => setCompany({ ...company, founded_year: parseInt(e.target.value, 10) })}
              />
            </div>
            <div>
              <label className="form-label">Workplace Policy</label>
              <select
                className="form-control"
                value={company.work_policy || 'Flexible Hybrid & Remote'}
                onChange={e => setCompany({ ...company, work_policy: e.target.value })}
              >
                <option value="Flexible Hybrid & Remote">Flexible Hybrid & Remote</option>
                <option value="Remote-First">Remote-First</option>
                <option value="Office-Centric">Office-Centric / On-Site</option>
                <option value="Flexible Schedule">Flexible Schedule</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">About the Company / Employer Narrative</label>
            <textarea
              rows={4}
              className="form-control"
              value={company.description}
              onChange={e => setCompany({ ...company, description: e.target.value })}
            />
          </div>

          <div>
            <label className="form-label">Company Culture & Values</label>
            <textarea
              rows={2}
              className="form-control"
              value={company.culture || ''}
              onChange={e => setCompany({ ...company, culture: e.target.value })}
            />
          </div>

          {/* Benefits Editor */}
          <div>
            <label className="form-label">Workplace Culture & Benefits</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <input
                type="text"
                placeholder="e.g. Parental Leave, Education Reimbursement"
                className="form-control"
                value={newBenefit}
                onChange={e => setNewBenefit(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddBenefit(); } }}
              />
              <button
                type="button"
                onClick={() => handleAddBenefit()}
                className="btn btn-secondary btn-sm"
                style={{ flexShrink: 0 }}
              >
                <Plus size={16} /> Add Benefit
              </button>
            </div>

            {/* Quick Preset Pills */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
              <span style={{ fontSize: '0.72rem', color: '#6C6C6C', marginRight: '4px', alignSelf: 'center' }}>Popular suggestions:</span>
              {[
                'Comprehensive Health Insurance',
                'Hybrid & Remote Flexibility',
                'Annual Learning Grant',
                'Performance Incentive Bonus',
                'Paid Parental Leave',
                'Home Office Setup Stipend'
              ].map(sug => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => handleAddBenefit(sug)}
                  style={{
                    fontSize: '0.74rem',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    backgroundColor: '#F1F5F8',
                    border: '1px solid #E5EAF0',
                    color: '#0060A8',
                    cursor: 'pointer'
                  }}
                >
                  + {sug}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {company.benefits?.map((ben, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    backgroundColor: '#F1F5F8',
                    border: '1px solid #E5EAF0',
                    fontSize: '0.82rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#031120'
                  }}
                >
                  {ben}
                  <button
                    type="button"
                    onClick={() => handleRemoveBenefit(idx)}
                    style={{ background: 'none', border: 'none', color: '#D94C4C', cursor: 'pointer', padding: 0 }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid #E5EAF0', paddingTop: '1rem' }}>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
            >
              <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        /* ==================================================================== */
        /* SECTION 4: DISPLAY VIEW (OVERVIEW / OPEN POSITIONS / PERKS)          */
        /* ==================================================================== */
        <div>
          {/* TAB 1: OVERVIEW */}
          {activeProfileTab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.75rem', alignItems: 'start' }}>
              {/* Left Column: About & Culture */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="card">
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0060A8', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                    About {company.name}
                  </h3>
                  <p style={{ fontSize: '0.92rem', color: '#031120', lineHeight: 1.7, margin: 0 }}>
                    {company.description}
                  </p>
                </div>

                {/* Company Culture & Workplace Values */}
                <div className="card">
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0060A8', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                    Workplace Culture & Philosophy
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#031120', lineHeight: 1.65, margin: 0 }}>
                    {company.culture || 'Our workplace is founded on architectural rigor, ownership, collaborative engineering, and continuous learning. We empower cross-functional teams to build high-scale systems with modern cloud standards.'}
                  </p>
                </div>
              </div>

              {/* Right Column: Key Company Information & Quick Facts */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="card">
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0060A8', textTransform: 'uppercase', marginBottom: '1rem' }}>
                    Corporate Information
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.86rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.6rem', borderBottom: '1px solid #E5EAF0' }}>
                      <span style={{ color: '#6C6C6C' }}>Industry:</span>
                      <strong style={{ color: '#031120' }}>{company.industry}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.6rem', borderBottom: '1px solid #E5EAF0' }}>
                      <span style={{ color: '#6C6C6C' }}>Headquarters:</span>
                      <strong style={{ color: '#031120' }}>{company.location}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.6rem', borderBottom: '1px solid #E5EAF0' }}>
                      <span style={{ color: '#6C6C6C' }}>Company Size:</span>
                      <strong style={{ color: '#0060A8' }}>{company.company_size || 'ENTERPRISE'}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.6rem', borderBottom: '1px solid #E5EAF0' }}>
                      <span style={{ color: '#6C6C6C' }}>Total Headcount:</span>
                      <strong style={{ color: '#031120' }}>{company.employee_count}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.6rem', borderBottom: '1px solid #E5EAF0' }}>
                      <span style={{ color: '#6C6C6C' }}>Founded:</span>
                      <strong style={{ color: '#031120' }}>{company.founded_year}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.6rem', borderBottom: '1px solid #E5EAF0' }}>
                      <span style={{ color: '#6C6C6C' }}>Work Policy:</span>
                      <strong style={{ color: '#16845B' }}>{company.work_policy || 'Flexible Hybrid & Remote'}</strong>
                    </div>

                    {company.website && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#6C6C6C' }}>Official Website:</span>
                        <a href={company.website} target="_blank" rel="noreferrer" style={{ color: '#0060A8', fontWeight: 700, textDecoration: 'none' }}>
                          {company.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Open Positions Snapshot */}
                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0060A8', textTransform: 'uppercase', margin: 0 }}>
                      Open Positions
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveProfileTab('jobs')}
                      className="link-institutional"
                      style={{ fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      View All ({company.active_jobs?.length || 4}) →
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {(company.active_jobs || []).slice(0, 3).map(j => (
                      <div
                        key={j.id}
                        style={{
                          padding: '0.75rem 0.9rem',
                          backgroundColor: '#F1F5F8',
                          borderRadius: '8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <strong style={{ fontSize: '0.86rem', color: '#031120', display: 'block' }}>{j.title}</strong>
                          <span style={{ fontSize: '0.74rem', color: '#6C6C6C' }}>{j.department} • {j.location}</span>
                        </div>
                        <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>
                          ₹{(j.min_salary / 100000).toFixed(1)}L - ₹{(j.max_salary / 100000).toFixed(1)}L
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CAREER REQUISITIONS (OPEN POSITIONS) */}
          {activeProfileTab === 'jobs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Search Toolbar */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                padding: '1rem 1.25rem',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E5EAF0'
              }}>
                <div style={{ display: 'flex', gap: '0.75rem', flex: 1, minWidth: '280px', flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                    <Search size={16} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="Search roles by title or keyword..."
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
                  Showing <strong>{filteredJobs.length}</strong> Open Requisitions
                </div>
              </div>

              {/* Requisitions Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
                {filteredJobs.length === 0 ? (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5EAF0', color: '#9CA3AF' }}>
                    No job openings match the selected filters.
                  </div>
                ) : (
                  filteredJobs.map(job => (
                    <div
                      key={job.id}
                      className="card"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        borderLeft: '4px solid #0060A8'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                          <span className="badge badge-blue">{job.job_code}</span>
                          <span className="badge badge-emerald">{job.status}</span>
                        </div>

                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#031120', marginBottom: '0.35rem' }}>
                          {job.title}
                        </h3>

                        <div style={{ fontSize: '0.8rem', color: '#6C6C6C', marginBottom: '1rem' }}>
                          {job.department} • <strong style={{ color: '#0060A8' }}>{job.job_role}</strong>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.82rem', color: '#6C6C6C', marginBottom: '1.25rem' }}>
                          <div>Experience: <strong style={{ color: '#031120' }}>{job.min_experience} - {job.max_experience} Years</strong></div>
                          <div>Compensation: <strong style={{ color: '#16845B' }}>₹{(job.min_salary / 100000).toFixed(1)}L - ₹{(job.max_salary / 100000).toFixed(1)}L PA</strong></div>
                          <div>Location: <strong style={{ color: '#031120' }}>{job.location}</strong></div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E5EAF0', paddingTop: '0.85rem' }}>
                        <span style={{ fontSize: '0.78rem', color: '#6C6C6C' }}>
                          <strong>{job.applicants_count || 4}</strong> candidates applied
                        </span>
                        {company.website && (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-primary btn-sm"
                            style={{ textDecoration: 'none' }}
                          >
                            Apply via Careers →
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: WORKPLACE PERKS & BENEFITS */}
          {activeProfileTab === 'perks' && (
            <div className="card">
              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0060A8', textTransform: 'uppercase', margin: 0 }}>
                  Workplace Benefits, Total Rewards & Wellness
                </h3>
                <div style={{ fontSize: '0.82rem', color: '#6C6C6C', marginTop: '2px' }}>
                  Competitive compensation packages, medical coverage, learning allowances, and career development support.
                </div>
              </div>

              {/* Categorized Benefit Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '1.25rem', backgroundColor: '#F1F5F8', borderRadius: '10px', border: '1px solid #E5EAF0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                    <Heart size={20} color="#D94C4C" />
                    <strong style={{ fontSize: '0.95rem', color: '#031120' }}>Health & Medical Security</strong>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.84rem', color: '#031120', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    <li>Comprehensive Family Health Insurance</li>
                    <li>Annual Health Checkups & Dental Care</li>
                    <li>Mental Health & Wellness Subscriptions</li>
                  </ul>
                </div>

                <div style={{ padding: '1.25rem', backgroundColor: '#F1F5F8', borderRadius: '10px', border: '1px solid #E5EAF0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                    <Laptop size={20} color="#0060A8" />
                    <strong style={{ fontSize: '0.95rem', color: '#031120' }}>Remote & Hybrid Flexibility</strong>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.84rem', color: '#031120', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    <li>Hybrid & Remote-First Work Policy</li>
                    <li>Ergonomic Home Office Setup Grant</li>
                    <li>High-Speed Broadband Reimbursements</li>
                  </ul>
                </div>

                <div style={{ padding: '1.25rem', backgroundColor: '#F1F5F8', borderRadius: '10px', border: '1px solid #E5EAF0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                    <Award size={20} color="#16845B" />
                    <strong style={{ fontSize: '0.95rem', color: '#031120' }}>Continuous Learning</strong>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.84rem', color: '#031120', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    <li>Annual Professional Learning Stipend</li>
                    <li>Full Cloud & Architecture Certification Funding</li>
                    <li>Internal Architecture Summits & Mentorship</li>
                  </ul>
                </div>

                <div style={{ padding: '1.25rem', backgroundColor: '#F1F5F8', borderRadius: '10px', border: '1px solid #E5EAF0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                    <DollarSign size={20} color="#D99524" />
                    <strong style={{ fontSize: '0.95rem', color: '#031120' }}>Financial & Wealth Creation</strong>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.84rem', color: '#031120', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    <li>Performance Incentive Bonuses</li>
                    <li>Corporate Equity & ESOP Participation</li>
                    <li>Retirement Gratuity & PF Contribution</li>
                  </ul>
                </div>
              </div>

              {/* Complete Listed Benefits */}
              <div style={{ borderTop: '1px solid #E5EAF0', paddingTop: '1.25rem' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#031120', marginBottom: '0.75rem' }}>
                  Complete Company Benefits Roster:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
                  {(company.benefits || []).map((ben, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.84rem', color: '#031120' }}>
                      <CheckCircle2 size={16} color="#16845B" style={{ flexShrink: 0 }} />
                      <span>{ben}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* SECTION 5: MODAL TO ADD NEW EMPLOYER (ADMIN & HR ONLY)               */}
      {/* ==================================================================== */}
      {showAddCompanyModal && isAdminOrHR && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(3, 17, 32, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #E5EAF0', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#0060A8', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#031120', margin: 0 }}>
                    Register Enterprise Employer
                  </h3>
                  <div style={{ fontSize: '0.74rem', color: '#6C6C6C' }}>Add partner employer organization to TalentIQ directory</div>
                </div>
              </div>
              <button onClick={() => setShowAddCompanyModal(false)} style={{ background: 'none', border: 'none', color: '#6C6C6C', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCompany} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Company Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NextWave Systems Technologies"
                  className="form-control"
                  value={newCompanyForm.name}
                  onChange={e => setNewCompanyForm({ ...newCompanyForm, name: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Corporate Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Accelerating Autonomous Cloud Infrastructure"
                  className="form-control"
                  value={newCompanyForm.tagline}
                  onChange={e => setNewCompanyForm({ ...newCompanyForm, tagline: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Industry Sector</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newCompanyForm.industry}
                    onChange={e => setNewCompanyForm({ ...newCompanyForm, industry: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Website URL</label>
                  <input
                    type="url"
                    placeholder="https://company.com"
                    className="form-control"
                    value={newCompanyForm.website}
                    onChange={e => setNewCompanyForm({ ...newCompanyForm, website: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Headquarters Location</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newCompanyForm.location}
                    onChange={e => setNewCompanyForm({ ...newCompanyForm, location: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Employee Count</label>
                  <input
                    type="text"
                    placeholder="e.g. 250-500 Employees"
                    className="form-control"
                    value={newCompanyForm.employee_count}
                    onChange={e => setNewCompanyForm({ ...newCompanyForm, employee_count: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Employer Story / About</label>
                <textarea
                  rows={3}
                  placeholder="Summary of company mission, domain, and scale..."
                  className="form-control"
                  value={newCompanyForm.description}
                  onChange={e => setNewCompanyForm({ ...newCompanyForm, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', borderTop: '1px solid #E5EAF0', paddingTop: '0.85rem' }}>
                <button type="button" onClick={() => setShowAddCompanyModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Register Employer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
