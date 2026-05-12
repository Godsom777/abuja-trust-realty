import Link from "next/link";
import styles from "./page.module.css";
import { supabase } from "@/lib/supabase";

export const metadata = {
  title: "About — Abuja Trust Realty",
  description:
    "Learn about Abuja Trust Realty — a curated, trust-first property marketplace connecting verified Abuja property owners with diaspora buyers.",
};

export const revalidate = 0;

export default async function AboutPage() {
  const { data: valuesData } = await supabase.from('about_values').select('*').order('id', { ascending: true });
  const VALUES = valuesData || [];

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <span className="text-label">Our Story</span>
          <h1>Bridging Trust in Abuja Real Estate</h1>
          <p className={styles.heroSub}>
            We exist because buying property in Nigeria from abroad shouldn't feel like a gamble.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className={`section ${styles.story}`}>
        <div className="container">
          <div className={styles.storyGrid}>
            <div className={styles.storyContent}>
              <h2>The Problem We Solve</h2>
              <p>
                Millions of Nigerians in the diaspora want to invest in property back home —
                particularly in Abuja, the federal capital. But the market is riddled with
                unverified agents, fraudulent listings, and zero accountability.
              </p>
              <p>
                Most platforms simply aggregate listings from anyone who registers. There's no
                verification, no review process, and no accountability if something goes wrong.
                Buyers are left to fend for themselves.
              </p>
              <h3>Our Approach</h3>
              <p>
                Abuja Trust Realty flips this model entirely. We are not an open marketplace.
                We are a <strong>managed, admin-curated directory</strong> that personally vets
                every property owner, reviews every listing, and facilitates every buyer-owner
                introduction.
              </p>
              <p>
                We act as the trusted middleman — staying on copy in every WhatsApp conversation,
                tracking every deal with unique reference numbers, and ensuring no money changes
                hands without our oversight.
              </p>
            </div>
            <div className={styles.storyStats}>
              <div className={styles.storyStat}>
                <i className={`fa-solid fa-ban ${styles.storyStatIcon}`}></i>
                <span className={styles.storyStatValue}>0</span>
                <span className={styles.storyStatLabel}>Agent listings</span>
                <span className={styles.storyStatNote}>Individual owners only</span>
              </div>
              <div className={styles.storyStat}>
                <i className={`fa-solid fa-user-check ${styles.storyStatIcon}`}></i>
                <span className={styles.storyStatValue}>100%</span>
                <span className={styles.storyStatLabel}>Verified owners</span>
                <span className={styles.storyStatNote}>Gov. ID + title docs checked</span>
              </div>
              <div className={styles.storyStat}>
                <i className={`fa-solid fa-percent ${styles.storyStatIcon}`}></i>
                <span className={styles.storyStatValue}>5%</span>
                <span className={styles.storyStatLabel}>Commission</span>
                <span className={styles.storyStatNote}>Paid by the buyer on success</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={`section ${styles.values}`}>
        <div className="container">
          <div className={styles.valuesHeader}>
            <span className="text-label">Our Values</span>
            <h2>What Drives Us</h2>
          </div>
          <div className={styles.valuesGrid}>
            {VALUES.map((v) => (
              <div key={v.title || v.id} className={styles.valueCard}>
                <div className={styles.valueIconWrap}>
                  <i className={`${v.icon || "fa-solid fa-check"} ${styles.valueIcon}`}></i>
                </div>
                <h3>{v.title}</h3>
                <p>{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`section ${styles.cta}`}>
        <div className="container">
          <div className={styles.ctaInner}>
            <h2>Ready to Get Started?</h2>
            <p>Browse our verified listings or list your own property.</p>
            <div className={styles.ctaActions}>
              <Link href="/abuja" className="btn btn-primary btn-lg">
                <i className="fa-solid fa-magnifying-glass"></i>
                Browse Listings
              </Link>
              <Link href="/owner/listings/new" className="btn btn-gold btn-lg">
                <i className="fa-solid fa-list-ul"></i>
                List Your Property
              </Link>
            </div>
          </div>
        </div>
      </section>
      <div style={{ height: '70px' }}></div>
    </>
  );
}
