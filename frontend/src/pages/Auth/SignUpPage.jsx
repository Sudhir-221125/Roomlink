/**
 * SignUpPage.jsx
 * Connects to POST /api/auth/register via AuthContext.
 * Handles 409 (email already exists), validation errors, and network errors.
 */
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ApiError } from '../../services/api';

export default function SignUpPage({ onNavigate }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('resident');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    try {
      await register(name, email, password, role);
      // New user → send to onboarding (space setup)
      onNavigate('onboarding');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          setError('An account with this email already exists. Please sign in.');
        } else if (err.status === 400) {
          setError(err.message || 'Please check your input and try again.');
        } else if (err.status === 0) {
          setError('Cannot connect to the server. Is the backend running?');
        } else {
          setError(err.message || 'Registration failed. Please try again.');
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
        <h1 className="auth-title">Create an account</h1>
        <p className="auth-subtitle">Join RoomLink to organize your shared living.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-field">
          <label htmlFor="signup-name" className="auth-label">Full name</label>
          <input
            id="signup-name"
            type="text"
            className="auth-input"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={isLoading}
            autoComplete="name"
          />
        </div>

        <div className="auth-field">
          <label htmlFor="signup-email" className="auth-label">Email address</label>
          <input
            id="signup-email"
            type="email"
            className="auth-input"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={isLoading}
            autoComplete="email"
          />
        </div>

        <div className="auth-field">
          <label htmlFor="signup-password" className="auth-label">Password</label>
          <input
            id="signup-password"
            type="password"
            className="auth-input"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={isLoading}
            autoComplete="new-password"
            aria-invalid={!!error && error.includes('Password')}
          />
        </div>

        <div className="auth-field">
          <label htmlFor="signup-confirm" className="auth-label">Confirm password</label>
          <input
            id="signup-confirm"
            type="password"
            className="auth-input"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            autoComplete="new-password"
            aria-invalid={!!error && error.includes('match')}
          />
        </div>

        <div className="auth-field">
          <label htmlFor="signup-role" className="auth-label">I am a...</label>
          <select
            id="signup-role"
            className="auth-input"
            value={role}
            onChange={e => setRole(e.target.value)}
            disabled={isLoading}
          >
            <option value="resident">Resident</option>
            <option value="guest">Guest</option>
          </select>
        </div>

        {error && (
          <p className="auth-error-msg" role="alert">{error}</p>
        )}

        <button
          type="submit"
          className="rl-btn rl-btn-primary auth-btn"
          disabled={isLoading}
        >
          {isLoading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="auth-footer">
        Already have an account?{' '}
        <button
          className="auth-link"
          style={{ background: 'none', border: 'none', padding: 0 }}
          onClick={() => onNavigate('auth-signin')}
        >
          Sign in
        </button>
      </p>
    </>
  );
}
