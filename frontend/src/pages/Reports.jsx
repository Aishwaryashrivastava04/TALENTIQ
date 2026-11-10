import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Users,
  Briefcase,
  FileCheck,
  TrendingUp,
  FileText,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Printer
} from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { reportService } from '../services/api';

export default function Reports({ user }) {
  const [downloading, setDownloading] = useState(null);

  const reports = [
    {
      id: 'candidates',
      title: 'Candidate Master Directory Report',
      description: 'Comprehensive roster of all registered candidates, experience levels, current/expected salaries, degrees, verified contact points, and status.',
      icon: Users,
      records: '15+ Verified Records',
      category: 'Talent Acquisition'
    },
    {
      id: 'jobs',
      title: 'Active Job Requisitions & Budgets Report',
      description: 'Corporate requisition inventory containing salary compensation bands, minimum/maximum experience requirements, departments, and headcount targets.',
      icon: Briefcase,
      records: 'All Published Roles',
      category: 'Headcount Planning'
    },
    {
      id: 'applications',
      title: 'Application Funnel & Status Pipeline Report',
      description: 'End-to-end recruitment lifecycle progression including explainable match scores, candidate-job pairings, interview stages, and recruiter review notes.',
      icon: FileCheck,
      records: 'Complete Pipeline',
      category: 'Recruitment Operations'
    },
    {
      id: 'analytics',
      title: 'Recruitment & Workforce Velocity Analytics',
      description: 'Departmental recruitment throughput, average competency fit, stage-by-stage hiring conversion rates, and time-to-hire benchmarks.',
      icon: BarChart3,
      records: 'Executive Summary',
      category: 'Workforce Intelligence'
    },
    {
      id: 'salary',
      title: 'Salary Prediction & Compensation Variance Analysis',
      description: 'Dual-model regression and Random Forest inferences across experience tiers, market medians, and confidence intervals.',
      icon: TrendingUp,
      records: 'Predictive Inferences',
      category: 'Compensation Strategy'
    },
  ];

  const handleDownload = async (type, format = 'csv') => {
    const key = `${type}-${format}`;
    setDownloading(key);
    try {
      const token = localStorage.getItem('sr_token');
      const url = reportService.getExportUrl(type, format);

      if (format === 'pdf') {
        // Open PDF printable report in new window with auto-print triggered
        const previewUrl = `${url}&autoPrint=true`;
        window.open(previewUrl, '_blank');
        return;
      }

      const response = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (!response.ok) {
        throw new Error('Export generation failed');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `talentiq_${type}_report_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (e) {
      alert('Error exporting report: ' + e.message);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Section Heading */}
      <SectionHeading
        title="ENTERPRISE REPORTS & DATA EXPORTS"
        subtitle="Export verified recruitment datasets, candidate rosters, requisition inventories, and predictive compensation audit logs in Excel (CSV) and printable PDF formats."
        action={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={13} /> DPDP / GDPR Verified
            </span>
          </div>
        }
      />

      {/* Reports Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: '1.5rem'
      }}>
        {reports.map((rpt) => {
          const Icon = rpt.icon;
          return (
            <div
              key={rpt.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderLeft: '4px solid #0060A8',
                gap: '1.25rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '8px',
                    backgroundColor: '#F1F5F8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0060A8'
                  }}>
                    <Icon size={22} />
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <span className="badge badge-blue">{rpt.category}</span>
                    <span className="badge badge-neutral">{rpt.records}</span>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#031120', marginBottom: '0.5rem' }}>
                  {rpt.title}
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#6C6C6C', lineHeight: 1.5, margin: 0 }}>
                  {rpt.description}
                </p>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid #E5EAF0',
                paddingTop: '1rem',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div style={{ fontSize: '0.74rem', color: '#9CA3AF' }}>
                  Format: Excel (.csv) & Printable PDF
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleDownload(rpt.id, 'excel')}
                    disabled={downloading === `${rpt.id}-excel`}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}
                  >
                    <FileSpreadsheet size={14} color="#16845B" />
                    {downloading === `${rpt.id}-excel` ? 'Exporting...' : 'Excel (CSV)'}
                  </button>

                  <button
                    onClick={() => handleDownload(rpt.id, 'pdf')}
                    disabled={downloading === `${rpt.id}-pdf`}
                    className="btn btn-primary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}
                  >
                    <Printer size={14} />
                    {downloading === `${rpt.id}-pdf` ? 'Preparing PDF...' : 'Export PDF'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
