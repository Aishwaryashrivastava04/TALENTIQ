import React from 'react';
import {
  LayoutDashboard,
  Users,
  FileSearch,
  Briefcase,
  FileCheck,
  TrendingUp,
  BarChart3,
  FileSpreadsheet,
  UserCog,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Award,
  Calendar,
  Building,
  FileText,
  User,
  Sliders,
  Shield,
  Sparkles,
  Globe
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onLogout, user, isCollapsed, toggleSidebar }) {
  const isCandidate = user?.role === 'CANDIDATE';
  const isAdmin = user?.role === 'ADMIN';

  // Navigation Items matching Institutional Aquatic specifications
  let menuItems = [];
  if (isCandidate) {
    menuItems = [
      { id: 'candidate-portal', label: 'Candidate Workspace', icon: LayoutDashboard, badge: 'Home' },
      { id: 'pricing', label: 'TALENTIQ Premium', icon: Sparkles, badge: 'PRO' },
      { id: 'resume-builder', label: 'Resume Builder', icon: FileText, badge: 'ATS' },
      { id: 'screening', label: 'Smart Resume Intelligence', icon: FileSearch, badge: 'Smart' },
      { id: 'interviews', label: 'Interview Schedule', icon: Calendar, badge: 'Live' },
      { id: 'salary-insights', label: 'Salary Benchmarks', icon: TrendingUp, badge: 'Market' },
      { id: 'account-settings', label: 'Account & Privacy', icon: User },
    ];
  } else if (isAdmin) {
    menuItems = [
      { id: 'admin-center', label: 'Admin Control Center', icon: Shield, badge: 'Exec' },
      { id: 'pricing', label: 'Membership Plans', icon: Sparkles, badge: 'Plans' },
      { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
      { id: 'user-management', label: 'User Directory', icon: UserCog, badge: 'Admin' },
      { id: 'candidates', label: 'Candidates', icon: Users },
      { id: 'screening', label: 'Smart Resume Intelligence', icon: FileSearch },
      { id: 'jobs', label: 'Job Requisitions', icon: Briefcase },
      { id: 'applications', label: 'Applications', icon: FileCheck },
      { id: 'interviews', label: 'Interviews', icon: Calendar },
      { id: 'company-profile', label: 'Company Profiles', icon: Building },
      { id: 'salary-insights', label: 'Salary Benchmarks', icon: TrendingUp },
      { id: 'analytics', label: 'Workforce Analytics', icon: BarChart3 },
      { id: 'reports', label: 'Reports & Exports', icon: FileSpreadsheet },
      { id: 'account-settings', label: 'Account Settings', icon: User },
      { id: 'settings', label: 'System Settings', icon: Settings },
    ];
  } else {
    // HR_MANAGER
    menuItems = [
      { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
      { id: 'candidates', label: 'Candidates', icon: Users },
      { id: 'screening', label: 'Smart Resume Intelligence', icon: FileSearch, badge: 'Smart' },
      { id: 'jobs', label: 'Job Requisitions', icon: Briefcase },
      { id: 'applications', label: 'Applications Pipeline', icon: FileCheck },
      { id: 'interviews', label: 'Interview Management', icon: Calendar, badge: 'Live' },
      { id: 'company-profile', label: 'Company Profile', icon: Building },
      { id: 'salary-insights', label: 'Salary Benchmarks', icon: TrendingUp },
      { id: 'analytics', label: 'Workforce Analytics', icon: BarChart3 },
      { id: 'reports', label: 'Reports & Exports', icon: FileSpreadsheet },
      { id: 'account-settings', label: 'Account Settings', icon: User },
      { id: 'settings', label: 'Preferences', icon: Settings },
    ];
  }

  const sidebarWidth = isCollapsed ? '76px' : '260px';

  return (
    <aside style={{
      width: sidebarWidth,
      backgroundColor: 'var(--bg-sidebar, #FFFFFF)',
      borderRight: '1px solid var(--border-color, #E5EAF0)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      flexShrink: 0,
      transition: 'width 240ms cubic-bezier(0.4, 0, 0.2, 1)',
      overflow: 'hidden'
    }}>
      {/* Brand Header */}
      <div style={{
        padding: isCollapsed ? '1.5rem 0.75rem' : '1.5rem 1.4rem',
        borderBottom: '1px solid var(--border-color, #E5EAF0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Institutional Blue Logo */}
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            backgroundColor: '#0060A8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '1.05rem',
            letterSpacing: '-0.02em',
            flexShrink: 0,
            boxShadow: '0 2px 6px rgba(0, 96, 168, 0.25)'
          }}>
            TQ
          </div>
          {!isCollapsed && (
            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
              <div style={{
                fontWeight: 800,
                fontSize: '1.15rem',
                letterSpacing: '-0.03em',
                color: '#031120',
                lineHeight: 1.1
              }}>
                TALENT<span style={{ color: '#0060A8' }}>IQ</span>
              </div>
              <div style={{
                fontSize: '0.68rem',
                color: '#6C6C6C',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}>
                {isCandidate ? 'Candidate Portal' : isAdmin ? 'Admin Control' : 'Corporate Suite'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <nav style={{
        flex: 1,
        padding: isCollapsed ? '1rem 0.5rem' : '1rem 0.75rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.35rem'
      }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={isCollapsed ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                width: '100%',
                padding: isCollapsed ? '0.7rem' : '0.65rem 0.95rem',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? 'var(--bg-gray, #F1F5F8)' : 'transparent',
                color: isActive ? 'var(--primary-blue, #0060A8)' : 'var(--body-text, #6C6C6C)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.86rem',
                cursor: 'pointer',
                transition: 'all 160ms ease',
                textAlign: 'left',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                position: 'relative',
                borderLeft: isActive ? '3px solid #0060A8' : '3px solid transparent'
              }}
            >
              <Icon
                size={18}
                color={isActive ? '#0060A8' : '#6C6C6C'}
                strokeWidth={isActive ? 2.2 : 1.75}
              />
              {!isCollapsed && (
                <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.label}
                </span>
              )}
              {!isCollapsed && item.badge && (
                <span style={{
                  fontSize: '0.68rem',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '9999px',
                  backgroundColor: isActive ? '#0060A8' : '#E5EAF0',
                  color: isActive ? '#FFFFFF' : '#6C6C6C',
                  fontWeight: 700
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer with Collapse Toggle and Logout */}
      <div style={{
        padding: isCollapsed ? '0.85rem 0.5rem' : '1rem 0.95rem',
        borderTop: '1px solid var(--border-color, #E5EAF0)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        {/* Collapse Button */}
        <button
          onClick={toggleSidebar}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            width: '100%',
            padding: '0.5rem 0.75rem',
            borderRadius: '6px',
            border: '1px solid var(--border-color, #E5EAF0)',
            backgroundColor: '#FFFFFF',
            color: '#6C6C6C',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background-color 160ms ease'
          }}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {!isCollapsed && <span>Collapse Sidebar</span>}
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* User Card */}
        {user && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: isCollapsed ? 0 : '0.65rem',
            padding: isCollapsed ? '0.5rem 0.25rem' : '0.65rem 0.75rem',
            borderRadius: '8px',
            backgroundColor: 'var(--bg-gray, #F1F5F8)',
            justifyContent: isCollapsed ? 'center' : 'flex-start'
          }}
          title={`${user.full_name || (isAdmin ? 'Aishwarya Shree' : 'User')} (${isAdmin ? 'Administrator' : user.role})`}
          >
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: '#0060A8',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.76rem',
              fontWeight: 800,
              flexShrink: 0,
              letterSpacing: '0.02em',
              overflow: 'hidden'
            }}>
              {user.avatar_url ? (
                <img src={user.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                (() => {
                  const name = user.full_name || (isAdmin ? 'Aishwarya Shree' : 'User');
                  const parts = name.trim().split(/\s+/);
                  return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.slice(0, 2).toUpperCase();
                })()
              )}
            </div>
            {!isCollapsed && (
              <div style={{ overflow: 'hidden', flex: 1 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#031120', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.full_name || (isAdmin ? 'Aishwarya Shree' : 'HR Executive')}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#0060A8', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {isAdmin ? 'Administrator' : user.role === 'HR_MANAGER' ? 'Talent Acquisition' : user.role === 'CANDIDATE' ? 'Job Candidate' : user.role}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Return to Public Website link */}
        <button
          onClick={() => setActiveTab('public-website')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            width: '100%',
            padding: isCollapsed ? '0.65rem' : '0.55rem 0.75rem',
            borderRadius: '6px',
            border: '1px solid #E5EAF0',
            backgroundColor: '#F8FAFC',
            color: '#0060A8',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            transition: 'background-color 160ms ease'
          }}
          title="Return to Public Website"
        >
          <Globe size={16} color="#0060A8" />
          {!isCollapsed && <span>Public Website</span>}
        </button>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            width: '100%',
            padding: isCollapsed ? '0.65rem' : '0.6rem 0.75rem',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: 'transparent',
            color: '#D94C4C',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            transition: 'background-color 160ms ease'
          }}
          title="Sign Out"
        >
          <LogOut size={16} />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
