import React, { useState, useEffect } from 'react';
import {
  FileCheck,
  CheckCircle2,
  Clock,
  Calendar,
  Sparkles,
  ArrowRight,
  Filter,
  X,
  ShieldCheck,
  User,
  Briefcase,
  Search,
  RotateCcw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { applicationService } from '../services/api';

export default function Applications({ user }) {
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('match_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const [loading, setLoading] = useState(true);

  // Interview Modal State
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [activeAppForInterview, setActiveAppForInterview] = useState(null);
  const [interviewForm, setInterviewForm] = useState({
    round_number: 1,
    round_type: 'TECHNICAL_1',
    scheduled_at: '',
    interviewer_name: user?.full_name || 'Priya Menon (Senior HR)',
    feedback: 'Evaluating data structures, algorithms, and microservice system design.',
  });
  const [interviewSaving, setInterviewSaving] = useState(false);
  const [actionNotice, setActionNotice] = useState('');

  const loadApplications = async () => {
    setLoading(true);
    try {
      const res = await applicationService.getAll({
        status: statusFilter || undefined,
      });
      if (res.data && res.data.data) {
        setApplications(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, sortBy]);

  const filteredApplications = applications
    .filter((app) => {
      if (!search) return true;
      const q = search.toLowerCase();
      const candMatch = (app.candidate_name || '').toLowerCase().includes(q);
      const codeMatch = (app.candidate_code || '').toLowerCase().includes(q) || (app.application_code || '').toLowerCase().includes(q);
      const jobMatch = (app.job_title || '').toLowerCase().includes(q);
      const deptMatch = (app.department || '').toLowerCase().includes(q);
      return candMatch || codeMatch || jobMatch || deptMatch;
    })
    .sort((a, b) => {
      if (sortBy === 'match_desc') return (b.match_score || 0) - (a.match_score || 0);
      if (sortBy === 'match_asc') return (a.match_score || 0) - (b.match_score || 0);
      if (sortBy === 'name') return (a.candidate_name || '').localeCompare(b.candidate_name || '');
      if (sortBy === 'newest') return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      return (b.id || 0) - (a.id || 0);
    });

  const totalPages = Math.max(1, Math.ceil(filteredApplications.length / pageSize));
  const paginatedApplications = filteredApplications.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleStatusChange = async (id, newStatus) => {
    if (newStatus === 'INTERVIEW_SCHEDULED') {
      const app = applications.find((a) => a.id === id);
      if (app) {
        openInterviewScheduler(app);
        return;
      }
    }

    try {
      await applicationService.updateStatus(id, newStatus);
      setActionNotice(`Application status transitioned to ${newStatus}`);
      setTimeout(() => setActionNotice(''), 4000);
      loadApplications();
    } catch (err) {
      alert('Failed to update application status: ' + err.message);
    }
  };

  const openInterviewScheduler = (app) => {
    setActiveAppForInterview(app);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    const dateString = tomorrow.toISOString().slice(0, 16);

    setInterviewForm({
      round_number: 1,
      round_type: 'TECHNICAL_1',
      scheduled_at: dateString,
      interviewer_name: user?.full_name || 'Vikram Malhotra (Lead Architect)',
      feedback: 'Technical interview round scheduled via recruitment pipeline.',
    });
    setShowInterviewModal(true);
  };

  const handleScheduleInterviewSubmit = async (e) => {
    e.preventDefault();
    if (!activeAppForInterview) return;
    setInterviewSaving(true);

    try {
      await applicationService.scheduleInterview(activeAppForInterview.id, interviewForm);
      setShowInterviewModal(false);
      setActionNotice(`Interview scheduled for ${activeAppForInterview.candidate_name}!`);
      setTimeout(() => setActionNotice(''), 4000);
      loadApplications();
    } catch (err) {
      alert('Failed to schedule interview: ' + (err.response?.data?.message || err.message));
    } finally {
      setInterviewSaving(false);
    }
  };

  // Funnel Counts
  const countByStatus = (st) => applications.filter(a => a.status === st).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Toast Notice */}
      {actionNotice && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: '10px',
          backgroundColor: 'rgba(22, 132, 91, 0.1)',
          border: '1px solid #16845B',
          color: '#16845B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontWeight: 600,
          fontSize: '0.86rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Section Heading */}
      <SectionHeading
        title="RECRUITMENT PIPELINE & APPLICATIONS"
        subtitle="Track candidate progression across 5 recruitment lifecycle stages from screening to final hire."
      />

      {/* Pipeline Funnel Status Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem'
      }}>
        {[
          { label: 'Applied', status: 'APPLIED', count: countByStatus('APPLIED'), color: '#031120' },
          { label: 'Shortlisted', status: 'SHORTLISTED', count: countByStatus('SHORTLISTED'), color: '#0060A8' },
          { label: 'Interview Scheduled', status: 'INTERVIEW_SCHEDULED', count: countByStatus('INTERVIEW_SCHEDULED'), color: '#D99524' },
          { label: 'Selected / Hired', status: 'SELECTED', count: countByStatus('SELECTED'), color: '#16845B' },
          { label: 'Rejected', status: 'REJECTED', count: countByStatus('REJECTED'), color: '#D94C4C' },
        ].map((stage, idx) => (
          <div
            key={idx}
            onClick={() => setStatusFilter(statusFilter === stage.status ? '' : stage.status)}
            style={{
              padding: '1.25rem',
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              border: statusFilter === stage.status ? `2px solid ${stage.color}` : '1px solid #E5EAF0',
              borderLeft: `4px solid ${stage.color}`,
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              transition: 'transform 200ms ease'
            }}
          >
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6C6C6C', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {stage.label}
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: stage.color, margin: '0.2rem 0' }}>
              {stage.count}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>
              {statusFilter === stage.status ? 'Filtered' : 'Click to filter'}
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter Toolbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.25rem',
        backgroundColor: '#FFFFFF',
        borderRadius: '10px',
        border: '1px solid #E5EAF0',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '320px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search size={16} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search candidate name, ID, or job role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color="#0060A8" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-control"
              style={{ width: '190px' }}
            >
              <option value="">All Stages</option>
              <option value="APPLIED">Applied</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
              <option value="SELECTED">Selected / Hired</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-control"
            style={{ width: '180px' }}
          >
            <option value="match_desc">Match Score (High-to-Low)</option>
            <option value="match_asc">Match Score (Low-to-High)</option>
            <option value="newest">Newest First</option>
            <option value="name">Candidate Name (A-Z)</option>
          </select>

          {(search || statusFilter || sortBy !== 'match_desc') && (
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('');
                setSortBy('match_desc');
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
          Showing <strong>{filteredApplications.length === 0 ? 0 : `${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, filteredApplications.length)}`}</strong> of <strong>{filteredApplications.length}</strong> Applications
        </div>
      </div>

      {/* Applications Data Table */}
      <div className="table-responsive">
        <table className="table-custom">
          <thead>
            <tr>
              <th>Application ID</th>
              <th>Candidate Name</th>
              <th>Requisition Position</th>
              <th>Match Score</th>
              <th>Experience Fit</th>
              <th>Current Status</th>
              <th>Applied Date</th>
              <th style={{ textAlign: 'right' }}>Update Progression</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '3.5rem', color: '#6C6C6C' }}>
                  <div style={{ width: '32px', height: '32px', border: '3px solid #E5EAF0', borderTopColor: '#0060A8', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 0.75rem' }} />
                  Loading pipeline applications from database...
                </td>
              </tr>
            ) : paginatedApplications.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
                  <FileCheck size={36} color="#94A3B8" style={{ marginBottom: '0.75rem' }} />
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#031120', marginBottom: '0.25rem' }}>
                    No Applications Found
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '1rem' }}>
                    No candidate applications match the selected criteria or search term.
                  </div>
                  {(search || statusFilter || sortBy !== 'match_desc') && (
                    <button
                      onClick={() => {
                        setSearch('');
                        setStatusFilter('');
                        setSortBy('match_desc');
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <RotateCcw size={13} /> Clear All Filters
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              paginatedApplications.map((app) => (
                <tr key={app.id}>
                  <td>
                    <span style={{ fontWeight: 700, color: '#0060A8', fontSize: '0.82rem' }}>
                      {app.application_code || `APP-${1000 + app.id}`}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#031120' }}>{app.candidate_name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#6C6C6C' }}>{app.candidate_code}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#031120' }}>{app.job_title}</div>
                    <div style={{ fontSize: '0.72rem', color: '#6C6C6C' }}>{app.department || 'Engineering'}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span className={`badge ${app.match_score >= 80 ? 'badge-emerald' : 'badge-blue'}`} style={{ fontWeight: 800 }}>
                        {app.match_score ? `${app.match_score}%` : '85%'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: '#6C6C6C' }}>
                      {app.experience_years ? `${app.experience_years} yrs` : 'Optimal'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${app.status === 'SELECTED' ? 'badge-emerald' : app.status === 'SHORTLISTED' ? 'badge-blue' : app.status === 'INTERVIEW_SCHEDULED' ? 'badge-warning' : app.status === 'REJECTED' ? 'badge-danger' : 'badge-applied'}`}>
                      {app.status}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.78rem', color: '#6C6C6C' }}>
                      {app.created_at ? new Date(app.created_at).toLocaleDateString() : 'Active'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      style={{
                        padding: '0.35rem 0.65rem',
                        borderRadius: '6px',
                        border: '1px solid #E5EAF0',
                        fontSize: '0.76rem',
                        fontWeight: 600,
                        backgroundColor: '#FFFFFF',
                        color: '#031120',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="APPLIED">Applied</option>
                      <option value="SHORTLISTED">Shortlist Candidate</option>
                      <option value="INTERVIEW_SCHEDULED">Schedule Interview...</option>
                      <option value="SELECTED">Mark as Selected (Hire)</option>
                      <option value="REJECTED">Reject Application</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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

      {/* Modal: Interview Scheduler */}
      {showInterviewModal && activeAppForInterview && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '560px' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E5EAF0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: '#0060A8', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#031120', margin: 0 }}>
                    Schedule Candidate Interview
                  </h3>
                  <div style={{ fontSize: '0.74rem', color: '#6C6C6C' }}>
                    {activeAppForInterview.candidate_name} • {activeAppForInterview.job_title}
                  </div>
                </div>
              </div>
              <button onClick={() => setShowInterviewModal(false)} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleScheduleInterviewSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.85rem' }}>
                <div>
                  <label className="form-label">Round Number</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    className="form-control"
                    value={interviewForm.round_number}
                    onChange={(e) => setInterviewForm({ ...interviewForm, round_number: parseInt(e.target.value, 10) })}
                  />
                </div>
                <div>
                  <label className="form-label">Round Category *</label>
                  <select
                    className="form-control"
                    value={interviewForm.round_type}
                    onChange={(e) => setInterviewForm({ ...interviewForm, round_type: e.target.value })}
                  >
                    <option value="TECHNICAL_1">Round 1: Core Technical & Coding</option>
                    <option value="TECHNICAL_2">Round 2: System Architecture & Data</option>
                    <option value="HR_ROUND">Round 3: HR & Behavioral Culture</option>
                    <option value="MANAGERIAL">Round 4: Leadership & Strategic Alignment</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Interview Date & Time *</label>
                <input
                  type="datetime-local"
                  required
                  className="form-control"
                  value={interviewForm.scheduled_at}
                  onChange={(e) => setInterviewForm({ ...interviewForm, scheduled_at: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Lead Interviewer</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={interviewForm.interviewer_name}
                  onChange={(e) => setInterviewForm({ ...interviewForm, interviewer_name: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Interview Preparation & Focus Notes</label>
                <textarea
                  rows="2"
                  className="form-control"
                  value={interviewForm.feedback}
                  onChange={(e) => setInterviewForm({ ...interviewForm, feedback: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowInterviewModal(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" disabled={interviewSaving} className="btn btn-primary btn-sm">
                  {interviewSaving ? 'Scheduling...' : 'Confirm Interview'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
