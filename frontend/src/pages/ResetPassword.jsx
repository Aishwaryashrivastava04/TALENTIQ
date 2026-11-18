import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { authService } from '../services/api';

export default function ResetPassword({ token: initialToken, onNavigateLogin, onNavigateHome }) {
  const [token, setToken] = useState(initialToken || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    if (urlToken) {
      setToken(urlToken);
    }
  }, []);

  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const strengthScore = [hasLength, hasUpper, hasLower, hasDigit, hasSpecial].filter(Boolean).length;

  const getStrengthLabel = () => {
    if (strengthScore <= 2) return { text: 'Weak', color: '#D94C4C', width: '30%' };
    if (strengthScore <= 4) return { text: 'Moderate', color: '#D99524', width: '70%' };
    return { text: 'Strong', color: '#16845B', width: '100%' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!token.trim()) {
      setError('A valid reset token is required. Please re-open the link from your email.');
      return;
    }

    if (password !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    if (strengthScore < 4) {
      setError('Password must be at least 8 characters long and contain uppercase, lowercase, a digit, and a special character.');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({
        token: token.trim(),
        password,
        confirm_password: confirmPassword,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed. The token may be expired or already used.');
    } finally {
      setLoading(false);
    }
  };

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
        maxWidth: '460px',
        width: '100%',
        padding: '2.5rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}>
        {onNavigateHome && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onNavigateHome();
            }}
            className="auth-back-btn"
            style={{ marginBottom: '1.25rem', padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
          >
            <ArrowLeft size={14} /> Back to Public Website
          </button>
        )}

        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.75rem' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            backgroundColor: '#0060A8',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            TQ
          </div>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#031120' }}>
            TALENT<span style={{ color: '#0060A8' }}>IQ</span>
          </span>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{
            fontSize: '22px',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: '#0060A8',
            letterSpacing: '-0.025em',
            margin: 0
          }}>
            SET NEW PASSWORD
          </h2>
          <div style={{
            width: '48px',
            height: '4px',
            backgroundColor: '#1473E6',
            marginTop: '4px',
            borderRadius: '2px',
            marginBottom: '0.65rem'
          }} />
          <p style={{ fontSize: '0.86rem', color: '#6C6C6C', margin: 0 }}>
            Create a robust password to secure your institutional recruitment account.
          </p>
        </div>

        {success ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{
              padding: '1.25rem',
              borderRadius: '10px',
              backgroundColor: 'rgba(22, 132, 91, 0.08)',
              border: '1px solid rgba(22, 132, 91, 0.25)',
              display: 'flex',
              gap: '0.75rem'
            }}>
              <CheckCircle2 size={20} color="#16845B" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 700, color: '#16845B', fontSize: '0.9rem' }}>Password Successfully Updated</div>
                <div style={{ fontSize: '0.82rem', color: '#031120', marginTop: '0.25rem' }}>
                  Your new password has been hashed with bcrypt and updated in MySQL. You can now sign in.
                </div>
              </div>
            </div>

            <button
              onClick={onNavigateLogin}
              className="btn btn-primary"
              style={{ width: '100%', height: '46px' }}
            >
              Sign In to TALENTIQ
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {error && (
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(217, 76, 76, 0.08)',
                border: '1px solid rgba(217, 76, 76, 0.25)',
                color: '#D94C4C',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="form-label">Reset Token</label>
              <input
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste the reset token"
                className="form-control"
              />
            </div>

            <div>
              <label className="form-label">New Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 chars with upper, digit, symbol"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.4rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div>
              <label className="form-label">Confirm New Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.4rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
                >
                  {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {password && (
              <div style={{ padding: '0.65rem 0.85rem', backgroundColor: '#F1F5F8', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '0.3rem' }}>
                  <span style={{ color: '#6C6C6C' }}>Password Complexity:</span>
                  <span style={{ fontWeight: 700, color: getStrengthLabel().color }}>{getStrengthLabel().text}</span>
                </div>
                <div style={{ height: '4px', backgroundColor: '#E5EAF0', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: getStrengthLabel().width, backgroundColor: getStrengthLabel().color, transition: 'width 250ms ease' }} />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', height: '46px', marginTop: '0.5rem' }}
            >
              {loading ? 'Updating Password...' : 'Save New Password'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={onNavigateLogin}
                className="link-institutional"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: 'none',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  padding: 0
                }}
              >
                <ArrowLeft size={14} /> Back to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
