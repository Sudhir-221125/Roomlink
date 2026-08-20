/**
 * SignInPage.jsx
 * Connects to POST /api/auth/login via AuthContext.
 * Handles 401 (wrong credentials) and network errors gracefully.
 */
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ApiError } from '../../services/api';

export default function SignInPage({ onNavigate }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      // Success — navigate into the app
      onNavigate('app');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError('Invalid email or password. Please try again.');
        } else if (err.status === 0) {
          setError('Cannot connect to the server. Is the backend running?');
        } else {
          setError(err.message || 'Sign in failed. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="auth-header">
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to manage your spaces.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-field">
          <label htmlFor="signin-email" className="auth-label">Email address</label>
          <input
            id="signin-email"
            type="email"
            className="auth-input"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={isLoading}
            autoComplete="email"
            aria-invalid={!!error}
          />
        </div>

        <div className="auth-field">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <label htmlFor="signin-password" className="auth-label">Password</label>
            <button
              type="button"
              className="auth-link"
              style={{ background: 'none', border: 'none', padding: 0, fontSize: 'var(--text-xs)' }}
              onClick={() => onNavigate('auth-forgot')}
            >
              Forgot password?
            </button>
          </div>
          <input
            id="signin-password"
            type="password"
            className="auth-input"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={isLoading}
            autoComplete="current-password"
            aria-invalid={!!error}
          />
        </div>

        {error && (
          <p className="auth-error-msg" role="alert">{error}</p>
        )}

        <button
          type="submit"
          className="rl-btn rl-btn-primary auth-btn"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="auth-footer">
        Don&apos;t have an account?{' '}
        <button
          className="auth-link"
          style={{ background: 'none', border: 'none', padding: 0 }}
          onClick={() => onNavigate('auth-signup')}
        >
          Sign up
        </button>
      </p>
    </>
  );
}
