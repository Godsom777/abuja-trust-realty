"use client";

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import styles from './BottomNav.module.css';

function BottomNavInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filter = searchParams ? searchParams.get('filter') : null;

  // Active state logic
  const isHome = pathname === '/' && filter !== 'saved';
  const isSearch = pathname === '/abuja' || pathname.startsWith('/abuja/') || pathname.startsWith('/property/');
  const isSaved = pathname === '/' && filter === 'saved';
  const isProfile = pathname === '/sign-in' || pathname === '/admin';

  return (
    <nav className={styles.bottomNav} aria-label="Bottom navigation">
      <Link
        href="/"
        className={`${styles.navItem} ${isHome ? styles.active : ''}`}
        aria-label="Home"
        id="bottom-nav-home"
      >
        <i className={isHome ? 'fa-solid fa-house' : 'fa-regular fa-house'}></i>
        <span>Home</span>
      </Link>

      <Link
        href="/abuja"
        className={`${styles.navItem} ${isSearch ? styles.active : ''}`}
        aria-label="Search"
        id="bottom-nav-search"
      >
        <i className="fa-solid fa-magnifying-glass"></i>
        <span>Search</span>
      </Link>

      <Link
        href="/?filter=saved"
        className={`${styles.navItem} ${isSaved ? styles.active : ''}`}
        aria-label="Saved properties"
        id="bottom-nav-saved"
      >
        <i className={isSaved ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
        <span>Saved</span>
      </Link>

      <Link
        href="/sign-in"
        className={`${styles.navItem} ${isProfile ? styles.active : ''}`}
        aria-label="Profile"
        id="bottom-nav-profile"
      >
        <i className={isProfile ? 'fa-solid fa-user' : 'fa-regular fa-user'}></i>
        <span>Profile</span>
      </Link>
    </nav>
  );
}

export default function BottomNav() {
  return (
    <Suspense fallback={null}>
      <BottomNavInner />
    </Suspense>
  );
}
