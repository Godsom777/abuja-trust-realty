import React from 'react';
import styles from './Badge.module.css';

/**
 * Custom Status Badge Component
 * @param {'available' | 'reserved' | 'sold'} status 
 */
export default function Badge({ status = 'available' }) {
  const normalizedStatus = status.toLowerCase();
  
  let label = 'Available';
  let statusClass = styles.available;

  if (normalizedStatus === 'reserved') {
    label = 'Reserved';
    statusClass = styles.reserved;
  } else if (normalizedStatus === 'sold' || normalizedStatus === 'let') {
    label = 'Sold / Let';
    statusClass = styles.sold;
  }

  return (
    <span className={`${styles.badge} ${statusClass}`}>
      <span className={styles.dot}></span>
      <span className={styles.label}>{label}</span>
    </span>
  );
}
