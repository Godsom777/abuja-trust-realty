import Link from "next/link";
import styles from "./page.module.css";
import { supabase } from "@/lib/supabase";

export const metadata = {
  title: "How It Works — Abuja Trust Realty",
  description:
    "Learn how Abuja Trust Realty verifies every property owner, reviews every listing, and facilitates every deal to keep you safe.",
};

export const revalidate = 0;

export default async function HowItWorksPage() {
  const { data: stepsData } = await supabase.from('how_it_works_steps').select('*').order('number', { ascending: true });
  const { data: trustPointsData } = await supabase.from('trust_points').select('*').order('id', { ascending: true });

  const STEPS = stepsData || [];
  const TRUST_POINTS = trustPointsData || [];

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <span className="text-label">Our Process</span>
          <h1>Trust Built Into Every Step</h1>
          <p className={styles.heroSub}>
            We're not an open marketplace. We're a managed, admin-curated directory
            that acts as a trusted middleman between verified property owners and serious buyers.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className={`section ${styles.stepsSection}`}>
        <div className="container">
          <div className={styles.timeline}>
            {STEPS.map((step) => (
              <div key={step.number} className={styles.timelineItem}>
                <div className={styles.timelineLine}>
                  <div className={styles.timelineDot}>
                    <i className={step.icon || "fa-solid fa-circle"}></i>
                  </div>
                </div>
                <div className={styles.timelineContent}>
                  <span className={styles.stepNumber}>Step {step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                  <div className={styles.stepDetail}>
                    <i className={`fa-solid fa-lightbulb ${styles.detailIcon}`}></i>
                    {step.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Grid */}
      <section className={`section ${styles.trustGrid}`}>
        <div className="container">
          <div className={styles.trustHeader}>
            <span className="text-label">Why Trust Us</span>
            <h2>Our Accountability Framework</h2>
          </div>
          <div className={styles.trustCards}>
            {TRUST_POINTS.map((point) => (
              <div key={point.title || point.id} className={styles.trustCard}>
                <div className={styles.trustIconWrap}>
                  <i className={`${point.icon || "fa-solid fa-check"} ${styles.trustIcon}`}></i>
                </div>
                <h4>{point.title}</h4>
                <p>{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`section ${styles.ctaSection}`}>
        <div className="container">
          <div className={styles.ctaBlock}>
            <h2>Ready to Find Your Property?</h2>
            <p>Browse our verified listings or learn about investing from the diaspora.</p>
            <div className={styles.ctaActions}>
              <Link href="/abuja" className="btn btn-primary btn-lg" id="hiw-browse">
                <i className="fa-solid fa-magnifying-glass"></i>
                Browse Listings
              </Link>
              <Link href="/buy-property-in-abuja-from-abroad" className="btn btn-secondary btn-lg" id="hiw-diaspora">
                <i className="fa-solid fa-book-open"></i>
                Diaspora Guide
              </Link>
            </div>
          </div>
        </div>
      </section>
      <div style={{ height: '70px' }}></div>
    </>
  );
}
