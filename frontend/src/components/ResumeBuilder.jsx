import React, { useState } from 'react';
import {
  FileText,
  User,
  GraduationCap,
  Briefcase,
  Award,
  Sparkles,
  Download,
  Printer,
  Plus,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Code2,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Globe
} from 'lucide-react';

export default function ResumeBuilder({ candidateProfile, onSaveProfile }) {
  const [activeSection, setActiveSection] = useState('personal'); // 'personal' | 'education' | 'experience' | 'skills' | 'projects' | 'certifications'
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [exportNotice, setExportNotice] = useState('');

  // Structured Resume State initialized with candidate profile data
  const [resumeData, setResumeData] = useState({
    personal: {
      fullName: candidateProfile ? `${candidateProfile.first_name || ''} ${candidateProfile.last_name || ''}`.trim() || 'Rahul Verma' : 'Rahul Verma',
      title: 'Full Stack Software Engineer & Cloud Architect',
      email: candidateProfile?.email || 'rahul.verma@example.com',
      phone: candidateProfile?.phone || '+91 9912345672',
      location: candidateProfile?.location || 'Bengaluru, Karnataka',
      website: 'https://github.com/rahulverma-dev',
      summary: 'Experienced Full-Stack Software Engineer with 3.5+ years of production expertise architecting high-performance web applications, scalable REST APIs, and microservices. Proficient in React.js, Node.js, Python, and ACID-compliant relational schemas.'
    },
    education: [
      {
        id: 1,
        degree: candidateProfile?.education_level ? `Master of Computer Applications (${candidateProfile.education_level})` : 'Master of Computer Applications (MCA)',
        institution: 'Visvesvaraya Technological University (VTU)',
        year: '2021 – 2023',
        score: '8.8 CGPA / First Class Distinction'
      },
      {
        id: 2,
        degree: 'Bachelor of Computer Applications (BCA)',
        institution: 'Bangalore University',
        year: '2018 – 2021',
        score: '8.5 CGPA'
      }
    ],
    experience: [
      {
        id: 1,
        role: 'Senior Software Engineer',
        company: 'CloudScale Technologies Pvt Ltd',
        period: '2023 – Present',
        location: 'Bengaluru, India',
        bullets: [
          'Architected responsive frontend dashboards using React 18, Vite, and custom CSS variables reducing load latency by 42%.',
          'Developed Node.js/Express REST microservices with JWT authentication and Bcrypt password encryption.',
          'Integrated MySQL 8.4 3NF transactional schemas with stored procedures and connection pooling.'
        ]
      },
      {
        id: 2,
        role: 'Full Stack Developer Intern',
        company: 'Apex Digital Solutions',
        period: '2022 – 2023',
        location: 'Bengaluru, India',
        bullets: [
          'Engineered candidate tracking components and interview schedule workflows.',
          'Built Python data processing pipelines extracting entity tokens from unstructured document files.'
        ]
      }
    ],
    skills: {
      languages: ['Python', 'JavaScript (ES6+)', 'SQL', 'Java 17', 'HTML5/CSS3'],
      frameworks: ['React.js', 'Node.js', 'Express.js', 'Spring Boot', 'Tailwind/Vite'],
      databases: ['MySQL 8.4 (3NF)', 'MongoDB Atlas', 'PostgreSQL', 'Redis'],
      tools: ['Docker', 'AWS (EC2, S3)', 'Git & GitHub', 'REST APIs', 'Postman']
    },
    projects: [
      {
        id: 1,
        name: 'TALENTIQ — Enterprise Recruitment Intelligence SaaS',
        tech: 'React 18, Node.js, Python Flask, MySQL 8.4, MongoDB Atlas',
        url: 'https://talentiq.io',
        description: 'Commercial HR-Tech platform with multi-factor candidate ranking (70% skill / 30% experience), predictive salary regression (R²=0.9458), and real-time interview management.'
      },
      {
        id: 2,
        name: 'Distributed Cloud Microservices Gateway',
        tech: 'Java 17, Spring Cloud, Docker, MySQL, Redis',
        url: 'https://github.com/rahulverma-dev/cloud-gateway',
        description: 'High-throughput API gateway processing 5,000+ requests/sec with rate limiting, JWT token validation, and circuit breakers.'
      }
    ],
    certifications: [
      { id: 1, name: 'AWS Certified Solutions Architect – Associate', issuer: 'Amazon Web Services', year: '2024' },
      { id: 2, name: 'Oracle Certified Professional: Java SE 17 Developer', issuer: 'Oracle Corporation', year: '2023' },
      { id: 3, name: 'Professional Full-Stack Web Development', issuer: 'Meta / Coursera', year: '2022' }
    ]
  });

  // Auto-fill from candidate profile
  const handleAutoFill = () => {
    if (!candidateProfile) return;
    setResumeData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        fullName: `${candidateProfile.first_name || ''} ${candidateProfile.last_name || ''}`.trim() || prev.personal.fullName,
        email: candidateProfile.email || prev.personal.email,
        phone: candidateProfile.phone || prev.personal.phone,
        location: candidateProfile.location || prev.personal.location
      },
      skills: {
        ...prev.skills,
        languages: Array.isArray(candidateProfile.skills) && candidateProfile.skills.length > 0 ? candidateProfile.skills : prev.skills.languages
      }
    }));
    setExportNotice('Resume details refreshed from your live candidate profile.');
    setTimeout(() => setExportNotice(''), 4000);
  };

  // Trigger Print to PDF
  const handlePrintPDF = () => {
    window.print();
  };

  // Export as JSON backup
  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(resumeData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${resumeData.personal.fullName.replace(/\s+/g, '_')}_Resume_TALENTIQ.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Toast Notice */}
      {exportNotice && (
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
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Top Controls Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '1.25rem 1.5rem',
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E5EAF0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: 'rgba(0, 96, 168, 0.1)',
            color: '#0060A8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileText size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#031120', margin: 0 }}>
              Professional Resume Builder
            </h2>
            <div style={{ fontSize: '0.78rem', color: '#6C6C6C' }}>
              Create, preview, and export an executive-formatted CV in Institutional Aquatic layout
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={handleAutoFill}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <RefreshCw size={15} /> Auto-Fill Profile
          </button>
          <button
            type="button"
            onClick={() => setShowPreviewModal(!showPreviewModal)}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <Sparkles size={15} color="#0060A8" /> {showPreviewModal ? 'Edit Mode' : 'Live Preview'}
          </button>
          <button
            type="button"
            onClick={handleDownloadJSON}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <Download size={15} /> JSON
          </button>
          <button
            type="button"
            onClick={handlePrintPDF}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <Printer size={15} /> Export PDF
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout (Editor on Left, Live Document on Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: showPreviewModal ? '1fr' : '1.1fr 1.2fr', gap: '1.75rem', alignItems: 'start' }}>
        {/* LEFT COLUMN: Section Editor */}
        {!showPreviewModal && (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Section Tabs */}
            <div style={{
              display: 'flex',
              gap: '0.4rem',
              flexWrap: 'wrap',
              borderBottom: '1px solid #E5EAF0',
              paddingBottom: '0.85rem'
            }}>
              {[
                { id: 'personal', label: 'Personal', icon: User },
                { id: 'education', label: 'Education', icon: GraduationCap },
                { id: 'experience', label: 'Experience', icon: Briefcase },
                { id: 'skills', label: 'Skills', icon: Code2 },
                { id: 'projects', label: 'Projects', icon: Sparkles },
                { id: 'certifications', label: 'Certs', icon: Award }
              ].map(sec => {
                const Icon = sec.icon;
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setActiveSection(sec.id)}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: isActive ? '#0060A8' : '#F1F5F8',
                      color: isActive ? '#FFFFFF' : '#031120',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <Icon size={14} /> {sec.label}
                  </button>
                );
              })}
            </div>

            {/* TAB: Personal Info */}
            {activeSection === 'personal' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0060A8', textTransform: 'uppercase', margin: 0 }}>
                  Personal & Contact Coordinates
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                  <div>
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={resumeData.personal.fullName}
                      onChange={e => setResumeData({
                        ...resumeData,
                        personal: { ...resumeData.personal, fullName: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Professional Headline</label>
                    <input
                      type="text"
                      className="form-control"
                      value={resumeData.personal.title}
                      onChange={e => setResumeData({
                        ...resumeData,
                        personal: { ...resumeData.personal, title: e.target.value }
                      })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                  <div>
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={resumeData.personal.email}
                      onChange={e => setResumeData({
                        ...resumeData,
                        personal: { ...resumeData.personal, email: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={resumeData.personal.phone}
                      onChange={e => setResumeData({
                        ...resumeData,
                        personal: { ...resumeData.personal, phone: e.target.value }
                      })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                  <div>
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      value={resumeData.personal.location}
                      onChange={e => setResumeData({
                        ...resumeData,
                        personal: { ...resumeData.personal, location: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Portfolio / GitHub URL</label>
                    <input
                      type="url"
                      className="form-control"
                      value={resumeData.personal.website}
                      onChange={e => setResumeData({
                        ...resumeData,
                        personal: { ...resumeData.personal, website: e.target.value }
                      })}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Executive Professional Summary</label>
                  <textarea
                    rows={4}
                    className="form-control"
                    value={resumeData.personal.summary}
                    onChange={e => setResumeData({
                      ...resumeData,
                      personal: { ...resumeData.personal, summary: e.target.value }
                    })}
                  />
                </div>
              </div>
            )}

            {/* TAB: Education */}
            {activeSection === 'education' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0060A8', textTransform: 'uppercase', margin: 0 }}>
                    Academic Qualifications
                  </h4>
                  <button
                    type="button"
                    onClick={() => setResumeData({
                      ...resumeData,
                      education: [
                        ...resumeData.education,
                        { id: Date.now(), degree: 'New Degree', institution: 'University', year: '2024', score: 'First Class' }
                      ]
                    })}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Plus size={14} /> Add Degree
                  </button>
                </div>

                {resumeData.education.map((edu, idx) => (
                  <div key={edu.id} style={{ padding: '1rem', backgroundColor: '#F1F5F8', borderRadius: '10px', position: 'relative' }}>
                    <button
                      type="button"
                      onClick={() => setResumeData({
                        ...resumeData,
                        education: resumeData.education.filter(e => e.id !== edu.id)
                      })}
                      style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', border: 'none', color: '#D94C4C', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div>
                        <label className="form-label">Degree & Major</label>
                        <input
                          type="text"
                          className="form-control"
                          value={edu.degree}
                          onChange={e => {
                            const updated = [...resumeData.education];
                            updated[idx].degree = e.target.value;
                            setResumeData({ ...resumeData, education: updated });
                          }}
                        />
                      </div>
                      <div>
                        <label className="form-label">Institution / University</label>
                        <input
                          type="text"
                          className="form-control"
                          value={edu.institution}
                          onChange={e => {
                            const updated = [...resumeData.education];
                            updated[idx].institution = e.target.value;
                            setResumeData({ ...resumeData, education: updated });
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label className="form-label">Graduation Year / Span</label>
                        <input
                          type="text"
                          className="form-control"
                          value={edu.year}
                          onChange={e => {
                            const updated = [...resumeData.education];
                            updated[idx].year = e.target.value;
                            setResumeData({ ...resumeData, education: updated });
                          }}
                        />
                      </div>
                      <div>
                        <label className="form-label">Grade / GPA / Percentage</label>
                        <input
                          type="text"
                          className="form-control"
                          value={edu.score}
                          onChange={e => {
                            const updated = [...resumeData.education];
                            updated[idx].score = e.target.value;
                            setResumeData({ ...resumeData, education: updated });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB: Work Experience */}
            {activeSection === 'experience' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0060A8', textTransform: 'uppercase', margin: 0 }}>
                    Career & Industry Experience
                  </h4>
                  <button
                    type="button"
                    onClick={() => setResumeData({
                      ...resumeData,
                      experience: [
                        ...resumeData.experience,
                        { id: Date.now(), role: 'Software Engineer', company: 'Tech Company', period: '2024 – Present', location: 'Bengaluru', bullets: ['Engineered scalable web applications.'] }
                      ]
                    })}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Plus size={14} /> Add Role
                  </button>
                </div>

                {resumeData.experience.map((exp, idx) => (
                  <div key={exp.id} style={{ padding: '1rem', backgroundColor: '#F1F5F8', borderRadius: '10px', position: 'relative' }}>
                    <button
                      type="button"
                      onClick={() => setResumeData({
                        ...resumeData,
                        experience: resumeData.experience.filter(e => e.id !== exp.id)
                      })}
                      style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', border: 'none', color: '#D94C4C', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div>
                        <label className="form-label">Role Title</label>
                        <input
                          type="text"
                          className="form-control"
                          value={exp.role}
                          onChange={e => {
                            const updated = [...resumeData.experience];
                            updated[idx].role = e.target.value;
                            setResumeData({ ...resumeData, experience: updated });
                          }}
                        />
                      </div>
                      <div>
                        <label className="form-label">Company Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={exp.company}
                          onChange={e => {
                            const updated = [...resumeData.experience];
                            updated[idx].company = e.target.value;
                            setResumeData({ ...resumeData, experience: updated });
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div>
                        <label className="form-label">Tenure / Dates</label>
                        <input
                          type="text"
                          className="form-control"
                          value={exp.period}
                          onChange={e => {
                            const updated = [...resumeData.experience];
                            updated[idx].period = e.target.value;
                            setResumeData({ ...resumeData, experience: updated });
                          }}
                        />
                      </div>
                      <div>
                        <label className="form-label">Location</label>
                        <input
                          type="text"
                          className="form-control"
                          value={exp.location}
                          onChange={e => {
                            const updated = [...resumeData.experience];
                            updated[idx].location = e.target.value;
                            setResumeData({ ...resumeData, experience: updated });
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Key Achievements (One per line)</label>
                      <textarea
                        rows={3}
                        className="form-control"
                        value={exp.bullets.join('\n')}
                        onChange={e => {
                          const updated = [...resumeData.experience];
                          updated[idx].bullets = e.target.value.split('\n').filter(Boolean);
                          setResumeData({ ...resumeData, experience: updated });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB: Skills */}
            {activeSection === 'skills' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0060A8', textTransform: 'uppercase', margin: 0 }}>
                  Technical Competencies (Comma-separated)
                </h4>

                <div>
                  <label className="form-label">Programming Languages</label>
                  <input
                    type="text"
                    className="form-control"
                    value={resumeData.skills.languages.join(', ')}
                    onChange={e => setResumeData({
                      ...resumeData,
                      skills: { ...resumeData.skills, languages: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }
                    })}
                  />
                </div>

                <div>
                  <label className="form-label">Frameworks & Libraries</label>
                  <input
                    type="text"
                    className="form-control"
                    value={resumeData.skills.frameworks.join(', ')}
                    onChange={e => setResumeData({
                      ...resumeData,
                      skills: { ...resumeData.skills, frameworks: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }
                    })}
                  />
                </div>

                <div>
                  <label className="form-label">Databases & Data Storage</label>
                  <input
                    type="text"
                    className="form-control"
                    value={resumeData.skills.databases.join(', ')}
                    onChange={e => setResumeData({
                      ...resumeData,
                      skills: { ...resumeData.skills, databases: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }
                    })}
                  />
                </div>

                <div>
                  <label className="form-label">Cloud, DevOps & Tools</label>
                  <input
                    type="text"
                    className="form-control"
                    value={resumeData.skills.tools.join(', ')}
                    onChange={e => setResumeData({
                      ...resumeData,
                      skills: { ...resumeData.skills, tools: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }
                    })}
                  />
                </div>
              </div>
            )}

            {/* TAB: Projects */}
            {activeSection === 'projects' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0060A8', textTransform: 'uppercase', margin: 0 }}>
                    Featured Engineering Projects
                  </h4>
                  <button
                    type="button"
                    onClick={() => setResumeData({
                      ...resumeData,
                      projects: [
                        ...resumeData.projects,
                        { id: Date.now(), name: 'New Project', tech: 'React, Node.js', url: '', description: 'Description of the project.' }
                      ]
                    })}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Plus size={14} /> Add Project
                  </button>
                </div>

                {resumeData.projects.map((proj, idx) => (
                  <div key={proj.id} style={{ padding: '1rem', backgroundColor: '#F1F5F8', borderRadius: '10px', position: 'relative' }}>
                    <button
                      type="button"
                      onClick={() => setResumeData({
                        ...resumeData,
                        projects: resumeData.projects.filter(p => p.id !== proj.id)
                      })}
                      style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', border: 'none', color: '#D94C4C', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div>
                        <label className="form-label">Project Title</label>
                        <input
                          type="text"
                          className="form-control"
                          value={proj.name}
                          onChange={e => {
                            const updated = [...resumeData.projects];
                            updated[idx].name = e.target.value;
                            setResumeData({ ...resumeData, projects: updated });
                          }}
                        />
                      </div>
                      <div>
                        <label className="form-label">Project URL / GitHub</label>
                        <input
                          type="url"
                          className="form-control"
                          value={proj.url}
                          onChange={e => {
                            const updated = [...resumeData.projects];
                            updated[idx].url = e.target.value;
                            setResumeData({ ...resumeData, projects: updated });
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label className="form-label">Technologies Used</label>
                      <input
                        type="text"
                        className="form-control"
                        value={proj.tech}
                        onChange={e => {
                          const updated = [...resumeData.projects];
                          updated[idx].tech = e.target.value;
                          setResumeData({ ...resumeData, projects: updated });
                        }}
                      />
                    </div>
                    <div>
                      <label className="form-label">Project Highlights & Architecture</label>
                      <textarea
                        rows={2}
                        className="form-control"
                        value={proj.description}
                        onChange={e => {
                          const updated = [...resumeData.projects];
                          updated[idx].description = e.target.value;
                          setResumeData({ ...resumeData, projects: updated });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB: Certifications */}
            {activeSection === 'certifications' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0060A8', textTransform: 'uppercase', margin: 0 }}>
                    Professional Certifications
                  </h4>
                  <button
                    type="button"
                    onClick={() => setResumeData({
                      ...resumeData,
                      certifications: [
                        ...resumeData.certifications,
                        { id: Date.now(), name: 'Certificate Name', issuer: 'Issuer Organization', year: '2024' }
                      ]
                    })}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Plus size={14} /> Add Certification
                  </button>
                </div>

                {resumeData.certifications.map((cert, idx) => (
                  <div key={cert.id} style={{ padding: '0.85rem 1rem', backgroundColor: '#F1F5F8', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ flex: 1.5 }}>
                      <label className="form-label" style={{ fontSize: '0.74rem' }}>Certificate Title</label>
                      <input
                        type="text"
                        className="form-control"
                        value={cert.name}
                        onChange={e => {
                          const updated = [...resumeData.certifications];
                          updated[idx].name = e.target.value;
                          setResumeData({ ...resumeData, certifications: updated });
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="form-label" style={{ fontSize: '0.74rem' }}>Issuer</label>
                      <input
                        type="text"
                        className="form-control"
                        value={cert.issuer}
                        onChange={e => {
                          const updated = [...resumeData.certifications];
                          updated[idx].issuer = e.target.value;
                          setResumeData({ ...resumeData, certifications: updated });
                        }}
                      />
                    </div>
                    <div style={{ width: '90px' }}>
                      <label className="form-label" style={{ fontSize: '0.74rem' }}>Year</label>
                      <input
                        type="text"
                        className="form-control"
                        value={cert.year}
                        onChange={e => {
                          const updated = [...resumeData.certifications];
                          updated[idx].year = e.target.value;
                          setResumeData({ ...resumeData, certifications: updated });
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setResumeData({
                        ...resumeData,
                        certifications: resumeData.certifications.filter(c => c.id !== cert.id)
                      })}
                      style={{ background: 'none', border: 'none', color: '#D94C4C', cursor: 'pointer', marginTop: '1.25rem' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* RIGHT COLUMN: Live Formatted Resume Document (Printable A4 Sheet) */}
        <div
          id="printable-resume"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E5EAF0',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
            padding: '2.5rem 3rem',
            color: '#031120',
            fontFamily: "'Plus Jakarta Sans', sans-serif"
          }}
        >
          {/* Header Block */}
          <div style={{ borderBottom: '2.5px solid #0060A8', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#031120', letterSpacing: '-0.025em', margin: 0 }}>
              {resumeData.personal.fullName}
            </h1>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0060A8', marginTop: '2px', marginBottom: '0.75rem' }}>
              {resumeData.personal.title}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.8rem', color: '#6C6C6C' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Mail size={13} color="#0060A8" /> {resumeData.personal.email}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Phone size={13} color="#0060A8" /> {resumeData.personal.phone}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={13} color="#0060A8" /> {resumeData.personal.location}
              </span>
              {resumeData.personal.website && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Globe size={13} color="#0060A8" /> {resumeData.personal.website}
                </span>
              )}
            </div>
          </div>

          {/* Professional Summary */}
          {resumeData.personal.summary && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0060A8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                Professional Profile
              </div>
              <p style={{ fontSize: '0.84rem', color: '#031120', lineHeight: 1.6, margin: 0 }}>
                {resumeData.personal.summary}
              </p>
            </div>
          )}

          {/* Technical Skills */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0060A8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.45rem' }}>
              Technical Expertise
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem' }}>
              <div><strong>Languages:</strong> <span style={{ color: '#6C6C6C' }}>{resumeData.skills.languages.join(' • ')}</span></div>
              <div><strong>Frameworks & APIs:</strong> <span style={{ color: '#6C6C6C' }}>{resumeData.skills.frameworks.join(' • ')}</span></div>
              <div><strong>Databases & Storage:</strong> <span style={{ color: '#6C6C6C' }}>{resumeData.skills.databases.join(' • ')}</span></div>
              <div><strong>Cloud & DevOps:</strong> <span style={{ color: '#6C6C6C' }}>{resumeData.skills.tools.join(' • ')}</span></div>
            </div>
          </div>

          {/* Work Experience */}
          {resumeData.experience.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0060A8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.65rem' }}>
                Professional Experience
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {resumeData.experience.map(exp => (
                  <div key={exp.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <strong style={{ fontSize: '0.92rem', color: '#031120' }}>{exp.role}</strong>
                      <span style={{ fontSize: '0.78rem', color: '#0060A8', fontWeight: 700 }}>{exp.period}</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#6C6C6C', marginBottom: '0.35rem' }}>
                      {exp.company} • {exp.location}
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.82rem', color: '#031120', lineHeight: 1.5 }}>
                      {exp.bullets.map((b, bIdx) => (
                        <li key={bIdx} style={{ marginBottom: '2px' }}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {resumeData.projects.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0060A8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.65rem' }}>
                Key Engineering Projects
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {resumeData.projects.map(proj => (
                  <div key={proj.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <strong style={{ fontSize: '0.88rem', color: '#031120' }}>{proj.name}</strong>
                      {proj.url && <span style={{ fontSize: '0.75rem', color: '#1473E6' }}>{proj.url}</span>}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#0060A8', fontWeight: 600, marginBottom: '2px' }}>
                      Stack: {proj.tech}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#6C6C6C', lineHeight: 1.45 }}>
                      {proj.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {resumeData.education.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0060A8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.55rem' }}>
                Education
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {resumeData.education.map(edu => (
                  <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div>
                      <strong style={{ fontSize: '0.86rem', color: '#031120' }}>{edu.degree}</strong>
                      <div style={{ fontSize: '0.78rem', color: '#6C6C6C' }}>{edu.institution} • {edu.score}</div>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#0060A8', fontWeight: 600 }}>{edu.year}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {resumeData.certifications.length > 0 && (
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0060A8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.45rem' }}>
                Certifications & Credentials
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.8rem', color: '#031120' }}>
                {resumeData.certifications.map(cert => (
                  <span key={cert.id} style={{ padding: '3px 8px', backgroundColor: '#F1F5F8', borderRadius: '4px', border: '1px solid #E5EAF0' }}>
                    <strong>{cert.name}</strong> — {cert.issuer} ({cert.year})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Footer Watermark */}
          <div style={{
            marginTop: '2rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid #E5EAF0',
            fontSize: '0.7rem',
            color: '#9CA3AF',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>Verified Candidate Dossier • TALENTIQ Corporate Intelligence</span>
            <span>Generated on {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
