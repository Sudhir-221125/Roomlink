import { useState } from 'react';
import styles from './SettingsPage.module.css';

const SECTIONS = [
  { id: 'profile', label: 'Profile' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'preferences', label: 'Preferences' },
  { id: 'account', label: 'Account' },
  { id: 'privacy', label: 'Privacy' },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  
  // Mock form state
  const [profileData, setProfileData] = useState({
    name: 'Admin User',
    email: 'admin@roomlink.com',
    phone: '555-0000',
  });

  const [appearanceData, setAppearanceData] = useState({
    theme: 'light',
    density: 'comfortable',
  });

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
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

            <button className={styles.saveButton}>Save Changes</button>
          </div>
        );
      case 'appearance':
        return (
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Appearance</h2>
            <p className={styles.sectionDescription}>Customize how RoomLink looks on your device.</p>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Theme</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input type="radio" name="theme" checked={appearanceData.theme === 'light'} onChange={() => setAppearanceData({...appearanceData, theme: 'light'})} />
                  Light
                </label>
                <label className={styles.radioLabel}>
                  <input type="radio" name="theme" checked={appearanceData.theme === 'dark'} onChange={() => setAppearanceData({...appearanceData, theme: 'dark'})} />
                  Dark
                </label>
                <label className={styles.radioLabel}>
                  <input type="radio" name="theme" checked={appearanceData.theme === 'system'} onChange={() => setAppearanceData({...appearanceData, theme: 'system'})} />
                  System
                </label>
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Notification Preferences</h2>
            <p className={styles.sectionDescription}>Choose what you want to be notified about.</p>
            
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" defaultChecked />
                <span>Email notifications for new rent payments</span>
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" defaultChecked />
                <span>Email notifications for new complaints</span>
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" defaultChecked />
                <span>Push notifications for chore reminders</span>
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" />
                <span>Weekly summary email</span>
              </label>
            </div>
          </div>
        );
      default:
        return (
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>{SECTIONS.find(s => s.id === activeSection)?.label}</h2>
            <p className={styles.sectionDescription}>Settings for this section are coming soon.</p>
          </div>
        );
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
