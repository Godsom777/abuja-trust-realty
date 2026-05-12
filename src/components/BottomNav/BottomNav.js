import Link from 'next/link';
import styles from './BottomNav.module.css';

export default function BottomNav() {
  return (
    <nav className={styles.bottomNav}>
      <Link href="/" className={styles.navItem}>
        <i className="fa-solid fa-house"></i>
        <span>Home</span>
      </Link>
      <Link href="/abuja" className={styles.navItem}>
        <i className="fa-solid fa-magnifying-glass"></i>
        <span>Search</span>
      </Link>
      <Link href="/how-it-works" className={styles.navItem}>
        <i className="fa-regular fa-heart"></i>
        <span>Saved</span>
      </Link>
      <Link href="/admin" className={styles.navItem}>
        <i className="fa-regular fa-user"></i>
        <span>Profile</span>
      </Link>
    </nav>
  );
}
