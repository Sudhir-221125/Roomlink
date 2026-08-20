import styles from './OverviewMetrics.module.css';

export default function OverviewMetrics() {
  return (
    <section className={styles.section} aria-label="Overview Metrics">
      <div className={styles.metricsGrid}>
        
        {/* Large Visual KPI: Rent */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <h3>Rent Collection</h3>
            <span className={styles.badgeSuccess}>On track</span>
          </div>
          <div className={styles.kpiBody}>
            <div className={styles.kpiValue}>
              <span className={styles.currency}>₹</span>18,500 
              <span className={styles.kpiTarget}>/ ₹24,000</span>
            </div>
            <div className={styles.progressBarWrap} aria-hidden="true">
              <div className={styles.progressBar} style={{ width: '77%' }} />
            </div>
            <p className={styles.kpiSub}>₹5,500 remaining for this month</p>
          </div>
        </div>

        {/* Medium Visual KPI: Occupancy */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <h3>Occupancy</h3>
            <span className={styles.badgeNeutral}>Stable</span>
          </div>
          <div className={styles.kpiBody}>
            <div className={styles.occupancyVisual}>
              <div className={styles.occItemActive} title="Room 1 (Occupied)"></div>
              <div className={styles.occItemActive} title="Room 2 (Occupied)"></div>
              <div className={styles.occItemActive} title="Room 3 (Occupied)"></div>
              <div className={styles.occItemActive} title="Room 4 (Occupied)"></div>
              <div className={styles.occItemEmpty} title="Room 5 (Empty)"></div>
            </div>
            <div className={styles.kpiValue}>
              4 <span className={styles.kpiTarget}>/ 5 Rooms</span>
            </div>
            <p className={styles.kpiSub}>Room 5 is currently vacant</p>
          </div>
        </div>

        {/* Smaller Chips: Bills & Chores */}
        <div className={styles.chipsCol}>
          <div className={styles.chipCard}>
            <div className={styles.chipIconWrap} style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#d97706' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div className={styles.chipContent}>
              <h4>3 Pending Bills</h4>
              <p>₹3,240 total</p>
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
              <h4>2 Open Issues</h4>
              <p>1 in progress</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
