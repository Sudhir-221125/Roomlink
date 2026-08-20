import { useState, useEffect, useRef } from 'react';
import { useScrollReveal, useStaggeredReveal } from '../../hooks/useScrollReveal';
import styles from './LandingPage.module.css';

// Mock UI data for the interactive showcase
const SHOWCASE_ROOMS = [
  { id: '101', number: '101', type: 'Single', status: 'Occupied', resident: 'Alice Smith', rent: '₹8,500' },
  { id: '102', number: '102', type: 'Double', status: 'Vacant', resident: 'None', rent: '₹12,000' },
  { id: '103', number: '103', type: 'Single', status: 'Maintenance', resident: 'None', rent: '₹8,500' },
  { id: '201', number: '201', type: 'Suite', status: 'Occupied', resident: 'Bob Johnson', rent: '₹15,000' },
];

const SHOWCASE_PAYMENTS = [
  { id: 'p1', resident: 'Alice Smith', room: '101', amount: '₹8,500', dueDate: 'Oct 01', status: 'Paid' },
  { id: 'p2', resident: 'Bob Johnson', room: '201', amount: '₹15,000', dueDate: 'Oct 01', status: 'Paid' },
  { id: 'p3', resident: 'Charlie Davis', room: '202', amount: '₹8,500', dueDate: 'Oct 01', status: 'Overdue' },
  { id: 'p4', resident: 'Diana Evans', room: '103', amount: '₹8,500', dueDate: 'Oct 01', status: 'Pending' },
];

const INITIAL_SHOWCASE_CHORES = [
  { id: 'c1', title: 'Take out the trash', assigned: 'Alice S.', status: 'Pending', priority: 'High' },
  { id: 'c2', title: 'Clean the kitchen', assigned: 'Bob J.', status: 'Pending', priority: 'Medium' },
  { id: 'c3', title: 'Vacuum common area', assigned: 'Charlie D.', status: 'Completed', priority: 'Medium' },
  { id: 'c4', title: 'Mop the hallways', assigned: 'Diana E.', status: 'Pending', priority: 'Low' },
];

const SHOWCASE_COMPLAINTS = [
  { id: 'iss-01', title: 'Leaking bathroom faucet', resident: 'Alice S.', priority: 'High', status: 'Open' },
  { id: 'iss-02', title: 'AC remote not working', resident: 'Bob J.', priority: 'Medium', status: 'In Progress' },
  { id: 'iss-03', title: 'Broken window blind', resident: 'Charlie D.', priority: 'Low', status: 'Open' },
];

export default function LandingPage({ onLogin }) {
  // Reveal hooks
  const heroRef = useStaggeredReveal(`.${styles.heroRevealItem}`, { threshold: 0.05 });
  const valueStripRef = useScrollReveal({ threshold: 0.1 });
  const rightPlaceRef = useScrollReveal({ threshold: 0.1 });
  const showcaseRef = useScrollReveal({ threshold: 0.1 });
  const workflowRef = useStaggeredReveal(`.${styles.workflowStep}`, { threshold: 0.1 });
  const benefitsRef = useStaggeredReveal(`.${styles.benefitCard}`, { threshold: 0.1 });
  const credibilityRef = useScrollReveal({ threshold: 0.1 });
  const metricsRef = useScrollReveal({ threshold: 0.1 });
  const ctaRef = useScrollReveal({ threshold: 0.1 });

  // Interactive showcase tab state
  const [activeTab, setActiveTab] = useState('overview');

  // Interactive chore completion state
  const [chores, setChores] = useState(INITIAL_SHOWCASE_CHORES);
  const [choreToast, setChoreToast] = useState('');

  // Counter stats simulation
  const [residentsCount, setResidentsCount] = useState(0);
  const [roomsCount, setRoomsCount] = useState(0);
  const [tasksPercent, setTasksPercent] = useState(0);
  const [rentTracked, setRentTracked] = useState(0);
  const metricsSectionRef = useRef(null);

  const handleCompleteChore = (id, title) => {
    setChores(prev => 
      prev.map(c => c.id === id ? { ...c, status: 'Completed' } : c)
    );
    setChoreToast(`"${title}" marked as complete!`);
    setTimeout(() => setChoreToast(''), 3000);
  };

  const handleResetChores = () => {
    setChores(INITIAL_SHOWCASE_CHORES);
  };

  // Animate stats when metrics section is in view
  useEffect(() => {
    let observer;
    let currentElement = metricsSectionRef.current;
    
    if (currentElement) {
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          // Trigger count-up animation
          const duration = 1500; // ms
          const stepTime = 30; // ms
          const steps = duration / stepTime;
          let step = 0;
          
          const timer = setInterval(() => {
            step++;
            setResidentsCount(Math.min(Math.floor((18 / steps) * step), 18));
            setRoomsCount(Math.min(Math.floor((24 / steps) * step), 24));
            setTasksPercent(Math.min(Math.floor((92 / steps) * step), 92));
            setRentTracked(Math.min(Math.floor((82400 / steps) * step), 82400));
            
            if (step >= steps) {
              clearInterval(timer);
            }
          }, stepTime);
          
          observer.unobserve(currentElement);
        }
      }, { threshold: 0.1 });
      
      observer.observe(currentElement);
    }
    
    return () => {
      if (observer && currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, []);

  return (
    <div className={styles.page}>
      
      {/* ── SECTION 1: HERO & INTEGRATED MOCKUP ── */}
      <section className={styles.heroSection} id="product">
        <div className={styles.heroContainer} ref={heroRef}>
          <div className={styles.heroText}>
            <span className={`${styles.brandLabel} ${styles.heroRevealItem}`}>CO-LIVING SPACE MANAGER</span>
            <h1 className={`${styles.heroTitle} ${styles.heroRevealItem}`}>
              Harmony in shared spaces. <br />
              <span className={styles.heroAccent}>Finally.</span>
            </h1>
            <p className={`${styles.heroSubtitle} ${styles.heroRevealItem}`}>
              The dynamic living space manager designed for modern co-living communities. 
              Automate rent, split bills fairly, rotate chores, and resolve complaints effortlessly.
            </p>
            <div className={`${styles.heroCtas} ${styles.heroRevealItem}`}>
              <button className="rl-btn rl-btn-primary" onClick={onLogin}>
                Start Managing for Free
              </button>
              <button className="rl-btn rl-btn-secondary" onClick={onLogin}>
                Explore Live Demo
              </button>
            </div>
          </div>

          {/* Integrated Mockup Dashboard */}
          <div className={`${styles.heroMockupWrapper} ${styles.heroRevealItem} reveal-slide-up`}>
            <div className={styles.mockupDashboard}>
              <div className={styles.mockupSidebar}>
                <div className={styles.mockBrand}>
                  <span className={styles.mockBrandDot}></span>
                  <span className={styles.mockBrandText}>RoomLink</span>
                </div>
                <div className={styles.mockNavLineActive} />
                <div className={styles.mockNavLine} />
                <div className={styles.mockNavLine} />
                <div className={styles.mockNavLine} />
                <div className={styles.mockNavLine} />
              </div>
              <div className={styles.mockupMain}>
                <div className={styles.mockupTopbar}>
                  <div className={styles.mockTitle}>Overview</div>
                  <div className={styles.mockUserWrap}>
                    <span className={styles.mockBellIcon}>🔔</span>
                    <div className={styles.mockAvatar}>A</div>
                  </div>
                </div>
                <div className={styles.mockupContent}>
                  <div className={styles.mockStatsRow}>
                    <div className={styles.mockStatCard}>
                      <span className={styles.mockStatLabel}>Rent Collection</span>
                      <span className={styles.mockStatValue}>77% Collected</span>
                      <div className={styles.mockProgressBarMini}><div style={{ width: '77%' }} /></div>
                    </div>
                    <div className={styles.mockStatCard}>
                      <span className={styles.mockStatLabel}>Pending Chores</span>
                      <span className={styles.mockStatValue}>5 Remaining</span>
                      <span className={styles.mockBadgeDanger}>2 Overdue</span>
                    </div>
                    <div className={styles.mockStatCard}>
                      <span className={styles.mockStatLabel}>Occupancy</span>
                      <span className={styles.mockStatValue}>4 / 5 Rooms</span>
                      <span className={styles.mockBadgeInfo}>1 Vacant</span>
                    </div>
                  </div>
                  <div className={styles.mockGrid}>
                    <div className={styles.mockListCard}>
                      <h4>Urgent Issues</h4>
                      <div className={styles.mockListItem}>
                        <span>Leaking faucet in Bathroom</span>
                        <span className={styles.mockBadgeDanger}>High Priority</span>
                      </div>
                      <div className={styles.mockListItem}>
                        <span>AC remote not working in Room 3</span>
                        <span className={styles.mockBadgeWarning}>Medium Priority</span>
                      </div>
                    </div>
                    <div className={styles.mockListCard}>
                      <h4>Recent Activity</h4>
                      <div className={styles.mockActivityRow}>
                        <span className={styles.mockAvatarMini} style={{ background: 'var(--color-primary)' }}>R</span>
                        <p><strong>Riya</strong> paid rent</p>
                      </div>
                      <div className={styles.mockActivityRow}>
                        <span className={styles.mockAvatarMini} style={{ background: '#d97706' }}>P</span>
                        <p><strong>Priya</strong> completed trash chore</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: TRUST / VALUE STRIP ── */}
      <section className={styles.valueStripSection} ref={valueStripRef}>
        <div className={`${styles.valueStripContainer} reveal-up`}>
          <p className={styles.valueStripIntro}>Everything shared living needs, connected in one place</p>
          <div className={styles.valueStripRow}>
            <span>🚪 Rooms</span>
            <span>👤 Residents</span>
            <span>💰 Rent Payments</span>
            <span>📄 Shared Bills</span>
            <span>🧹 Rotating Chores</span>
            <span>⚠️ Issues & Complaints</span>
            <span>👥 Guest Tracking</span>
            <span>🔔 Live Notifications</span>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: "EVERYTHING IN ITS RIGHT PLACE" SECTION ── */}
      <section className={styles.rightPlaceSection} ref={rightPlaceRef}>
        <div className={`${styles.rightPlaceContainer} reveal-up`}>
          <div className={styles.rightPlaceText}>
            <h2>Everything in its right place</h2>
            <p>
              Fragmentation is the enemy of a peaceful household. RoomLink centralizes all communication, payments, chore assignments, and maintenance logs. No more passive-aggressive WhatsApp groups or lost receipts.
            </p>
          </div>
          <div className={styles.rightPlaceGrid}>
            <div className={styles.rightPlaceCard}>
              <h3>Rent & Finances</h3>
              <p>Expect clarity. See who has paid, automate payment tracking, and share bills with digital ledger clarity.</p>
              <div className={styles.rightPlaceVisualItem}>
                <div className={styles.miniLedger}>
                  <div className={styles.miniLedgerRow}><span>Riya S. (Room 1)</span><span className={styles.badgeSuccess}>Paid</span></div>
                  <div className={styles.miniLedgerRow}><span>Karan P. (Room 4)</span><span className={styles.badgeDanger}>Overdue</span></div>
                </div>
              </div>
            </div>
            
            <div className={styles.rightPlaceCard}>
              <h3>Household Duties</h3>
              <p>Equitable chores rotation. Set recurring schedules, check off tasks, and view dynamic timelines.</p>
              <div className={styles.rightPlaceVisualItem}>
                <div className={styles.miniChoreWheel}>
                  <div className={styles.choreItem}>🧹 Clean Kitchen (Bob)</div>
                  <div className={styles.choreItem}>🗑️ Empty Trash (Alice)</div>
                </div>
              </div>
            </div>

            <div className={styles.rightPlaceCard}>
              <h3>Maintenance & Communication</h3>
              <p>Log complaints, assign urgency levels, track repairs, and register guests beforehand.</p>
              <div className={styles.rightPlaceVisualItem}>
                <div className={styles.miniIssues}>
                  <div className={styles.issueRow}>🔌 Heater not working <span className={styles.badgeWarning}>In Progress</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: INTERACTIVE PRODUCT SHOWCASE ── */}
      <section className={styles.showcaseSection} id="features" ref={showcaseRef}>
        <div className={`${styles.showcaseContainer} reveal-up`}>
          <div className={styles.showcaseHeader}>
            <h2>Interactive Product Showcase</h2>
            <p>Explore how RoomLink handles daily management. Click through the tabs below to preview the actual interface.</p>
          </div>

          {/* Tab Selector */}
          <div className={styles.showcaseTabs}>
            <button className={`${styles.showcaseTab} ${activeTab === 'overview' ? styles.activeTab : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
            <button className={`${styles.showcaseTab} ${activeTab === 'rooms' ? styles.activeTab : ''}`} onClick={() => setActiveTab('rooms')}>Rooms</button>
            <button className={`${styles.showcaseTab} ${activeTab === 'payments' ? styles.activeTab : ''}`} onClick={() => setActiveTab('payments')}>Payments</button>
            <button className={`${styles.showcaseTab} ${activeTab === 'chores' ? styles.activeTab : ''}`} onClick={() => setActiveTab('chores')}>Chores & Tasks</button>
            <button className={`${styles.showcaseTab} ${activeTab === 'issues' ? styles.activeTab : ''}`} onClick={() => setActiveTab('issues')}>Issues</button>
          </div>

          {/* Showcase Live Screen Mockup */}
          <div className={styles.showcaseScreen}>
            {choreToast && <div className={styles.showcaseToast}>{choreToast}</div>}
            
            {activeTab === 'overview' && (
              <div className={styles.paneFade}>
                <div className={styles.paneHeader}>
                  <h3>Command Center Dashboard</h3>
                  <p>A unified overview of rent tracking, maintenance requests, and upcoming chores.</p>
                </div>
                <div className={styles.showcaseMetricsRow}>
                  <div className={styles.showcaseKpi}>
                    <span className={styles.kpiLabel}>Total Rent Tracked</span>
                    <span className={styles.kpiVal}>₹18,500 / ₹24,000</span>
                    <div className={styles.showcaseBar}><div style={{ width: '77%' }} /></div>
                  </div>
                  <div className={styles.showcaseKpi}>
                    <span className={styles.kpiLabel}>Open Requests</span>
                    <span className={styles.kpiVal}>2 Active</span>
                    <span className={styles.miniBadge}>1 In Progress</span>
                  </div>
                  <div className={styles.showcaseKpi}>
                    <span className={styles.kpiLabel}>Chores Today</span>
                    <span className={styles.kpiVal}>3 Assigned</span>
                    <span className={styles.miniBadge}>1 Completed</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'rooms' && (
              <div className={styles.paneFade}>
                <div className={styles.paneHeader}>
                  <h3>Rooms & Residents</h3>
                  <p>Track occupancy status, room configurations, and resident lease alignments.</p>
                </div>
                <div className={styles.showcaseRoomsGrid}>
                  {SHOWCASE_ROOMS.map(room => (
                    <div key={room.id} className={styles.showcaseRoomCard}>
                      <div className={styles.cardTop}>
                        <h4>Room {room.number}</h4>
                        <span className={`${styles.statusBadge} ${styles[room.status.toLowerCase()]}`}>{room.status}</span>
                      </div>
                      <p><strong>Type:</strong> {room.type}</p>
                      <p><strong>Resident:</strong> {room.resident}</p>
                      <p><strong>Rent:</strong> {room.rent}/mo</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className={styles.paneFade}>
                <div className={styles.paneHeader}>
                  <h3>Rent & Expense Splitter</h3>
                  <p>Monitor collection status and billing statements. Know who paid and who is pending.</p>
                </div>
                <div className={styles.showcaseTableWrapper}>
                  <table className={styles.showcaseTable}>
                    <thead>
                      <tr>
                        <th>Resident</th>
                        <th>Room</th>
                        <th>Amount</th>
                        <th>Due Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SHOWCASE_PAYMENTS.map(pay => (
                        <tr key={pay.id}>
                          <td>{pay.resident}</td>
                          <td>{pay.room}</td>
                          <td>{pay.amount}</td>
                          <td>{pay.dueDate}</td>
                          <td><span className={`${styles.badge} ${styles[pay.status.toLowerCase()]}`}>{pay.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'chores' && (
              <div className={styles.paneFade}>
                <div className={styles.paneHeader}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3>Rotating Chores</h3>
                      <p>Try it out! Click "Mark Complete" to complete a chore on the demo board.</p>
                    </div>
                    <button className={styles.resetBtn} onClick={handleResetChores}>Reset Board</button>
                  </div>
                </div>
                <div className={styles.showcaseChoresList}>
                  {chores.map(chore => (
                    <div key={chore.id} className={`${styles.showcaseChoreItem} ${chore.status === 'Completed' ? styles.choreDone : ''}`}>
                      <div className={styles.choreDetails}>
                        <span className={styles.choreCheckbox}>{chore.status === 'Completed' ? '✓' : '○'}</span>
                        <div>
                          <h4>{chore.title}</h4>
                          <p>Assigned to: <strong>{chore.assigned}</strong> · Priority: {chore.priority}</p>
                        </div>
                      </div>
                      {chore.status !== 'Completed' && (
                        <button className={styles.choreCompleteBtn} onClick={() => handleCompleteChore(chore.id, chore.title)}>
                          Mark Complete
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'issues' && (
              <div className={styles.paneFade}>
                <div className={styles.paneHeader}>
                  <h3>Maintenance & Complaints Logs</h3>
                  <p>Issue tracking with severity filters. Resolve problems transparently.</p>
                </div>
                <div className={styles.showcaseTableWrapper}>
                  <table className={styles.showcaseTable}>
                    <thead>
                      <tr>
                        <th>Issue ID</th>
                        <th>Description</th>
                        <th>Reporter</th>
                        <th>Urgency</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SHOWCASE_COMPLAINTS.map(comp => (
                        <tr key={comp.id}>
                          <td>{comp.id}</td>
                          <td>{comp.title}</td>
                          <td>{comp.resident}</td>
                          <td><span className={`${styles.badge} ${styles[comp.priority.toLowerCase()]}`}>{comp.priority}</span></td>
                          <td><span className={`${styles.badge} ${styles[comp.status.toLowerCase().replace(' ', '')]}`}>{comp.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: HOW ROOMLINK WORKS ── */}
      <section className={styles.workflowSection} id="how-it-works" ref={workflowRef}>
        <div className={styles.sectionHeader}>
          <h2>How RoomLink Works</h2>
          <p>Get your community up and running in four simple steps.</p>
        </div>
        <div className={styles.workflowGrid}>
          <div className={styles.workflowStep}>
            <div className={styles.stepNum}>01</div>
            <h3>Set up your space</h3>
            <p>Give your shared space a name, enter room details, and define basic configurations.</p>
          </div>
          <div className={styles.workflowStep}>
            <div className={styles.stepNum}>02</div>
            <h3>Add residents</h3>
            <p>Invite housemates or residents via email. They'll join instantly with their secure accounts.</p>
          </div>
          <div className={styles.workflowStep}>
            <div className={styles.stepNum}>03</div>
            <h3>Organize tasks</h3>
            <p>Automate chore schedules, utility bill divisions, and rotating calendars once.</p>
          </div>
          <div className={styles.workflowStep}>
            <div className={styles.stepNum}>04</div>
            <h3>Relax & Track</h3>
            <p>RoomLink handles reminders, records payments, logs complaints, and tracks activity.</p>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: "WHY ROOMLINK" / BENEFITS SECTION ── */}
      <section className={styles.benefitsSection} id="benefits" ref={benefitsRef}>
        <div className={styles.sectionHeader}>
          <h2>Why Choose RoomLink</h2>
          <p>Build a peaceful, organized co-living experience with structural clarity.</p>
        </div>
        <div className={styles.benefitsGrid}>
          <div className={styles.benefitCard}>
            <span className={styles.benefitIcon}>⏱️</span>
            <h3>Less Coordination Overhead</h3>
            <p>Spend less time sorting bills, reminding housemates of duties, and aligning calendars.</p>
          </div>
          <div className={styles.benefitCard}>
            <span className={styles.benefitIcon}>👁️</span>
            <h3>Full Visibility</h3>
            <p>Everything related to your shared living space is visible in one centralized feed.</p>
          </div>
          <div className={styles.benefitCard}>
            <span className={styles.benefitIcon}>💵</span>
            <h3>Fewer Missed Payments</h3>
            <p>Auto-reminders keep rent payments and shared bills paid on time, consistently.</p>
          </div>
          <div className={styles.benefitCard}>
            <span className={styles.benefitIcon}>🤝</span>
            <h3>Clear Responsibility</h3>
            <p>Assigned duties, clear guidelines, and checklists leave no room for ambiguity.</p>
          </div>
          <div className={styles.benefitCard}>
            <span className={styles.benefitIcon}>💬</span>
            <h3>Better Communication</h3>
            <p>Log disputes, track tasks, and submit maintenance tickets objectively and transparently.</p>
          </div>
          <div className={styles.benefitCard}>
            <span className={styles.benefitIcon}>🏡</span>
            <h3>Organized Shared Living</h3>
            <p>A harmonious environment designed specifically for contemporary shared households.</p>
          </div>
        </div>
      </section>

      {/* ── SECTION 7: SOCIAL PROOF / CREDIBILITY ── */}
      <section className={styles.credibilitySection} ref={credibilityRef}>
        <div className={`${styles.credibilityContainer} reveal-up`}>
          <h2>Designed for modern shared living</h2>
          <p>One workspace for the everyday moments that keep a household running safely, transparently, and cleanly.</p>
        </div>
      </section>

      {/* ── SECTION 8: STATISTICS / VISUAL METRICS (DYNAMIC ANIMATION) ── */}
      <section className={styles.metricsSection} ref={metricsRef}>
        <div className={`${styles.metricsContainer} reveal-up`} ref={metricsSectionRef}>
          <div className={styles.metricItem}>
            <span className={styles.metricNumber}>{residentsCount}</span>
            <span className={styles.metricLabel}>Residents Tracked</span>
          </div>
          <div className={styles.metricItem}>
            <span className={styles.metricNumber}>{roomsCount}</span>
            <span className={styles.metricLabel}>Rooms Managed</span>
          </div>
          <div className={styles.metricItem}>
            <span className={styles.metricNumber}>{tasksPercent}%</span>
            <span className={styles.metricLabel}>Task Completion Rate</span>
          </div>
          <div className={styles.metricItem}>
            <span className={styles.metricNumber}>₹{(rentTracked / 1000).toFixed(1)}k</span>
            <span className={styles.metricLabel}>Rent Collected</span>
          </div>
        </div>
      </section>

      {/* ── SECTION 9: FINAL CTA ── */}
      <section className={styles.ctaSection} ref={ctaRef}>
        <div className={`${styles.ctaCard} reveal-scale`}>
          <h2 className={styles.ctaTitle}>Make shared living feel simpler.</h2>
          <p className={styles.ctaDesc}>
            Bring rooms, people, payments, and everyday responsibilities into one beautiful place.
          </p>
          <div className={styles.ctaButtons}>
            <button className="rl-btn rl-btn-primary" onClick={onLogin} style={{ background: '#fff', color: 'var(--color-primary)' }}>
              Start with RoomLink
            </button>
            <button className="rl-btn rl-btn-secondary" onClick={onLogin} style={{ background: 'transparent', border: '1px solid #fff', color: '#fff' }}>
              Explore the product
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
