import { useState } from 'react';
import styles from './BillsPage.module.css';
import Tabs from '../../components/common/Tabs';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { useToast } from '../../contexts/ToastContext';

const MOCK_BILLS = [
  { id: 'b1', title: 'Electricity (Sep)', category: 'Electricity', amount: 150.00, dueDate: '2023-10-05', status: 'Pending', sharedBy: 3, paidBy: 1 },
  { id: 'b2', title: 'Water (Sep)', category: 'Water', amount: 45.50, dueDate: '2023-10-10', status: 'Pending', sharedBy: 3, paidBy: 0 },
  { id: 'b3', title: 'Internet', category: 'Internet', amount: 80.00, dueDate: '2023-10-01', status: 'Paid', sharedBy: 3, paidBy: 3 },
  { id: 'b4', title: 'Plumbing Repair', category: 'Maintenance', amount: 250.00, dueDate: '2023-09-15', status: 'Overdue', sharedBy: 1, paidBy: 0 },
  { id: 'b5', title: 'Electricity (Aug)', category: 'Electricity', amount: 142.00, dueDate: '2023-09-05', status: 'Paid', sharedBy: 3, paidBy: 3 },
];

const TABS = [
  { id: 'active', label: 'Active Bills' },
  { id: 'history', label: 'Bill History' }
];

export default function BillsPage() {
  const [activeTab, setActiveTab] = useState('active');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const { showToast } = useToast();

  const filteredBills = MOCK_BILLS.filter(bill => {
    const isActive = bill.status === 'Pending' || bill.status === 'Overdue';
    if (activeTab === 'active' && !isActive) return false;
    if (activeTab === 'history' && isActive) return false;

    if (categoryFilter !== 'All' && bill.category !== categoryFilter) return false;

    return true;
  });

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Paid': return 'success';
      case 'Pending': return 'warning';
      case 'Overdue': return 'danger';
      default: return 'neutral';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Electricity': return '⚡';
      case 'Water': return '💧';
      case 'Internet': return '🌐';
      case 'Maintenance': return '🔧';
      default: return '📄';
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Bills & Expenses</h1>
          <p className={styles.subtitle}>Manage shared bills, utilities, and property expenses.</p>
        </div>
        <button 
          className={styles.primaryButton}
          onClick={() => showToast('Add bill form coming soon', 'info')}
        >+ Add Bill</button>
      </header>

      <Tabs tabs={TABS} activeTab={activeTab} onChange={(tab) => {
        setActiveTab(tab);
        setCategoryFilter('All');
      }} />

      <div className={styles.controls}>
        <select 
          value={categoryFilter} 
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="All">All Categories</option>
          <option value="Electricity">Electricity</option>
          <option value="Water">Water</option>
          <option value="Internet">Internet</option>
          <option value="Maintenance">Maintenance</option>
        </select>
      </div>

      <div className={styles.content}>
        {filteredBills.length > 0 ? (
          <div className={styles.grid}>
            {filteredBills.map(bill => (
              <div key={bill.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.iconTitleWrapper}>
                    <span className={styles.categoryIcon}>{getCategoryIcon(bill.category)}</span>
                    <h3 className={styles.cardTitle}>{bill.title}</h3>
                  </div>
                  <Badge variant={getStatusVariant(bill.status)}>{bill.status}</Badge>
                </div>
                
                <div className={styles.cardBody}>
                  <div className={styles.amount}>${bill.amount.toFixed(2)}</div>
                  <p className={styles.detail}><strong>Due:</strong> {bill.dueDate}</p>
                  
                  {bill.sharedBy > 1 && (
                    <div className={styles.sharedProgress}>
                      <div className={styles.progressText}>
                        <span>Shared Payment</span>
                        <span>{bill.paidBy} / {bill.sharedBy} Paid</span>
                      </div>
                      <div className={styles.progressBarBg}>
                        <div 
                          className={styles.progressBarFill} 
                          style={{ width: `${(bill.paidBy / bill.sharedBy) * 100}%` }} 
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className={styles.cardFooter}>
                  <button 
                    className={styles.textButton}
                    onClick={() => showToast('Bill details view coming soon', 'info')}
                  >View Details</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState 
            title="No bills found" 
            description="There are no bills matching your current view." 
          />
        )}
      </div>
    </div>
  );
}
