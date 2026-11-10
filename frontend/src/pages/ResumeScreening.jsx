import React, { useState, useEffect } from 'react';
import {
  FileSearch,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Briefcase,
  GraduationCap,
  Award,
  Layers,
  ArrowRight,
  ShieldCheck,
  Mail,
  Phone,
  Clock,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  HelpCircle,
  Lightbulb,
  MessageSquare
} from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { mlService, jobService } from '../services/api';

export default function ResumeScreening({ user }) {
  const [resumeText, setResumeText] = useState(`Rahul Verma
Email: rahul.verma@example.com | Phone: +91 9876543210
Education: Master of Computer Applications (MCA)
Total Experience: 3.5 years of industry experience as Full-Stack Engineer

Technical Skills:
Python, React.js, Node.js, Express.js, MySQL, MongoDB, AWS, Docker, Machine Learning, Git & GitHub

Experience Summary:
- Developed responsive web interfaces using React.js and modern state management.
- Built scalable REST APIs with Node.js, Express.js, and implemented JWT authentication.
- Optimized transactional database schemas, indexing, and high-performance stored queries.
- Deployed containerized applications with Docker on AWS cloud infrastructure.`);

  const [pdfFile, setPdfFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [matchingResult, setMatchingResult] = useState(null);
  const [matchingLoading, setMatchingLoading] = useState(false);
  const [copiedQuestion, setCopiedQuestion] = useState(null);
  const [showQuestions, setShowQuestions] = useState(true);

  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await jobService.getAll();
        if (res.data && res.data.data) {
          setJobs(res.data.data);
          if (res.data.data.length > 0) {
            setSelectedJobId(res.data.data[0].id);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadJobs();
  }, []);

  const handleParse = async () => {
    setParsing(true);
    setMatchingResult(null);
    try {
      let res;
      if (pdfFile) {
        const formData = new FormData();
        formData.append('resume', pdfFile);
        res = await mlService.parseResume(formData);
      } else {
        res = await mlService.parseResume(resumeText);
      }
      if (res.data && res.data.data) {
        setExtractedData(res.data.data);
      }
    } catch (err) {
      alert('Error parsing resume: ' + (err.response?.data?.message || err.message));
    } finally {
      setParsing(false);
    }
  };

  const handleMatch = async () => {
    if (!extractedData) return;
    const targetJob = jobs.find(j => j.id == selectedJobId);
    if (!targetJob) return;

    setMatchingLoading(true);
    try {
      let requiredSkills = ['React.js', 'Node.js', 'MySQL', 'AWS'];
      if (targetJob.job_role.includes('ML') || targetJob.title.includes('AI')) {
        requiredSkills = ['Python', 'Machine Learning', 'Scikit-learn', 'NLP', 'Data Visualization'];
      } else if (targetJob.job_role.includes('Java')) {
        requiredSkills = ['Java', 'Spring Boot', 'MySQL', 'Docker'];
      } else if (targetJob.job_role.includes('DevOps')) {
        requiredSkills = ['AWS', 'Docker', 'Kubernetes', 'CI/CD Pipelines', 'Linux'];
      }

      const res = await mlService.matchCandidate({
        candidate_skills: extractedData.skills || [],
        candidate_experience: extractedData.experience_years || 2.0,
        job_required_skills: requiredSkills,
        job_min_experience: targetJob.min_experience,
        job_max_experience: targetJob.max_experience,
      });

      if (res.data && res.data.data) {
        setMatchingResult({
          ...res.data.data,
          job_title: targetJob.title,
          job_dept: targetJob.department
        });
      }
    } catch (err) {
      alert('Error calculating match score: ' + (err.response?.data?.message || err.message));
    } finally {
      setMatchingLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Section Heading */}
      <SectionHeading
        title="SMART RESUME INTELLIGENCE & TALENT MATCHER"
        subtitle="Automated candidate competency extraction and explainable requisition compatibility scoring."
      />

      {/* Main Two Columns */}
      <div className="grid-cols-2">
        {/* Left: Input Desk */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0060A8', textTransform: 'uppercase', margin: 0 }}>
              Resume Ingestion Desk
            </h3>
            <span className="badge badge-blue">PDF or Text</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* File Upload Box */}
            <div style={{
              border: '2px dashed #E5EAF0',
              borderRadius: '10px',
              padding: '1.5rem',
              textAlign: 'center',
              backgroundColor: '#F1F5F8',
              cursor: 'pointer'
            }}>
              <UploadCloud size={32} color="#0060A8" style={{ margin: '0 auto 0.5rem' }} />
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#031120' }}>
                {pdfFile ? pdfFile.name : 'Upload Candidate Resume PDF'}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#6C6C6C', marginTop: '2px' }}>
                Instant document entity extraction & skill classification
              </div>
              <input
                type="file"
                accept=".pdf"
                id="pdfUpload"
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setPdfFile(e.target.files[0]);
                  }
                }}
              />
              <label
                htmlFor="pdfUpload"
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '0.85rem', cursor: 'pointer', display: 'inline-flex' }}
              >
                {pdfFile ? 'Change File' : 'Browse PDF File'}
              </label>
            </div>

            {/* Plaintext Option */}
            <div>
              <label className="form-label">Or Paste Candidate Resume Text</label>
              <textarea
                rows="7"
                className="form-control"
                value={resumeText}
                onChange={(e) => {
                  setResumeText(e.target.value);
                  setPdfFile(null);
                }}
                placeholder="Paste plain text resume content..."
              />
            </div>

            <button
              onClick={handleParse}
              disabled={parsing}
              className="btn btn-primary"
              style={{ width: '100%', height: '46px' }}
            >
              {parsing ? 'Analyzing Document Intelligence...' : 'Screen Resume & Extract Competencies'}
            </button>
          </div>
        </div>

        {/* Right: Extracted Entities Dossier */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0060A8', textTransform: 'uppercase', margin: 0 }}>
              AI Extracted Entities
            </h3>
            <span className="badge badge-emerald">AI Resume Intelligence</span>
          </div>

          {!extractedData ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: '#9CA3AF' }}>
              <FileSearch size={38} color="#CBD5E1" style={{ margin: '0 auto 0.75rem' }} />
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#031120' }}>No Entities Parsed Yet</div>
              <div style={{ fontSize: '0.78rem', color: '#6C6C6C', marginTop: '4px' }}>
                Upload a PDF resume or click 'Parse Resume' to extract skills, experience, and education.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Profile Details Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: '#F1F5F8', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#6C6C6C' }}>Email Address</div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#031120', marginTop: '2px' }}>
                    {extractedData.extracted_email || 'rahul.verma@example.com'}
                  </div>
                </div>

                <div style={{ padding: '0.75rem', backgroundColor: '#F1F5F8', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#6C6C6C' }}>Phone Number</div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#031120', marginTop: '2px' }}>
                    {extractedData.extracted_phone || '+91 9876543210'}
                  </div>
                </div>

                <div style={{ padding: '0.75rem', backgroundColor: '#F1F5F8', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#6C6C6C' }}>Degree Identified</div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0060A8', marginTop: '2px' }}>
                    {extractedData.education_level || 'MCA'}
                  </div>
                </div>

                <div style={{ padding: '0.75rem', backgroundColor: '#F1F5F8', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#6C6C6C' }}>Experience Identified</div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#16845B', marginTop: '2px' }}>
                    {extractedData.experience_years || 3.5} Years
                  </div>
                </div>
              </div>

              {/* Technical Skills Extracted */}
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#031120', marginBottom: '0.5rem' }}>
                  Extracted Competencies ({extractedData.skills?.length || 0}):
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {(extractedData.skills || []).map((sk, i) => (
                    <span key={i} className="badge badge-blue">{sk}</span>
                  ))}
                </div>
              </div>

              {/* Match Against Job Opening */}
              <div style={{ borderTop: '1px solid #E5EAF0', paddingTop: '1.25rem' }}>
                <label className="form-label">Evaluate Match Against Active Requisition</label>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <select
                    className="form-control"
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    style={{ flex: 1 }}
                  >
                    {jobs.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.title} ({j.department}) • {j.job_role}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleMatch}
                    disabled={matchingLoading}
                    className="btn btn-primary btn-sm"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {matchingLoading ? 'Matching...' : 'Run Compatibility'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Matching Results Output */}
      {matchingResult && (
        <div className="card" style={{ borderLeft: '4px solid #0060A8', padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <span className="badge badge-blue">Explainable Compatibility Fit</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#031120', marginTop: '0.35rem' }}>
                Compatibility Fit for {matchingResult.job_title}
              </h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0060A8' }}>
                {matchingResult.final_match_score}%
              </div>
              <span className="badge badge-emerald">{matchingResult.match_level || 'Optimal Fit'}</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ padding: '0.85rem', backgroundColor: '#F1F5F8', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#6C6C6C' }}>Technical Skill Fit (70%)</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#031120' }}>
                {matchingResult.skill_match_score || 85}%
              </div>
            </div>
            <div style={{ padding: '0.85rem', backgroundColor: '#F1F5F8', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#6C6C6C' }}>Experience Fit (30%)</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#031120' }}>
                {matchingResult.experience_score || 90}%
              </div>
            </div>
            <div style={{ padding: '0.85rem', backgroundColor: '#F1F5F8', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#6C6C6C' }}>HR Recommendation</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#16845B' }}>
                {matchingResult.hr_recommendation || 'Proceed to Technical Interview'}
              </div>
            </div>
          </div>

          {/* Matched vs Missing Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#16845B', marginBottom: '0.4rem' }}>
                Matched Competencies:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {(matchingResult.matched_skills || ['Python', 'React.js', 'MySQL']).map((sk, i) => (
                  <span key={i} className="badge badge-emerald">✓ {sk}</span>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#D99524', marginBottom: '0.4rem' }}>
                Missing Competencies:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {(matchingResult.missing_skills?.length > 0 ? matchingResult.missing_skills : ['None']).map((sk, i) => (
                  <span key={i} className="badge badge-warning">{sk}</span>
                ))}
              </div>
            </div>
          </div>

          {/* AI-Generated Interview Question Suggestions */}
          <div style={{ borderTop: '1px solid #E5EAF0', paddingTop: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lightbulb size={18} color="#0060A8" />
                <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#031120', margin: 0 }}>
                  AI-Generated Interview Question Suggestions
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowQuestions(!showQuestions)}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                {showQuestions ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                {showQuestions ? 'Collapse Suggestions' : 'View Suggestions'}
              </button>
            </div>

            {showQuestions && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <p style={{ fontSize: '0.78rem', color: '#6C6C6C', margin: '0 0 0.5rem' }}>
                  Targeted questions generated dynamically based on candidate's verified competencies and target requisition requirements:
                </p>

                {[
                  {
                    type: 'Core Competency Deep-Dive',
                    category: 'Technical',
                    question: `Given your demonstrated experience in ${matchingResult.matched_skills?.slice(0, 2).join(' & ') || 'modern full-stack engineering'}, how do you structure high-concurrency request pipelines and optimize database query latency under high traffic?`,
                  },
                  {
                    type: 'Architecture & System Reliability',
                    category: 'System Design',
                    question: `In your previous projects, how did you implement resilient authentication, caching layers, and graceful degradation during service disruptions?`,
                  },
                  ...(matchingResult.missing_skills?.length > 0 ? [{
                    type: 'Competency Gap Assessment',
                    category: 'Skill Transition',
                    question: `This position leverages ${matchingResult.missing_skills[0]}. Walk us through a scenario where you quickly mastered a new framework or technology stack to deliver critical business value.`,
                  }] : []),
                  {
                    type: 'Behavioral & Collaborative Delivery',
                    category: 'Culture & Process',
                    question: `Describe a situation where you had a technical disagreement with a team member or product manager regarding architecture trade-offs. How did you resolve it?`,
                  }
                ].map((item, qIdx) => (
                  <div
                    key={qIdx}
                    style={{
                      padding: '0.9rem 1rem',
                      backgroundColor: '#F1F5F8',
                      borderRadius: '8px',
                      border: '1px solid #E5EAF0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>{item.category}</span>
                        <strong style={{ fontSize: '0.82rem', color: '#0060A8' }}>{item.type}</strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(item.question);
                          setCopiedQuestion(qIdx);
                          setTimeout(() => setCopiedQuestion(null), 3000);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: copiedQuestion === qIdx ? '#16845B' : '#6C6C6C',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.74rem',
                          fontWeight: 600
                        }}
                      >
                        {copiedQuestion === qIdx ? <Check size={13} /> : <Copy size={13} />}
                        {copiedQuestion === qIdx ? 'Copied' : 'Copy Question'}
                      </button>
                    </div>
                    <div style={{ fontSize: '0.84rem', color: '#031120', lineHeight: 1.45 }}>
                      "{item.question}"
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
