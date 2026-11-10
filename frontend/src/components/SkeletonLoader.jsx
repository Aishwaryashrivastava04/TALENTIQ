import React from 'react';
import { AlertCircle, FolderOpen, Search, ArrowRight } from 'lucide-react';

export function SkeletonCard({ count = 3, height = '120px' }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', width: '100%' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="skeleton-card"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5EAF0',
            borderRadius: '10px',
            padding: '1.5rem',
            height: height,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ width: '40%', height: '14px', backgroundColor: '#E5EAF0', borderRadius: '4px', animation: 'skeletonShimmer 1.5s infinite' }} />
          <div style={{ width: '70%', height: '24px', backgroundColor: '#E5EAF0', borderRadius: '4px', margin: '8px 0', animation: 'skeletonShimmer 1.5s infinite' }} />
          <div style={{ width: '50%', height: '12px', backgroundColor: '#E5EAF0', borderRadius: '4px', animation: 'skeletonShimmer 1.5s infinite' }} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5, columns = 4 }) {
  return (
    <div style={{ width: '100%', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E5EAF0', overflow: 'hidden' }}>
      <div style={{ display: 'flex', backgroundColor: '#F1F5F8', padding: '0.85rem 1rem', borderBottom: '1px solid #E5EAF0' }}>
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: '14px', backgroundColor: '#CBD5E1', borderRadius: '4px', margin: '0 0.5rem', animation: 'skeletonShimmer 1.5s infinite' }} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} style={{ display: 'flex', padding: '1rem', borderBottom: '1px solid #F1F5F8' }}>
          {Array.from({ length: columns }).map((_, c) => (
            <div key={c} style={{ flex: 1, height: '14px', backgroundColor: '#E5EAF0', borderRadius: '4px', margin: '0 0.5rem', animation: 'skeletonShimmer 1.5s infinite' }} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function EmptyState({
  title = 'No Records Found',
  description = 'There are no active records matching your criteria.',
  icon: Icon = FolderOpen,
  actionText,
  onAction
}) {
  return (
    <div style={{
      padding: '3.5rem 2rem',
      backgroundColor: '#FFFFFF',
      borderRadius: '10px',
      border: '1px solid #E5EAF0',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      maxWidth: '480px',
      margin: '2rem auto'
    }}>
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: '#F1F5F8',
        color: '#0060A8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.25rem'
      }}>
        <Icon size={28} />
      </div>
      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#031120', marginBottom: '0.4rem' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.86rem', color: '#6C6C6C', lineHeight: 1.5, marginBottom: actionText ? '1.5rem' : '0' }}>
        {description}
      </p>
      {actionText && onAction && (
        <button onClick={onAction} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {actionText} <ArrowRight size={15} />
        </button>
      )}
    </div>
  );
}
