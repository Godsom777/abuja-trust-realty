"use client";

import React from 'react';
import { getGeneralEnquiryLink } from '@/lib/whatsapp';
import styles from './about.module.css';

export default function AboutPage() {
  const waLink = getGeneralEnquiryLink();

  const STEPS = [
    {
      number: "01",
      title: "Owner Verification",
      desc: "Every listing is posted by vetted, individual property owners—never anonymous agents. We manually verify title deeds and inspect physical properties before publication."
    },
    {
      number: "02",
      title: "Seamless Discovery",
      desc: "Browse through an elegantly curated directory of premium properties in Abuja. Easily toggle prices side-by-side in Naira, US Dollars, or British Pounds."
    },
    {
      number: "03",
      title: "Shared WhatsApp Close",
      desc: "When you find a property, we create a secure WhatsApp introduction. negotiations occur directly between you and the owner, with platform coordination."
    }
  ];

  return (
    <div className={styles.container}>
      {/* Visual Header */}
      <section className={styles.hero}>
        <span className={styles.kicker}>Our Mission</span>
        <h1 className={styles.title}>Trust-first property discoveries in Abuja.</h1>
        <div className={styles.divider}></div>
      </section>

      {/* Narrative Section */}
      <section className={styles.narrative}>
        <p className={styles.lead}>
          Abode was built to solve the primary friction point of Abuja real estate: <strong>the trust deficit.</strong>
        </p>
        <p className={styles.bodyText}>
          For Nigerians in the diaspora, buying or renting a home back home is often filled with anxiety, speculative agent fees, and double-dealing. We eliminate the middlemen.
        </p>
        <p className={styles.bodyText}>
          By enforcing strict verification standards on every individual property owner, we deliver a directory of genuine listings you can confidently act on from anywhere in the world.
        </p>
      </section>

      {/* Steps Flow (How it Works) */}
      <section className={styles.stepsSection}>
        <h2 className={styles.sectionHeading}>How Abode Works</h2>
        
        <div className={styles.stepsGrid}>
          {STEPS.map((step, idx) => (
            <div key={idx} className={styles.stepCard}>
              <span className={styles.stepNum}>{step.number}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className={styles.cta}>
        <h3 className={styles.ctaHeading}>Have questions?</h3>
        <p className={styles.ctaText}>
          Whether you are a buyer seeking verified property or an owner looking to list, speak directly to our coordination team.
        </p>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.ctaBtn} hover-lift`}
        >
          <i className="fa-brands fa-whatsapp"></i> Chat with coordination team
        </a>
      </section>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Abode. All rights reserved.</p>
        <p className={styles.footerSubtitle}>Direct, vetted real estate for the diaspora.</p>
      </footer>
    </div>
  );
}
