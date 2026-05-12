"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";

const NAV_LINKS = [
  { href: "/abuja", label: "Browse Listings" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}
        id="main-navigation"
      >
        <div className={styles.inner}>
          {/* Logo */}
          <Link href="/" className={styles.logo} id="nav-logo">
            <i className={`fa-solid fa-diamond ${styles.logoIcon}`}></i>
            <span className={styles.logoText}>
              Abuja Trust<span className={styles.logoAccent}> Realty</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className={styles.links}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={styles.link}
                id={`nav-${link.label.toLowerCase().replace(/\s/g, "-")}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className={styles.actions}>
            <Link href="/sign-in" className={styles.signIn} id="nav-sign-in">
              Sign In
            </Link>
            <Link
              href="/contact"
              className={`btn btn-primary ${styles.listBtn}`}
              id="nav-list-property"
            >
              <i className="fa-solid fa-plus"></i>
              List Property
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ""}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            id="nav-mobile-toggle"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className={styles.mobileOverlay} onClick={() => setMobileOpen(false)}>
          <div
            className={styles.mobileMenu}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.mobileHeader}>
              <Link href="/" className={styles.logo} onClick={() => setMobileOpen(false)}>
                <i className={`fa-solid fa-diamond ${styles.logoIcon}`}></i>
                <span className={styles.logoText}>
                  Abuja Trust<span className={styles.logoAccent}> Realty</span>
                </span>
              </Link>
              <button
                className={styles.closeBtn}
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className={styles.mobileLinks}>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={styles.mobileLink}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                  <i className="fa-solid fa-chevron-right"></i>
                </Link>
              ))}
            </div>
            <div className={styles.mobileActions}>
              <Link
                href="/sign-in"
                className="btn btn-secondary btn-lg"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => setMobileOpen(false)}
              >
                <i className="fa-regular fa-user"></i>
                Sign In
              </Link>
              <Link
                href="/contact"
                className="btn btn-primary btn-lg"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => setMobileOpen(false)}
              >
                <i className="fa-solid fa-plus"></i>
                List Your Property
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
