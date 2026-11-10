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
  const [selectedRoleForRegister, setSelectedRoleForRegister] = useState('HR_MANAGER');
  const [resetToken, setResetToken] = useState('');
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setIsSidebarCollapsed(prev => !prev);

  useEffect(() => {
    // Check URL parameters for reset-password link: ?token=...
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    if (urlToken) {
      setResetToken(urlToken);
      setAuthView('reset-password');
    }

    const savedUser = localStorage.getItem('sr_user');
    const savedToken = localStorage.getItem('sr_token');
    if (savedToken && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.role === 'ADMIN' && (!parsed.full_name || parsed.full_name.includes('Arun') || parsed.full_name.includes('Lead Admin'))) {
          parsed.full_name = 'Aishwarya Shree';
          localStorage.setItem('sr_user', JSON.stringify(parsed));
        }
        setUser(parsed);
        if (parsed.role === 'CANDIDATE') {
          setActiveTab('candidate-portal');
        } else if (parsed.role === 'ADMIN') {
          setActiveTab('admin-center');
        } else {
          setActiveTab('dashboard');
        }
      } catch (e) {
        setUser({ full_name: 'Aishwarya Shree', role: 'ADMIN', email: 'admin@recruitment.com' });
      }
    }

    const handleAuthExpired = () => {
      setUser(null);
      setAuthView('login');
    };
    window.addEventListener('auth:expired', handleAuthExpired);
    return () => window.removeEventListener('auth:expired', handleAuthExpired);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    if (userData?.role === 'CANDIDATE') {
      setActiveTab('candidate-portal');
    } else if (userData?.role === 'ADMIN') {
      setActiveTab('admin-center');
    } else {
      setActiveTab('dashboard');
    }
    setAuthView('login');
  };

  const handleLogout = async () => {
    try {
      await authService.logout().catch(() => null);
    } finally {
      localStorage.removeItem('sr_token');
      localStorage.removeItem('sr_user');
      setUser(null);
      setAuthView('landing');
    }
  };

  // If user is not logged in, render Landing Page or Authentication sub-views
  if (!user) {
    if (authView === 'landing') {
      return (
        <LandingPage
          onNavigateLogin={() => setAuthView('login')}
          onNavigateRegister={(role) => {
            setSelectedRoleForRegister(role || 'HR_MANAGER');
            setAuthView('register');
          }}
          onQuickDemoLogin={handleLoginSuccess}
        />
      );
    }

    if (authView === 'register') {
      return (
        <Register
          initialRole={selectedRoleForRegister}
          onRegisterSuccess={handleLoginSuccess}
          onNavigateLogin={() => setAuthView('login')}
          onNavigateHome={() => setAuthView('landing')}
        />
      );
    }

    if (authView === 'forgot-password') {
      return (
        <ForgotPassword
          onNavigateLogin={() => setAuthView('login')}
          onNavigateResetWithToken={(tok) => {
            setResetToken(tok);
            setAuthView('reset-password');
          }}
          onNavigateHome={() => setAuthView('landing')}
        />
      );
    }

    if (authView === 'reset-password') {
      return (
        <ResetPassword
          token={resetToken}
          onNavigateLogin={() => setAuthView('login')}
          onNavigateHome={() => setAuthView('landing')}
        />
      );
    }

    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onNavigateRegister={() => {
          setSelectedRoleForRegister('HR_MANAGER');
          setAuthView('register');
        }}
        onNavigateForgotPassword={() => setAuthView('forgot-password')}
        onNavigateHome={() => setAuthView('landing')}
      />
    );
  }

  const renderActivePage = () => {
    const isCandidate = user?.role === 'CANDIDATE';
    const isHR = user?.role === 'HR_MANAGER';
    const isAdmin = user?.role === 'ADMIN';

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
        return <Pricing user={user} onNavigateToDashboard={() => setActiveTab(isAdmin ? 'admin-center' : 'dashboard')} />;
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} user={user} />;
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
        return isAdmin ? <AdminControlCenter user={user} /> : <Dashboard setActiveTab={setActiveTab} user={user} />;
    }
  };

  return (
    <div className="app-container">
      {/* SaaS Sidebar with Collapsible layout */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
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
          setActiveTab={setActiveTab}
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
