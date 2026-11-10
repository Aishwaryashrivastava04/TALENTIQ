import React, { useState } from 'react';
import {
  X,
  HelpCircle,
  BookOpen,
  Sparkles,
  TrendingUp,
  FileText,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Mail
} from 'lucide-react';

export default function HelpDrawer({ isOpen, onClose, onNavigateContact }) {
  if (!isOpen) return null;

  const [activeTopic, setActiveTopic] = useState('getting-started');

  const topics = [
    {
      id: 'getting-started',
      title: 'Platform Overview & Getting Started',
      icon: BookOpen,
      content: (
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0060A8', marginBottom: '0.5rem' }}>
            Welcome to TALENTIQ
          </h4>
          <p style={{ color: '#6C6C6C', lineHeight: 1.6, marginBottom: '1rem' }}>
            TALENTIQ is an integrated recruitment SaaS platform engineered to eliminate guesswork from hiring. Whether you are an HR executive managing corporate requisitions or a technology professional seeking career advancement, this guide will orient you with key platform capabilities.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ padding: '0.85rem', backgroundColor: '#F1F5F8', borderRadius: '8px' }}>
              <strong style={{ color: '#031120', display: 'block', marginBottom: '2px' }}>For Candidates:</strong>
              <span style={{ color: '#6C6C6C', fontSize: '0.82rem' }}>Build an ATS-optimized CV in the Resume Builder, discover matching requisitions, benchmark fair market compensation, and track interview schedules in real time.</span>
            </div>
            <div style={{ padding: '0.85rem', backgroundColor: '#F1F5F8', borderRadius: '8px' }}>
              <strong style={{ color: '#031120', display: 'block', marginBottom: '2px' }}>For HR Managers:</strong>
              <span style={{ color: '#6C6C6C', fontSize: '0.82rem' }}>Post job openings, ingest candidate pools with instant resume extraction, review transparent match percentages, and coordinate multi-stage interview rounds with evaluator scorecards.</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'smart-matching',
      title: 'How Intelligent Talent Matching Works',
      icon: Sparkles,
      content: (
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0060A8', marginBottom: '0.5rem' }}>
            Explainable Multi-Factor Compatibility
          </h4>
          <p style={{ color: '#6C6C6C', lineHeight: 1.6, marginBottom: '1rem' }}>
            Unlike black-box screening systems that arbitrarily reject candidates, TALENTIQ utilizes a transparent, audited 70/30 mathematical compatibility model:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem 1rem', borderLeft: '3px solid #0060A8', backgroundColor: '#F1F5F8', borderRadius: '0 8px 8px 0' }}>
              <strong style={{ color: '#0060A8', fontSize: '0.86rem' }}>70% Skill Compatibility Component:</strong>
              <div style={{ color: '#6C6C6C', fontSize: '0.8rem', marginTop: '2px' }}>Evaluates the exact overlap between required competencies for the role and skills extracted from the candidate's profile.</div>
            </div>
            <div style={{ padding: '0.75rem 1rem', borderLeft: '3px solid #1473E6', backgroundColor: '#F1F5F8', borderRadius: '0 8px 8px 0' }}>
              <strong style={{ color: '#1473E6', fontSize: '0.86rem' }}>30% Experience Tenure Component:</strong>
              <div style={{ color: '#6C6C6C', fontSize: '0.8rem', marginTop: '2px' }}>Assesses candidate years of verified career experience relative to the target experience band configured by the hiring team.</div>
            </div>
          </div>
          <p style={{ color: '#6C6C6C', fontSize: '0.82rem', lineHeight: 1.5 }}>
            Every score provides an itemized list of matched competencies and missing prerequisites so hiring managers always have full explainability.
          </p>
        </div>
      )
    },
    {
      id: 'salary-intelligence',
      title: 'Predictive Salary Benchmarks',
      icon: TrendingUp,
      content: (
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0060A8', marginBottom: '0.5rem' }}>
            Market-Calibrated Compensation
          </h4>
          <p style={{ color: '#6C6C6C', lineHeight: 1.6, marginBottom: '1rem' }}>
            Our compensation intelligence engine provides statistical salary distributions and predictive models calibrated against thousands of verified compensation records.
          </p>
          <div style={{ backgroundColor: '#F1F5F8', padding: '1rem', borderRadius: '8px', fontSize: '0.82rem', color: '#6C6C6C', lineHeight: 1.6 }}>
            <div style={{ color: '#031120', fontWeight: 700, marginBottom: '4px' }}>Key Parameters Analyzed:</div>
            <div>• Target Role Specialization (Engineering, Data, Product, Infrastructure)</div>
            <div>• Verified Years of Experience with non-linear tenure compounding</div>
            <div>• Highest Academic Attainment Tier (BCA, B.Tech, MCA, M.Tech, Ph.D)</div>
            <div>• Geographic Metro Location Tier (Tier 1 vs Tier 2 vs Tier 3)</div>
          </div>
        </div>
      )
    },
    {
      id: 'security',
      title: 'Security, DPDP & Compliance',
      icon: ShieldCheck,
      content: (
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0060A8', marginBottom: '0.5rem' }}>
            Enterprise Governance Standards
          </h4>
          <p style={{ color: '#6C6C6C', lineHeight: 1.6, marginBottom: '1rem' }}>
            TALENTIQ maintains strict isolation between Candidate, HR, and Admin workspaces. User credentials undergo irreversible one-way cryptographic hashing, all web sessions rely on digitally signed tokens, and candidates retain complete DPDP data rights (access, portability, deletion).
          </p>
        </div>
      )
    }
  ];

  const currentTopicData = topics.find(t => t.id === activeTopic) || topics[0];

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '850px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '12px',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid #E5EAF0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(0, 96, 168, 0.1)',
              color: '#0060A8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <HelpCircle size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#031120', margin: 0 }}>
                TALENTIQ Knowledge & Platform Guide
              </h3>
              <div style={{ fontSize: '0.74rem', color: '#6C6C6C' }}>
                Architecture Walkthroughs, Feature Guides, and Support Information
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#6C6C6C',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body: Sidebar + Main Content */}
        <div style={{ display: 'flex', flex: 1, minHeight: '380px', overflow: 'hidden' }}>
          {/* Navigation Sidebar */}
          <div style={{
            width: '260px',
            borderRight: '1px solid #E5EAF0',
            backgroundColor: '#F1F5F8',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem'
          }}>
            {topics.map((t) => {
              const Icon = t.icon;
              const isActive = activeTopic === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTopic(t.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                    color: isActive ? '#0060A8' : '#031120',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
                  }}
                >
                  <Icon size={16} color={isActive ? '#0060A8' : '#6C6C6C'} />
                  <span style={{ flex: 1 }}>{t.title}</span>
                </button>
              );
            })}
          </div>

          {/* Detailed Content Pane */}
          <div style={{ flex: 1, padding: '1.75rem', overflowY: 'auto', backgroundColor: '#FFFFFF' }}>
            {currentTopicData.content}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.75rem',
          borderTop: '1px solid #E5EAF0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#F1F5F8',
          fontSize: '0.82rem'
        }}>
          <span style={{ color: '#6C6C6C' }}>
            Need dedicated technical assistance? Reach our engineering team at <strong>support@talentiq.io</strong>
          </span>
          <button onClick={onClose} className="btn btn-primary btn-sm">
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
