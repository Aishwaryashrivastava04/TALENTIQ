import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Candidates from './pages/Candidates';
import ResumeScreening from './pages/ResumeScreening';
import Jobs from './pages/Jobs';
import Applications from './pages/Applications';
import SalaryPrediction from './pages/SalaryPrediction';
import RecruitmentAnalytics from './pages/RecruitmentAnalytics';
import Reports from './pages/Reports';
import UserManagement from './pages/UserManagement';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import CandidatePortal from './pages/CandidatePortal';
import LandingPage from './pages/LandingPage';
import ResumeBuilder from './components/ResumeBuilder';
import CompanyProfile from './pages/CompanyProfile';
import InterviewManagement from './pages/InterviewManagement';
import SalaryInsights from './pages/SalaryInsights';
import AccountSettings from './pages/AccountSettings';
import AdminControlCenter from './pages/AdminControlCenter';
import Pricing from './pages/Pricing';
import ChangePasswordModal from './components/ChangePasswordModal';
import { authService } from './services/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [authView, setAuthView] = useState('landing'); // 'landing' | 'login' | 'register' | 'forgot-password' | 'reset-password'
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [selectedRoleForRegister, setSelectedRoleForRegister] = useState('HR_MANAGER');
  const [resetToken, setResetToken] = useState('');
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setIsSidebarCollapsed(prev => !prev);

  // Sync auth subviews with HTML5 history & URL hash for smooth mobile back button
  const navigateToAuth = (view, role = 'HR_MANAGER', replace = false) => {
    setSelectedRoleForRegister(role);
    setAuthView(view);
    setIsDashboardOpen(false);
    const hash = view === 'landing' ? '' : `#/${view}`;
    const targetUrl = hash ? `${window.location.pathname}${hash}` : window.location.pathname;
    if (replace) {
      window.history.replaceState({ authView: view, role }, '', targetUrl);
    } else {
      window.history.pushState({ authView: view, role }, '', targetUrl);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  // Sync dashboard tabs with HTML5 history & URL hash
  const handleTabChange = (tab, replace = false) => {
    setActiveTab(tab);
    setIsDashboardOpen(true);
    const hash = `#/${tab}`;
    if (replace) {
      window.history.replaceState({ activeTab: tab }, '', hash);
    } else {
      window.history.pushState({ activeTab: tab }, '', hash);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  // Return to First Page (Public Website) from anywhere
  const handleReturnToPublicWebsite = () => {
    setIsDashboardOpen(false);
    setAuthView('landing');
    window.history.pushState({ authView: 'landing' }, '', window.location.pathname);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  // Robust return to landing page from any auth sub-view
  const handleNavigateHome = () => {
    setAuthView('landing');
    setIsDashboardOpen(false);
    if (window.location.hash) {
      window.history.back();
    } else {
      navigateToAuth('landing', 'HR_MANAGER', true);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  // Enter dashboard directly from landing page when user is recognized
  const handleEnterDashboard = () => {
    const targetTab = user?.role === 'CANDIDATE' ? 'candidate-portal' : (user?.role === 'ADMIN' ? 'admin-center' : 'dashboard');
    handleTabChange(targetTab);
  };

  useEffect(() => {
    // Check URL parameters for reset-password link: ?token=...
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    if (urlToken) {
      setResetToken(urlToken);
      navigateToAuth('reset-password', 'HR_MANAGER', true);
      return;
    }

    const savedUser = localStorage.getItem('sr_user');
    const savedToken = localStorage.getItem('sr_token');
    let loadedUser = null;
    if (savedToken && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.role === 'ADMIN' && (!parsed.full_name || parsed.full_name.includes('Arun') || parsed.full_name.includes('Lead Admin'))) {
          parsed.full_name = 'Aishwarya Shree';
          localStorage.setItem('sr_user', JSON.stringify(parsed));
        }
        loadedUser = parsed;
        setUser(parsed);
      } catch (e) {
        loadedUser = { full_name: 'Aishwarya Shree', role: 'ADMIN', email: 'admin@recruitment.com' };
        setUser(loadedUser);
      }
    }

    // Inspect URL hash
    const rawHash = (window.location.hash || '').replace('#/', '').replace('#', '').trim();
    const dashboardTabs = [
      'dashboard', 'candidates', 'screening', 'jobs', 'applications',
      'interviews', 'company-profile', 'salary-insights', 'salary-prediction',
      'analytics', 'reports', 'admin-center', 'candidate-portal',
      'account-settings', 'settings', 'user-management', 'resume-builder'
    ];

    // IF USER EXPLICITLY HAS A DASHBOARD TAB IN URL (e.g. #/dashboard, #/candidates)
    if (loadedUser && dashboardTabs.includes(rawHash)) {
      setActiveTab(rawHash);
      setIsDashboardOpen(true);
    } else if (['login', 'register', 'forgot-password', 'reset-password'].includes(rawHash)) {
      setAuthView(rawHash);
      setIsDashboardOpen(false);
    } else {
      // DEFAULT: ALWAYS OPEN FIRST PAGE (PUBLIC LANDING PAGE)!
      setAuthView('landing');
      setIsDashboardOpen(false);
      window.history.replaceState({ authView: 'landing' }, '', window.location.pathname);
    }

    const handleAuthExpired = () => {
      setUser(null);
      setIsDashboardOpen(false);
      navigateToAuth('login', 'HR_MANAGER', true);
    };
    window.addEventListener('auth:expired', handleAuthExpired);
    return () => window.removeEventListener('auth:expired', handleAuthExpired);
  }, []);

  // Listen to popstate event (hardware mobile back button, swipe back, browser back)
  useEffect(() => {
    const handlePopState = (event) => {
      const state = event.state || {};
      const rawHash = (window.location.hash || '').replace('#/', '').replace('#', '').trim();
      const dashboardTabs = [
        'dashboard', 'candidates', 'screening', 'jobs', 'applications',
        'interviews', 'company-profile', 'salary-insights', 'salary-prediction',
        'analytics', 'reports', 'admin-center', 'candidate-portal',
        'account-settings', 'settings', 'user-management', 'resume-builder'
      ];

      if (!rawHash || rawHash === 'landing') {
        setIsDashboardOpen(false);
        setAuthView('landing');
      } else if (['login', 'register', 'forgot-password', 'reset-password'].includes(rawHash)) {
        setIsDashboardOpen(false);
        setAuthView(rawHash);
        if (state.role) setSelectedRoleForRegister(state.role);
      } else if (dashboardTabs.includes(rawHash)) {
        setActiveTab(rawHash);
        setIsDashboardOpen(true);
      } else {
        setIsDashboardOpen(false);
        setAuthView('landing');
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [user]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    const targetTab = userData?.role === 'CANDIDATE' ? 'candidate-portal' : (userData?.role === 'ADMIN' ? 'admin-center' : 'dashboard');
    handleTabChange(targetTab, true);
    setAuthView('landing');
  };

  const handleLogout = async () => {
    try {
      await authService.logout().catch(() => null);
    } finally {
      localStorage.removeItem('sr_token');
      localStorage.removeItem('sr_user');
      setUser(null);
      setIsDashboardOpen(false);
      navigateToAuth('landing', 'HR_MANAGER', true);
    }
  };

  // If dashboard is not open, render First Page (Landing) or Auth Sub-views (Login/Register)
  if (!isDashboardOpen) {
    if (authView === 'landing') {
      return (
        <LandingPage
          user={user}
          onNavigateLogin={() => navigateToAuth('login')}
          onNavigateRegister={(role) => navigateToAuth('register', role || 'HR_MANAGER')}
          onQuickDemoLogin={handleLoginSuccess}
          onEnterDashboard={handleEnterDashboard}
        />
      );
    }

    if (authView === 'register') {
      return (
        <Register
          initialRole={selectedRoleForRegister}
          onRegisterSuccess={handleLoginSuccess}
          onNavigateLogin={() => navigateToAuth('login')}
          onNavigateHome={handleNavigateHome}
        />
      );
    }

    if (authView === 'forgot-password') {
      return (
        <ForgotPassword
          onNavigateLogin={() => navigateToAuth('login')}
          onNavigateResetWithToken={(tok) => {
            setResetToken(tok);
            navigateToAuth('reset-password');
          }}
          onNavigateHome={handleNavigateHome}
        />
      );
    }

    if (authView === 'reset-password') {
      return (
        <ResetPassword
          token={resetToken}
          onNavigateLogin={() => navigateToAuth('login')}
          onNavigateHome={handleNavigateHome}
        />
      );
    }

    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onNavigateRegister={(role) => navigateToAuth('register', role || 'HR_MANAGER')}
        onNavigateForgotPassword={() => navigateToAuth('forgot-password')}
        onNavigateHome={handleNavigateHome}
      />
    );
  }

  const renderActivePage = () => {
    const isCandidate = user?.role === 'CANDIDATE';
    const isHR = user?.role === 'HR_MANAGER';
    const isAdmin = user?.role === 'ADMIN';

    // Universal Public Website tab for any role (view website without signing out)
    if (activeTab === 'public-website') {
      const returnTab = isAdmin ? 'admin-center' : (isCandidate ? 'candidate-portal' : 'dashboard');
      return (
        <LandingPage
          user={user}
          onQuickDemoLogin={handleLoginSuccess}
          onNavigateLogin={() => handleTabChange(returnTab)}
          onNavigateRegister={() => handleTabChange(returnTab)}
        />
      );
    }

    // 1. Candidate RBAC Guard
    if (isCandidate) {
      if (activeTab === 'resume-builder') {
        return (
          <ResumeBuilder
            candidateProfile={{
              first_name: user?.full_name?.split(' ')[0] || 'Rahul',
              last_name: user?.full_name?.split(' ').slice(1).join(' ') || 'Verma',
              email: user?.email,
              phone: user?.phone
            }}
          />
        );
      }
      if (activeTab === 'salary-insights' || activeTab === 'salary-prediction') {
        return <SalaryInsights user={user} />;
      }
      if (activeTab === 'account-settings') {
        return <AccountSettings user={user} />;
      }
      if (activeTab === 'screening') {
        return <ResumeScreening user={user} />;
      }
      if (activeTab === 'pricing') {
        return <Pricing user={user} onNavigateToDashboard={() => setActiveTab('candidate-portal')} />;
      }
      // Any attempt to access HR or Admin controls defaults to Candidate Portal
      return <CandidatePortal user={user} />;
    }

    // 2. HR Manager RBAC Guard (Block Admin Control Center and User Management)
    if (isHR && ['admin-center', 'user-management'].includes(activeTab)) {
      return <Dashboard setActiveTab={setActiveTab} user={user} />;
    }

    // 3. Tab Routing for HR Managers & Admins
    switch (activeTab) {
      case 'admin-center':
        return <AdminControlCenter user={user} />;
      case 'pricing':
        return <Pricing user={user} onNavigateToDashboard={() => handleTabChange(isAdmin ? 'admin-center' : 'dashboard')} />;
      case 'dashboard':
        return <Dashboard setActiveTab={handleTabChange} user={user} />;
      case 'candidate-portal':
        return <CandidatePortal user={user} />;
      case 'candidates':
        return <Candidates user={user} />;
      case 'screening':
        return <ResumeScreening user={user} />;
      case 'jobs':
        return <Jobs user={user} />;
      case 'applications':
        return <Applications user={user} />;
      case 'interviews':
        return <InterviewManagement user={user} />;
      case 'company-profile':
        return <CompanyProfile user={user} />;
      case 'salary-insights':
      case 'salary-prediction':
        return <SalaryInsights user={user} />;
      case 'analytics':
        return <RecruitmentAnalytics user={user} />;
      case 'reports':
        return <Reports user={user} />;
      case 'user-management':
        return <UserManagement user={user} />;
      case 'account-settings':
        return <AccountSettings user={user} />;
      case 'resume-builder':
        return <ResumeBuilder />;
      case 'settings':
        return <Settings user={user} />;
      default:
        return isAdmin ? <AdminControlCenter user={user} /> : <Dashboard setActiveTab={handleTabChange} user={user} />;
    }
  };

  return (
    <div className="app-container">
      {/* SaaS Sidebar with Collapsible layout */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'public-website') handleReturnToPublicWebsite();
          else handleTabChange(tab);
        }}
        onLogout={handleLogout}
        user={user}
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
      />

      {/* Main App Body */}
      <div className="main-content">
        <Header
          activeTab={activeTab}
          user={user}
          onOpenChangePassword={() => setShowChangePasswordModal(true)}
          onLogout={handleLogout}
          isSidebarCollapsed={isSidebarCollapsed}
          toggleSidebar={toggleSidebar}
          setActiveTab={(tab) => {
            if (tab === 'public-website') handleReturnToPublicWebsite();
            else handleTabChange(tab);
          }}
        />
        <main className="page-body">
          {renderActivePage()}
        </main>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />
    </div>
  );
}
