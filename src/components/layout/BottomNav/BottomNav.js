"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import styles from './BottomNav.module.css';

export default function BottomNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter');

  // Helper to check if a navigation item is active
  const isActive = (path, filterVal = null) => {
    if (filterVal) {
      return pathname === path && filter === filterVal;
    }
    // For homepage browse, only active if pathname is "/" and there is no special active filter
    if (path === '/') {
      return pathname === '/' && filter !== 'saved';
    }
    return pathname === path;
  };

  const navItems = [
    {
      id: 'browse',
      label: 'Browse',
      iconClass: 'fa-house',
      href: '/'
    },
    {
      id: 'saved',
      label: 'Saved',
      iconClass: 'fa-heart',
      href: '/?filter=saved'
    },
    {
      id: 'about',
      label: 'About',
      iconClass: 'fa-circle-info',
      href: '/about'
    }
  ];

  return (
    <nav className={styles.nav}>
      <div className={styles.navInner}>
        {navItems.map((item) => {
          const active = isActive(item.href === '/?filter=saved' ? '/' : item.href, item.id === 'saved' ? 'saved' : null);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`${styles.navItem} ${active ? styles.active : ''}`}
            >
              <i className={`fa-solid ${item.iconClass} ${styles.icon}`}></i>
              <span className={styles.label}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
