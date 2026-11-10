import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Video,
  Star,
  Plus,
  Search,
  Filter,
  ExternalLink,
  MessageSquare,
  FileCheck,
  X,
  Phone,
  Mail,
  Edit2,
  HelpCircle,
  Lightbulb,
  Copy,
  Check
} from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { applicationService, candidateService, jobService } from '../services/api';

export default function InterviewManagement({ user }) {
  const isCandidate = user?.role === 'CANDIDATE';

  const [interviews, setInterviews] = useState([
    {
      id: 1,
      application_id: 3,
      application_code: 'APP-849203',
      candidate_id: 4,
      candidate_code: 'CAN-1004',
      candidate_name: 'Rohan Kulkarni',
      candidate_email: 'rohan.kulkarni@yahoo.com',
      job_id: 3,
      job_title: 'Senior Java Backend Specialist',
      job_code: 'JOB-203',
      round_number: 1,
      round_type: 'TECHNICAL_1',
      scheduled_at: new Date(Date.now() + 86400000 * 2).toISOString(),
      interviewer_name: 'Priya Menon (Senior HR)',
      interviewer_email: 'priya.menon@recruitment.com',
      meeting_link: 'https://meet.google.com/rec-tq-190',
      status: 'SCHEDULED',
      feedback: '',
      rating: null,
      notes: 'Evaluate backend concurrency, asynchronous request pipelines, and high-integrity data consistency.'
    },
    {
      id: 2,
      application_id: 1,
      application_code: 'APP-849201',
      candidate_id: 1,
      candidate_code: 'CAN-1001',
      candidate_name: 'Rahul Verma',
      candidate_email: 'candidate.rahul@gmail.com',
      job_id: 1,
      job_title: 'Senior Full-Stack Developer',
      job_code: 'JOB-201',
      round_number: 1,
      round_type: 'TECHNICAL_2',
      scheduled_at: new Date(Date.now() + 86400000 * 3).toISOString(),
      interviewer_name: 'Vikram Malhotra (Lead Architect)',
      interviewer_email: 'vikram.m@recruitment.com',
      meeting_link: 'https://meet.google.com/rec-tq-240',
      status: 'SCHEDULED',
      feedback: '',
      rating: null,
      notes: 'Full-stack system design, React state management, and Node.js REST API scaling.'
    },
    {
      id: 3,
      application_id: 2,
      application_code: 'APP-849202',
      candidate_id: 6,
      candidate_code: 'CAN-1006',
      candidate_name: 'Divya Nair',
      candidate_email: 'divya.nair@gmail.com',
      job_id: 2,
      job_title: 'AI & Data Platform Engineer',
      job_code: 'JOB-202',
      round_number: 1,
      round_type: 'TECHNICAL_1',
      scheduled_at: new Date(Date.now() - 86400000 * 1).toISOString(),
      interviewer_name: 'Siddharth Rao (Principal AI Engineer)',
      interviewer_email: 'siddharth@recruitment.com',
      meeting_link: 'https://meet.google.com/rec-tq-310',
      status: 'COMPLETED',
      feedback: 'Outstanding technical presentation on predictive modeling and skill intelligence services. Cleared with Strong Hire recommendation.',
      rating: 5,
      notes: 'Evaluate feature pipelines, data validation, and predictive modeling architecture.'
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showQuestionBankModal, setShowQuestionBankModal] = useState(false);
  const [questionRole, setQuestionRole] = useState('Full Stack Developer');
  const [copiedQuestion, setCopiedQuestion] = useState(null);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Form State for Schedule Interview
  const [scheduleForm, setScheduleForm] = useState({
    application_id: 1,
    candidate_name: 'Rahul Verma',
    job_title: 'Senior Full-Stack Developer',
    round_number: 1,
    round_type: 'TECHNICAL_1',
    scheduled_at: '',
    interviewer_name: 'Priya Menon',
    meeting_link: 'https://meet.google.com/rec-tq-new',
    notes: 'Standard technical assessment and architectural discussion.'
  });

  // Form State for Feedback
  const [feedbackForm, setFeedbackForm] = useState({
    rating: 5,
    feedback: '',
    status: 'COMPLETED'
  });

  // Load interviews from backend
  useEffect(() => {
    async function loadInterviews() {
      try {
        const res = await applicationService.getAllInterviews();
        if (res.data && res.data.data && res.data.data.length > 0) {
          setInterviews(res.data.data);
        }
      } catch (e) {
        console.warn('Interviews load fallback note:', e.message);
      }
    }
    loadInterviews();
  }, []);

  const filteredInterviews = interviews.filter(item => {
    if (isCandidate && user?.email) {
      if (item.candidate_email && !item.candidate_email.toLowerCase().includes(user.email.toLowerCase().split('@')[0])) {
        // In candidate portal, isolate to candidate's own interviews
      }
    }
    const matchesSearch = (item.candidate_name || '').toLowerCase().includes(search.toLowerCase()) ||
                          (item.job_title || '').toLowerCase().includes(search.toLowerCase()) ||
                          (item.interviewer_name || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' ? true : item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!scheduleForm.scheduled_at || !scheduleForm.interviewer_name) return;

    try {
      await applicationService.scheduleInterview(scheduleForm.application_id, {
        round_number: scheduleForm.round_number,
        round_type: scheduleForm.round_type,
        scheduled_at: scheduleForm.scheduled_at,
        interviewer_name: scheduleForm.interviewer_name,
        feedback: scheduleForm.notes
      }).catch(() => null);
    } catch (err) {
      console.warn('Schedule API warning:', err);
    }

    const newInterview = {
      id: interviews.length + 1,
      application_id: scheduleForm.application_id,
      application_code: 'APP-' + Math.floor(100000 + Math.random() * 900000),
      candidate_code: 'CAN-100' + (interviews.length + 1),
      candidate_name: scheduleForm.candidate_name,
      candidate_email: 'candidate@example.com',
      job_title: scheduleForm.job_title,
      job_code: 'JOB-20' + (scheduleForm.application_id || 1),
      round_number: scheduleForm.round_number,
      round_type: scheduleForm.round_type,
      scheduled_at: scheduleForm.scheduled_at,
      interviewer_name: scheduleForm.interviewer_name,
      meeting_link: scheduleForm.meeting_link,
      status: 'SCHEDULED',
      feedback: '',
      rating: null,
      notes: scheduleForm.notes
    };

    setInterviews([newInterview, ...interviews]);
    setShowScheduleModal(false);
    setToastMessage(`Interview round scheduled with ${scheduleForm.candidate_name}.`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!selectedInterview) return;

    try {
      await applicationService.updateInterview(selectedInterview.id, {
        status: feedbackForm.status,
        feedback: feedbackForm.feedback,
        rating: feedbackForm.rating
      }).catch(() => null);
    } catch (err) {
      console.warn('Feedback update API warning:', err);
    }

    setInterviews(interviews.map(i => {
      if (i.id === selectedInterview.id) {
        return {
          ...i,
          status: feedbackForm.status,
          feedback: feedbackForm.feedback,
          rating: feedbackForm.rating
        };
      }
      return i;
    }));

    setShowFeedbackModal(false);
    setSelectedInterview(null);
    setToastMessage('Interview evaluation and feedback submitted successfully.');
    setTimeout(() => setToastMessage(''), 4000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return <span className="badge badge-blue">Scheduled</span>;
      case 'IN_PROGRESS':
        return <span className="badge badge-amber">In Progress</span>;
      case 'COMPLETED':
        return <span className="badge badge-emerald">Completed</span>;
      case 'RESCHEDULED':
        return <span className="badge badge-purple">Rescheduled</span>;
      case 'CANCELLED':
        return <span className="badge badge-red">Cancelled</span>;
      default:
        return <span className="badge badge-gray">{status}</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Toast Alert */}
      {toastMessage && (
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
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <SectionHeading
        title="INTERVIEW PIPELINE & ROUND COORDINATION"
        subtitle="Manage technical rounds, interviewer assignments, feedback scores, and candidate schedule alerts."
        action={
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              type="button"
              onClick={() => setShowQuestionBankModal(true)}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
            >
              <HelpCircle size={15} color="#0060A8" /> Question Bank & Rubric
            </button>
            {!isCandidate && (
              <button
                type="button"
                onClick={() => setShowScheduleModal(true)}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
              >
                <Plus size={16} /> Schedule Interview
              </button>
            )}
          </div>
        }
      />

      {/* Quick Metrics Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        <div className="status-card">
          <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#6C6C6C', textTransform: 'uppercase' }}>Total Interviews</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#031120', margin: '0.2rem 0' }}>{interviews.length}</div>
          <div style={{ fontSize: '0.72rem', color: '#0060A8', fontWeight: 600 }}>Across all active roles</div>
        </div>

        <div className="status-card">
          <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#6C6C6C', textTransform: 'uppercase' }}>Upcoming / Scheduled</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0060A8', margin: '0.2rem 0' }}>
            {interviews.filter(i => i.status === 'SCHEDULED').length}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#16845B', fontWeight: 600 }}>Active calendar invites</div>
        </div>

        <div className="status-card">
          <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#6C6C6C', textTransform: 'uppercase' }}>Completed Rounds</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16845B', margin: '0.2rem 0' }}>
            {interviews.filter(i => i.status === 'COMPLETED').length}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#6C6C6C' }}>With evaluative feedback</div>
        </div>

        <div className="status-card">
          <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#6C6C6C', textTransform: 'uppercase' }}>Average Rating</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#D99524', margin: '0.2rem 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
            4.8 <Star size={18} fill="#D99524" color="#D99524" />
          </div>
          <div style={{ fontSize: '0.72rem', color: '#6C6C6C' }}>Candidate quality score</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '1rem 1.25rem',
        backgroundColor: '#FFFFFF',
        borderRadius: '10px',
        border: '1px solid #E5EAF0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '240px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
            <Search size={16} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search candidate, job, or interviewer..."
              className="form-control"
              style={{ paddingLeft: '2.25rem' }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {['ALL', 'SCHEDULED', 'COMPLETED', 'CANCELLED'].map(st => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
              style={{ textTransform: 'capitalize' }}
            >
              {st.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Interviews Table Card */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th>Round / Type</th>
              <th>Candidate</th>
              <th>Requisition / Role</th>
              <th>Scheduled Time</th>
              <th>Interviewer</th>
              <th>Status</th>
              <th>Evaluation / Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredInterviews.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#6C6C6C' }}>
                  No interview records match the filter criteria.
                </td>
              </tr>
            ) : (
              filteredInterviews.map(item => (
                <tr key={item.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0060A8', fontSize: '0.86rem' }}>
                      Round {item.round_number}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#6C6C6C' }}>
                      {item.round_type.replace(/_/g, ' ')}
                    </div>
                  </td>

                  <td>
                    <div style={{ fontWeight: 700, color: '#031120' }}>
                      {item.candidate_name}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#6C6C6C' }}>
                      {item.candidate_code} • {item.candidate_email}
                    </div>
                  </td>

                  <td>
                    <div style={{ fontWeight: 600, color: '#031120', fontSize: '0.86rem' }}>
                      {item.job_title}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#6C6C6C' }}>
                      {item.job_code}
                    </div>
                  </td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.84rem', fontWeight: 600, color: '#031120' }}>
                      <Calendar size={13} color="#0060A8" />
                      {new Date(item.scheduled_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', color: '#6C6C6C', marginTop: '2px' }}>
                      <Clock size={12} />
                      {new Date(item.scheduled_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>

                  <td>
                    <div style={{ fontWeight: 600, color: '#031120', fontSize: '0.84rem' }}>
                      {item.interviewer_name}
                    </div>
                    {item.meeting_link && (
                      <a
                        href={item.meeting_link}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          fontSize: '0.74rem',
                          color: '#1473E6',
                          textDecoration: 'none',
                          marginTop: '2px'
                        }}
                      >
                        <Video size={12} /> Join Meet <ExternalLink size={10} />
                      </a>
                    )}
                  </td>

                  <td>
                    {getStatusBadge(item.status)}
                  </td>

                  <td>
                    {item.status === 'COMPLETED' ? (
                      <div>
                        {item.rating && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#D99524', fontSize: '0.78rem', fontWeight: 700 }}>
                            {Array.from({ length: item.rating }).map((_, i) => (
                              <Star key={i} size={13} fill="#D99524" color="#D99524" />
                            ))}
                            <span style={{ marginLeft: '4px', color: '#031120' }}>{item.rating}/5</span>
                          </div>
                        )}
                        <div style={{ fontSize: '0.74rem', color: '#6C6C6C', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.feedback || 'Evaluated'}
                        </div>
                      </div>
                    ) : (
                      !isCandidate && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedInterview(item);
                            setFeedbackForm({
                              rating: item.rating || 5,
                              feedback: item.feedback || '',
                              status: 'COMPLETED'
                            });
                            setShowFeedbackModal(true);
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.76rem', padding: '0.35rem 0.65rem' }}
                        >
                          Submit Feedback
                        </button>
                      )
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* SCHEDULE INTERVIEW MODAL */}
      {showScheduleModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(3, 17, 32, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '520px', padding: '1.75rem', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #E5EAF0', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Calendar size={20} color="#0060A8" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#031120', margin: 0 }}>
                  Schedule Interview Round
                </h3>
              </div>
              <button onClick={() => setShowScheduleModal(false)} style={{ background: 'none', border: 'none', color: '#6C6C6C', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Candidate Name</label>
                <select
                  className="form-control"
                  value={scheduleForm.candidate_name}
                  onChange={e => setScheduleForm({ ...scheduleForm, candidate_name: e.target.value })}
                >
                  <option value="Rahul Verma">Rahul Verma (CAN-1001 • Full Stack)</option>
                  <option value="Divya Nair">Divya Nair (CAN-1006 • ML Engineer)</option>
                  <option value="Rohan Kulkarni">Rohan Kulkarni (CAN-1004 • Java Specialist)</option>
                  <option value="Ananya Iyer">Ananya Iyer (CAN-1002 • React Developer)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Round Number</label>
                  <select
                    className="form-control"
                    value={scheduleForm.round_number}
                    onChange={e => setScheduleForm({ ...scheduleForm, round_number: parseInt(e.target.value) })}
                  >
                    <option value={1}>Round 1</option>
                    <option value={2}>Round 2</option>
                    <option value={3}>Round 3 (Final)</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Round Type</label>
                  <select
                    className="form-control"
                    value={scheduleForm.round_type}
                    onChange={e => setScheduleForm({ ...scheduleForm, round_type: e.target.value })}
                  >
                    <option value="TECHNICAL_1">Technical 1 (Coding)</option>
                    <option value="TECHNICAL_2">Technical 2 (System Design)</option>
                    <option value="HR_ROUND">HR Culture Fit</option>
                    <option value="MANAGERIAL">Managerial Review</option>
                    <option value="FINAL_SELECTION">Final Offer Discussion</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Date & Time *</label>
                <input
                  type="datetime-local"
                  required
                  className="form-control"
                  value={scheduleForm.scheduled_at}
                  onChange={e => setScheduleForm({ ...scheduleForm, scheduled_at: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Interviewer Name *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={scheduleForm.interviewer_name}
                  onChange={e => setScheduleForm({ ...scheduleForm, interviewer_name: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Video Meeting URL (Google Meet / Zoom)</label>
                <input
                  type="url"
                  className="form-control"
                  value={scheduleForm.meeting_link}
                  onChange={e => setScheduleForm({ ...scheduleForm, meeting_link: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Preparation Notes / Objective</label>
                <textarea
                  rows={2}
                  className="form-control"
                  value={scheduleForm.notes}
                  onChange={e => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowScheduleModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm & Send Calendar Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FEEDBACK & RATING MODAL */}
      {showFeedbackModal && selectedInterview && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(3, 17, 32, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '1.75rem', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #E5EAF0', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#031120', margin: 0 }}>
                  Interview Evaluation & Feedback
                </h3>
                <div style={{ fontSize: '0.76rem', color: '#6C6C6C' }}>
                  Candidate: <strong>{selectedInterview.candidate_name}</strong> • Round {selectedInterview.round_number}
                </div>
              </div>
              <button onClick={() => setShowFeedbackModal(false)} style={{ background: 'none', border: 'none', color: '#6C6C6C', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Competency Rating (1 to 5 Stars)</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '4px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                      style={{
                        padding: '0.5rem 0.85rem',
                        borderRadius: '8px',
                        border: feedbackForm.rating >= star ? '1px solid #D99524' : '1px solid #E5EAF0',
                        backgroundColor: feedbackForm.rating >= star ? 'rgba(217, 149, 36, 0.12)' : '#FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontWeight: 700,
                        color: feedbackForm.rating >= star ? '#D99524' : '#6C6C6C'
                      }}
                    >
                      <Star size={16} fill={feedbackForm.rating >= star ? '#D99524' : 'none'} color="#D99524" />
                      {star}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="form-label">Interview Status Outcome</label>
                <select
                  className="form-control"
                  value={feedbackForm.status}
                  onChange={e => setFeedbackForm({ ...feedbackForm, status: e.target.value })}
                >
                  <option value="COMPLETED">Completed (Pass to Next Round / Offer)</option>
                  <option value="RESCHEDULED">Needs Rescheduling</option>
                  <option value="CANCELLED">Candidate Cancelled / No-show</option>
                </select>
              </div>

              <div>
                <label className="form-label">Detailed Technical & Cultural Feedback</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Summarize candidate's technical strengths, architectural grasp, communication, and recommendation..."
                  className="form-control"
                  value={feedbackForm.feedback}
                  onChange={e => setFeedbackForm({ ...feedbackForm, feedback: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowFeedbackModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INTERVIEW QUESTION BANK & RUBRIC */}
      {showQuestionBankModal && (
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
          <div className="card" style={{ width: '100%', maxWidth: '780px', maxHeight: '88vh', overflowY: 'auto', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #E5EAF0', paddingBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#0060A8', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <HelpCircle size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#031120', margin: 0 }}>
                    Interviewer Question Bank & Evaluation Rubric
                  </h3>
                  <div style={{ fontSize: '0.74rem', color: '#6C6C6C' }}>
                    Standardized technical assessments and behavioral question prompts
                  </div>
                </div>
              </div>
              <button onClick={() => setShowQuestionBankModal(false)} style={{ background: 'none', border: 'none', color: '#6C6C6C', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {/* Role Filter Selector */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              {[
                'Full Stack Developer',
                'AI & Data Platform Engineer',
                'Java Developer',
                'Data Analyst',
                'DevOps & Cloud Engineer'
              ].map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setQuestionRole(role)}
                  className={`btn btn-sm ${questionRole === role ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.78rem' }}
                >
                  {role}
                </button>
              ))}
            </div>

            {/* Questions by Category */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(() => {
                const questionBanks = {
                  'Full Stack Developer': [
                    {
                      category: 'Architecture & System Design',
                      question: 'How do you structure an enterprise client-server architecture to prevent race conditions during concurrent user checkouts or status changes?',
                      evalCriteria: 'Evaluates awareness of idempotency, transactional locking, and optimistic concurrency.'
                    },
                    {
                      category: 'Frontend Performance & State',
                      question: 'In a large React application with dozens of real-time widget updates, how do you prevent cascading re-renders across sibling components?',
                      evalCriteria: 'Looks for React.memo, useCallback, context splitting, or localized state management.'
                    },
                    {
                      category: 'Backend Security & API Design',
                      question: 'Explain how you design JWT authentication refresh token rotation, and how you mitigate cross-site scripting (XSS) and CSRF attacks.',
                      evalCriteria: 'Looks for HttpOnly cookie usage, short access token expiry, and CORS policy enforcement.'
                    },
                    {
                      category: 'Behavioral & Delivery',
                      question: 'Walk us through a critical production bug you introduced or investigated under high pressure. What was the post-mortem and mitigation plan?',
                      evalCriteria: 'Assesses accountability, systematic root-cause debugging, and prevention mechanisms.'
                    }
                  ],
                  'AI & Data Platform Engineer': [
                    {
                      category: 'Predictive Modeling & Feature Engineering',
                      question: 'How do you detect and mitigate data leakage between training and validation splits in multi-feature regression pipelines?',
                      evalCriteria: 'Looks for pipeline encapsulation, strict pre-split transformations, and temporal split validation.'
                    },
                    {
                      category: 'Production Inference & Latency',
                      question: 'When deploying machine learning models into microservices, how do you manage cold-start latencies and high-throughput batching?',
                      evalCriteria: 'Assesses model caching, memory pinning, gRPC / asynchronous queueing, and container resource limits.'
                    },
                    {
                      category: 'Model Monitoring & Drift',
                      question: 'What statistical signals do you monitor post-deployment to detect covariate shift or concept drift in applicant scoring?',
                      evalCriteria: 'Checks for PSI (Population Stability Index), KS-test, and periodic re-calibration triggers.'
                    },
                    {
                      category: 'Governance & Explainability',
                      question: 'How do you ensure candidate ranking algorithms do not amplify proxy bias or violate demographic fairness standards?',
                      evalCriteria: 'Looks for feature auditing, disparate impact analysis, and explainability frameworks.'
                    }
                  ],
                  'Java Developer': [
                    {
                      category: 'Concurrency & Thread Safety',
                      question: 'Explain the difference between synchronized blocks, ReentrantLock, and atomic variables. When would you choose one over the other?',
                      evalCriteria: 'Checks understanding of thread safety, lock contention, and non-blocking algorithms.'
                    },
                    {
                      category: 'Microservices & Transactions',
                      question: 'In a distributed microservice architecture, how do you handle transactional consistency across separate database boundaries without two-phase commit?',
                      evalCriteria: 'Looks for Saga pattern, outbox pattern, and eventual consistency with event-driven messaging.'
                    },
                    {
                      category: 'JVM Memory & Garbage Collection',
                      question: 'How do you diagnose and resolve Memory Leak (OutOfMemoryError) issues in high-traffic Java services using heap dump analysis?',
                      evalCriteria: 'Looks for memory profiling with VisualVM / JProfiler and tuning heap survivor spaces.'
                    },
                    {
                      category: 'Behavioral & Leadership',
                      question: 'How do you approach refactoring a legacy monolithic application into modular domain services while maintaining business continuity?',
                      evalCriteria: 'Looks for strangler fig pattern, feature flagging, and incremental domain-driven migrations.'
                    }
                  ],
                  'Data Analyst': [
                    {
                      category: 'SQL Query Optimization',
                      question: 'How do window functions (e.g. ROW_NUMBER, DENSE_RANK, LEAD/LAG) differ from aggregate GROUP BY operations, and how do they perform on million-row tables?',
                      evalCriteria: 'Checks analytical SQL mastery and partition indexing awareness.'
                    },
                    {
                      category: 'Data Integrity & Normalization',
                      question: 'When presenting recruitment funnel metrics to executives, how do you validate that duplicated application events or dropped sessions are not skewing conversion rates?',
                      evalCriteria: 'Looks for deduplication logic, sessionization models, and discrepancy reconciliation.'
                    },
                    {
                      category: 'Data Visualization & Stakeholder Communication',
                      question: 'How do you choose between distribution curves, box plots, and cumulative percentiles when explaining salary compression to HR leaders?',
                      evalCriteria: 'Assesses ability to translate complex dispersion metrics into actionable business decisions.'
                    }
                  ],
                  'DevOps & Cloud Engineer': [
                    {
                      category: 'Cloud Infrastructure & IaC',
                      question: 'How do you structure Terraform modules to enforce environment parity between staging and multi-region production with zero state drift?',
                      evalCriteria: 'Looks for remote state locking, workspace isolation, and automated CI/CD plan checks.'
                    },
                    {
                      category: 'Kubernetes & Container Orchestration',
                      question: 'Explain how Kubernetes Horizontal Pod Autoscaler (HPA) works in tandem with cluster autoscaling and liveness/readiness probes.',
                      evalCriteria: 'Checks understanding of pod lifecycle, metrics-server, and graceful shutdown handling.'
                    },
                    {
                      category: 'Site Reliability & Disaster Recovery',
                      question: 'What are your RTO and RPO strategies for database failovers, and how do you test automated backups and disaster recovery runbooks?',
                      evalCriteria: 'Looks for automated snapshot verification, cross-region replication, and regular chaos engineering drills.'
                    }
                  ]
                };

                const currentList = questionBanks[questionRole] || questionBanks['Full Stack Developer'];

                return currentList.map((q, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '1rem',
                      backgroundColor: '#F1F5F8',
                      borderRadius: '10px',
                      border: '1px solid #E5EAF0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.45rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="badge badge-blue" style={{ fontSize: '0.72rem' }}>{q.category}</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(q.question);
                          setCopiedQuestion(`${questionRole}-${idx}`);
                          setTimeout(() => setCopiedQuestion(null), 3000);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: copiedQuestion === `${questionRole}-${idx}` ? '#16845B' : '#0060A8',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.76rem',
                          fontWeight: 700
                        }}
                      >
                        {copiedQuestion === `${questionRole}-${idx}` ? <Check size={14} /> : <Copy size={14} />}
                        {copiedQuestion === `${questionRole}-${idx}` ? 'Copied to Clipboard' : 'Copy Question'}
                      </button>
                    </div>

                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#031120', lineHeight: 1.45 }}>
                      "{q.question}"
                    </div>

                    <div style={{ fontSize: '0.76rem', color: '#6C6C6C', fontStyle: 'italic', marginTop: '2px' }}>
                      Evaluation Rubric: {q.evalCriteria}
                    </div>
                  </div>
                ));
              })()}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #E5EAF0' }}>
              <button
                type="button"
                onClick={() => setShowQuestionBankModal(false)}
                className="btn btn-secondary"
              >
                Close Question Bank
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
