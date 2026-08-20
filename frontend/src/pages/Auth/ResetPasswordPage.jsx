import { useState } from 'react';

export default function ResetPasswordPage({ onNavigate }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
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

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onNavigate('auth-signin');
    }, 1000);
  };

  return (
    <>
      <div className="auth-header">
        <h1 className="auth-title">Set new password</h1>
        <p className="auth-subtitle">Your new password must be different to previously used passwords.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-field">
          <label htmlFor="password" className="auth-label">New password</label>
          <input 
            id="password" 
            type="password" 
            className="auth-input" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={isSubmitting}
            aria-invalid={!!error && error.includes('Password')}
          />
        </div>

        <div className="auth-field">
          <label htmlFor="confirmPassword" className="auth-label">Confirm new password</label>
          <input 
            id="confirmPassword" 
            type="password" 
            className="auth-input" 
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            disabled={isSubmitting}
            aria-invalid={!!error && error.includes('match')}
          />
        </div>

        {error && (
          <p className="auth-error-msg" role="alert">{error}</p>
        )}

        <button 
          type="submit" 
          className="rl-btn rl-btn-primary auth-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Resetting...' : 'Reset password'}
        </button>
      </form>
    </>
  );
}
