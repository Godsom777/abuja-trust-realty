import Link from "next/link";
import styles from "./page.module.css";

export const metadata = {
  title: "How It Works — Abuja Trust Realty",
  description:
    "Learn how Abuja Trust Realty verifies every property owner, reviews every listing, and facilitates every deal to keep you safe.",
};

const STEPS = [
  {
    number: "01",
    icon: "fa-solid fa-file-signature",
    title: "Owner Registers & Submits Verification",
    description:
      "Property owners create an account and submit government-issued ID plus title documents (C of O, Deed of Assignment, Survey Plan). No listing goes live until the owner is personally verified.",
    detail: "We check every document manually — no automated approvals.",
  },
  {
    number: "02",
    icon: "fa-solid fa-magnifying-glass",
    title: "Admin Reviews & Approves",
    description:
      "Our team reviews the owner's identity and property documentation. Owners are approved or rejected with clear reasons. Only approved owners can create listings.",
    detail: "Average review time: 24–48 hours.",
  },
  {
    number: "03",
    icon: "fa-solid fa-house",
    title: "Property Listing Goes Live",
    description:
      "The owner creates their listing with photos, pricing, and property details. Our admin team reviews the listing separately before publishing it to the marketplace.",
    detail: "Double verification: owner AND listing are both reviewed.",
  },
  {
    number: "04",
    icon: "fa-solid fa-binoculars",
    title: "Buyer Discovers & Expresses Interest",
    description:
      "Diaspora buyers browse verified listings, filter by district and property type, and express interest or make an offer — all without needing the owner's contact details.",
    detail: "No upfront payments required to express interest.",
  },
  {
    number: "05",
    icon: "fa-brands fa-whatsapp",
    title: "WhatsApp Introduction — Facilitated by Us",
    description:
      "We create a tracked deal thread with a unique reference number (e.g., ABJ-2024-0047) and personally introduce the buyer to the owner via WhatsApp — with our platform number on copy.",
    detail: "We stay on every conversation. Your deal is tracked.",
  },
  {
    number: "06",
    icon: "fa-solid fa-trophy",
    title: "Deal Closes — Everyone Wins",
    description:
      "We facilitate the negotiation through to close. The owner pays a 5% commission only on successful deal closure. No upfront fees for either party.",
    detail: "Commission only on success. No listing fees.",
  },
];

const TRUST_POINTS = [
  {
    icon: "fa-solid fa-shield-halved",
    title: "No Agent Listings",
    description: "Only verified individual property owners can list. No middlemen, no agents.",
  },
  {
    icon: "fa-solid fa-file-shield",
    title: "Document Verification",
    description: "Government ID + title documents reviewed for every owner before approval.",
  },
  {
    icon: "fa-solid fa-eye",
    title: "Double Review",
    description: "Both the owner AND each listing are independently reviewed by our team.",
  },
  {
    icon: "fa-brands fa-whatsapp",
    title: "Platform on Copy",
    description: "Our WhatsApp number is in every deal conversation. We see everything.",
  },
  {
    icon: "fa-solid fa-hashtag",
    title: "Deal Reference Tracking",
    description: "Every transaction gets a unique reference number for audit and accountability.",
  },
  {
    icon: "fa-solid fa-hand-holding-dollar",
    title: "No Direct Transfers",
    description: "We advise against direct owner payments. All steps coordinated through us.",
  },
];

export default function HowItWorksPage() {
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
                    <i className={step.icon}></i>
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
              <div key={point.title} className={styles.trustCard}>
                <div className={styles.trustIconWrap}>
                  <i className={`${point.icon} ${styles.trustIcon}`}></i>
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
    </>
  );
}
