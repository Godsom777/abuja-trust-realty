import Link from "next/link";
import PropertyCard from "@/components/PropertyCard/PropertyCard";
import styles from "./page.module.css";

/* ── Mock data for demo ── */
const FEATURED_LISTINGS = [
  {
    title: "4 Bedroom Detached Duplex with BQ",
    slug: "/abuja/maitama/for-sale/residential/4-bedroom-detached-duplex-with-bq",
    district: "Maitama",
    transactionType: "sale",
    propertyType: "residential",
    priceNgn: 450_000_000,
    bedrooms: 4,
    bathrooms: 5,
    sizeSqm: 650,
    photo: "/images/listing-duplex.png",
    verified: true,
    featured: true,
  },
  {
    title: "Luxury Serviced 3 Bedroom Apartment",
    slug: "/abuja/asokoro/for-rent/residential/luxury-serviced-3-bedroom-apartment",
    district: "Asokoro",
    transactionType: "rent",
    propertyType: "residential",
    priceNgn: 15_000_000,
    bedrooms: 3,
    bathrooms: 3,
    sizeSqm: 280,
    photo: "/images/listing-apartment.png",
    verified: true,
    featured: true,
  },
  {
    title: "900sqm Plot with C of O",
    slug: "/abuja/gwarinpa/for-sale/land/900sqm-plot-with-c-of-o",
    district: "Gwarinpa",
    transactionType: "sale",
    propertyType: "land",
    priceNgn: 85_000_000,
    bedrooms: null,
    bathrooms: null,
    sizeSqm: 900,
    photo: "/images/listing-land.png",
    verified: true,
    featured: false,
  },
];

const DISTRICTS = [
  { name: "Maitama", slug: "maitama", count: 24 },
  { name: "Asokoro", slug: "asokoro", count: 18 },
  { name: "Wuse 2", slug: "wuse-2", count: 31 },
  { name: "Gwarinpa", slug: "gwarinpa", count: 42 },
  { name: "Jabi", slug: "jabi", count: 15 },
  { name: "Life Camp", slug: "life-camp", count: 28 },
  { name: "Garki", slug: "garki", count: 12 },
  { name: "Katampe", slug: "katampe", count: 9 },
];

const TRUST_STEPS = [
  {
    step: "01",
    icon: "fa-solid fa-magnifying-glass",
    title: "We Verify Every Owner",
    description:
      "Property owners submit government-issued ID and title documents. Our team reviews every application manually before any listing goes live.",
  },
  {
    step: "02",
    icon: "fa-solid fa-circle-check",
    title: "We Review Every Listing",
    description:
      "Each property listing is individually reviewed and approved by our admin team. No auto-approved listings — ever.",
  },
  {
    step: "03",
    icon: "fa-brands fa-whatsapp",
    title: "We Facilitate Every Deal",
    description:
      "When you express interest, we personally introduce you to the verified owner via WhatsApp — and stay on copy throughout the entire transaction.",
  },
  {
    step: "04",
    icon: "fa-solid fa-shield-halved",
    title: "Your Money Is Protected",
    description:
      "We advise against any direct transfers. All payment steps are coordinated through the platform with full audit trail and deal reference tracking.",
  },
];

const STATS = [
  { value: "100%", label: "Verified Owners", icon: "fa-solid fa-user-check" },
  { value: "0%", label: "Agent Listings", icon: "fa-solid fa-ban" },
  { value: "5%", label: "Commission Only", icon: "fa-solid fa-handshake" },
  { value: "24/7", label: "WhatsApp Support", icon: "fa-brands fa-whatsapp" },
];

export default function HomePage() {
  return (
    <>
      {/* ═══════════ HERO ═══════════ */}
      <section className={styles.hero} id="hero-section">
        <div className={styles.heroBg}>
          <div
            className={styles.heroImage}
            style={{ backgroundImage: "url(/images/hero.png)" }}
          />
          <div className={styles.heroOverlay} />
          <div className={styles.heroGrain} />
        </div>

        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            Trusted by Nigerians in the Diaspora
          </div>

          <h1 className={styles.heroTitle}>
            Verified Property
            <br />
            in <em className={styles.heroAccent}>Abuja</em>
          </h1>

          <p className={styles.heroSubtitle}>
            A curated marketplace where every owner is vetted and every listing
            is admin-reviewed. Buy, rent, or invest with confidence — from
            anywhere in the world.
          </p>

          <div className={styles.heroActions}>
            <Link
              href="/abuja"
              className="btn btn-primary btn-lg"
              id="hero-browse"
            >
              <i className="fa-solid fa-arrow-right"></i>
              Browse Listings
            </Link>
            <Link
              href="/how-it-works"
              className={`btn btn-lg ${styles.heroSecondaryBtn}`}
              id="hero-how"
            >
              <i className="fa-solid fa-circle-info"></i>
              How It Works
            </Link>
          </div>

          {/* Currency display */}
          <div className={styles.currencyRow}>
            <span><i className="fa-solid fa-coins"></i> Prices displayed in</span>
            <div className={styles.currencies}>
              <span className={styles.currencyTag}>🇳🇬 NGN</span>
              <span className={styles.currencyTag}>🇺🇸 USD</span>
              <span className={styles.currencyTag}>🇬🇧 GBP</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ STATS BAR ═══════════ */}
      <section className={styles.statsBar} id="stats-section">
        <div className="container">
          <div className={styles.statsGrid}>
            {STATS.map((stat) => (
              <div key={stat.label} className={styles.statItem}>
                <i className={`${stat.icon} ${styles.statIcon}`}></i>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURED LISTINGS ═══════════ */}
      <section className={`section ${styles.listings}`} id="featured-listings">
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span className="text-label">Featured Properties</span>
              <h2>Handpicked &amp; Verified</h2>
            </div>
            <Link href="/abuja" className="btn btn-secondary" id="view-all-listings">
              View All Listings
              <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>

          <div className={styles.listingsGrid}>
            {FEATURED_LISTINGS.map((listing, i) => (
              <div
                key={listing.slug}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <PropertyCard {...listing} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className={`section ${styles.trustSection}`} id="trust-process">
        <div className="container">
          <div className={styles.sectionHeaderCenter}>
            <span className="text-label">How It Works</span>
            <h2>Trust Built Into Every Step</h2>
            <p className={styles.sectionDesc}>
              Unlike open marketplaces, we manually verify every property owner
              and review every listing before it goes live.
            </p>
          </div>

          <div className={styles.stepsGrid}>
            {TRUST_STEPS.map((step, i) => (
              <div
                key={step.step}
                className={styles.stepCard}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={styles.stepNumber}>{step.step}</div>
                <div className={styles.stepIconWrap}>
                  <i className={`${step.icon} ${styles.stepIcon}`}></i>
                </div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ DISTRICTS ═══════════ */}
      <section className={`section ${styles.districts}`} id="districts-section">
        <div className="container">
          <div className={styles.sectionHeaderCenter}>
            <span className="text-label">Explore Abuja</span>
            <h2>Browse by District</h2>
            <p className={styles.sectionDesc}>
              Find verified properties across all major Abuja districts.
            </p>
          </div>

          <div className={styles.districtsGrid}>
            {DISTRICTS.map((d, i) => (
              <Link
                key={d.slug}
                href={`/abuja/${d.slug}`}
                className={styles.districtCard}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className={styles.districtName}>{d.name}</div>
                <div className={styles.districtCount}>
                  <i className="fa-solid fa-building"></i>
                  {d.count} listings
                </div>
                <i className={`fa-solid fa-arrow-up-right-from-square ${styles.districtArrow}`}></i>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ DIASPORA CTA ═══════════ */}
      <section className={styles.diasporaCta} id="diaspora-cta">
        <div className="container">
          <div className={styles.diasporaInner}>
            <div className={styles.diasporaContent}>
              <span className="text-label" style={{ color: "var(--color-gold)" }}>
                For Nigerians Abroad
              </span>
              <h2 className={styles.diasporaTitle}>
                Investing in Abuja from the Diaspora?
              </h2>
              <p className={styles.diasporaDesc}>
                We understand the trust gap. That's why every owner on our platform
                has been personally verified, every listing has been reviewed, and
                every transaction is facilitated with full accountability.
              </p>
              <div className={styles.diasporaFeatures}>
                {[
                  "Government ID verified owners",
                  "Title documents reviewed",
                  "WhatsApp facilitated introductions",
                  "Deal reference tracking",
                ].map((f) => (
                  <div key={f} className={styles.diasporaFeature}>
                    <i className={`fa-solid fa-circle-check ${styles.diasporaCheck}`}></i>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <div className={styles.diasporaActions}>
                <Link
                  href="/buy-property-in-abuja-from-abroad"
                  className="btn btn-gold btn-lg"
                  id="diaspora-guide"
                >
                  <i className="fa-solid fa-book-open"></i>
                  Read Our Diaspora Guide
                </Link>
                <Link
                  href="/abuja"
                  className={`btn btn-lg ${styles.diasporaSecondaryBtn}`}
                  id="diaspora-browse"
                >
                  <i className="fa-solid fa-magnifying-glass"></i>
                  Browse Listings
                </Link>
              </div>
            </div>
            <div className={styles.diasporaVisual}>
              <div className={styles.diasporaCard}>
                <div className={styles.diasporaCardHeader}>
                  <i className="fa-brands fa-whatsapp"></i>
                  WhatsApp Introduction
                  <span className={styles.diasporaCardDot} />
                </div>
                <div className={styles.diasporaCardBody}>
                  <p className={styles.diasporaMsg}>
                    Hello Sarah,<br /><br />
                    Thank you for your interest in the property at Maitama, Abuja.<br /><br />
                    <strong>Your Deal Reference: ABJ-2024-0047</strong><br /><br />
                    The verified owner will be added to this thread shortly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ OWNER CTA ═══════════ */}
      <section className={`section ${styles.ownerCta}`} id="owner-cta">
        <div className="container">
          <div className={styles.ownerCtaInner}>
            <h2>Own Property in Abuja?</h2>
            <p>
              Join our verified owner network and connect with serious diaspora
              buyers. No agents. No spam inquiries. Just vetted, ready-to-buy
              prospects.
            </p>
            <Link
              href="/owner/listings/new"
              className="btn btn-primary btn-lg"
              id="owner-cta-list"
            >
              <i className="fa-solid fa-list-ul"></i>
              List Your Property — It's Free
            </Link>
            <span className={styles.ownerNote}>
              <i className="fa-solid fa-percent"></i>
              5% commission only on successful deal close
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
