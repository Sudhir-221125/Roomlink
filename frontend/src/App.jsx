/**
 * App.jsx
 * RoomLink root component.
 * Manages active page state and renders the appropriate page inside AppLayout.
 */
import { useState } from 'react';
import AppLayout from './layouts/AppLayout';
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardPage from './pages/Dashboard/DashboardPage';
import PlaceholderPage from './pages/Placeholder/PlaceholderPage';
import LandingPage from './pages/Landing/LandingPage';
import { ToastProvider } from './contexts/ToastContext';

// Auth Pages
import SignInPage from './pages/Auth/SignInPage';
import SignUpPage from './pages/Auth/SignUpPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';
import VerifyEmailPage from './pages/Auth/VerifyEmailPage';

// Onboarding
import OnboardingFlow from './pages/Onboarding/OnboardingFlow';

// Product Pages
import RoomsPage from './pages/Rooms/RoomsPage';
import RentPage from './pages/Rent/RentPage';
import BillsPage from './pages/Bills/BillsPage';
import ChoresPage from './pages/Chores/ChoresPage';
import ComplaintsPage from './pages/Complaints/ComplaintsPage';
import GuestsPage from './pages/Guests/GuestsPage';
import NotificationsPage from './pages/Notifications/NotificationsPage';
import SettingsPage from './pages/Settings/SettingsPage';

// Pages that are fully implemented in the authenticated shell
const IMPLEMENTED_PAGES = new Set([
  'overview',
  'rooms',
  'rent',
  'bills',
  'chores',
  'complaints',
  'guests',
  'notifications',
  'settings'
]);

export default function App() {
  const [appView, setAppView] = useState('landing');
  const [activePage, setActivePage] = useState('overview');

  function navigateTo(view) {
    setAppView(view);
    window.scrollTo(0, 0);
  }

  function handleLogout() {
    navigateTo('landing');
    setActivePage('overview');
  }

  function renderAppPage() {
    if (IMPLEMENTED_PAGES.has(activePage)) {
      switch (activePage) {
        case 'overview': return <DashboardPage />;
        case 'rooms': return <RoomsPage />;
        case 'rent': return <RentPage />;
        case 'bills': return <BillsPage />;
        case 'chores': return <ChoresPage />;
        case 'complaints': return <ComplaintsPage />;
        case 'guests': return <GuestsPage />;
        case 'notifications': return <NotificationsPage />;
        case 'settings': return <SettingsPage />;
        default:
          return null;
      }
    }
    return <PlaceholderPage page={activePage} />;
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
      return <OnboardingFlow onComplete={() => navigateTo('app')} onCancel={() => navigateTo('auth-signin')} />;

    case 'app':
      return (
        <ToastProvider>
          <AppLayout 
            activePage={activePage} 
            onNavigate={setActivePage}
            onLogout={handleLogout}
          >
            {renderAppPage()}
          </AppLayout>
        </ToastProvider>
      );
      
    default:
      return null;
  }
}
