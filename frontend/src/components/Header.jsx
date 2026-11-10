import React, { useState, useEffect } from 'react';
import {
  Bell,
  Search,
  HelpCircle,
  User,
  LogOut,
  Key,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ChevronRight,
  ExternalLink,
  X,
  BookOpen
} from 'lucide-react';
import HelpDrawer from './HelpDrawer';
import { notificationService } from '../services/api';

export default function Header({
  activeTab,
  user,
  onOpenChangePassword,
  onLogout,
  isSidebarCollapsed,
  toggleSidebar,
  setActiveTab
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const tabLabels = {
    dashboard: 'Overview',
    'candidate-portal': 'Candidate Workspace',
    'resume-builder': 'Resume Builder',
    candidates: 'Candidates Directory',
    screening: 'AI Resume Intelligence',
    jobs: 'Job Requisitions',
    applications: 'Applications Pipeline',
    interviews: 'Interview Management',
    'company-profile': 'Company Profile',
    'salary-insights': 'Salary Insights & Models',
    'salary-prediction': 'Salary Prediction',
    analytics: 'Workforce Analytics',
    reports: 'Reports & Exports',
    'user-management': 'User Directory',
    'admin-center': 'Admin Control Center',
    'account-settings': 'Account & Privacy Settings',
    settings: 'System Architecture & Settings',
  };

  const searchableIndex = [
    { title: 'Rahul Verma', category: 'Candidate', detail: 'MCA • 3.5 yrs • Python, React', tab: 'candidates' },
    { title: 'Divya Nair', category: 'Candidate', detail: 'BTECH • 4.0 yrs • NLP, ML, Python', tab: 'candidates' },
    { title: 'Rohan Kulkarni', category: 'Candidate', detail: 'MTECH • 7.5 yrs • Java, Spring Boot', tab: 'candidates' },
    { title: 'Senior Full-Stack Developer', category: 'Job Vacancy', detail: 'Engineering • 2-5 yrs • ₹8-15 LPA', tab: 'jobs' },
    { title: 'AI & Data Platform Engineer', category: 'Job Vacancy', detail: 'Data & AI • 3-7 yrs • ₹12-22 LPA', tab: 'jobs' },
    { title: 'Senior Backend Specialist', category: 'Job Vacancy', detail: 'Banking Platform • 4-8 yrs • ₹10-18 LPA', tab: 'jobs' },
    { title: 'Salary Prediction & Model Comparison', category: 'Workspace', detail: 'Linear Regression vs Random Forest', tab: 'salary-prediction' },
    { title: 'Statistical Distributions & Correlations', category: 'Analytics', detail: 'Pearson Correlation (r=0.83) & Quartiles', tab: 'analytics' },
  ];

  const handleSearchChange = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.trim().length > 1) {
      const filtered = searchableIndex.filter(item =>
        item.title.toLowerCase().includes(q.toLowerCase()) ||
        item.detail.toLowerCase().includes(q.toLowerCase()) ||
        item.category.toLowerCase().includes(q.toLowerCase())
      );
      setSearchResults(filtered);
      setShowSearchDropdown(true);
    } else {
      setShowSearchDropdown(false);
    }
  };

  const [notifications, setNotifications] = useState([]);
  const [notifFilter, setNotifFilter] = useState('ALL');

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getAll();
      if (res.data && res.data.data) {
        setNotifications(res.data.data);
      }
    } catch (e) {
      // Graceful fallback to initial default notifications
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (e) {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.is_read) {
      try {
        await notificationService.markAsRead(notif.id);
      } catch (e) {}
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
    }
    if (notif.link && setActiveTab) {
      setActiveTab(notif.link);
      setShowNotifications(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;
  const filteredNotifications = notifFilter === 'UNREAD'
    ? notifications.filter(n => !n.is_read)
    : notifications;

  return (
    <header style={{
      height: '68px',
      backgroundColor: 'var(--bg-header, #FFFFFF)',
      borderBottom: '1px solid var(--border-color, #E5EAF0)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
    }}>
      {/* Left: Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted-text, #9CA3AF)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          TALENTIQ
        </span>
        <ChevronRight size={14} color="#9CA3AF" />
        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary-blue, #0060A8)' }}>
          {tabLabels[activeTab] || 'Overview'}
        </span>
      </div>

      {/* Center: Search Bar */}
      <div style={{ position: 'relative', width: '380px', maxWidth: '100%' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--bg-gray, #F1F5F8)',
          borderRadius: '10px',
          padding: '0 0.85rem',
          height: '40px',
          border: '1px solid var(--border-color, #E5EAF0)'
        }}>
          <Search size={16} color="#6C6C6C" style={{ marginRight: '0.6rem' }} />
          <input
            type="text"
            placeholder="Search candidates, jobs, intelligence..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => searchQuery.trim().length > 1 && setShowSearchDropdown(true)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              width: '100%',
              fontSize: '0.84rem',
              color: '#031120',
              fontFamily: 'inherit'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); setShowSearchDropdown(false); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Global Search Dropdown */}
        {showSearchDropdown && searchResults.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '46px',
            left: 0,
            right: 0,
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5EAF0',
            borderRadius: '10px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            zIndex: 100,
            overflow: 'hidden'
          }}>
            <div style={{ padding: '0.5rem 0.85rem', fontSize: '0.72rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', backgroundColor: '#F8FAFC' }}>
              Suggested Intelligence Results ({searchResults.length})
            </div>
            {searchResults.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setActiveTab(item.tab);
                  setShowSearchDropdown(false);
                  setSearchQuery('');
                }}
                style={{
                  padding: '0.75rem 0.85rem',
                  borderBottom: '1px solid #F1F5F8',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background-color 150ms ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F5F8'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#031120' }}>{item.title}</div>
                  <div style={{ fontSize: '0.74rem', color: '#6C6C6C' }}>{item.detail}</div>
                </div>
                <span style={{ fontSize: '0.68rem', padding: '0.2rem 0.5rem', borderRadius: '9999px', backgroundColor: 'rgba(0, 96, 168, 0.08)', color: '#0060A8', fontWeight: 700 }}>
                  {item.category}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: Actions (Help, Notifications, User Menu) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Help Icon */}
        <button
          onClick={() => setShowHelpModal(true)}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            border: '1px solid #E5EAF0',
            backgroundColor: '#FFFFFF',
            color: '#6C6C6C',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 160ms ease'
          }}
          title="Platform Knowledge & Help Guide"
        >
          <HelpCircle size={18} />
        </button>

        {/* Notifications Icon with Badge */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              border: '1px solid #E5EAF0',
              backgroundColor: '#FFFFFF',
              color: '#6C6C6C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative'
            }}
            title="Notification Center"
          >
            <Bell size={18} />
            {unreadCount > 0 ? (
              <span style={{
                position: 'absolute',
                top: '-3px',
                right: '-3px',
                minWidth: '18px',
                height: '18px',
                borderRadius: '9px',
                backgroundColor: '#D94C4C',
                color: '#FFFFFF',
                fontSize: '0.68rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
                boxShadow: '0 2px 4px rgba(217, 76, 76, 0.4)'
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            ) : null}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '46px',
              right: 0,
              width: '350px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5EAF0',
              borderRadius: '12px',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.12)',
              zIndex: 100,
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '0.85rem 1rem',
                borderBottom: '1px solid #E5EAF0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#FAFCFE'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#031120' }}>Live Notifications</span>
                  {unreadCount > 0 && (
                    <span className="badge badge-red" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '0.72rem',
                      color: '#0060A8',
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Filter Tabs */}
              <div style={{ display: 'flex', borderBottom: '1px solid #F1F5F8', padding: '0.35rem 0.75rem', gap: '0.35rem' }}>
                <button
                  onClick={() => setNotifFilter('ALL')}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    border: 'none',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    backgroundColor: notifFilter === 'ALL' ? '#0060A8' : 'transparent',
                    color: notifFilter === 'ALL' ? '#FFFFFF' : '#6C6C6C',
                    cursor: 'pointer'
                  }}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setNotifFilter('UNREAD')}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    border: 'none',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    backgroundColor: notifFilter === 'UNREAD' ? '#0060A8' : 'transparent',
                    color: notifFilter === 'UNREAD' ? '#FFFFFF' : '#6C6C6C',
                    cursor: 'pointer'
                  }}
                >
                  Unread ({unreadCount})
                </button>
              </div>

              {/* Notification List */}
              <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                {filteredNotifications.length === 0 ? (
                  <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#9CA3AF', fontSize: '0.8rem' }}>
                    No notifications to display.
                  </div>
                ) : (
                  filteredNotifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      style={{
                        padding: '0.8rem 1rem',
                        borderBottom: '1px solid #F1F5F8',
                        display: 'flex',
                        gap: '0.65rem',
                        backgroundColor: n.is_read ? '#FFFFFF' : 'rgba(0, 96, 168, 0.03)',
                        cursor: 'pointer',
                        transition: 'background-color 140ms ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = n.is_read ? '#FFFFFF' : 'rgba(0, 96, 168, 0.03)'}
                    >
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: n.is_read ? '#CBD5E1' : '#0060A8',
                        marginTop: '6px',
                        flexShrink: 0
                      }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.82rem', fontWeight: n.is_read ? 600 : 800, color: '#031120' }}>
                            {n.title}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.76rem', color: '#4B5563', marginTop: '2px', lineHeight: 1.35 }}>
                          {n.message}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#9CA3AF', marginTop: '4px' }}>
                          {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(n.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              border: '1px solid #E5EAF0',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer',
              transition: 'background-color 160ms ease'
            }}
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#0060A8',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.02em',
              overflow: 'hidden'
            }}>
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                (() => {
                  const name = user?.full_name || (user?.role === 'ADMIN' ? 'Aishwarya Shree' : 'User');
                  const parts = name.trim().split(/\s+/);
                  return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.slice(0, 2).toUpperCase();
                })()
              )}
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#031120' }}>
              {user?.full_name?.split(' ')[0] || (user?.role === 'ADMIN' ? 'Aishwarya' : 'User')}
            </span>
          </button>

          {showProfileMenu && (
            <div style={{
              position: 'absolute',
              top: '44px',
              right: 0,
              width: '240px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5EAF0',
              borderRadius: '10px',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12)',
              zIndex: 100,
              padding: '0.5rem 0'
            }}>
              <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #F1F5F8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#031120' }}>
                    {user?.full_name || (user?.role === 'ADMIN' ? 'Aishwarya Shree' : 'Administrator')}
                  </div>
                  <span className="badge badge-emerald" style={{ fontSize: '0.62rem', padding: '2px 6px' }}>Active</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#6C6C6C' }}>{user?.email || 'admin@recruitment.com'}</div>
                <div style={{ fontSize: '0.7rem', color: '#0060A8', fontWeight: 700, marginTop: '2px', textTransform: 'uppercase' }}>
                  {user?.role === 'ADMIN' ? 'Administrator' : user?.role === 'HR_MANAGER' ? 'Talent Acquisition' : 'Candidate'}
                </div>
              </div>
              <button
                onClick={() => { setActiveTab('account-settings'); setShowProfileMenu(false); }}
                style={{
                  width: '100%',
                  padding: '0.6rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  background: 'none',
                  border: 'none',
                  fontSize: '0.82rem',
                  color: '#031120',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F5F8'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <User size={14} color="#0060A8" /> Account & Privacy
              </button>
              <button
                onClick={() => { onOpenChangePassword(); setShowProfileMenu(false); }}
                style={{
                  width: '100%',
                  padding: '0.6rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  background: 'none',
                  border: 'none',
                  fontSize: '0.82rem',
                  color: '#031120',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F5F8'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Key size={14} color="#0060A8" /> Change Password
              </button>
              <button
                onClick={() => { onLogout(); setShowProfileMenu(false); }}
                style={{
                  width: '100%',
                  padding: '0.6rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  background: 'none',
                  border: 'none',
                  fontSize: '0.82rem',
                  color: '#D94C4C',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F5F8'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Platform Help & Knowledge Guide Drawer */}
      <HelpDrawer
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />
    </header>
  );
}
