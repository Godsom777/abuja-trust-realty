"use client";

import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import styles from './CurrencyToggle.module.css';

const OPTIONS = [
  { key: 'ngn', symbol: '₦', label: 'NGN' },
  { key: 'usd', symbol: '$', label: 'USD' },
  { key: 'gbp', symbol: '£', label: 'GBP' }
];

export default function CurrencyToggle() {
  const { currency, setCurrency } = useAppStore();
  const [mounted, setMounted] = useState(false);

  // Re-hydrate Zustand store safely on mount to prevent hydration mismatch
  useEffect(() => {
    useAppStore.persist.rehydrate();
    setMounted(true);
  }, []);

  if (!mounted) {
    // Elegant skeletal placeholder before client re-hydration
    return (
      <div className={styles.containerPlaceholder}>
        <span className={styles.placeholderDot}></span>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {OPTIONS.map((opt) => {
        const isActive = currency === opt.key;
        return (
          <button
            key={opt.key}
            onClick={() => setCurrency(opt.key)}
            className={`${styles.toggleBtn} ${isActive ? styles.active : ''}`}
            title={`Switch to ${opt.label}`}
          >
            <span className={styles.symbol}>{opt.symbol}</span>
            <span className={styles.label}>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
