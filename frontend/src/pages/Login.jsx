import React, { useState } from 'react';
import {
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  Building,
  Users,
  TrendingUp,
  Award,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { authService } from '../services/api';

export default function Login({ onLoginSuccess, onNavigateRegister, onNavigateForgotPassword, onNavigateHome }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    const cleanEmail = (email || '').trim();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail) {
      setError('Please enter your corporate or candidate email address.');
      return;
    }
    if (!cleanPassword) {
      setError('Please enter your account password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await authService.login({
        email: cleanEmail,
        password: cleanPassword,
        remember_me: rememberMe,
      });

      if (res.data && res.data.token && res.data.user) {
        localStorage.setItem('sr_token', res.data.token);
        localStorage.setItem('sr_user', JSON.stringify(res.data.user));
        onLoginSuccess(res.data.user);
        return;
      } else {
        throw new Error(res.data?.message || 'Authentication credentials not recognized.');
      }
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.message;
      setError(serverMsg || 'Invalid email or password. Please verify your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: '#F1F5F8',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* LEFT COLUMN: Institutional Blue Corporate Identity */}
      <div style={{
        flex: '1 1 48%',
        backgroundColor: '#0060A8',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '4rem 4.5rem',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle Institutional Architectural Lines */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '1px',
          backgroundColor: 'rgba(255, 255, 255, 0.12)'
        }} />

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

        {/* Core Hero Message */}
        <div style={{ maxWidth: '540px', margin: 'auto 0' }}>
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
            <ShieldCheck size={14} /> Enterprise HR SaaS Platform
          </div>

          <h1 style={{
            fontSize: '2.8rem',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            color: '#FFFFFF',
            marginBottom: '1.25rem'
          }}>
            BUILD BETTER TEAMS WITH DATA.
          </h1>

          <div style={{
            width: '48px',
            height: '4px',
            backgroundColor: '#1473E6',
            marginBottom: '1.5rem',
            borderRadius: '2px'
          }} />

          <p style={{
            fontSize: '1.05rem',
            lineHeight: 1.6,
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '2.5rem',
            fontWeight: 400
          }}>
            Empowering modern HR organizations and job seekers with transparent candidate matching, predictive salary benchmarking, and automated recruitment workflows.
          </p>

          {/* Institutional Capability Highlights (Realistic, non-exaggerated) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.25rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} color="#60A5FA" /> Smart Match
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.75)', marginTop: '4px', lineHeight: 1.4 }}>
                Explainable 70/30 skill and tenure scoring
              </div>
            </div>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <TrendingUp size={16} color="#4ADE80" /> Compensation
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.75)', marginTop: '4px', lineHeight: 1.4 }}>
                Fair market benchmarks with confidence intervals
              </div>
            </div>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} color="#FBBF24" /> Secure Vault
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.75)', marginTop: '4px', lineHeight: 1.4 }}>
                Data protection compliant with DPDP & GDPR
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.65)' }}>
          © 2026 TALENTIQ Technologies Inc. All rights reserved. Corporate Recruitment Platform.
        </div>
      </div>

      {/* RIGHT COLUMN: Clean White Corporate Login Surface */}
      <div style={{
        flex: '1 1 52%',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 4rem'
      }}>
        <div style={{ maxWidth: '440px', width: '100%' }}>
          {/* Back to Home Link */}
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
                marginBottom: '1.5rem',
                padding: 0
              }}
            >
              ← Back to Public Website
            </button>
          )}

          {/* Welcome Heading */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#0060A8',
              letterSpacing: '-0.025em',
              margin: 0
            }}>
              SIGN IN TO TALENTIQ
            </h2>
            <div style={{
              width: '48px',
              height: '4px',
              backgroundColor: '#1473E6',
              marginTop: '4px',
              borderRadius: '2px',
              marginBottom: '0.75rem'
            }} />
            <p style={{ fontSize: '0.9rem', color: '#6C6C6C', margin: 0 }}>
              Access corporate recruitment workflows, talent intelligence, and candidate pipelines.
            </p>
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

          {/* Form */}
          <form noValidate onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  placeholder="Enter your registered email address"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                <label className="form-label" style={{ margin: 0 }}>Password</label>
                <button
                  type="button"
                  onClick={onNavigateForgotPassword}
                  className="link-institutional"
                  style={{ background: 'none', border: 'none', fontSize: '0.78rem', fontWeight: 600, padding: 0 }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  placeholder="Enter your password"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#9CA3AF',
                    cursor: 'pointer'
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: '#0060A8', cursor: 'pointer', width: '16px', height: '16px' }}
              />
              <label htmlFor="remember" style={{ fontSize: '0.82rem', color: '#6C6C6C', cursor: 'pointer', userSelect: 'none' }}>
                Keep me signed in on this workstation
              </label>
            </div>

            {/* Submit Pill Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                height: '46px',
                fontSize: '0.92rem',
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#FFFFFF', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                  Authenticating...
                </>
              ) : (
                <>Sign In to Workspace <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Registration Link */}
          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.86rem', color: '#6C6C6C', borderTop: '1px solid #E5EAF0', paddingTop: '1.5rem' }}>
            New to TALENTIQ?{' '}
            <button
              onClick={() => onNavigateRegister && onNavigateRegister('HR_MANAGER')}
              className="link-institutional"
              style={{ background: 'none', border: 'none', fontWeight: 700, padding: 0 }}
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
