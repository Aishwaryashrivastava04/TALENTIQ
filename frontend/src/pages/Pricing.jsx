import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Zap,
  ArrowRight,
  CreditCard,
  Lock,
  RefreshCw,
  HelpCircle,
  FileCheck,
  Award,
  TrendingUp,
  X,
  AlertCircle
} from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { membershipService } from '../services/api';

export default function Pricing({ user, onNavigateToDashboard, onNavigateToRegister }) {
  const [billingCycle, setBillingCycle] = useState('MONTHLY'); // 'MONTHLY' | 'YEARLY'
  const [pricingData, setPricingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutModal, setCheckoutModal] = useState(null); // { plan, cycle, order, step: 'CHECKOUT' | 'SUCCESS' | 'ERROR' }
  const [processingPayment, setProcessingPayment] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successData, setSuccessData] = useState(null);

  // Load plans & dynamic pricing from backend
  useEffect(() => {
    async function loadPlans() {
      setLoading(true);
      try {
        const res = await membershipService.getPlans();
        if (res.data?.data) {
          setPricingData(res.data.data);
        }
      } catch (err) {
        console.warn('Fallback to local pricing:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPlans();
  }, []);

  const monthlyPrice = pricingData?.pricing_config?.monthly ?? 299;
  const yearlyPrice = pricingData?.pricing_config?.yearly ?? 1999;
  const yearlyMonthlyEquivalent = Math.round(yearlyPrice / 12);
  const savingsPercent = Math.round(((monthlyPrice * 12 - yearlyPrice) / (monthlyPrice * 12)) * 100);

  // Free Plan Features
  const freeFeatures = [
    { title: 'Job search across verified companies', available: true },
    { title: 'Standard job applications submission', available: true },
    { title: 'Basic application status tracking', available: true },
    { title: 'Candidate profile & dossier management', available: true },
    { title: 'Basic resume upload & parsing', available: true },
    { title: 'Standard job recommendations', available: true },
    { title: 'Basic salary benchmarks & percentiles', available: true },
    { title: 'Advanced AI resume review & ATS score', available: false },
    { title: 'Detailed resume improvement suggestions', available: false },
    { title: 'AI mock interview practice simulator', available: false },
    { title: 'Personalized interview coaching & STAR tips', available: false },
    { title: 'Personalized 90-day career roadmap', available: false },
    { title: 'Advanced skill gap analysis', available: false },
    { title: 'Application performance & recruiter view metrics', available: false },
    { title: 'Priority dedicated career support', available: false },
  ];

  // Premium Plan Features
  const premiumFeatures = [
    { title: 'Job search across verified companies', available: true },
    { title: 'Standard job applications submission', available: true },
    { title: 'Basic application status tracking', available: true },
    { title: 'Candidate profile & dossier management', available: true },
    { title: 'Basic resume upload & parsing', available: true },
    { title: 'Standard job recommendations', available: true },
    { title: 'Basic salary benchmarks & percentiles', available: true },
    { title: 'Advanced AI resume review & ATS score', available: true, highlight: true },
    { title: 'Detailed resume improvement suggestions & rewrites', available: true, highlight: true },
    { title: 'AI mock interview practice simulator', available: true, highlight: true },
    { title: 'Personalized interview coaching & STAR feedback', available: true, highlight: true },
    { title: 'Personalized 90-day career roadmap & milestones', available: true, highlight: true },
    { title: 'Advanced skill gap analysis vs. high-paying roles', available: true, highlight: true },
    { title: 'Application performance & recruiter view analytics', available: true, highlight: true },
    { title: 'Priority dedicated technical career support', available: true, highlight: true },
  ];

  // Initiate Order & Checkout
  const handleStartCheckout = async (planType) => {
    if (!user) {
      if (onNavigateToRegister) {
        onNavigateToRegister();
      } else {
        alert('Please create a free candidate account or log in to subscribe to TALENTIQ Premium.');
      }
      return;
    }

    setProcessingPayment(true);
    setErrorMessage('');

    try {
      const orderRes = await membershipService.createOrder({
        plan_code: billingCycle === 'YEARLY' ? 'PREMIUM_YEARLY' : 'PREMIUM_MONTHLY',
        billing_cycle: billingCycle
      });

      if (orderRes.data?.data) {
        setCheckoutModal({
          plan: billingCycle === 'YEARLY' ? 'PREMIUM_YEARLY' : 'PREMIUM_MONTHLY',
          cycle: billingCycle,
          order: orderRes.data.data,
          step: 'CHECKOUT'
        });
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message || 'Failed to initiate payment order.');
    } finally {
      setProcessingPayment(false);
    }
  };

  // Execute Simulated Test Payment (Razorpay Test Mode)
  const handleExecutePayment = async (forceFail = false) => {
    if (!checkoutModal?.order) return;
    setProcessingPayment(true);
    setErrorMessage('');

    try {
      const res = await membershipService.simulateTestPayment({
        plan_code: checkoutModal.plan,
        billing_cycle: checkoutModal.cycle,
        force_fail: forceFail
      });

      if (res.data?.success) {
        setSuccessData(res.data.data);
        setCheckoutModal(prev => ({ ...prev, step: 'SUCCESS' }));
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message || 'Payment simulation failed.');
    } finally {
      setProcessingPayment(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', maxWidth: '1200px', margin: '0 auto', paddingBottom: '3rem' }}>
      
      {/* 1. HERO HEADER WITH BADGE */}
      <div style={{ textAlign: 'center', padding: '1.5rem 1rem 0' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          borderRadius: '9999px',
          backgroundColor: 'rgba(0, 96, 168, 0.08)',
          border: '1px solid rgba(0, 96, 168, 0.25)',
          color: '#0060A8',
          fontSize: '0.8rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '1rem'
        }}>
          <Sparkles size={14} color="#0060A8" /> TALENTIQ PREMIUM – Career Growth Membership
        </div>

        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#031120', margin: '0 0 0.85rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          Accelerate Your Career with Intelligent Preparation
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#64748B', maxWidth: '680px', margin: '0 auto 2rem', lineHeight: 1.55 }}>
          Supercharge your interview readiness, optimize your resume for applicant tracking systems, and follow a personalized 90-day technical career roadmap.
        </p>

        {/* Billing Cycle Switcher */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          padding: '4px',
          borderRadius: '9999px',
          border: '1px solid #E5EAF0',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
          gap: '4px'
        }}>
          <button
            type="button"
            onClick={() => setBillingCycle('MONTHLY')}
            style={{
              padding: '0.55rem 1.4rem',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: billingCycle === 'MONTHLY' ? '#0060A8' : 'transparent',
              color: billingCycle === 'MONTHLY' ? '#FFFFFF' : '#64748B',
              fontSize: '0.86rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 160ms ease'
            }}
          >
            Monthly Billing
          </button>

          <button
            type="button"
            onClick={() => setBillingCycle('YEARLY')}
            style={{
              padding: '0.55rem 1.4rem',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: billingCycle === 'YEARLY' ? '#0060A8' : 'transparent',
              color: billingCycle === 'YEARLY' ? '#FFFFFF' : '#64748B',
              fontSize: '0.86rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 160ms ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem'
            }}
          >
            <span>Annual Billing</span>
            <span style={{
              fontSize: '0.72rem',
              backgroundColor: billingCycle === 'YEARLY' ? 'rgba(255, 255, 255, 0.25)' : '#16845B',
              color: '#FFFFFF',
              padding: '2px 8px',
              borderRadius: '9999px',
              fontWeight: 800
            }}>
              Save {savingsPercent}%
            </span>
          </button>
        </div>
      </div>

      {/* 2. SIDE-BY-SIDE PRICING CARDS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '2rem',
        alignItems: 'stretch'
      }}>
        
        {/* FREE PLAN CARD */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E5EAF0',
          padding: '2.25rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Standard Tier
            </div>
            <h3 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#031120', margin: '0.4rem 0 0.85rem' }}>
              Basic Career Explorer
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Essential recruitment tools for candidates actively browsing verified openings and tracking submitted applications.
            </p>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '1.75rem', paddingBottom: '1.5rem', borderBottom: '1px solid #E5EAF0' }}>
              <span style={{ fontSize: '2.8rem', fontWeight: 900, color: '#031120', letterSpacing: '-0.03em' }}>₹0</span>
              <span style={{ fontSize: '0.88rem', color: '#64748B', fontWeight: 600 }}>/ free forever</span>
            </div>

            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#031120', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '1rem' }}>
              Included Features:
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {freeFeatures.slice(0, 7).map((feat, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.86rem', color: '#334155' }}>
                  <CheckCircle2 size={16} color="#16845B" style={{ flexShrink: 0 }} />
                  <span>{feat.title}</span>
                </li>
              ))}
              {freeFeatures.slice(7, 11).map((feat, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.86rem', color: '#94A3B8' }}>
                  <XCircle size={16} color="#CBD5E1" style={{ flexShrink: 0 }} />
                  <span>{feat.title}</span>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #E5EAF0' }}>
            <button
              type="button"
              onClick={onNavigateToDashboard}
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontWeight: 700 }}
            >
              Continue with Free Plan
            </button>
            <div style={{ fontSize: '0.74rem', color: '#94A3B8', textAlign: 'center', marginTop: '0.65rem' }}>
              No credit card or payment commitment required.
            </div>
          </div>
        </div>

        {/* PREMIUM PLAN CARD */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          border: '2px solid #0060A8',
          padding: '2.25rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          boxShadow: '0 8px 30px rgba(0, 96, 168, 0.12)'
        }}>
          {/* Top Banner Ribbon */}
          <div style={{
            position: 'absolute',
            top: '-13px',
            right: '24px',
            backgroundColor: '#0060A8',
            color: '#FFFFFF',
            fontSize: '0.72rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            padding: '4px 14px',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            boxShadow: '0 2px 8px rgba(0, 96, 168, 0.35)'
          }}>
            <Sparkles size={12} /> MOST POPULAR CAREER TIER
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0060A8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Accelerated Career Tier
            </div>
            <h3 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#031120', margin: '0.4rem 0 0.85rem' }}>
              TALENTIQ Premium
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Full suite of intelligent career enablement tools: AI mock interview coaching, resume optimization, and tailored roadmaps.
            </p>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1.75rem', paddingBottom: '1.5rem', borderBottom: '1px solid #E5EAF0' }}>
              <span style={{ fontSize: '2.8rem', fontWeight: 900, color: '#0060A8', letterSpacing: '-0.03em' }}>
                ₹{billingCycle === 'YEARLY' ? yearlyPrice : monthlyPrice}
              </span>
              <span style={{ fontSize: '0.88rem', color: '#64748B', fontWeight: 600 }}>
                {billingCycle === 'YEARLY' ? `/ billed annually (₹${yearlyMonthlyEquivalent}/mo)` : '/ month'}
              </span>
            </div>

            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0060A8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Award size={14} color="#0060A8" /> Everything in Free, plus:
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {premiumFeatures.slice(7).map((feat, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.86rem', color: '#031120', fontWeight: 600 }}>
                  <CheckCircle2 size={16} color="#0060A8" style={{ flexShrink: 0 }} />
                  <span>{feat.title}</span>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #E5EAF0' }}>
            <button
              type="button"
              disabled={processingPayment}
              onClick={() => handleStartCheckout('PREMIUM')}
              className="btn btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '0.85rem',
                fontSize: '0.95rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(0, 96, 168, 0.3)'
              }}
            >
              {processingPayment ? (
                <>
                  <div style={{ width: '16px', height: '16px', border: '2px solid #FFFFFF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  Initializing Razorpay Gateway...
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Upgrade to TALENTIQ Premium
                </>
              )}
            </button>
            <div style={{ fontSize: '0.74rem', color: '#64748B', textAlign: 'center', marginTop: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
              <Lock size={12} color="#16845B" /> 256-Bit SSL Encryption • Cancel anytime
            </div>
          </div>
        </div>
      </div>

      {/* 3. FAIR RECRUITMENT POLICY BANNER */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E5EAF0',
        borderLeft: '5px solid #16845B',
        padding: '1.5rem 1.75rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1.25rem',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
      }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '10px',
          backgroundColor: 'rgba(22, 132, 91, 0.1)',
          color: '#16845B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <ShieldCheck size={24} />
        </div>
        <div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#031120', margin: '0 0 0.35rem' }}>
            TALENTIQ Fair Recruitment & Anti-Bias Standard
          </h4>
          <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.55, margin: 0 }}>
            TALENTIQ Premium is designed strictly for candidate self-enablement, skill growth, and interview preparation. 
            <strong> Premium membership does NOT artificially inflate match scores, guarantee shortlisting, or grant preferential ranking over other candidates.</strong> All employer hiring decisions remain 100% merit-based and evaluated by human HR professionals.
          </p>
        </div>
      </div>

      {/* 4. DETAILED FEATURE COMPARISON MATRIX */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5EAF0', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem 1.75rem', borderBottom: '1px solid #E5EAF0', backgroundColor: '#F8FAFC' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#031120', margin: '0 0 0.25rem' }}>
            Feature Comparison Matrix
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
            Compare capabilities across standard candidate accounts and Career Growth memberships.
          </p>
        </div>

        <div className="table-responsive">
          <table className="table-custom" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th style={{ width: '45%' }}>Platform Capability</th>
                <th style={{ textAlign: 'center', width: '25%' }}>Basic Free Plan</th>
                <th style={{ textAlign: 'center', width: '30%', color: '#0060A8' }}>TALENTIQ Premium</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: 'Job Search & Application Pipeline', free: 'Standard Access', prem: 'Standard Access' },
                { feature: 'Application Status Tracking', free: 'Basic Status', prem: 'Real-Time Insights' },
                { feature: 'Candidate Profile Dossier', free: 'Standard Dossier', prem: 'Verified Dossier' },
                { feature: 'Resume ATS Compatibility Review', free: 'Basic Parser', prem: 'Deep AI Audit + Keyword Density' },
                { feature: 'AI Resume Bullet Improvement Rewrites', free: '—', prem: 'Unlimited Scale-Metric Rewrites' },
                { feature: 'AI Mock Interview Simulator', free: '—', prem: 'Interactive Q&A + STAR Feedback' },
                { feature: 'Personalized 90-Day Career Roadmap', free: '—', prem: 'Tailored 3-Phase Acceleration Plan' },
                { feature: 'Advanced Skill Gap Analysis', free: 'Basic Counts', prem: 'Market Priority Skill Breakdown' },
                { feature: 'Application Performance Analytics', free: '—', prem: 'Recruiter Views & Fit Velocity' },
                { feature: 'Priority Technical Career Support', free: 'Community', prem: 'Priority Turnaround' },
              ].map((row, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600, color: '#031120', fontSize: '0.86rem' }}>{row.feature}</td>
                  <td style={{ textAlign: 'center', fontSize: '0.84rem', color: row.free === '—' ? '#94A3B8' : '#334155' }}>
                    {row.free === '—' ? <XCircle size={16} color="#CBD5E1" style={{ margin: '0 auto' }} /> : row.free}
                  </td>
                  <td style={{ textAlign: 'center', fontSize: '0.84rem', fontWeight: 700, color: '#0060A8' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <CheckCircle2 size={15} color="#0060A8" />
                      <span>{row.prem}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. FREQUENTLY ASKED QUESTIONS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#031120', margin: '0 0 0.4rem' }}>
            Frequently Asked Questions
          </h3>
          <p style={{ fontSize: '0.86rem', color: '#64748B', margin: 0 }}>
            Everything you need to know about TALENTIQ Premium subscriptions and billing.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem'
        }}>
          {[
            {
              q: 'Can I cancel my subscription anytime?',
              a: 'Yes. You can cancel auto-renewal anytime with one click in your Candidate Dashboard. Your benefits remain completely active until your billing period ends.'
            },
            {
              q: 'Does Premium guarantee an interview or offer?',
              a: 'No. In alignment with our Fair Recruitment Policy, TALENTIQ strictly prohibits artificial match inflation. Premium gives you world-class AI preparation tools so your qualifications stand out on merit.'
            },
            {
              q: 'What payment methods are supported?',
              a: 'We support all major Indian credit cards, debit cards, UPI (Google Pay, PhonePe, Paytm), and Netbanking processed securely through Razorpay.'
            },
            {
              q: 'Are official tax invoices provided?',
              a: 'Yes. An official GST-compliant tax invoice is automatically generated and permanently downloadable from your Payment History.'
            }
          ].map((item, idx) => (
            <div key={idx} style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              border: '1px solid #E5EAF0',
              padding: '1.25rem 1.5rem'
            }}>
              <h5 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#031120', margin: '0 0 0.45rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <HelpCircle size={15} color="#0060A8" /> {item.q}
              </h5>
              <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* CHECKOUT MODAL: RAZORPAY TEST-MODE GATEWAY SIMULATOR                 */}
      {/* ==================================================================== */}
      {checkoutModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '540px' }}>
            
            {/* Modal Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E5EAF0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#0060A8', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CreditCard size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#031120', margin: 0 }}>
                    {checkoutModal.step === 'SUCCESS' ? 'Subscription Confirmed!' : 'Secure Razorpay Checkout'}
                  </h3>
                  <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                    {checkoutModal.step === 'SUCCESS' ? 'Invoice Generated & Active' : 'Test Mode Gateway Sandbox'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setCheckoutModal(null)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body: STEP 1 - CHECKOUT */}
            {checkoutModal.step === 'CHECKOUT' && (
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* Order Summary Box */}
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '10px',
                  border: '1px solid #E5EAF0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#031120' }}>
                      TALENTIQ Premium ({checkoutModal.cycle === 'YEARLY' ? 'Annual Plan' : 'Monthly Plan'})
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '2px' }}>
                      Order Ref: <strong>{checkoutModal.order.order_id}</strong>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0060A8' }}>
                      ₹{checkoutModal.order.amount_inr}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>incl. taxes</div>
                  </div>
                </div>

                {/* Gateway Test Notice Banner */}
                <div style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(0, 96, 168, 0.05)',
                  border: '1px solid rgba(0, 96, 168, 0.15)',
                  fontSize: '0.78rem',
                  color: '#031120',
                  lineHeight: 1.45
                }}>
                  <strong>Razorpay Test Sandbox Active:</strong> This sandbox environment validates backend HMAC-SHA256 signatures, order idempotency, and immediate subscription activation without charging real credit cards.
                </div>

                {errorMessage && (
                  <div style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(217, 76, 76, 0.1)',
                    border: '1px solid #D94C4C',
                    color: '#D94C4C',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <AlertCircle size={16} />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Simulated Payment Execution Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button
                    type="button"
                    disabled={processingPayment}
                    onClick={() => handleExecutePayment(false)}
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      padding: '0.85rem',
                      fontWeight: 800,
                      fontSize: '0.92rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    {processingPayment ? (
                      <>
                        <div style={{ width: '15px', height: '15px', border: '2px solid #FFFFFF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                        Verifying Cryptographic Signature...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={16} /> Complete Verified Test Payment (₹{checkoutModal.order.amount_inr})
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={processingPayment}
                    onClick={() => handleExecutePayment(true)}
                    className="btn btn-secondary"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      padding: '0.65rem',
                      fontSize: '0.78rem',
                      color: '#D94C4C',
                      borderColor: '#FCA5A5'
                    }}
                  >
                    Test Negative Case: Simulate Failed Payment
                  </button>
                </div>
              </div>
            )}

            {/* Modal Body: STEP 2 - SUCCESS */}
            {checkoutModal.step === 'SUCCESS' && successData && (
              <div style={{ padding: '2rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(22, 132, 91, 0.1)',
                  color: '#16845B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CheckCircle2 size={32} />
                </div>

                <div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#031120', margin: '0 0 0.35rem' }}>
                    Welcome to TALENTIQ Premium!
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#64748B', maxWidth: '380px', margin: '0 auto', lineHeight: 1.5 }}>
                    Your cryptographic signature was verified and your Career Growth subscription is active through <strong>{new Date(successData.subscription.expires_at).toLocaleDateString()}</strong>.
                  </p>
                </div>

                <div style={{
                  width: '100%',
                  padding: '1rem',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '10px',
                  border: '1px solid #E5EAF0',
                  textAlign: 'left',
                  fontSize: '0.8rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem'
                }}>
                  <div><strong>Invoice Number:</strong> {successData.subscription.invoice_number}</div>
                  <div><strong>Plan Tier:</strong> {successData.subscription.plan_code}</div>
                  <div><strong>Billing Cycle:</strong> {successData.subscription.billing_cycle}</div>
                  <div><strong>Payment Status:</strong> <span style={{ color: '#16845B', fontWeight: 700 }}>SETTLED & VERIFIED</span></div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCheckoutModal(null);
                    if (onNavigateToDashboard) onNavigateToDashboard();
                  }}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', fontWeight: 800 }}
                >
                  Go to Candidate Workspace →
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
