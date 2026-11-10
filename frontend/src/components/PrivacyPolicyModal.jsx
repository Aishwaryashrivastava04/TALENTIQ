import React from 'react';
import { X, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export default function PrivacyPolicyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '750px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '12px',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
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
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#031120', margin: 0 }}>
                Enterprise Privacy Policy & Data Governance
              </h3>
              <div style={{ fontSize: '0.74rem', color: '#6C6C6C' }}>
                Effective Date: January 1, 2026 • Compliant with DPDP Act & GDPR Standards
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

        {/* Modal Body */}
        <div style={{
          padding: '1.75rem',
          overflowY: 'auto',
          fontSize: '0.88rem',
          color: '#031120',
          lineHeight: 1.7,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          <section>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0060A8', marginBottom: '0.4rem' }}>
              1. Overview & Commitment to Data Privacy
            </h4>
            <p style={{ color: '#6C6C6C' }}>
              TALENTIQ Technologies Inc. ("TALENTIQ", "we", "us", or "our") operates an enterprise-grade recruitment and workforce intelligence platform. We are deeply committed to protecting candidate personal data and corporate proprietary hiring records. All data collection, processing, and retention practices strictly adhere to the Digital Personal Data Protection (DPDP) Act and the General Data Protection Regulation (GDPR).
            </p>
          </section>

          <section>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0060A8', marginBottom: '0.4rem' }}>
              2. Data Collected & Processing Purpose
            </h4>
            <p style={{ color: '#6C6C6C' }}>
              We collect information provided directly by job candidates and authorized corporate HR managers, including contact information, professional employment histories, educational credentials, and parsed skill competencies. This data is exclusively utilized to:
            </p>
            <ul style={{ paddingLeft: '1.25rem', color: '#6C6C6C', marginTop: '0.4rem' }}>
              <li>Compute explainable job compatibility match scores based on verified technical proficiencies.</li>
              <li>Generate market-calibrated salary estimations and salary confidence intervals.</li>
              <li>Coordinate recruitment pipeline stages, interview calendars, and evaluator ratings.</li>
              <li>Maintain immutable compliance audit trails for corporate recruitment governance.</li>
            </ul>
          </section>

          <section>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0060A8', marginBottom: '0.4rem' }}>
              3. Encryption & Data Security
            </h4>
            <p style={{ color: '#6C6C6C' }}>
              TALENTIQ implements bank-grade security controls. All network communications are encrypted in transit using 256-Bit SSL/TLS. Passwords undergo irreversible one-way cryptographic hashing before storage. Application records and uploaded resume documents are stored in encrypted, access-controlled repositories with multi-tenant isolation.
            </p>
          </section>

          <section>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0060A8', marginBottom: '0.4rem' }}>
              4. Candidate Data Rights
            </h4>
            <p style={{ color: '#6C6C6C' }}>
              In accordance with international privacy frameworks, every candidate registered on TALENTIQ retains the following sovereign rights:
            </p>
            <ul style={{ paddingLeft: '1.25rem', color: '#6C6C6C', marginTop: '0.4rem' }}>
              <li><strong>Right to Access:</strong> View all profile information, match evaluations, and applications at any time.</li>
              <li><strong>Right to Data Portability:</strong> Export a full machine-readable JSON archive of all personal records with one click.</li>
              <li><strong>Right to Erasure:</strong> Permanently request the deletion of account records and uploaded resumes.</li>
            </ul>
          </section>

          <section>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0060A8', marginBottom: '0.4rem' }}>
              5. Contacting the Data Protection Officer
            </h4>
            <p style={{ color: '#6C6C6C' }}>
              For inquiries regarding data privacy compliance, or to exercise your statutory rights, please contact our Data Governance Office at: <strong>privacy-governance@talentiq.io</strong>.
            </p>
          </section>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '1rem 1.75rem',
          borderTop: '1px solid #E5EAF0',
          display: 'flex',
          justifyContent: 'flex-end',
          backgroundColor: '#F1F5F8'
        }}>
          <button onClick={onClose} className="btn btn-primary btn-sm">
            Close & Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
}
