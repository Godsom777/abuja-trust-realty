"use client";

import { useState } from 'react';
import styles from './page.module.css';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('upload'); // upload, verify, settings

  // Settings State
  const [commMode, setCommMode] = useState('whatsapp');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === '1238') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  const handleUpload = (e) => {
    // Only simulate if files are selected
    if (e.target.files && e.target.files.length > 0) {
      setUploadProgress(10);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 15;
        });
      }, 300);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <div className={styles.authIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h1 className={styles.authTitle}>Admin Access</h1>
          <p className={styles.authSubtitle}>Enter your password to access the dashboard</p>
          <form onSubmit={handleLogin} className={styles.authForm}>
            <div className={styles.inputGroup}>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className={styles.input}
                autoFocus
              />
            </div>
            {error && <p className={styles.errorText}>{error}</p>}
            <button type="submit" className={`btn btn-primary ${styles.loginBtn}`}>
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.logo}>Abuja<span>Trust</span></h2>
          <span className={styles.badge}>Admin</span>
        </div>
        <nav className={styles.nav}>
          <button 
            className={`${styles.navItem} ${activeTab === 'upload' ? styles.active : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            Media Upload
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'verify' ? styles.active : ''}`}
            onClick={() => setActiveTab('verify')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            Verifications
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'settings' ? styles.active : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            Settings
          </button>
        </nav>
        <div className={styles.sidebarFooter}>
          <button onClick={() => setIsAuthenticated(false)} className={styles.logoutBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Sign Out
          </button>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>
            {activeTab === 'upload' && 'Upload Media'}
            {activeTab === 'verify' && 'Pending Verifications'}
            {activeTab === 'settings' && 'Platform Settings'}
          </h1>
          <div className={styles.userProfile}>
            <div className={styles.avatar}>A</div>
          </div>
        </header>

        <div className={styles.contentArea}>
          {activeTab === 'upload' ? (
            <div className={styles.uploadSection}>
              <div className={styles.uploadCard}>
                <div className={styles.dropzone}>
                  <div className={styles.dropzoneIcon}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </div>
                  <h3>Drag & drop videos or pictures here</h3>
                  <p>Support for MP4, MOV, JPG, PNG (Max 500MB)</p>
                  <label className={`btn btn-secondary ${styles.browseBtn}`}>
                    Browse Files
                    <input type="file" hidden multiple accept="video/*,image/*" onChange={handleUpload} />
                  </label>
                </div>
                
                {uploadProgress > 0 && (
                  <div className={styles.uploadProgress}>
                    <div className={styles.progressHeader}>
                      <span className={styles.fileName}>Uploading media...</span>
                      <span className={styles.percentage}>{uploadProgress}%</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === 'verify' ? (
            <div className={styles.verifySection}>
              <div className={styles.verifyGrid}>
                {[1, 2, 3].map((item) => (
                  <div key={item} className={styles.verifyCard}>
                    <div className={styles.verifyCardHeader}>
                      <span className={styles.statusBadge}>Pending Review</span>
                      <span className={styles.timeAgo}>2 hours ago</span>
                    </div>
                    <h3 className={styles.propertyTitle}>4 Bedroom Duplex - Maitama</h3>
                    <p className={styles.uploader}>Uploaded by: <strong>Agent JD</strong></p>
                    <div className={styles.mediaPreview}>
                      <div className={styles.previewPlaceholder}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                        <span>Video Tour (3:45)</span>
                      </div>
                    </div>
                    <div className={styles.verifyActions}>
                      <button className={`btn btn-secondary ${styles.rejectBtn}`}>Reject</button>
                      <button className={`btn btn-primary ${styles.approveBtn}`}>Approve</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.settingsSection}>
              <div className={styles.settingsGrid}>
                
                {/* Communication Settings */}
                <div className={styles.settingsCard}>
                  <div className={styles.settingsHeader}>
                    <div className={styles.settingsIconWrapper}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    </div>
                    <div>
                      <h3 className={styles.settingsTitle}>Lead Communication</h3>
                      <p className={styles.settingsDesc}>How users contact agents for properties.</p>
                    </div>
                  </div>
                  <div className={styles.settingsBody}>
                    <div className={styles.radioGroup}>
                      <label className={`${styles.radioLabel} ${commMode === 'whatsapp' ? styles.activeRadio : ''}`}>
                        <input 
                          type="radio" 
                          name="commMode" 
                          value="whatsapp" 
                          checked={commMode === 'whatsapp'} 
                          onChange={() => setCommMode('whatsapp')} 
                          className={styles.hiddenRadio}
                        />
                        <span className={styles.radioCustom}></span>
                        <div>
                          <strong>WhatsApp Priority</strong>
                          <p>Direct users to WhatsApp chats.</p>
                        </div>
                      </label>
                      <label className={`${styles.radioLabel} ${commMode === 'email' ? styles.activeRadio : ''}`}>
                        <input 
                          type="radio" 
                          name="commMode" 
                          value="email" 
                          checked={commMode === 'email'} 
                          onChange={() => setCommMode('email')} 
                          className={styles.hiddenRadio}
                        />
                        <span className={styles.radioCustom}></span>
                        <div>
                          <strong>Email Priority</strong>
                          <p>Direct users to an email contact form.</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Platform Settings */}
                <div className={styles.settingsCard}>
                  <div className={styles.settingsHeader}>
                    <div className={styles.settingsIconWrapper}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                    </div>
                    <div>
                      <h3 className={styles.settingsTitle}>Platform Controls</h3>
                      <p className={styles.settingsDesc}>Manage site-wide behaviors.</p>
                    </div>
                  </div>
                  <div className={styles.settingsBody}>
                    <div className={styles.toggleRow}>
                      <div>
                        <strong>Maintenance Mode</strong>
                        <p>Display a "coming soon" page to users.</p>
                      </div>
                      <label className={styles.switch}>
                        <input 
                          type="checkbox" 
                          checked={maintenanceMode} 
                          onChange={(e) => setMaintenanceMode(e.target.checked)} 
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </div>
                    <div className={styles.toggleRow}>
                      <div>
                        <strong>Email Notifications</strong>
                        <p>Receive updates for new property uploads.</p>
                      </div>
                      <label className={styles.switch}>
                        <input 
                          type="checkbox" 
                          checked={emailNotifications} 
                          onChange={(e) => setEmailNotifications(e.target.checked)} 
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </div>
                  </div>
                </div>

              </div>
              <div className={styles.settingsActions}>
                <button className={`btn btn-primary ${styles.saveSettingsBtn}`}>
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
