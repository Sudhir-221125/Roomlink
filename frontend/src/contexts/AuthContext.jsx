/**
 * AuthContext.jsx
 * Provides application-wide authentication state.
 *
 * - Restores session on startup via GET /api/auth/me
 * - Exposes login(), register(), logout() which call real backend APIs
 * - Listens for the rl:unauthorized event from api.js to handle 401 globally
 * - Never stores or exposes password_hash
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe, login as apiLogin, register as apiRegister, logout as apiLogout } from '../services/authService.js';
import { getStoredToken } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children, onSessionExpired }) {
  const [user, setUser]               = useState(null);
  const [isLoading, setIsLoading]     = useState(true);  // true until session check done
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ── Session restore on app load ──────────────────────────────────────────
  useEffect(() => {
    async function restoreSession() {
      const token = getStoredToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const data = await getMe();
        // Backend returns { user } or the user directly depending on response shape
        const resolvedUser = data?.user || data;
        setUser(resolvedUser);
        setIsAuthenticated(true);
      } catch {
        // Token invalid or expired — clear it
        apiLogout();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }
    restoreSession();
  }, []);

  // ── Global 401 handler (from api.js event) ───────────────────────────────
  useEffect(() => {
    function handleUnauthorized() {
      setUser(null);
      setIsAuthenticated(false);
      if (onSessionExpired) onSessionExpired();
    }
    window.addEventListener('rl:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('rl:unauthorized', handleUnauthorized);
  }, [onSessionExpired]);

  // ── Auth actions ─────────────────────────────────────────────────────────

  const login = useCallback(async (email, password) => {
    const data = await apiLogin({ email, password });
    const resolvedUser = data?.user || data;
    setUser(resolvedUser);
    setIsAuthenticated(true);
    return data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const data = await apiRegister({ name, email, password });
    const resolvedUser = data?.user || data;
    setUser(resolvedUser);
    setIsAuthenticated(true);
    return data;
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
