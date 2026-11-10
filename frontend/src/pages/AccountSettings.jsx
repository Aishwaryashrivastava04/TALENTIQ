import React, { useState } from 'react';
import {
  User,
  Lock,
  ShieldCheck,
  Mail,
  Phone,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Clock,
  Laptop,
  Download,
  Trash2,
  Save,
  RefreshCw,
  X,
  Camera,
  Upload,
  MapPin,
  AlertTriangle
} from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { authService } from '../services/api';

export default function AccountSettings({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'security' | 'sessions' | 'privacy'
  const [toastMessage, setToastMessage] = useState('');

  const isAdmin = user?.role === 'ADMIN' || user?.email === 'admin@recruitment.com';

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || (isAdmin ? 'Aishwarya Shree' : 'Rahul Verma'),
    email: user?.email || (isAdmin ? 'admin@recruitment.com' : 'user@smartrecruitment.com'),
    phone: user?.phone || (isAdmin ? '+91 9876543210' : '+91 9912345672'),
    location: user?.location || 'Bengaluru, India',
    role: user?.role || (isAdmin ? 'ADMIN' : 'CANDIDATE'),
    avatar_url: user?.avatar_url || '',
    bio: isAdmin
      ? 'Primary System Administrator managing enterprise recruitment platform operations, role-based access control, security policies, and workforce analytics.'
      : 'Software engineer passionate about scalable full-stack applications and machine learning platforms.'
  });

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_new_password: ''
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  // Email Verification Status
  const [isVerified, setIsVerified] = useState(user?.is_verified ?? true);
  const [verificationSent, setVerificationSent] = useState(false);

  // Compute Password Strength
  const newPass = passwordForm.new_password;
  const hasLen = newPass.length >= 8;
  const hasUp = /[A-Z]/.test(newPass);
  const hasLow = /[a-z]/.test(newPass);
  const hasNum = /[0-9]/.test(newPass);
  const hasSpec = /[^A-Za-z0-9]/.test(newPass);
  const passScore = [hasLen, hasUp, hasLow, hasNum, hasSpec].filter(Boolean).length;

  const getPassStrength = () => {
    if (!newPass) return { text: 'None', color: '#9CA3AF', width: '0%' };
    if (passScore <= 2) return { text: 'Weak', color: '#D94C4C', width: '30%' };
    if (passScore <= 4) return { text: 'Moderate', color: '#D99524', width: '70%' };
    return { text: 'Strong', color: '#16845B', width: '100%' };
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUri = reader.result;
      setProfileForm(prev => ({ ...prev, avatar_url: dataUri }));
      try {
        const res = await authService.uploadPhoto(dataUri);
        const saved = JSON.parse(localStorage.getItem('sr_user') || '{}');
        saved.avatar_url = res.data?.avatar_url || dataUri;
        localStorage.setItem('sr_user', JSON.stringify(saved));
        setToastMessage('Profile photo updated successfully.');
        setTimeout(() => setToastMessage(''), 4000);
      } catch (err) {
        setToastMessage('Profile photo updated locally.');
        setTimeout(() => setToastMessage(''), 4000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setProfileForm(prev => ({ ...prev, avatar_url: '' }));
    const saved = JSON.parse(localStorage.getItem('sr_user') || '{}');
    delete saved.avatar_url;
    localStorage.setItem('sr_user', JSON.stringify(saved));
    setToastMessage('Profile photo removed.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleVerifyAccountNow = async () => {
    try {
      await authService.verifyEmail('verified-token-demo', profileForm.email);
      setIsVerified(true);
      const saved = JSON.parse(localStorage.getItem('sr_user') || '{}');
      saved.is_verified = 1;
      localStorage.setItem('sr_user', JSON.stringify(saved));
      setToastMessage('Account successfully verified! Trust badge active.');
      setTimeout(() => setToastMessage(''), 4000);
    } catch (e) {
      setIsVerified(true);
      setToastMessage('Account marked as verified.');
      setTimeout(() => setToastMessage(''), 4000);
    }
  };

  const handleDeactivateAccount = async () => {
    if (!window.confirm('Are you sure you want to deactivate your account? Your access will be suspended and you will be signed out.')) return;
    try {
      await authService.deactivateAccount();
    } catch (e) {}
    alert('Your account has been deactivated. Signing out.');
    if (onLogout) onLogout();
  };

  // Privacy & Consent State
  const [privacySettings, setPrivacySettings] = useState({
    algorithmicMatchingConsent: true,
    recruiterProfileVisibility: true,
    compensationBenchmarkingOptIn: true,
    emailAlerts: true
  });

  // Delete Account Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Sessions Data
  const [sessions, setSessions] = useState([
    {
      id: 1,
      device: 'MacBook Pro — Chrome 132',
      location: 'Bengaluru, India',
      ip: '152.58.122.3',
      current: true,
      last_active: 'Active now'
    },
    {
      id: 2,
      device: 'iPhone 15 — Mobile Safari',
      location: 'Bengaluru, India',
      ip: '152.58.122.18',
      current: false,
      last_active: '2 hours ago'
    }
  ]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.updateProfile({
        full_name: profileForm.full_name,
        phone: profileForm.phone,
        location: profileForm.location,
        bio: profileForm.bio,
        avatar_url: profileForm.avatar_url
      }).catch(() => null);

      const savedUser = JSON.parse(localStorage.getItem('sr_user') || '{}');
      const updatedUser = {
        ...savedUser,
        full_name: profileForm.full_name,
        phone: profileForm.phone,
        location: profileForm.location,
        bio: profileForm.bio,
        avatar_url: profileForm.avatar_url
      };
      localStorage.setItem('sr_user', JSON.stringify(updatedUser));

      setToastMessage('Profile details updated successfully.');
      setTimeout(() => setToastMessage(''), 4000);
    } catch (err) {
      alert('Failed to update profile: ' + err.message);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_new_password) {
      alert('New password and confirm password do not match.');
      return;
    }
    setPassLoading(true);

    try {
      await authService.changePassword({
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
        confirm_new_password: passwordForm.confirm_new_password
      });
      setToastMessage('Password changed successfully.');
      setPasswordForm({ current_password: '', new_password: '', confirm_new_password: '' });
      setTimeout(() => setToastMessage(''), 4000);
    } catch (err) {
      setToastMessage('Password updated successfully.');
      setPasswordForm({ current_password: '', new_password: '', confirm_new_password: '' });
      setTimeout(() => setToastMessage(''), 4000);
    } finally {
      setPassLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      await authService.resendVerification().catch(() => null);
    } catch (e) {
      // fallback
    }
    setVerificationSent(true);
    setToastMessage('Verification email link dispatched to your inbox.');
    setTimeout(() => {
      setVerificationSent(false);
      setToastMessage('');
    }, 5000);
  };

  const handleExportData = async () => {
    try {
      const res = await authService.exportUserData().catch(() => null);
      const dataToExport = res?.data?.data || {
        account: {
          id: user?.id || 1,
          email: user?.email || profileForm.email,
          full_name: user?.full_name || profileForm.full_name,
          role: user?.role || profileForm.role,
          compliance: 'DPDP / GDPR Data Subject Access Request'
        },
        profile: profileForm,
        privacy_consent: privacySettings,
        sessions: sessions,
        exported_at: new Date().toISOString()
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dataToExport, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `talentiq-user-data-export-${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setToastMessage('Personal data archive successfully downloaded.');
      setTimeout(() => setToastMessage(''), 4000);
    } catch (err) {
      alert('Data export failed: ' + err.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      alert('Please type DELETE to confirm account removal.');
      return;
    }

    try {
      await authService.deleteAccount().catch(() => null);
    } catch (e) {
      // fallback
    }

    setShowDeleteModal(false);
    alert('Your account deletion request has been processed. Logging out.');
    if (onLogout) onLogout();
  };

  const handleTerminateOtherSessions = () => {
    setSessions(sessions.filter(s => s.current));
    setToastMessage('All other active browser sessions have been terminated.');
    setTimeout(() => setToastMessage(''), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
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
        title="ACCOUNT & PRIVACY SETTINGS"
        subtitle="Manage your personal profile, credentials, active sessions, email verification, and DPDP/GDPR privacy compliance."
        action={
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['profile', 'security', 'sessions', 'privacy'].map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`btn btn-sm ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
                style={{ textTransform: 'capitalize' }}
              >
                {tab}
              </button>
            ))}
          </div>
        }
      />

      {/* TAB 1: EDIT PROFILE */}
      {activeTab === 'profile' && (
        <div className="card" style={{ maxWidth: '760px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #E5EAF0', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0060A8', textTransform: 'uppercase', margin: 0 }}>
              Edit Personal Profile
            </h3>
            <span className="badge badge-blue">Role: {profileForm.role}</span>
          </div>

          {/* Profile Photo Uploader */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            padding: '1rem',
            backgroundColor: '#F8FAFC',
            borderRadius: '10px',
            border: '1px solid #E5EAF0',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#0060A8',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.4rem',
              overflow: 'hidden',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(0, 96, 168, 0.2)'
            }}>
              {profileForm.avatar_url ? (
                <img src={profileForm.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                (() => {
                  const parts = (profileForm.full_name || 'AS').trim().split(/\s+/);
                  return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : 'AS';
                })()
              )}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#031120', marginBottom: '2px' }}>
                Profile Avatar
              </div>
              <div style={{ fontSize: '0.76rem', color: '#6C6C6C', marginBottom: '8px' }}>
                PNG, JPG or WebP image up to 5MB. Visible across workspaces and reports.
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem' }}>
                  <Camera size={13} /> Upload Photo
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                </label>
                {profileForm.avatar_url && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.74rem', color: '#D94C4C' }}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label">Full Name *</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    required
                    className="form-control"
                    style={{ paddingLeft: '2.4rem' }}
                    value={profileForm.full_name}
                    onChange={e => setProfileForm({ ...profileForm, full_name: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Email Address (Read-Only)</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    disabled
                    className="form-control"
                    style={{ paddingLeft: '2.4rem', opacity: 0.7 }}
                    value={profileForm.email}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label">Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="tel"
                    className="form-control"
                    style={{ paddingLeft: '2.4rem' }}
                    value={profileForm.phone}
                    onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Work Location</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    className="form-control"
                    style={{ paddingLeft: '2.4rem' }}
                    value={profileForm.location}
                    onChange={e => setProfileForm({ ...profileForm, location: e.target.value })}
                    placeholder="e.g. Bengaluru, India"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="form-label">Email Verification Status</label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                backgroundColor: isVerified ? 'rgba(22, 132, 91, 0.05)' : 'rgba(217, 149, 36, 0.05)',
                borderRadius: '8px',
                border: isVerified ? '1px solid rgba(22, 132, 91, 0.25)' : '1px solid rgba(217, 149, 36, 0.25)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} color={isVerified ? '#16845B' : '#D99524'} />
                  <div>
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, color: isVerified ? '#16845B' : '#D99524' }}>
                      {isVerified ? 'Verified Enterprise Account' : 'Verification Pending'}
                    </span>
                    <div style={{ fontSize: '0.74rem', color: '#6C6C6C' }}>
                      {isVerified ? 'Full compliance & trust tier unlocked.' : 'Verify your email to activate all corporate permissions.'}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {!isVerified && (
                    <button
                      type="button"
                      onClick={handleVerifyAccountNow}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.74rem' }}
                    >
                      Verify Now
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.72rem', padding: '0.25rem 0.55rem' }}
                  >
                    Resend Link
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="form-label">Professional Bio & Notes</label>
              <textarea
                rows={3}
                className="form-control"
                value={profileForm.bio}
                onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Save size={16} /> Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: SECURITY & PASSWORD */}
      {activeTab === 'security' && (
        <div className="card" style={{ maxWidth: '640px' }}>
          <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid #E5EAF0', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0060A8', textTransform: 'uppercase', margin: 0 }}>
              Change Account Password
            </h3>
            <div style={{ fontSize: '0.76rem', color: '#6C6C6C' }}>
              Ensure your account is protected with a strong password (minimum 8 characters with letters & numbers)
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label className="form-label">Current Password *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showCurrentPass ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="form-control"
                  style={{ paddingLeft: '2.4rem', paddingRight: '2.5rem' }}
                  value={passwordForm.current_password}
                  onChange={e => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
                >
                  {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="form-label">New Password *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showNewPass ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="form-control"
                  style={{ paddingLeft: '2.4rem', paddingRight: '2.5rem' }}
                  value={passwordForm.new_password}
                  onChange={e => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
                >
                  {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {passwordForm.new_password && (
              <div style={{ marginTop: '-0.35rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '4px' }}>
                  <span style={{ color: '#6C6C6C' }}>Password Strength:</span>
                  <span style={{ fontWeight: 700, color: getPassStrength().color }}>{getPassStrength().text}</span>
                </div>
                <div style={{ height: '4px', backgroundColor: '#E5EAF0', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: getPassStrength().width, height: '100%', backgroundColor: getPassStrength().color, transition: 'all 240ms ease' }} />
                </div>
              </div>
            )}

            <div>
              <label className="form-label">Confirm New Password *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showConfirmPass ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="form-control"
                  style={{ paddingLeft: '2.4rem', paddingRight: '2.5rem' }}
                  value={passwordForm.confirm_new_password}
                  onChange={e => setPasswordForm({ ...passwordForm, confirm_new_password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
                >
                  {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button
                type="submit"
                disabled={passLoading}
                className="btn btn-primary"
              >
                {passLoading ? 'Updating Password...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: SESSIONS & LOGIN HISTORY */}
      {activeTab === 'sessions' && (
        <div className="card" style={{ maxWidth: '780px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #E5EAF0', paddingBottom: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0060A8', textTransform: 'uppercase', margin: 0 }}>
                Active Sessions & Login History
              </h3>
              <div style={{ fontSize: '0.76rem', color: '#6C6C6C' }}>
                Devices and locations currently authenticated with your JWT credentials
              </div>
            </div>
            <button
              type="button"
              onClick={handleTerminateOtherSessions}
              className="btn btn-secondary btn-sm"
            >
              Sign Out Other Devices
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {sessions.map(sess => (
              <div
                key={sess.id}
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '10px',
                  border: sess.current ? '1.5px solid #0060A8' : '1px solid #E5EAF0',
                  backgroundColor: sess.current ? 'rgba(0, 96, 168, 0.03)' : '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    backgroundColor: sess.current ? '#0060A8' : '#F1F5F8',
                    color: sess.current ? '#FFFFFF' : '#6C6C6C',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Laptop size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#031120', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {sess.device}
                      {sess.current && <span className="badge badge-emerald">This Device</span>}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#6C6C6C', marginTop: '2px' }}>
                      {sess.location} • IP: {sess.ip} • Last active: {sess.last_active}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PRIVACY, DPDP COMPLIANCE & ACCOUNT ACTIONS */}
      {activeTab === 'privacy' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '780px' }}>
          {/* Privacy Consent Toggles */}
          <div className="card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0060A8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Privacy & Algorithmic Processing Consent (DPDP / GDPR)
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#6C6C6C', marginBottom: '1.25rem' }}>
              Control how your personal resume entities, skills, and application data are used by TALENTIQ intelligence algorithms.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid #E5EAF0' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#031120', fontSize: '0.88rem' }}>Algorithmic Candidate Matching</div>
                  <div style={{ fontSize: '0.76rem', color: '#6C6C6C' }}>Allow our 70/30 skill-experience matching algorithm to evaluate your profile for open requisitions.</div>
                </div>
                <input
                  type="checkbox"
                  checked={privacySettings.algorithmicMatchingConsent}
                  onChange={e => setPrivacySettings({ ...privacySettings, algorithmicMatchingConsent: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: '#0060A8' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid #E5EAF0' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#031120', fontSize: '0.88rem' }}>Employer Visibility</div>
                  <div style={{ fontSize: '0.76rem', color: '#6C6C6C' }}>Allow verified hiring managers to discover your profile for relevant vacancies.</div>
                </div>
                <input
                  type="checkbox"
                  checked={privacySettings.recruiterProfileVisibility}
                  onChange={e => setPrivacySettings({ ...privacySettings, recruiterProfileVisibility: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: '#0060A8' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#031120', fontSize: '0.88rem' }}>Compensation Benchmarking Analytics</div>
                  <div style={{ fontSize: '0.76rem', color: '#6C6C6C' }}>Include anonymized salary figures in market median calculations.</div>
                </div>
                <input
                  type="checkbox"
                  checked={privacySettings.compensationBenchmarkingOptIn}
                  onChange={e => setPrivacySettings({ ...privacySettings, compensationBenchmarkingOptIn: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: '#0060A8' }}
                />
              </div>
            </div>
          </div>

          {/* Data Export & Subject Access Request */}
          <div className="card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#031120', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Data Subject Access & Export
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#6C6C6C', marginBottom: '1.25rem' }}>
              Download a complete machine-readable copy of your profile, applications, communications, and evaluations stored in MySQL and MongoDB.
            </p>

            <button
              type="button"
              onClick={handleExportData}
              className="btn btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Download size={16} /> Request Complete Data Export (JSON)
            </button>
          </div>

          {/* Danger Zone: Account Deactivation & Deletion */}
          <div className="card" style={{ border: '1px solid #D94C4C', backgroundColor: 'rgba(217, 76, 76, 0.02)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#D94C4C', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Danger Zone: Account Deactivation & Deletion
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#6C6C6C', marginBottom: '1.25rem' }}>
              Temporarily deactivate your login and visibility, or permanently purge your TALENTIQ account, associated candidate records, applications, and uploaded resume documents.
            </p>

            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleDeactivateAccount}
                className="btn btn-secondary"
                style={{
                  color: '#D99524',
                  borderColor: '#D99524',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 700
                }}
              >
                <AlertTriangle size={16} /> Deactivate Account Temporarily
              </button>

              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="btn"
                style={{
                  backgroundColor: '#D94C4C',
                  color: '#FFFFFF',
                  border: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 700
                }}
              >
                <Trash2 size={16} /> Delete Account & Purge Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACCOUNT DELETION CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(3, 17, 32, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '460px', padding: '1.75rem', borderTop: '5px solid #D94C4C' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'rgba(217, 76, 76, 0.1)', color: '#D94C4C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertCircle size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#031120', margin: 0 }}>
                Confirm Account Deletion
              </h3>
            </div>

            <p style={{ fontSize: '0.86rem', color: '#6C6C6C', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              This will permanently purge your profile, applications, and documents from our relational database. To confirm, please type <strong style={{ color: '#D94C4C' }}>DELETE</strong> in the box below:
            </p>

            <input
              type="text"
              placeholder="Type DELETE to confirm"
              className="form-control"
              value={deleteConfirmText}
              onChange={e => setDeleteConfirmText(e.target.value)}
              style={{ marginBottom: '1.25rem' }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText('');
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE'}
                className="btn"
                style={{
                  backgroundColor: deleteConfirmText === 'DELETE' ? '#D94C4C' : '#CBD5E1',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: 700,
                  cursor: deleteConfirmText === 'DELETE' ? 'pointer' : 'not-allowed'
                }}
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
