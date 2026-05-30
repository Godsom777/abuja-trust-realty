import React from 'react';
import styles from './SpecChip.module.css';

/**
 * Property Specification Chip Component
 * @param {string} iconClass - FontAwesome icon class (e.g., 'fa-bed')
 * @param {string|number} value - The value to display (e.g. 3)
 * @param {string} label - The type label (e.g., 'Beds', 'Baths', 'sqm')
 */
export default function SpecChip({ iconClass, value, label }) {
  if (value === undefined || value === null || value === '') return null;
  
  return (
    <div className={styles.chip}>
      <i className={`fa-solid ${iconClass} ${styles.icon}`}></i>
      <span className={styles.text}>
        <strong className={styles.value}>{value}</strong> {label}
      </span>
    </div>
  );
}
