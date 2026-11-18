import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { authService } from '../services/api';

export default function ForgotPassword({ onNavigateLogin, onNavigateResetWithToken, onNavigateHome }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [debugLink, setDebugLink] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please provide your registered email address.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await authService.forgotPassword(email.trim());
      setSubmitted(true);
      setMessage(res.data?.message || 'Password reset link has been dispatched.');
      if (res.data?.debugTokenLink) {
        setDebugLink(res.data.debugTokenLink);
      }
      if (res.data?.previewUrl) {
        setPreviewUrl(res.data.previewUrl);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request reset. Please try again.');
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

        {/* Section Heading */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{
            fontSize: '22px',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: '#0060A8',
            letterSpacing: '-0.025em',
            margin: 0
          }}>
            RECOVER PASSWORD
          </h2>
          <div style={{
            width: '48px',
            height: '4px',
            backgroundColor: '#1473E6',
            marginTop: '4px',
            borderRadius: '2px',
            marginBottom: '0.65rem'
          }} />
          <p style={{ fontSize: '0.86rem', color: '#6C6C6C', margin: 0, lineHeight: 1.5 }}>
            Enter your registered corporate email to receive a cryptographically secure 15-minute reset token.
          </p>
        </div>

        {submitted ? (
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
                <div style={{ fontWeight: 700, color: '#16845B', fontSize: '0.9rem' }}>Instructions Dispatched</div>
                <div style={{ fontSize: '0.82rem', color: '#031120', marginTop: '0.25rem', lineHeight: 1.45 }}>
                  {message}
                </div>
              </div>
            </div>

            {/* Quick Demo Access Token Link */}
            {debugLink && (
              <div style={{
                padding: '0.85rem 1rem',
                backgroundColor: '#F1F5F8',
                borderRadius: '8px',
                border: '1px solid #E5EAF0'
              }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6C6C6C', textTransform: 'uppercase' }}>
                  Testing Direct Token Link:
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const tok = debugLink.split('token=')[1];
                    onNavigateResetWithToken(tok);
                  }}
                  className="link-institutional"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    marginTop: '0.35rem'
                  }}
                >
                  Open Reset Form with Generated Token <ExternalLink size={13} />
                </button>
              </div>
            )}

            <button
              onClick={onNavigateLogin}
              className="btn btn-secondary"
              style={{ width: '100%', height: '46px' }}
            >
              Return to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
              <label className="form-label">Registered Corporate Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', height: '46px', marginTop: '0.5rem' }}
            >
              {loading ? 'Dispatching Token...' : 'Send Reset Link'}
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
