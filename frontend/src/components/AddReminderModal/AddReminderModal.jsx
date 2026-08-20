/**
 * AddReminderModal.jsx
 * Accessible modal dialog for adding a new reminder.
 * Uses local state only — no backend persistence.
 */
import { useState, useEffect, useRef } from 'react';
import styles from './AddReminderModal.module.css';

const COLOR_OPTIONS = [
  { value: 'brand',   label: 'Teal' },
  { value: 'warning', label: 'Amber' },
  { value: 'success', label: 'Green' },
];

export default function AddReminderModal({ open, onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [color, setColor] = useState('brand');
  const titleRef = useRef(null);
  const [prevOpen, setPrevOpen] = useState(open);

  // Reset form when modal opens (React 19: reset during render, not in effect)
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      // Transition from closed → open: reset form values
      setTitle('');
      setDate('');
      setColor('brand');
    }
  }

  // Focus title input on open (DOM-only, no setState)
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => titleRef.current?.focus());
    }
  }, [open]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !date) return;

    const formatted = new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    onAdd({
      id: `rem-${Date.now()}`,
      title: title.trim(),
      date: formatted,
      color,
    });
    onClose();
  }

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={onClose} />
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label="Add reminder"
      >
        <div className={styles.header}>
          <h2 className={styles.title}>Add Reminder</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close dialog">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              width="18" height="18">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="reminder-title">Title</label>
            <input
              ref={titleRef}
              id="reminder-title"
              className={styles.input}
              type="text"
              placeholder="e.g. Rent Due, Maintenance Check"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="reminder-date">Date</label>
            <input
              id="reminder-date"
              className={styles.input}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="reminder-color">Category</label>
            <select
              id="reminder-color"
              className={styles.select}
              value={color}
              onChange={(e) => setColor(e.target.value)}
            >
              {COLOR_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={!title.trim() || !date}>
              Add Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
