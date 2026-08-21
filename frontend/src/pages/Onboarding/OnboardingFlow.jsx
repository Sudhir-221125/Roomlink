/**
 * OnboardingFlow.jsx
 * Post-registration setup flow.
 *
 * Step 1: Choose role (Property Manager → creates Space | Resident → joins via invite)
 * Step 2a (manager): Create a Space via POST /api/spaces — REAL API
 * Step 2b (resident): Enter invite code — UI placeholder (backend not yet implemented)
 * Step 3: Profile confirmation — display name from auth, ready to go
 */
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSpace } from '../../contexts/SpaceContext';
import { ApiError } from '../../services/api';
import styles from './OnboardingFlow.module.css';

const SPACE_TYPES = ['Apartment', 'PG', 'Hostel', 'Shared House', 'Other'];

export default function OnboardingFlow({ onComplete, onCancel }) {
  const { user } = useAuth();
  const { createNewSpace } = useSpace();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  // Step 1: role choice
  const [role, setRole] = useState(null); // 'manager' | 'resident'

  // Step 2 — manager fields (maps to Space model)
  const [spaceName, setSpaceName] = useState('');
  const [spaceType, setSpaceType] = useState('Apartment');
  const [spaceAddress, setSpaceAddress] = useState('');
  const [spaceDescription, setSpaceDescription] = useState('');

  // Step 2 — resident field (invite code — future feature)
  const [inviteCode, setInviteCode] = useState('');

  const handleNext = () => {
    setApiError('');
    setStep(s => s + 1);
  };
  const handleBack = () => {
    setApiError('');
    setStep(s => s - 1);
  };

  const handleStep2Continue = async () => {
    setApiError('');
    if (role === 'manager') {
      if (!spaceName.trim() || !spaceAddress.trim()) {
        setApiError('Please enter a name and address for your space.');
        return;
      }
      setIsSubmitting(true);
      try {
        await createNewSpace({
          name: spaceName.trim(),
          type: spaceType,
          address: spaceAddress.trim(),
          description: spaceDescription.trim() || undefined,
        });
        handleNext();
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.status === 0) {
            setApiError('Cannot reach the server. You can continue and set up your space later.');
          } else {
            setApiError(err.message || 'Failed to create space. Please try again.');
          }
        } else {
          setApiError('An unexpected error occurred.');
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Resident invite — no backend yet, just proceed
      handleNext();
    }
  };

  const handleFinish = () => {
    onComplete();
  };

  // Pre-fill display name from auth user
  const displayName = user?.name || '';

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.brandBadge}>
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
            <rect width="32" height="32" rx="8" fill="var(--color-primary)" />
            <path d="M7 22V13l9-7 9 7v9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="13" y="16" width="6" height="6" rx="1" fill="#fff" fillOpacity="0.85" />
          </svg>
          RoomLink
        </div>
        <button className={styles.cancelBtn} onClick={onCancel} disabled={isSubmitting}>
          Cancel Setup
        </button>
      </header>

      <main className={styles.main}>
        <div className={styles.card}>

          {/* Progress Bar */}
          <div className={styles.progressWrap} aria-hidden="true">
            <div className={styles.progressBar} style={{ width: `${(step / 3) * 100}%` }} />
          </div>

          <div className={styles.content}>

            {/* ── Step 1: Role ── */}
            {step === 1 && (
              <div className={styles.stepFadeIn}>
                <h1 className={styles.title}>How will you use RoomLink?</h1>
                <p className={styles.subtitle}>We'll customize your experience based on your role.</p>

                <div className={styles.roleGrid}>
                  <button
                    className={`${styles.roleCard} ${role === 'manager' ? styles.roleCardActive : ''}`}
                    onClick={() => setRole('manager')}
                  >
                    <div className={styles.roleIcon}>🏢</div>
                    <h3>Property Manager</h3>
                    <p>I manage a shared space and want to invite residents.</p>
                  </button>

                  <button
                    className={`${styles.roleCard} ${role === 'resident' ? styles.roleCardActive : ''}`}
                    onClick={() => setRole('resident')}
                  >
                    <div className={styles.roleIcon}>🏠</div>
                    <h3>Resident</h3>
                    <p>I live in a shared space and want to join my house.</p>
                  </button>
                </div>

                <div className={styles.actions}>
                  <button
                    className="rl-btn rl-btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                    disabled={!role}
                    onClick={handleNext}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 2: Space setup ── */}
            {step === 2 && (
              <div className={styles.stepFadeIn}>
                <h1 className={styles.title}>
                  {role === 'manager' ? 'Set up your space' : 'Join a space'}
                </h1>
                <p className={styles.subtitle}>
                  {role === 'manager'
                    ? 'Create your shared living space. Members can be added after setup.'
                    : 'Enter the invite code provided by your manager or housemate.'}
                </p>

                <div className={styles.formGroup}>
                  {role === 'manager' ? (
                    <>
                      <div className="auth-field">
                        <label htmlFor="spaceName" className="auth-label">Space Name <span style={{color:'var(--color-danger)'}}>*</span></label>
                        <input
                          id="spaceName"
                          className="auth-input"
                          placeholder="e.g. The Sunnydale House, PG Nagar Block B"
                          value={spaceName}
                          onChange={e => setSpaceName(e.target.value)}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="auth-field" style={{ marginTop: 'var(--space-4)' }}>
                        <label htmlFor="spaceType" className="auth-label">Type</label>
                        <select
                          id="spaceType"
                          className="auth-input"
                          value={spaceType}
                          onChange={e => setSpaceType(e.target.value)}
                          disabled={isSubmitting}
                        >
                          {SPACE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="auth-field" style={{ marginTop: 'var(--space-4)' }}>
                        <label htmlFor="spaceAddress" className="auth-label">Address <span style={{color:'var(--color-danger)'}}>*</span></label>
                        <input
                          id="spaceAddress"
                          className="auth-input"
                          placeholder="e.g. 42 Park Street, Bangalore"
                          value={spaceAddress}
                          onChange={e => setSpaceAddress(e.target.value)}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="auth-field" style={{ marginTop: 'var(--space-4)' }}>
                        <label htmlFor="spaceDesc" className="auth-label">Description <span style={{color:'var(--color-text-muted)', fontWeight:400}}>(optional)</span></label>
                        <input
                          id="spaceDesc"
                          className="auth-input"
                          placeholder="A brief description of the space"
                          value={spaceDescription}
                          onChange={e => setSpaceDescription(e.target.value)}
                          disabled={isSubmitting}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="auth-field">
                        <label htmlFor="inviteCode" className="auth-label">Invite Code</label>
                        <input
                          id="inviteCode"
                          className="auth-input"
                          placeholder="e.g. A3F9-K2L1"
                          value={inviteCode}
                          onChange={e => setInviteCode(e.target.value)}
                        />
                      </div>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
                        💡 Invite-code joining is coming soon. You can skip for now and ask your manager to add you directly.
                      </p>
                    </>
                  )}
                </div>

                {apiError && (
                  <p className="auth-error-msg" role="alert" style={{ marginTop: 'var(--space-3)' }}>{apiError}</p>
                )}

                <div className={styles.actionsSplit}>
                  <button className="rl-btn" onClick={handleBack} disabled={isSubmitting}>Back</button>
                  <button
                    className="rl-btn rl-btn-primary"
                    onClick={handleStep2Continue}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating…' : 'Continue'}
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 3: Profile confirmation ── */}
            {step === 3 && (
              <div className={styles.stepFadeIn}>
                <h1 className={styles.title}>You&apos;re all set!</h1>
                <p className={styles.subtitle}>Your space has been created. Let&apos;s go to your dashboard.</p>

                <div className={styles.profileSetup}>
                  <div className={styles.avatarUpload}>
                    <div className={styles.avatarCircle}>
                      {displayName.charAt(0).toUpperCase() || '?'}
                    </div>
                  </div>

                  {displayName && (
                    <div style={{ marginTop: 'var(--space-3)', textAlign: 'center' }}>
                      <p style={{ fontWeight: 600, color: 'var(--color-text)' }}>{displayName}</p>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                        {role === 'manager' ? 'Space Owner' : 'Resident'}
                      </p>
                    </div>
                  )}
                </div>

                <div className={styles.actionsSplit}>
                  <button className="rl-btn" onClick={handleBack}>Back</button>
                  <button
                    className="rl-btn rl-btn-primary"
                    onClick={handleFinish}
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
