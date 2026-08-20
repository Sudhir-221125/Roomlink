export default function VerifyEmailPage({ onNavigate }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div className="auth-header">
        <div style={{ margin: '0 auto var(--space-4)', width: '48px', height: '48px', background: 'var(--color-success-bg)', color: 'var(--color-success-text)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h1 className="auth-title">Email Verified</h1>
        <p className="auth-subtitle">Your email address has been successfully verified.</p>
      </div>
      <button 
        className="rl-btn rl-btn-primary auth-btn"
        onClick={() => onNavigate('onboarding')}
      >
        Continue to RoomLink
      </button>
    </div>
  );
}
