import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  MapPin,
  IndianRupee,
  Building,
  Trash2,
  X,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Users,
  Award,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  SlidersHorizontal,
  FileCheck
} from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { jobService, candidateService, mlService } from '../services/api';

export default function Jobs({ setActiveTab, user }) {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [notification, setNotification] = useState(null);

  // AI Resume Ranking State
  const [rankingJob, setRankingJob] = useState(null);
  const [rankingResults, setRankingResults] = useState([]);
  const [rankingLoading, setRankingLoading] = useState(false);
  const [selectedGapAnalysis, setSelectedGapAnalysis] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    company: 'TalentIQ Enterprise Solutions',
    department: 'Engineering',
    job_role: 'Full Stack Developer',
    min_experience: '2.0',
    max_experience: '5.0',
    min_salary: '800000',
    max_salary: '1500000',
    location: 'Bengaluru',
    company_size: 'MID_SIZE',
    required_skills: 'React.js, Node.js, MySQL, REST APIs, Git',
    description: ''
  });

  const loadJobs = async () => {
    setLoading(true);
    try {
      const res = await jobService.getAll({
        search: search || undefined,
        department: departmentFilter || undefined
      });
      if (res.data && res.data.data) {
        setJobs(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
    setCurrentPage(1);
  }, [search, departmentFilter, locationFilter, sortBy]);

  const filteredJobs = jobs.filter(j => {
    const locMatch = !locationFilter || (j.location || '').toLowerCase().includes(locationFilter.toLowerCase());
    return locMatch;
  }).sort((a, b) => {
    if (sortBy === 'salary') return (b.max_salary || 0) - (a.max_salary || 0);
    if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
    if (sortBy === 'experience') return (a.min_experience || 0) - (b.min_experience || 0);
    return (b.id || 0) - (a.id || 0);
  });

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / pageSize));
  const paginatedJobs = filteredJobs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        min_experience: parseFloat(formData.min_experience),
        max_experience: parseFloat(formData.max_experience),
        min_salary: parseFloat(formData.min_salary),
        max_salary: parseFloat(formData.max_salary),
      };
      await jobService.create(payload);
      setShowAddModal(false);
      setNotification({ type: 'success', text: 'Job requisition successfully published!' });
      loadJobs();
    } catch (err) {
      setNotification({ type: 'error', text: err.response?.data?.message || 'Error creating job requisition' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job requisition?')) return;
    try {
      await jobService.delete(id);
      setNotification({ type: 'success', text: 'Job requisition deleted successfully.' });
      loadJobs();
    } catch (err) {
      setNotification({ type: 'error', text: 'Delete operation failed.' });
    }
  };

  const handleOpenRanking = async (job) => {
    setRankingJob(job);
    setRankingLoading(true);
    setSelectedGapAnalysis(null);

    const roleSkillsMap = {
      'Full Stack Developer': ['React.js', 'Node.js', 'MySQL', 'JavaScript', 'REST APIs', 'Git'],
      'ML Engineer': ['Python', 'Scikit-learn', 'TensorFlow', 'NLP', 'Pandas', 'Flask'],
      'Java Developer': ['Java', 'Spring Boot', 'MySQL', 'JDBC', 'Microservices', 'REST APIs'],
      'Data Analyst': ['SQL', 'Python', 'Pandas', 'PowerBI', 'Tableau', 'Statistics'],
      'Frontend Developer': ['React.js', 'HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'Tailwind'],
      'DevOps Engineer': ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'Terraform']
    };
    const targetSkills = roleSkillsMap[job.job_role] || ['Python', 'SQL', 'Git'];

    try {
      const candRes = await candidateService.getAll();
      const candidateList = candRes.data?.data || [];

      const rankRes = await mlService.rankCandidates({
        job: {
          job_role: job.job_role,
          min_experience: job.min_experience,
          max_experience: job.max_experience,
          skills: targetSkills
        },
        job_required_skills: targetSkills,
        candidates: candidateList
      });

      if (rankRes.data && rankRes.data.data) {
        setRankingResults(rankRes.data.data);
      } else {
        setRankingResults([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRankingLoading(false);
    }
  };

  const handleAnalyzeSkillGap = async (candidate) => {
    if (!rankingJob) return;
    try {
      const roleSkillsMap = {
        'Full Stack Developer': ['React.js', 'Node.js', 'MySQL', 'JavaScript', 'REST APIs', 'Git'],
        'ML Engineer': ['Python', 'Scikit-learn', 'TensorFlow', 'NLP', 'Pandas', 'Flask'],
        'Java Developer': ['Java', 'Spring Boot', 'MySQL', 'JDBC', 'Microservices', 'REST APIs'],
        'Data Analyst': ['SQL', 'Python', 'Pandas', 'PowerBI', 'Tableau', 'Statistics'],
      };
      const targetSkills = roleSkillsMap[rankingJob.job_role] || ['Python', 'SQL', 'Git'];
      const candSkills = candidate.matched_skills || ['Python'];

      const res = await mlService.analyzeSkillGaps({
        candidate_skills: candSkills,
        job_required_skills: targetSkills
      });

      if (res.data && res.data.data) {
        setSelectedGapAnalysis({
          candidateName: candidate.candidate_name,
          ...res.data.data
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Toast Alert */}
      {notification && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: '10px',
          backgroundColor: notification.type === 'success' ? 'rgba(22, 132, 91, 0.1)' : 'rgba(217, 76, 76, 0.1)',
          border: notification.type === 'success' ? '1px solid #16845B' : '1px solid #D94C4C',
          color: notification.type === 'success' ? '#16845B' : '#D94C4C',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontWeight: 600,
          fontSize: '0.86rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span>{notification.text}</span>
          </div>
          <button onClick={() => setNotification(null)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Section Header */}
      <SectionHeading
        title="CORPORATE JOB REQUISITIONS"
        subtitle="Manage open employment positions, configure salary bands, and execute AI resume ranking algorithms."
        action={
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
            <Plus size={16} /> Post Job Opening
          </button>
        }
      />

      {/* Search & Filter Toolbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '1.25rem',
        backgroundColor: '#FFFFFF',
        borderRadius: '10px',
        border: '1px solid #E5EAF0'
      }}>
        <div style={{ display: 'flex', gap: '0.75rem', flex: 1, minWidth: '320px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search size={16} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by title, role, or skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="form-control"
            style={{ width: '170px' }}
          >
            <option value="">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Data & AI">Data & AI</option>
            <option value="Banking Platform">Banking Platform</option>
            <option value="Analytics">Analytics</option>
            <option value="Infrastructure">Infrastructure</option>
          </select>

          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="form-control"
            style={{ width: '160px' }}
          >
            <option value="">All Locations</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Pune">Pune</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Chennai">Chennai</option>
            <option value="Delhi NCR">Delhi NCR</option>
            <option value="Remote">Remote</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-control"
            style={{ width: '170px' }}
          >
            <option value="newest">Newest First</option>
            <option value="salary">Highest Budget</option>
            <option value="title">Title (A-Z)</option>
            <option value="experience">Min Experience</option>
          </select>

          {(search || departmentFilter || locationFilter || sortBy !== 'newest') && (
            <button
              onClick={() => {
                setSearch('');
                setDepartmentFilter('');
                setLocationFilter('');
                setSortBy('newest');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                border: '1px solid #E5EAF0',
                backgroundColor: '#F8FAFC',
                color: '#6C6C6C',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={13} /> Reset
            </button>
          )}
        </div>

        <div style={{ fontSize: '0.82rem', color: '#6C6C6C', fontWeight: 600 }}>
          Showing <strong>{filteredJobs.length === 0 ? 0 : `${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, filteredJobs.length)}`}</strong> of <strong>{filteredJobs.length}</strong> Requisitions
        </div>
      </div>

      {/* Jobs Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '1.5rem'
      }}>
        {loading ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3.5rem 1rem', color: '#6C6C6C' }}>
            <div style={{ width: '36px', height: '36px', border: '3px solid #E5EAF0', borderTopColor: '#0060A8', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
            <p style={{ margin: 0, fontWeight: 600 }}>Loading job vacancies from database...</p>
          </div>
        ) : paginatedJobs.length === 0 ? (
          <div style={{
            gridColumn: '1/-1',
            textAlign: 'center',
            padding: '3.5rem 2rem',
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            border: '1px dashed #CBD5E1'
          }}>
            <Briefcase size={40} color="#94A3B8" style={{ marginBottom: '1rem' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#031120', marginBottom: '0.4rem' }}>
              No Job Openings Found
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#64748B', maxWidth: '400px', margin: '0 auto 1.25rem' }}>
              No active job requisitions matched your current search filters. Try adjusting your query or resetting all filters.
            </p>
            {(search || departmentFilter || locationFilter || sortBy !== 'newest') && (
              <button
                onClick={() => {
                  setSearch('');
                  setDepartmentFilter('');
                  setLocationFilter('');
                  setSortBy('newest');
                }}
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <RotateCcw size={14} /> Clear All Filters
              </button>
            )}
          </div>
        ) : (
          paginatedJobs.map((job) => (
            <div
              key={job.id}
              className="card"
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                {/* Header Badge Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="badge badge-blue">{job.job_code}</span>
                    <span style={{ fontSize: '0.75rem', color: '#6C6C6C', fontWeight: 600 }}>
                      {job.company || 'TalentIQ Enterprise'}
                    </span>
                  </div>
                  <span className="badge badge-emerald">{job.status}</span>
                </div>

                {/* Job Title */}
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#031120', marginBottom: '0.35rem' }}>
                  {job.title}
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#6C6C6C', marginBottom: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Building size={13} color="#9CA3AF" />
                  <span>{job.department}</span>
                  <span>•</span>
                  <span style={{ color: '#0060A8', fontWeight: 600 }}>{job.job_role}</span>
                </div>

                {/* Details List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6C6C6C' }}>
                    <Briefcase size={14} color="#0060A8" />
                    <span>Experience: <strong style={{ color: '#031120' }}>{job.min_experience} - {job.max_experience} Years</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6C6C6C' }}>
                    <IndianRupee size={14} color="#16845B" />
                    <span>Salary Band: <strong style={{ color: '#16845B' }}>₹{(job.min_salary / 100000).toFixed(1)}L - ₹{(job.max_salary / 100000).toFixed(1)}L PA</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6C6C6C' }}>
                    <MapPin size={14} color="#D99524" />
                    <span>Location: <strong style={{ color: '#031120' }}>{job.location} ({job.company_size || 'MID_SIZE'})</strong></span>
                  </div>
                </div>

                {/* Description */}
                {job.description && (
                  <p style={{
                    fontSize: '0.8rem',
                    color: '#6C6C6C',
                    borderTop: '1px solid #E5EAF0',
                    paddingTop: '0.75rem',
                    lineHeight: 1.45,
                    marginBottom: 0
                  }}>
                    {job.description}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '1.25rem',
                paddingTop: '0.85rem',
                borderTop: '1px solid #E5EAF0'
              }}>
                <button
                  onClick={() => handleOpenRanking(job)}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Sparkles size={14} color="#0060A8" /> AI Candidate Ranking
                </button>

                <button
                  onClick={() => handleDelete(job.id)}
                  className="btn btn-secondary btn-sm"
                  style={{ color: '#D94C4C' }}
                  title="Remove Requisition"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 1.25rem',
          backgroundColor: '#FFFFFF',
          borderRadius: '10px',
          border: '1px solid #E5EAF0',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ fontSize: '0.82rem', color: '#6C6C6C' }}>
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              <ChevronLeft size={14} /> Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setCurrentPage(pg)}
                style={{
                  minWidth: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: currentPage === pg ? '#0060A8' : '#E5EAF0',
                  backgroundColor: currentPage === pg ? '#0060A8' : '#FFFFFF',
                  color: currentPage === pg ? '#FFFFFF' : '#031120',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {pg}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Modal: AI Candidate Ranking Leaderboard */}
      {rankingJob && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '820px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E5EAF0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#0060A8', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#031120', margin: 0 }}>
                    AI Candidate Ranking & Screening
                  </h3>
                  <div style={{ fontSize: '0.74rem', color: '#6C6C6C' }}>
                    Candidate matches for <strong>{rankingJob.title}</strong> ({rankingJob.job_code})
                  </div>
                </div>
              </div>
              <button onClick={() => setRankingJob(null)} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{
                padding: '0.85rem 1rem',
                backgroundColor: 'rgba(0, 96, 168, 0.05)',
                border: '1px solid rgba(0, 96, 168, 0.15)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                fontSize: '0.82rem',
                color: '#031120',
                lineHeight: 1.45
              }}>
                <ShieldCheck size={18} color="#0060A8" style={{ flexShrink: 0 }} />
                <div>
                  <strong>Human-in-the-Loop Governance:</strong> Hybrid scoring algorithm combines 70% technical competency match with 30% experience calibration. Automatic rejection is prohibited; HR professionals retain full selection authority.
                </div>
              </div>

              {rankingLoading ? (
                <div style={{ padding: '2.5rem', textAlign: 'center', color: '#9CA3AF' }}>
                  Ranking candidate compatibility across verified competencies...
                </div>
              ) : rankingResults.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#9CA3AF' }}>
                  No candidate records available for ranking.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {rankingResults.map((cand, idx) => (
                    <div
                      key={cand.candidate_id || idx}
                      style={{
                        padding: '1rem',
                        backgroundColor: '#F1F5F8',
                        borderRadius: '8px',
                        borderLeft: idx === 0 ? '4px solid #16845B' : '4px solid #0060A8',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.6rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            backgroundColor: idx === 0 ? '#16845B' : '#0060A8',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '0.75rem'
                          }}>
                            #{cand.rank || idx + 1}
                          </span>
                          <div>
                            <span style={{ fontWeight: 800, color: '#031120', fontSize: '0.95rem' }}>
                              {cand.candidate_name}
                            </span>
                            <span style={{ marginLeft: '0.4rem', fontSize: '0.75rem', color: '#6C6C6C' }}>
                              ({cand.candidate_code}) • {cand.experience_years} yrs • {cand.education_level}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className={`badge ${cand.match_score >= 80 ? 'badge-emerald' : 'badge-blue'}`} style={{ fontWeight: 800 }}>
                            {cand.match_score}% Match
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#6C6C6C' }}>
                            Top {cand.percentile}%
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', alignItems: 'center', fontSize: '0.75rem' }}>
                        <span style={{ color: '#6C6C6C' }}>Matched:</span>
                        {(cand.matched_skills || []).map((sk, sIdx) => (
                          <span key={sIdx} className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>✓ {sk}</span>
                        ))}
                        {(cand.missing_skills || []).slice(0, 3).map((sk, sIdx) => (
                          <span key={sIdx} className="badge badge-warning" style={{ fontSize: '0.7rem' }}>Missing: {sk}</span>
                        ))}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E5EAF0', paddingTop: '0.5rem', marginTop: '0.2rem' }}>
                        <div style={{ fontSize: '0.75rem', color: '#6C6C6C' }}>
                          HR Recommendation: <strong style={{ color: '#031120' }}>{cand.hr_recommendation || 'Proceed to Interview'}</strong>
                        </div>
                        <button
                          onClick={() => handleAnalyzeSkillGap(cand)}
                          className="link-institutional"
                          style={{ fontSize: '0.75rem', fontWeight: 700, background: 'none', border: 'none' }}
                        >
                          Skill Gap Analysis
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Skill Gap Breakdown Card */}
              {selectedGapAnalysis && (
                <div style={{
                  padding: '1.25rem',
                  backgroundColor: 'rgba(217, 149, 36, 0.08)',
                  border: '1px solid rgba(217, 149, 36, 0.3)',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#D99524', margin: 0 }}>
                      Skill Gap Analysis: {selectedGapAnalysis.candidateName}
                    </h4>
                    <button onClick={() => setSelectedGapAnalysis(null)} style={{ background: 'none', border: 'none', color: '#D99524', cursor: 'pointer' }}>
                      <X size={15} />
                    </button>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6C6C6C' }}>
                    Skill Fit Percentage: <strong>{selectedGapAnalysis.skill_fit_percentage}%</strong> (Missing {selectedGapAnalysis.missing_skills_count} required competencies).
                  </div>
                  {selectedGapAnalysis.missing_competencies?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {selectedGapAnalysis.missing_competencies.map((m, i) => (
                        <span key={i} className="badge badge-warning">{m}</span>
                      ))}
                    </div>
                  )}
                  {selectedGapAnalysis.upskilling_roadmap?.length > 0 && (
                    <div style={{ fontSize: '0.78rem', color: '#6C6C6C', marginTop: '0.2rem' }}>
                      <strong>Suggested 30-Day Training Curriculum:</strong>
                      <ul style={{ margin: '0.25rem 0 0 1rem', padding: 0 }}>
                        {selectedGapAnalysis.upskilling_roadmap.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button onClick={() => setRankingJob(null)} className="btn btn-secondary btn-sm">
                  Close Ranking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Publish Job Opening */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E5EAF0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0060A8', textTransform: 'uppercase', margin: 0 }}>
                  Publish Corporate Job Requisition
                </h3>
                <div style={{ fontSize: '0.75rem', color: '#6C6C6C' }}>Registered in MySQL 8.4 database</div>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead Machine Learning Engineer"
                  className="form-control"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Department *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Standard Role *</label>
                  <select
                    className="form-control"
                    value={formData.job_role}
                    onChange={(e) => setFormData({ ...formData, job_role: e.target.value })}
                  >
                    <option value="Full Stack Developer">Full Stack Developer</option>
                    <option value="ML Engineer">ML Engineer</option>
                    <option value="Java Developer">Java Developer</option>
                    <option value="Data Analyst">Data Analyst</option>
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="DevOps Engineer">DevOps Engineer</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Min Experience (Yrs)</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-control"
                    value={formData.min_experience}
                    onChange={(e) => setFormData({ ...formData, min_experience: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Max Experience (Yrs)</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-control"
                    value={formData.max_experience}
                    onChange={(e) => setFormData({ ...formData, max_experience: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Min Salary (INR)</label>
                  <input
                    type="number"
                    step="50000"
                    className="form-control"
                    value={formData.min_salary}
                    onChange={(e) => setFormData({ ...formData, min_salary: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Max Salary (INR)</label>
                  <input
                    type="number"
                    step="50000"
                    className="form-control"
                    value={formData.max_salary}
                    onChange={(e) => setFormData({ ...formData, max_salary: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Company Tier</label>
                  <select
                    className="form-control"
                    value={formData.company_size}
                    onChange={(e) => setFormData({ ...formData, company_size: e.target.value })}
                  >
                    <option value="STARTUP">Startup (1-50)</option>
                    <option value="MID_SIZE">Mid-Size (50-500)</option>
                    <option value="ENTERPRISE">Enterprise (500+)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Role Description & Responsibilities</label>
                <textarea
                  rows="3"
                  className="form-control"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
