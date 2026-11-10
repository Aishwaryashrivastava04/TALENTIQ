import React from 'react';

export default function SectionHeading({ title, subtitle, action }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '1.75rem',
      flexWrap: 'wrap',
      gap: '1rem'
    }}>
      <div>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 700,
          textTransform: 'uppercase',
          color: 'var(--primary-blue, #0060A8)',
          letterSpacing: '-0.025em',
          margin: 0,
          lineHeight: 1.2
        }}>
          {title}
        </h2>
        <div style={{
          width: '48px',
          height: '4px',
          backgroundColor: 'var(--accent-blue, #1473E6)',
          marginTop: '4px',
          borderRadius: '2px'
        }} />
        {subtitle && (
          <p style={{
            fontSize: '14px',
            color: 'var(--body-text, #6C6C6C)',
            marginTop: '0.45rem',
            marginBottom: 0
          }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {action}
        </div>
      )}
    </div>
  );
}
