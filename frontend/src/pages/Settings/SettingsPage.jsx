import { useState, useEffect } from 'react';
import styles from './SettingsPage.module.css';
import { useAuth } from '../../contexts/AuthContext';
import { useSpace } from '../../contexts/SpaceContext';
import { useToast } from '../../contexts/ToastContext';

const SECTIONS = [
  { id: 'profile', label: 'Profile' },
  { id: 'space', label: 'Space Settings' },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const { user } = useAuth();
  const { currentSpace, updateCurrentSpace, canManageSpace } = useSpace();
  const { showToast } = useToast();
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [spaceData, setSpaceData] = useState({
    name: currentSpace?.name || '',
    type: currentSpace?.type || '',
    address: currentSpace?.address || '',
    description: currentSpace?.description || '',
  });
  
  const [isSavingSpace, setIsSavingSpace] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (currentSpace) {
      setSpaceData({
        name: currentSpace.name || '',
        type: currentSpace.type || '',
        address: currentSpace.address || '',
        description: currentSpace.description || '',
      });
    }
  }, [currentSpace]);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };
  
  const handleSpaceChange = (e) => {
    setSpaceData({ ...spaceData, [e.target.name]: e.target.value });
  };

  const handleSaveSpace = async () => {
    if (!spaceData.name.trim()) {
      showToast('Space name is required', 'error');
      return;
    }
    setIsSavingSpace(true);
    try {
      await updateCurrentSpace({
        name: spaceData.name.trim(),
        type: spaceData.type,
        address: spaceData.address.trim() || undefined,
        description: spaceData.description.trim() || undefined,
      });
      showToast('Space settings updated successfully', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update space settings', 'error');
    } finally {
      setIsSavingSpace(false);
    }
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Profile Information</h2>
            <p className={styles.sectionDescription}>Update your personal information and contact details.</p>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Full Name</label>
              <input type="text" name="name" value={profileData.name} onChange={handleProfileChange} className={styles.input} />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address</label>
              <input type="email" name="email" value={profileData.email} onChange={handleProfileChange} className={styles.input} />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Phone Number</label>
              <input type="tel" name="phone" value={profileData.phone} onChange={handleProfileChange} className={styles.input} />
            </div>

            <button className={styles.saveButton}>Save Profile</button>
          </div>
        );
      case 'space':
        return (
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Space Settings</h2>
            <p className={styles.sectionDescription}>Manage settings for your current space.</p>
            
            {!currentSpace ? (
              <p>No space selected. Select a space to manage its settings.</p>
            ) : !canManageSpace() ? (
              <p>You do not have permission to manage this space's settings.</p>
            ) : (
              <>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Space Name *</label>
                  <input type="text" name="name" value={spaceData.name} onChange={handleSpaceChange} className={styles.input} disabled={isSavingSpace} />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Type</label>
                  <select name="type" value={spaceData.type} onChange={handleSpaceChange} className={styles.input} disabled={isSavingSpace}>
                    {['Apartment','PG','Hostel','Shared House','Other'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Address</label>
                  <input type="text" name="address" value={spaceData.address} onChange={handleSpaceChange} className={styles.input} disabled={isSavingSpace} />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Description</label>
                  <textarea name="description" value={spaceData.description} onChange={handleSpaceChange} className={styles.input} disabled={isSavingSpace} rows={3} style={{ resize: 'vertical' }} />
                </div>

                <button className={styles.saveButton} onClick={handleSaveSpace} disabled={isSavingSpace}>
                  {isSavingSpace ? 'Saving…' : 'Save Space Settings'}
                </button>
              </>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Settings</h1>
          <p className={styles.subtitle}>Manage your account settings and preferences.</p>
        </div>
      </header>

      <div className={styles.settingsLayout}>
        <aside className={styles.sidebar}>
          <nav className={styles.nav}>
            {SECTIONS.map(section => (
              <button
                key={section.id}
                className={`${styles.navItem} ${activeSection === section.id ? styles.active : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className={styles.mainContent}>
          {renderSectionContent()}
        </main>
      </div>
    </div>
  );
}
