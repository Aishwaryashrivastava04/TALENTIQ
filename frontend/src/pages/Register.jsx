import React, { useState } from 'react';
import {
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Building,
  Briefcase,
  GraduationCap,
  MapPin,
  Sparkles,
  Users,
  Check,
  FileText
} from 'lucide-react';
import { authService } from '../services/api';

export default function Register({ onRegisterSuccess, onNavigateLogin, onNavigateHome, initialRole = 'HR_MANAGER' }) {
  // Only HR_MANAGER or CANDIDATE. Public Admin registration is strictly prohibited.
  const [role, setRole] = useState(initialRole === 'CANDIDATE' ? 'CANDIDATE' : 'HR_MANAGER');

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
    // HR Manager fields
    company_name: '',
    job_title: '',
    // Candidate fields
    location: '',
    education_level: '',
    experience_years: '',
    skills: '',
    terms_accepted: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [registrationSuccessData, setRegistrationSuccessData] = useState(null);

  // Compute password strength metrics
  const password = formData.password;
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const strengthScore = [hasLength, hasUpper, hasLower, hasDigit, hasSpecial].filter(Boolean).length;

  const getStrengthLabel = () => {
    if (!password) return { text: 'None', color: '#9CA3AF', width: '0%' };
    if (strengthScore <= 2) return { text: 'Weak', color: '#D94C4C', width: '30%' };
    if (strengthScore <= 4) return { text: 'Moderate', color: '#D99524', width: '70%' };
    return { text: 'Strong', color: '#16845B', width: '100%' };
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = (formData.email || '').trim();
    const cleanName = (formData.full_name || '').trim();

    if (!cleanName) {
      setError('Please provide your full legal name.');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!formData.phone || formData.phone.trim().length < 8) {
      setError('Please provide a valid contact telephone number.');
      return;
    }
    if (!formData.password || formData.password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }
    if (formData.password !== formData.confirm_password) {
      setError('Password confirmation does not match.');
      return;
    }
    if (!formData.terms_accepted) {
      setError('You must accept the Terms of Service and Privacy Policy to register.');
      return;
    }

    const payload = {
      ...formData,
      full_name: cleanName,
      email: cleanEmail,
      phone: formData.phone.trim(),
      password: formData.password,
      role: role,
      experience_years: parseFloat(formData.experience_years) || 0.0,
      skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
      location: formData.location || 'Bengaluru',
      education_level: formData.education_level || 'MCA',
      company_name: role === 'HR_MANAGER' ? (formData.company_name || 'Enterprise Organization') : undefined,
      job_title: role === 'HR_MANAGER' ? (formData.job_title || 'Recruiter') : undefined,
    };

    setLoading(true);
    try {
      const res = await authService.register(payload);
      if (res.data && res.data.token && res.data.user) {
        localStorage.setItem('sr_token', res.data.token);
        localStorage.setItem('sr_user', JSON.stringify(res.data.user));
        setRegistrationSuccessData({
          user: res.data.user,
          email: cleanEmail,
          message: res.data.message || 'Account registered successfully.'
        });
        return;
      } else {
        throw new Error(res.data?.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.message;
      setError(serverMsg || 'Registration failed. Email may already be associated with an existing account.');
    } finally {
      setLoading(false);
    }
  };

  const strength = getStrengthLabel();

  // If registration was successful, display the verified onboarding state
  if (registrationSuccessData) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F1F5F8',
        padding: '2rem 1.5rem',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}>
        <div className="card" style={{
          maxWidth: '520px',
          width: '100%',
          padding: '3rem',
          textAlign: 'center',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(22, 132, 91, 0.1)',
            color: '#16845B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <CheckCircle2 size={36} />
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#031120', marginBottom: '0.5rem' }}>
            Account Created Successfully!
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#6C6C6C', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            Welcome to TALENTIQ, <strong>{registrationSuccessData.user.full_name}</strong>. A verification notice has been dispatched to <strong>{registrationSuccessData.email}</strong>.
          </p>

          <div style={{
            backgroundColor: '#F1F5F8',
            borderRadius: '10px',
            padding: '1.25rem',
            marginBottom: '2rem',
            textAlign: 'left',
            fontSize: '0.82rem',
            color: '#031120',
            border: '1px solid #E5EAF0'
          }}>
            <div style={{ fontWeight: 700, marginBottom: '0.4rem', color: '#0060A8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} /> Account Security Notice
            </div>
            <div>• Role Profile: <strong>{registrationSuccessData.user.role === 'CANDIDATE' ? 'Candidate Talent Profile' : 'HR Talent Acquisition Executive'}</strong></div>
            <div>• Verification Status: <span className="badge badge-emerald" style={{ marginLeft: '4px' }}>Active Session Provisioned</span></div>
            <div>• Data Protection: Protected under India DPDP Act and GDPR compliance standards.</div>
          </div>

          <button
            onClick={() => onRegisterSuccess(registrationSuccessData.user)}
            className="btn btn-primary"
            style={{ width: '100%', height: '48px', fontSize: '0.95rem' }}
          >
            Enter {registrationSuccessData.user.role === 'CANDIDATE' ? 'Candidate Workspace' : 'HR Dashboard'} <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: '#F1F5F8',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* LEFT COLUMN: Institutional Blue Corporate Identity */}
      <div style={{
        flex: '1 1 42%',
        backgroundColor: '#0060A8',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '3.5rem 4rem',
        color: '#FFFFFF',
        position: 'relative'
      }}>
        {/* Brand Header */}
        <div
          onClick={onNavigateHome}
          style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: onNavigateHome ? 'pointer' : 'default' }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: '#FFFFFF',
            color: '#0060A8',
            fontWeight: 800,
            fontSize: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}>
            TQ
          </div>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>
              TALENTIQ
            </div>
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.85, marginTop: '2px' }}>
              Enterprise Recruitment Platform
            </div>
          </div>
        </div>

        {/* Narrative Section */}
        <div style={{ maxWidth: '480px', margin: 'auto 0' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            fontSize: '0.78rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
            letterSpacing: '0.03em'
          }}>
            <ShieldCheck size={14} /> Account Registration
          </div>

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            color: '#FFFFFF',
            marginBottom: '1rem'
          }}>
            {role === 'CANDIDATE' ? 'Advance Your Tech Career' : 'Modernize Your Corporate Hiring'}
          </h1>

          <div style={{
            width: '48px',
            height: '4px',
            backgroundColor: '#1473E6',
            marginBottom: '1.5rem',
            borderRadius: '2px'
          }} />

          <p style={{
            fontSize: '1rem',
            lineHeight: 1.6,
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '2rem'
          }}>
            {role === 'CANDIDATE'
              ? 'Join thousands of technology professionals. Create professional resumes, discover verified job opportunities, and access transparent compensation insights.'
              : 'Empower your talent acquisition team with explainable candidate matching, automated resume screening, and predictive offer benchmarking.'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.9)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Check size={16} color="#60A5FA" /> Role-isolated secure environment
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Check size={16} color="#60A5FA" /> Automated resume parsing and matching
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Check size={16} color="#60A5FA" /> Data privacy compliant with DPDP standards
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.65)' }}>
          © 2026 TALENTIQ Technologies Inc. All rights reserved.
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Registration Form */}
      <div style={{
        flex: '1 1 58%',
        backgroundColor: '#FFFFFF',
        overflowY: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 4rem'
      }}>
        <div style={{ maxWidth: '540px', width: '100%' }}>
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              style={{
                background: 'none',
                border: 'none',
                color: '#0060A8',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                marginBottom: '1.25rem',
                padding: 0
              }}
            >
              ← Back to Public Website
            </button>
          )}

          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{
              fontSize: '22px',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#0060A8',
              letterSpacing: '-0.025em',
              margin: 0
            }}>
              CREATE TALENTIQ ACCOUNT
            </h2>
            <div style={{
              width: '48px',
              height: '4px',
              backgroundColor: '#1473E6',
              marginTop: '4px',
              borderRadius: '2px',
              marginBottom: '0.65rem'
            }} />
            <p style={{ fontSize: '0.88rem', color: '#6C6C6C', margin: 0 }}>
              Select your account type to configure your workspace.
            </p>
          </div>

          {/* Account Role Segmented Toggle (Candidate vs HR) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
            backgroundColor: '#F1F5F8',
            padding: '6px',
            borderRadius: '10px',
            border: '1px solid #E5EAF0',
            marginBottom: '1.75rem'
          }}>
            <button
              type="button"
              onClick={() => { setRole('HR_MANAGER'); setError(null); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.7rem 1rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: role === 'HR_MANAGER' ? '#0060A8' : 'transparent',
                color: role === 'HR_MANAGER' ? '#FFFFFF' : '#6C6C6C',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 160ms ease'
              }}
            >
              <Building size={16} /> HR / Employer Account
            </button>
            <button
              type="button"
              onClick={() => { setRole('CANDIDATE'); setError(null); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.7rem 1rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: role === 'CANDIDATE' ? '#0060A8' : 'transparent',
                color: role === 'CANDIDATE' ? '#FFFFFF' : '#6C6C6C',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 160ms ease'
              }}
            >
              <User size={16} /> Candidate Account
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div style={{
              padding: '0.85rem 1rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(217, 76, 76, 0.08)',
              border: '1px solid rgba(217, 76, 76, 0.25)',
              color: '#D94C4C',
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              marginBottom: '1.5rem',
              fontWeight: 500
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {/* Full Name */}
            <div>
              <label className="form-label">Full Legal Name *</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Enter your full legal name"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label">{role === 'HR_MANAGER' ? 'Corporate Email *' : 'Email Address *'}</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={role === 'HR_MANAGER' ? 'Enter corporate email (name@company.com)' : 'Enter your email address'}
                    className="form-control"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Phone Number *</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter phone number (e.g. +91 98765 43210)"
                    className="form-control"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Role-Specific Fields */}
            {role === 'HR_MANAGER' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Company Name *</label>
                  <div style={{ position: 'relative' }}>
                    <Building size={16} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      required
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      placeholder="e.g. CloudScale Tech"
                      className="form-control"
                      style={{ paddingLeft: '2.5rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Job Title *</label>
                  <div style={{ position: 'relative' }}>
                    <Briefcase size={16} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      required
                      value={formData.job_title}
                      onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                      placeholder="e.g. Lead Talent Specialist"
                      className="form-control"
                      style={{ paddingLeft: '2.5rem' }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label className="form-label">Location</label>
                    <select
                      className="form-control"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    >
                      <option value="">Select Location</option>
                      <option value="Bengaluru">Bengaluru</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Pune">Pune</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Delhi NCR">Delhi NCR</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Highest Degree</label>
                    <select
                      className="form-control"
                      value={formData.education_level}
                      onChange={(e) => setFormData({ ...formData, education_level: e.target.value })}
                    >
                      <option value="">Select Qualification</option>
                      <option value="MCA">MCA</option>
                      <option value="B.Tech">B.Tech</option>
                      <option value="M.Tech">M.Tech</option>
                      <option value="BCA">BCA</option>
                      <option value="B.Sc CS">B.Sc CS</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Experience (Years)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="30"
                      placeholder="e.g. 2.0"
                      className="form-control"
                      value={formData.experience_years}
                      onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Technical Skills (Comma-separated)</label>
                  <div style={{ position: 'relative' }}>
                    <Sparkles size={16} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      className="form-control"
                      style={{ paddingLeft: '2.5rem' }}
                      value={formData.skills}
                      onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                      placeholder="e.g. Python, React.js, Node.js, SQL, Machine Learning"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Password & Confirm Password */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label">Password * (Min 8 chars)</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter your password (min 8 characters)"
                    className="form-control"
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="form-label">Confirm Password *</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirm_password}
                    onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                    placeholder="Confirm your password"
                    className="form-control"
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <div style={{ marginTop: '-0.35rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '4px' }}>
                  <span style={{ color: '#6C6C6C' }}>Password Strength:</span>
                  <span style={{ fontWeight: 700, color: strength.color }}>{strength.text}</span>
                </div>
                <div style={{ height: '4px', backgroundColor: '#E5EAF0', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: strength.width, height: '100%', backgroundColor: strength.color, transition: 'all 240ms ease' }} />
                </div>
              </div>
            )}

            {/* Terms of Service & Privacy Policy Consent */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', marginTop: '0.5rem' }}>
              <input
                type="checkbox"
                id="terms"
                required
                checked={formData.terms_accepted}
                onChange={(e) => setFormData({ ...formData, terms_accepted: e.target.checked })}
                style={{ accentColor: '#0060A8', cursor: 'pointer', width: '16px', height: '16px', marginTop: '2px' }}
              />
              <label htmlFor="terms" style={{ fontSize: '0.8rem', color: '#6C6C6C', cursor: 'pointer', lineHeight: 1.45 }}>
                I agree to the <span style={{ color: '#0060A8', fontWeight: 600 }}>Terms of Service</span> and acknowledge the <span style={{ color: '#0060A8', fontWeight: 600 }}>Data Privacy Statement</span> under India DPDP Act and GDPR compliance standards.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                height: '46px',
                fontSize: '0.92rem',
                marginTop: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {loading ? 'Creating Secure Account...' : `Register as ${role === 'HR_MANAGER' ? 'Employer' : 'Candidate'}`}
            </button>
          </form>

          {/* Sign In Link */}
          <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.86rem', color: '#6C6C6C', borderTop: '1px solid #E5EAF0', paddingTop: '1.25rem' }}>
            Already have an account?{' '}
            <button
              onClick={onNavigateLogin}
              className="link-institutional"
              style={{ background: 'none', border: 'none', fontWeight: 700, padding: 0 }}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
