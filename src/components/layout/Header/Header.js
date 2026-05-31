import React from 'react';
import Link from 'next/link';
import CurrencyToggle from '../../ui/CurrencyToggle/CurrencyToggle';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        {/* Wordmark Logo */}
        <Link href="/" className={styles.logo}>
          ABJ-Realty<span className={styles.logoDot}>.</span>
        </Link>
        
        {/* Floating Currency Swapper */}
        <div className={styles.actions}>
          <CurrencyToggle />
        </div>
      </div>
    </header>
  );
}
