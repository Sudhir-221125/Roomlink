/**
 * App.jsx
 * RoomLink root component.
 * Manages active page state and renders the appropriate page inside AppLayout.
 */
import { useState } from 'react';
import AppLayout from './layouts/AppLayout';
import DashboardPage from './pages/Dashboard/DashboardPage';
import PlaceholderPage from './pages/Placeholder/PlaceholderPage';

// Pages that are fully implemented
const IMPLEMENTED_PAGES = new Set(['dashboard']);

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');

  function renderPage() {
    if (IMPLEMENTED_PAGES.has(activePage)) {
      switch (activePage) {
        case 'dashboard':
          return <DashboardPage />;
        default:
          return null;
      }
    }
    // Show a contextual placeholder for unimplemented pages
    return <PlaceholderPage page={activePage} />;
  }

  return (
    <AppLayout activePage={activePage} onNavigate={setActivePage}>
      {renderPage()}
    </AppLayout>
  );
}
