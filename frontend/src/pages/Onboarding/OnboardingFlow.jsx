import { useState } from 'react';
import styles from './OnboardingFlow.module.css';

export default function OnboardingFlow({ onComplete, onCancel }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [role, setRole] = useState(null); // 'manager' | 'resident'
  const [propertyName, setPropertyName] = useState('');
  const [residentsCount, setResidentsCount] = useState('4');
  const [profileName, setProfileName] = useState('Alex Doe'); // Mock pre-fill

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleFinish = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onComplete();
    }, 1200);
  };

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
                    <p>I manage a property and want to invite residents.</p>
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

            {step === 2 && (
              <div className={styles.stepFadeIn}>
                <h1 className={styles.title}>
                  {role === 'manager' ? 'Set up your property' : 'Join a property'}
                </h1>
                <p className={styles.subtitle}>
                  {role === 'manager' 
                    ? 'Give your shared space a name so residents can recognize it.' 
                    : 'Enter the invite code provided by your manager or housemate.'}
                </p>
                
                <div className={styles.formGroup}>
                  {role === 'manager' ? (
                    <>
                      <div className="auth-field">
                        <label htmlFor="propName" className="auth-label">Property or House Name</label>
                        <input 
                          id="propName" 
                          className="auth-input" 
                          placeholder="e.g. The Sunnydale House"
                          value={propertyName}
                          onChange={e => setPropertyName(e.target.value)}
                        />
                      </div>
                      <div className="auth-field" style={{ marginTop: 'var(--space-4)' }}>
                        <label htmlFor="resCount" className="auth-label">Number of residents</label>
                        <select 
                          id="resCount" 
                          className="auth-input" 
                          value={residentsCount}
                          onChange={e => setResidentsCount(e.target.value)}
                        >
                          <option value="2">2 residents</option>
                          <option value="3">3 residents</option>
                          <option value="4">4 residents</option>
                          <option value="5+">5+ residents</option>
                        </select>
                      </div>
                    </>
                  ) : (
                    <div className="auth-field">
                      <label htmlFor="inviteCode" className="auth-label">Invite Code</label>
                      <input 
                        id="inviteCode" 
                        className="auth-input" 
                        placeholder="e.g. A3F9-K2L1"
                      />
                    </div>
                  )}
                </div>

                <div className={styles.actionsSplit}>
                  <button className="rl-btn" onClick={handleBack}>Back</button>
                  <button className="rl-btn rl-btn-primary" onClick={handleNext}>Continue</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className={styles.stepFadeIn}>
                <h1 className={styles.title}>Complete your profile</h1>
                <p className={styles.subtitle}>Add a photo so your housemates know it's you.</p>
                
                <div className={styles.profileSetup}>
                  <div className={styles.avatarUpload}>
                    <div className={styles.avatarCircle}>
                      {profileName.charAt(0)}
                    </div>
                    <button className={styles.uploadBtn}>Upload Photo</button>
                  </div>
                  
                  <div className="auth-field" style={{ width: '100%', maxWidth: '300px' }}>
                    <label htmlFor="profileName" className="auth-label">Display Name</label>
                    <input 
                      id="profileName" 
                      className="auth-input" 
                      value={profileName}
                      onChange={e => setProfileName(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className={styles.actionsSplit}>
                  <button className="rl-btn" onClick={handleBack} disabled={isSubmitting}>Back</button>
                  <button 
                    className="rl-btn rl-btn-primary" 
                    onClick={handleFinish}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Setting up...' : 'Go to Dashboard'}
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
