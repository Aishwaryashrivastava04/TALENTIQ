import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Filter,
  Eye,
  Trash2,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  MapPin,
  IndianRupee,
  X,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Send,
  Clock,
  ShieldCheck,
  TrendingUp,
  FileText,
  Award,
  Edit,
  ArrowUpDown
} from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { candidateService, applicationService, mlService } from '../services/api';

export default function Candidates({ user }) {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState('');
  const [educationFilter, setEducationFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [candidateProfileTab, setCandidateProfileTab] = useState('dossier'); // 'dossier' | 'communications' | 'predictions'
  const [showAddModal, setShowAddModal] = useState(false);
  const [notification, setNotification] = useState(null);

  // Communications State
  const [commCandidate, setCommCandidate] = useState(null);
  const [commList, setCommList] = useState([]);
  const [commLoading, setCommLoading] = useState(false);
  const [newComm, setNewComm] = useState({
    subject: '',
    message_body: '',
    sender_name: 'Priya Menon (Senior HR Partner)',
    channel: 'EMAIL'
  });
  const [sendingComm, setSendingComm] = useState(false);

  // Form Data for New Candidate
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    experience_years: '3.0',
    education_level: 'MCA',
    current_salary: '700000',
    expected_salary: '1100000',
    location: 'Bengaluru',
    skills: 'Python, React.js, MySQL, REST APIs'
  });

  const loadCandidates = async () => {
    setLoading(true);
    try {
      const res = await candidateService.getAll({
        search: search || undefined,
        education: educationFilter || undefined
      });
      if (res.data && res.data.data) {
        let list = res.data.data;
        if (sortBy === 'experience') {
          list = [...list].sort((a, b) => (b.experience_years || 0) - (a.experience_years || 0));
        } else if (sortBy === 'salary') {
          list = [...list].sort((a, b) => (b.expected_salary || 0) - (a.expected_salary || 0));
        } else {
          list = [...list].sort((a, b) => (a.first_name || '').localeCompare(b.first_name || ''));
        }
        setCandidates(list);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
    setCurrentPage(1);
  }, [search, educationFilter, sortBy, locationFilter, experienceFilter]);

  const filteredCandidates = candidates.filter(c => {
    const locMatch = !locationFilter || (c.location || '').toLowerCase().includes(locationFilter.toLowerCase());
    const exp = parseFloat(c.experience_years) || 0;
    const expMatch = !experienceFilter ? true :
      experienceFilter === '0-2' ? exp <= 2 :
      experienceFilter === '2-5' ? exp > 2 && exp <= 5 :
      experienceFilter === '5-8' ? exp > 5 && exp <= 8 :
      exp > 8;
    return locMatch && expMatch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredCandidates.length / pageSize));
  const paginatedCandidates = filteredCandidates.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        experience_years: parseFloat(formData.experience_years),
        current_salary: parseFloat(formData.current_salary),
        expected_salary: parseFloat(formData.expected_salary),
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      };
      await candidateService.create(payload);
      setShowAddModal(false);
      setNotification({ type: 'success', text: 'Candidate successfully enrolled into talent directory.' });
      loadCandidates();
    } catch (err) {
      setNotification({ type: 'error', text: err.response?.data?.message || 'Error creating candidate record' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this candidate profile?')) return;
    try {
      await candidateService.delete(id);
      setNotification({ type: 'success', text: 'Candidate record removed successfully.' });
      loadCandidates();
    } catch (err) {
      setNotification({ type: 'error', text: 'Delete operation failed.' });
    }
  };

  const openCommunications = async (cand) => {
    setCommCandidate(cand);
    setCommLoading(true);
    try {
      const res = await candidateService.getCommunications(cand.id);
      if (res.data && res.data.data) {
        setCommList(res.data.data);
      } else {
        setCommList([]);
      }
    } catch (err) {
      setCommList([]);
    } finally {
      setCommLoading(false);
    }
  };

  const handleSendCommunication = async (e) => {
    e.preventDefault();
    if (!newComm.subject.trim() || !newComm.message_body.trim()) {
      alert('Please provide both subject and message body.');
      return;
    }
    setSendingComm(true);
    try {
      const res = await candidateService.sendCommunication(commCandidate.id, newComm);
      if (res.data && res.data.data) {
        setCommList([res.data.data, ...commList]);
      }
      setNewComm({
        subject: '',
        message_body: '',
        sender_name: 'Priya Menon (Senior HR Partner)',
        channel: 'EMAIL'
      });
      setNotification({ type: 'success', text: `Communication recorded and dispatched to ${commCandidate.email}` });
    } catch (err) {
      alert('Failed to send communication: ' + (err.response?.data?.message || err.message));
    } finally {
      setSendingComm(false);
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
        title="CANDIDATE DIRECTORY"
        subtitle="Manage registered talent profiles, review qualification dossiers, and track interview communications."
        action={
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
            <Plus size={16} /> Add Candidate
          </button>
        }
      />

      {/* Filters & Search Toolbar */}
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
        <div style={{ display: 'flex', gap: '0.85rem', flex: 1, minWidth: '320px', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={16} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by candidate name, code, or technical skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          {/* Education Filter */}
          <select
            value={educationFilter}
            onChange={(e) => setEducationFilter(e.target.value)}
            className="form-control"
            style={{ width: '150px' }}
          >
            <option value="">All Degrees</option>
            <option value="BCA">BCA</option>
            <option value="MCA">MCA</option>
            <option value="BTECH">B.Tech</option>
            <option value="MTECH">M.Tech</option>
            <option value="PHD">Ph.D</option>
          </select>

          {/* Location Filter */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="form-control"
            style={{ width: '150px' }}
          >
            <option value="">All Locations</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Pune">Pune</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Chennai">Chennai</option>
            <option value="Remote">Remote</option>
          </select>

          {/* Experience Filter */}
          <select
            value={experienceFilter}
            onChange={(e) => setExperienceFilter(e.target.value)}
            className="form-control"
            style={{ width: '150px' }}
          >
            <option value="">All Experience</option>
            <option value="0-2">0 - 2 Years</option>
            <option value="2-5">2 - 5 Years</option>
            <option value="5-8">5 - 8 Years</option>
            <option value="8+">8+ Years</option>
          </select>

          {/* Sort By Filter */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-control"
            style={{ width: '160px' }}
          >
            <option value="name">Sort by Name</option>
            <option value="experience">Sort by Experience</option>
            <option value="salary">Sort by Expected CTC</option>
          </select>

          {(search || educationFilter || locationFilter || experienceFilter) && (
            <button
              onClick={() => { setSearch(''); setEducationFilter(''); setLocationFilter(''); setExperienceFilter(''); }}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.74rem' }}
            >
              Reset
            </button>
          )}
        </div>

        <div style={{ fontSize: '0.82rem', color: '#6C6C6C', fontWeight: 600 }}>
          Showing <strong>{filteredCandidates.length}</strong> Qualified Candidates
        </div>
      </div>

      {/* Candidate Data Table */}
      <div className="table-responsive">
        <table className="table-custom">
          <thead>
            <tr>
              <th>Candidate ID</th>
              <th>Candidate Name & Skills</th>
              <th>Contact Details</th>
              <th>Experience</th>
              <th>Degree</th>
              <th>Compensation (Cur / Exp)</th>
              <th>Location</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '3rem', color: '#9CA3AF' }}>
                  Loading verified candidate directory records...
                </td>
              </tr>
            ) : filteredCandidates.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '3rem', color: '#9CA3AF' }}>
                  No candidates found matching the selected filters.
                </td>
              </tr>
            ) : (
              paginatedCandidates.map((c) => (
                <tr key={c.id}>
                  <td>
                    <span style={{ fontWeight: 700, color: '#0060A8', fontSize: '0.82rem' }}>
                      {c.candidate_code}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#031120' }}>
                      {c.full_name || `${c.first_name} ${c.last_name}`}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#6C6C6C', marginTop: '2px', maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.skills_list || 'Python, Java, SQL, REST'}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}>
                      <Mail size={12} color="#9CA3AF" /> {c.email}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#6C6C6C', marginTop: '2px' }}>
                      <Phone size={12} color="#9CA3AF" /> {c.phone}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{c.experience_years} yrs</span>
                  </td>
                  <td>
                    <span className="badge badge-blue">{c.education_level}</span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#031120' }}>
                      ₹{(c.current_salary / 100000).toFixed(1)}L → <span style={{ color: '#0060A8' }}>₹{(c.expected_salary / 100000).toFixed(1)}L</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: '#6C6C6C' }}>
                      <MapPin size={13} color="#9CA3AF" /> {c.location}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${c.status === 'AVAILABLE' ? 'badge-emerald' : 'badge-warning'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                      <button
                        onClick={() => openCommunications(c)}
                        className="btn btn-secondary btn-sm"
                        title="Candidate Communication History"
                      >
                        <MessageSquare size={14} />
                      </button>
                      <button
                        onClick={() => { setSelectedCandidate(c); setCandidateProfileTab('dossier'); }}
                        className="btn btn-secondary btn-sm"
                        title="View Candidate Dossier"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#D94C4C' }}
                        title="Delete Candidate Record"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {!loading && filteredCandidates.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1.25rem',
            borderTop: '1px solid #E5EAF0',
            backgroundColor: '#FFFFFF',
            borderRadius: '0 0 10px 10px',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <div style={{ fontSize: '0.78rem', color: '#6C6C6C' }}>
              Showing {((currentPage - 1) * pageSize) + 1}–{Math.min(currentPage * pageSize, filteredCandidates.length)} of {filteredCandidates.length} candidate profiles
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.74rem' }}
              >
                ← Previous
              </button>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#031120', padding: '0 0.5rem' }}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.74rem' }}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Add Candidate */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E5EAF0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0060A8', textTransform: 'uppercase', margin: 0 }}>
                  Enroll New Candidate
                </h3>
                <div style={{ fontSize: '0.75rem', color: '#6C6C6C' }}>Verified Talent Record</div>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">First Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Last Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    className="form-control"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    className="form-control"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Experience (Years)</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-control"
                    value={formData.experience_years}
                    onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Education Degree</label>
                  <select
                    className="form-control"
                    value={formData.education_level}
                    onChange={(e) => setFormData({ ...formData, education_level: e.target.value })}
                  >
                    <option value="BCA">BCA</option>
                    <option value="MCA">MCA</option>
                    <option value="BTECH">B.Tech</option>
                    <option value="MTECH">M.Tech</option>
                    <option value="PHD">Ph.D</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Current Salary (INR)</label>
                  <input
                    type="number"
                    step="50000"
                    className="form-control"
                    value={formData.current_salary}
                    onChange={(e) => setFormData({ ...formData, current_salary: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Expected Salary (INR)</label>
                  <input
                    type="number"
                    step="50000"
                    className="form-control"
                    value={formData.expected_salary}
                    onChange={(e) => setFormData({ ...formData, expected_salary: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Primary Location</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Technical Skills (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Python, React.js, MySQL, Docker, AWS"
                  className="form-control"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Candidate Dossier */}
      {selectedCandidate && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E5EAF0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="badge badge-blue">{selectedCandidate.candidate_code}</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#031120', margin: 0 }}>
                  {selectedCandidate.full_name || `${selectedCandidate.first_name} ${selectedCandidate.last_name}`}
                </h3>
              </div>
              <button onClick={() => setSelectedCandidate(null)} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Dossier Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div style={{ padding: '0.85rem', backgroundColor: '#F1F5F8', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#6C6C6C' }}>Education Degree</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#031120', marginTop: '2px' }}>{selectedCandidate.education_level}</div>
                </div>
                <div style={{ padding: '0.85rem', backgroundColor: '#F1F5F8', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#6C6C6C' }}>Experience Level</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#031120', marginTop: '2px' }}>{selectedCandidate.experience_years} Years</div>
                </div>
                <div style={{ padding: '0.85rem', backgroundColor: '#F1F5F8', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#6C6C6C' }}>Current Compensation</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#16845B', marginTop: '2px' }}>
                    ₹{(selectedCandidate.current_salary / 100000).toFixed(1)} LPA
                  </div>
                </div>
                <div style={{ padding: '0.85rem', backgroundColor: '#F1F5F8', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#6C6C6C' }}>Expected Compensation</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0060A8', marginTop: '2px' }}>
                    ₹{(selectedCandidate.expected_salary / 100000).toFixed(1)} LPA
                  </div>
                </div>
              </div>

              {/* Skills Portfolio */}
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#031120', marginBottom: '0.5rem' }}>Verified Skills Portfolio:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                  {(selectedCandidate.skills_list ? selectedCandidate.skills_list.split(',') : ['Python', 'Java', 'SQL', 'React']).map((sk, i) => (
                    <span key={i} className="badge badge-blue">{sk.trim()}</span>
                  ))}
                </div>
              </div>

              {/* Persisted Database Link */}
              <div style={{
                padding: '0.85rem 1rem',
                backgroundColor: 'rgba(0, 96, 168, 0.05)',
                border: '1px solid rgba(0, 96, 168, 0.15)',
                borderRadius: '8px',
                fontSize: '0.8rem',
                color: '#6C6C6C',
                lineHeight: 1.45
              }}>
                <ShieldCheck size={14} color="#0060A8" style={{ display: 'inline', marginRight: '4px' }} />
                Verified and active talent record under reference identifier <strong>{selectedCandidate.candidate_code}</strong>.
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                <button
                  onClick={() => {
                    const c = selectedCandidate;
                    setSelectedCandidate(null);
                    openCommunications(c);
                  }}
                  className="btn btn-primary btn-sm"
                >
                  <MessageSquare size={14} /> Open Communication History
                </button>
                <button onClick={() => setSelectedCandidate(null)} className="btn btn-secondary btn-sm">
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Candidate Communications Drawer */}
      {commCandidate && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E5EAF0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#0060A8', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageSquare size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#031120', margin: 0 }}>
                    Candidate Communications
                  </h3>
                  <div style={{ fontSize: '0.74rem', color: '#6C6C6C' }}>
                    {commCandidate.full_name || `${commCandidate.first_name} ${commCandidate.last_name}`} • {commCandidate.email}
                  </div>
                </div>
              </div>
              <button onClick={() => setCommCandidate(null)} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Communication Timeline */}
              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#031120', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={15} color="#0060A8" /> Communication History ({commList.length})
                </h4>

                {commLoading ? (
                  <div style={{ padding: '1.5rem', textAlign: 'center', color: '#9CA3AF' }}>Loading communications log...</div>
                ) : commList.length === 0 ? (
                  <div style={{ padding: '1.5rem', textAlign: 'center', color: '#6C6C6C', backgroundColor: '#F1F5F8', borderRadius: '8px', fontSize: '0.84rem' }}>
                    No recorded messages for this candidate yet. Use the composer below to dispatch the first notice.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '220px', overflowY: 'auto' }}>
                    {commList.map((comm) => (
                      <div
                        key={comm.id}
                        style={{
                          backgroundColor: '#F1F5F8',
                          padding: '1rem',
                          borderRadius: '8px',
                          borderLeft: '4px solid #0060A8'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                          <span style={{ fontWeight: 700, color: '#031120', fontSize: '0.88rem' }}>{comm.subject}</span>
                          <span className="badge badge-blue">{comm.channel || 'EMAIL'}</span>
                        </div>
                        <p style={{ fontSize: '0.82rem', color: '#6C6C6C', lineHeight: 1.45, margin: '0.35rem 0' }}>
                          {comm.message_body}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#9CA3AF', borderTop: '1px solid #E5EAF0', paddingTop: '0.4rem', marginTop: '0.4rem' }}>
                          <span>By: <strong>{comm.sender_name || 'HR Team'}</strong></span>
                          <span>{comm.sent_at ? new Date(comm.sent_at).toLocaleString() : 'Recent'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Compose Message Form */}
              <div style={{ borderTop: '1px solid #E5EAF0', paddingTop: '1.25rem' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#031120', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Send size={15} color="#0060A8" /> Compose Communication
                </h4>

                <form onSubmit={handleSendCommunication} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label className="form-label">Subject *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Invitation to Technical Interview / Offer Letter"
                        className="form-control"
                        value={newComm.subject}
                        onChange={(e) => setNewComm({ ...newComm, subject: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="form-label">Channel</label>
                      <select
                        className="form-control"
                        value={newComm.channel}
                        onChange={(e) => setNewComm({ ...newComm, channel: e.target.value })}
                      >
                        <option value="EMAIL">Email (SMTP)</option>
                        <option value="PORTAL_ALERT">Portal Alert</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Message Body *</label>
                    <textarea
                      rows="3"
                      required
                      placeholder="Enter the official communication text, interview details, or next steps..."
                      className="form-control"
                      value={newComm.message_body}
                      onChange={(e) => setNewComm({ ...newComm, message_body: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                    <div style={{ fontSize: '0.74rem', color: '#6C6C6C' }}>
                      Audit logged to MySQL <code>candidate_communications</code>.
                    </div>
                    <div style={{ display: 'flex', gap: '0.6rem' }}>
                      <button type="button" onClick={() => setCommCandidate(null)} className="btn btn-secondary btn-sm">
                        Close
                      </button>
                      <button type="submit" disabled={sendingComm} className="btn btn-primary btn-sm">
                        <Send size={14} /> {sendingComm ? 'Dispatching...' : 'Send Communication'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
