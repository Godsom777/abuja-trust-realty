import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import CurrencyToggle from '../../ui/CurrencyToggle/CurrencyToggle';
import styles from './Header.module.css';

export default function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filter = searchParams ? searchParams.get('filter') : null;

  const isActive = (path, filterVal = null) => {
    if (filterVal) {
      return pathname === path && filter === filterVal;
    }
    if (path === '/') {
      return pathname === '/' && filter !== 'saved';
    }
    return pathname === path;
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        {/* Brand Logo */}
        <Link href="/" className={styles.logo} id="header-logo">
          <Image
            src="/images/emanon.png"
            alt="emanon. logo"
            width={38}
            height={38}
            className={styles.logoImage}
            priority
          />
          <span className={styles.logoText}>
            emanon<span className={styles.logoDot}>.</span>
          </span>
        </Link>
        
        {/* Desktop Navigation Links */}
        <nav className={styles.desktopNav}>
          <Link href="/" className={`${styles.navLink} ${isActive('/') ? styles.navLinkActive : ''}`}>
            Browse
          </Link>
          <Link href="/?filter=saved" className={`${styles.navLink} ${isActive('/', 'saved') ? styles.navLinkActive : ''}`}>
            Saved
          </Link>
          <Link href="/upload-video" className={`${styles.navLink} ${isActive('/upload-video') ? styles.navLinkActive : ''}`}>
            Upload Video
          </Link>
          <Link href="/about" className={`${styles.navLink} ${isActive('/about') ? styles.navLinkActive : ''}`}>
            About
          </Link>
        </nav>
        
        {/* Floating Currency Swapper */}
        <div className={styles.actions}>
          <CurrencyToggle />
        </div>
      </div>
    </header>
  );
}
