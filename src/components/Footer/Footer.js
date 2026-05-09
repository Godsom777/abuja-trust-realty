import Link from "next/link";
import styles from "./Footer.module.css";

const FOOTER_LINKS = {
  "Browse": [
    { href: "/abuja", label: "All Listings" },
    { href: "/abuja/maitama", label: "Maitama" },
    { href: "/abuja/asokoro", label: "Asokoro" },
    { href: "/abuja/gwarinpa", label: "Gwarinpa" },
    { href: "/abuja/wuse-2", label: "Wuse 2" },
    { href: "/abuja/jabi", label: "Jabi" },
  ],
  "Property Types": [
    { href: "/abuja/for-sale", label: "For Sale" },
    { href: "/abuja/for-rent", label: "For Rent" },
    { href: "/abuja/off-plan", label: "Off-Plan" },
  ],
  "Resources": [
    { href: "/how-it-works", label: "How It Works" },
    { href: "/buy-property-in-abuja-from-abroad", label: "Buying from Abroad" },
    { href: "/abuja-real-estate-investment-guide", label: "Investment Guide" },
    { href: "/abuja-property-prices", label: "Price Guide" },
  ],
  "Company": [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
  ],
};

export default function Footer() {
  return (
    <footer className={styles.footer} id="site-footer">
      {/* Top CTA Section */}
      <div className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaInner}>
            <div className={styles.ctaText}>
              <h3>Own property in Abuja?</h3>
              <p>
                List with us and reach verified diaspora buyers who are ready to invest.
              </p>
            </div>
            <Link href="/owner/listings/new" className="btn btn-gold btn-lg" id="footer-cta-list">
              <i className="fa-solid fa-list-ul"></i>
              Start Listing — It's Free
            </Link>
          </div>
        </div>
      </div>

      {/* Links Grid */}
      <div className={styles.main}>
        <div className="container">
          <div className={styles.grid}>
            {/* Brand Column */}
            <div className={styles.brandCol}>
              <Link href="/" className={styles.logo}>
                <i className={`fa-solid fa-diamond ${styles.logoIcon}`}></i>
                <span className={styles.logoName}>
                  Abuja Trust<span className={styles.logoAccent}> Realty</span>
                </span>
              </Link>
              <p className={styles.tagline}>
                A curated, trust-first marketplace for verified property in Abuja, Nigeria.
                Every owner vetted. Every listing reviewed.
              </p>
              <div className={styles.trustBadges}>
                <div className={styles.trustBadge}>
                  <i className={`fa-solid fa-circle-check ${styles.trustIcon}`}></i>
                  <span>Verified Owners Only</span>
                </div>
                <div className={styles.trustBadge}>
                  <i className={`fa-solid fa-shield-halved ${styles.trustIcon}`}></i>
                  <span>Admin-Reviewed Listings</span>
                </div>
                <div className={styles.trustBadge}>
                  <i className={`fa-brands fa-whatsapp ${styles.trustIcon}`}></i>
                  <span>WhatsApp Facilitated Deals</span>
                </div>
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div key={title} className={styles.linkCol}>
                <h4 className={styles.colTitle}>{title}</h4>
                <ul className={styles.linkList}>
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className={styles.footerLink}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottom}>
        <div className="container">
          <div className={styles.bottomInner}>
            <p className={styles.copyright}>
              © {new Date().getFullYear()} Abuja Trust Realty. All rights reserved.
            </p>
            <div className={styles.bottomRight}>
              <span className={styles.currency}>
                <i className="fa-solid fa-coins"></i>
                NGN · USD · GBP
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
