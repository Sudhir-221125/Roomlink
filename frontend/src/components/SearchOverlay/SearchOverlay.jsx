/**
 * SearchOverlay.jsx
 * Lightweight frontend-only search modal.
 * Filters searchableItems from mock data as user types.
 * Keyboard accessible: Escape to close, arrow keys for navigation.
 */
import { useState, useEffect, useRef } from 'react';
import { searchableItems } from '../../services/mockData';
import styles from './SearchOverlay.module.css';

const TYPE_ICONS = {
  resident: '👤',
  room: '🏠',
  page: '📄',
};

export default function SearchOverlay({ open, onClose, onNavigate }) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const [prevOpen, setPrevOpen] = useState(open);
  const [prevQuery, setPrevQuery] = useState(query);

  const results = query.trim().length > 0
    ? searchableItems.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.detail.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  // Reset on open (React 19: reset during render, not in effect)
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setQuery('');
      setActiveIndex(0);
    }
  }

  // Reset active index when query changes (during render, not in effect)
  if (query !== prevQuery) {
    setPrevQuery(query);
    setActiveIndex(0);
  }

  // Focus input on open (DOM-only, no setState)
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Keyboard handling
  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[activeIndex]) {
      onNavigate(results[activeIndex].page);
      onClose();
    }
  }

  if (!open) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Search">
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.panel} onKeyDown={handleKeyDown}>
        <div className={styles.inputWrap}>
          <svg
            className={styles.searchIcon}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            className={styles.input}
            type="text"
            placeholder="Search rooms, residents, pages…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search rooms, residents, and pages"
          />
          <kbd className={styles.kbd}>Esc</kbd>
        </div>

        {query.trim().length > 0 && (
          <ul className={styles.results} role="listbox">
            {results.length === 0 ? (
              <li className={styles.noResults}>No results for &ldquo;{query}&rdquo;</li>
            ) : (
              results.map((item, i) => (
                <li
                  key={`${item.type}-${item.label}`}
                  role="option"
                  aria-selected={i === activeIndex}
                  className={[styles.result, i === activeIndex ? styles.resultActive : ''].join(' ')}
                  onClick={() => {
                    onNavigate(item.page);
                    onClose();
                  }}
                  onMouseEnter={() => setActiveIndex(i)}
                >
                  <span className={styles.resultIcon} aria-hidden="true">{TYPE_ICONS[item.type]}</span>
                  <div className={styles.resultText}>
                    <span className={styles.resultLabel}>{item.label}</span>
                    <span className={styles.resultDetail}>{item.detail}</span>
                  </div>
                  <span className={styles.resultType}>{item.type}</span>
                </li>
              ))
            )}
          </ul>
        )}

        {query.trim().length === 0 && (
          <div className={styles.hint}>
            Start typing to search rooms, residents, or pages
          </div>
        )}
      </div>
    </div>
  );
}
