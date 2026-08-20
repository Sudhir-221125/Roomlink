import { useState } from 'react';

export default function ForgotPasswordPage({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1000);
  };

  if (isSuccess) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div className="auth-header">
          <div style={{ margin: '0 auto var(--space-4)', width: '48px', height: '48px', background: 'var(--color-success-bg)', color: 'var(--color-success-text)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h1 className="auth-title">Check your email</h1>
          <p className="auth-subtitle">We sent a password reset link to <br/><strong>{email}</strong></p>
        </div>
        <button 
          className="rl-btn rl-btn-primary auth-btn"
          onClick={() => onNavigate('auth-signin')}
        >
          Return to sign in
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="auth-header">
        <h1 className="auth-title">Reset password</h1>
        <p className="auth-subtitle">Enter your email address and we'll send you a link to reset your password.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-field">
          <label htmlFor="email" className="auth-label">Email address</label>
          <input 
            id="email" 
            type="email" 
            className="auth-input" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={isSubmitting}
            aria-invalid={!!error}
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
          {isSubmitting ? 'Sending...' : 'Send reset link'}
        </button>
      </form>

      <p className="auth-footer">
        <button className="auth-link" style={{ background: 'none', border: 'none', padding: 0 }} onClick={() => onNavigate('auth-signin')}>
          &larr; Back to sign in
        </button>
      </p>
    </>
  );
}
