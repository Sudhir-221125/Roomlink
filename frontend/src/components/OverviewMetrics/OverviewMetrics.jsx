import styles from './OverviewMetrics.module.css';

export default function OverviewMetrics({ 
  totalBilled = 0, 
  totalPaid = 0, 
  outstandingAmount = 0, 
  pendingBillsCount = 0, 
  membersCount = 0, 
  openIssuesCount = 0, 
  inProgressIssuesCount = 0,
  isLoading = false
}) {
  const collectionProgress = totalBilled > 0 ? (totalPaid / totalBilled) * 100 : 100;
  
  return (
    <section className={styles.section} aria-label="Overview Metrics">
      <div className={styles.metricsGrid}>
        
        {/* Large Visual KPI: Rent / Bill Collection */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <h3>Bill Collection</h3>
            {isLoading ? (
               <span className={styles.badgeNeutral}>Loading...</span>
            ) : outstandingAmount === 0 && totalBilled > 0 ? (
               <span className={styles.badgeSuccess}>All paid</span>
            ) : outstandingAmount === 0 ? (
               <span className={styles.badgeNeutral}>No bills</span>
            ) : (
               <span className={styles.badgeWarning}>Pending</span>
            )}
          </div>
          <div className={styles.kpiBody}>
            {isLoading ? (
               <div className={styles.kpiValue} style={{ color: 'var(--color-text-muted)', fontSize: '1.5rem' }}>Loading data...</div>
            ) : (
               <>
                 <div className={styles.kpiValue}>
                   <span className={styles.currency}>₹</span>{totalPaid.toLocaleString()} 
                   <span className={styles.kpiTarget}>/ ₹{totalBilled.toLocaleString()}</span>
                 </div>
                 <div className={styles.progressBarWrap} aria-hidden="true">
                   <div className={styles.progressBar} style={{ width: `${Math.min(collectionProgress, 100)}%` }} />
                 </div>
                 <p className={styles.kpiSub}>
                   {outstandingAmount > 0 ? `₹${outstandingAmount.toLocaleString()} remaining` : 'All bills settled'}
                 </p>
               </>
            )}
          </div>
        </div>

        {/* Medium Visual KPI: Members */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <h3>Members</h3>
            <span className={styles.badgeSuccess}>Active</span>
          </div>
          <div className={styles.kpiBody}>
             {isLoading ? (
               <div className={styles.kpiValue} style={{ color: 'var(--color-text-muted)', fontSize: '1.5rem' }}>Loading...</div>
             ) : (
               <>
                 <div className={styles.occupancyVisual}>
                   {Array.from({ length: Math.min(membersCount, 5) }).map((_, i) => (
                     <div key={i} className={styles.occItemActive} title="Member (Active)"></div>
                   ))}
                   {membersCount === 0 && <div className={styles.occItemEmpty} title="No Members"></div>}
                 </div>
                 <div className={styles.kpiValue}>
                   {membersCount} <span className={styles.kpiTarget}>Residents</span>
                 </div>
                 <p className={styles.kpiSub}>{membersCount} active members in space</p>
               </>
             )}
          </div>
        </div>

        {/* Smaller Chips: Bills & Issues */}
        <div className={styles.chipsCol}>
          <div className={styles.chipCard}>
            <div className={styles.chipIconWrap} style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#d97706' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div className={styles.chipContent}>
              <h4>{isLoading ? '...' : pendingBillsCount} Pending {pendingBillsCount === 1 ? 'Bill' : 'Bills'}</h4>
              <p>{isLoading ? 'Loading' : `₹${outstandingAmount.toLocaleString()} total`}</p>
            </div>
          </div>
          
          <div className={styles.chipCard}>
            <div className={styles.chipIconWrap} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#2563eb' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div className={styles.chipContent}>
              <h4>{isLoading ? '...' : openIssuesCount} Open {openIssuesCount === 1 ? 'Issue' : 'Issues'}</h4>
              <p>{isLoading ? 'Loading' : `${inProgressIssuesCount} in progress`}</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
