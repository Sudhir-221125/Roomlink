/**
 * App.jsx
 * RoomLink root component.
 *
 * Manages the top-level view state (landing | auth | onboarding | app).
 * Wraps everything in AuthProvider + SpaceProvider so all children have access.
 * Restores authenticated sessions automatically via AuthContext on startup.
 */
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SpaceProvider } from './contexts/SpaceContext';
import { ToastProvider } from './contexts/ToastContext';
import AppLayout from './layouts/AppLayout';
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardPage from './pages/Dashboard/DashboardPage';
import PlaceholderPage from './pages/Placeholder/PlaceholderPage';
import LandingPage from './pages/Landing/LandingPage';

// Auth Pages
import SignInPage from './pages/Auth/SignInPage';
import SignUpPage from './pages/Auth/SignUpPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';
import VerifyEmailPage from './pages/Auth/VerifyEmailPage';

// Onboarding
import OnboardingFlow from './pages/Onboarding/OnboardingFlow';

// Product Pages
import MembersPage from './pages/Rooms/RoomsPage';   // Rooms page repurposed as Members
import RentPage from './pages/Rent/RentPage';
import BillsPage from './pages/Bills/BillsPage';
import ChoresPage from './pages/Chores/ChoresPage';
import ComplaintsPage from './pages/Complaints/ComplaintsPage';
import GuestsPage from './pages/Guests/GuestsPage';
import NotificationsPage from './pages/Notifications/NotificationsPage';
import SettingsPage from './pages/Settings/SettingsPage';

// Pages that render a real component in the authenticated shell
const IMPLEMENTED_PAGES = new Set([
  'overview',
  'members',
  'rent',
  'bills',
  'chores',
  'complaints',
  'guests',
  'notifications',
  'settings',
]);

// ── Inner app — has access to AuthContext ────────────────────────────────────
function AppInner() {
  const { isAuthenticated, isLoading } = useAuth();
  const [appView, setAppView] = useState('loading'); // Start in loading state
  const [activePage, setActivePage] = useState('overview');

  // Once auth state is known, decide initial view
  useEffect(() => {
    if (!isLoading) {
      setAppView(isAuthenticated ? 'app' : 'landing');
    }
  }, [isLoading, isAuthenticated]);

  function navigateTo(view) {
    setAppView(view);
    window.scrollTo(0, 0);
  }

  function handleLogout() {
    navigateTo('landing');
    setActivePage('overview');
  }

  // Called when 401 event fires globally
  useEffect(() => {
    function handleSessionExpired() {
      navigateTo('auth-signin');
      setActivePage('overview');
    }
    window.addEventListener('rl:unauthorized', handleSessionExpired);
    return () => window.removeEventListener('rl:unauthorized', handleSessionExpired);
  }, []);

  function renderAppPage() {
    if (IMPLEMENTED_PAGES.has(activePage)) {
      switch (activePage) {
        case 'overview':       return <DashboardPage />;
        case 'members':        return <MembersPage />;
        case 'rent':           return <RentPage />;
        case 'bills':          return <BillsPage />;
        case 'chores':         return <ChoresPage />;
        case 'complaints':     return <ComplaintsPage />;
        case 'guests':         return <GuestsPage />;
        case 'notifications':  return <NotificationsPage />;
        case 'settings':       return <SettingsPage />;
        default: return null;
      }
    }
    return <PlaceholderPage page={activePage} />;
  }

  // Loading screen while session is being restored
  if (appView === 'loading') {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'var(--color-bg, #f8fafc)',
        color: 'var(--color-text-muted, #64748b)',
        fontFamily: 'var(--font-sans, system-ui)',
        fontSize: '0.9rem',
        gap: '0.5rem',
        flexDirection: 'column',
      }}>
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40" style={{ opacity: 0.7 }}>
          <rect width="32" height="32" rx="8" fill="var(--color-primary, #6366f1)" />
          <path d="M7 22V13l9-7 9 7v9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="13" y="16" width="6" height="6" rx="1" fill="#fff" fillOpacity="0.85" />
        </svg>
        <span>Loading RoomLink…</span>
      </div>
    );
  }

  // --- Top-level View Router ---
  switch (appView) {
    case 'landing':
      return (
        <PublicLayout onLogin={() => navigateTo('auth-signin')}>
          <LandingPage onLogin={() => navigateTo('auth-signup')} />
        </PublicLayout>
      );

    case 'auth-signin':
      return <AuthLayout><SignInPage onNavigate={navigateTo} /></AuthLayout>;
    case 'auth-signup':
      return <AuthLayout><SignUpPage onNavigate={navigateTo} /></AuthLayout>;
    case 'auth-forgot':
      return <AuthLayout><ForgotPasswordPage onNavigate={navigateTo} /></AuthLayout>;
    case 'auth-reset':
      return <AuthLayout><ResetPasswordPage onNavigate={navigateTo} /></AuthLayout>;
    case 'auth-verify':
      return <AuthLayout><VerifyEmailPage onNavigate={navigateTo} /></AuthLayout>;

    case 'onboarding':
      return (
        <OnboardingFlow
          onComplete={() => navigateTo('app')}
          onCancel={() => navigateTo('auth-signin')}
        />
      );

    case 'app':
      return (
        <ToastProvider>
          <SpaceProvider>
            <AppLayout
              activePage={activePage}
              onNavigate={setActivePage}
              onLogout={handleLogout}
            >
              {renderAppPage()}
            </AppLayout>
          </SpaceProvider>
        </ToastProvider>
      );

    default:
      return null;
  }
}

// ── Root — wraps everything in AuthProvider ──────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
