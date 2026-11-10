import React from 'react';
import { X, FileText, CheckCircle2 } from 'lucide-react';

export default function TermsModal({ isOpen, onClose }) {
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
              <FileText size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#031120', margin: 0 }}>
                Enterprise Terms of Service
              </h3>
              <div style={{ fontSize: '0.74rem', color: '#6C6C6C' }}>
                TALENTIQ Corporate Recruitment SaaS Agreement • Last Updated: 2026
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
              1. Acceptance of Enterprise Terms
            </h4>
            <p style={{ color: '#6C6C6C' }}>
              By accessing, browsing, or creating an account on TALENTIQ, corporate organizations, hiring managers, and candidate users agree to be bound by these Terms of Service. If you are registering on behalf of a corporate legal entity, you represent that you possess the requisite authority to bind that organization.
            </p>
          </section>

          <section>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0060A8', marginBottom: '0.4rem' }}>
              2. Authorized Platform Usage & Account Integrity
            </h4>
            <p style={{ color: '#6C6C6C' }}>
              Users must provide accurate, verified information during profile creation and job application submission. Accounts may not be shared across individuals outside authorized organizational seat licenses. Reverse engineering, unauthorized automated scraping, and unauthorized credential probing are strictly prohibited.
            </p>
          </section>

          <section>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0060A8', marginBottom: '0.4rem' }}>
              3. Explainable Intelligence & Decision-Making
            </h4>
            <p style={{ color: '#6C6C6C' }}>
              TALENTIQ provides automated candidate matching assessments and predictive compensation ranges as assistive decision-support tools. Final hiring, interview selection, and compensation determinations remain the sole responsibility of human corporate recruiters and hiring managers.
            </p>
          </section>

          <section>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0060A8', marginBottom: '0.4rem' }}>
              4. Data Retention & Service Availability
            </h4>
            <p style={{ color: '#6C6C6C' }}>
              TALENTIQ maintains cloud infrastructure with automated daily snapshots and disaster recovery procedures. While we make every commercially reasonable effort to ensure uninterrupted availability, scheduled maintenance windows are communicated in advance via platform notifications.
            </p>
          </section>

          <section>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0060A8', marginBottom: '0.4rem' }}>
              5. Governing Law & Dispute Resolution
            </h4>
            <p style={{ color: '#6C6C6C' }}>
              These terms shall be governed by and construed in accordance with corporate enterprise regulations. Any dispute arising under these terms shall be subject to the exclusive jurisdiction of enterprise arbitration tribunals.
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
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
}
