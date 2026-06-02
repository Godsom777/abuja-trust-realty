"use client";

import React from 'react';
import { getGeneralEnquiryLink, getWhatsAppNumber } from '@/lib/whatsapp';
import styles from './about.module.css';

export default function AboutPage() {
  const waLink = getGeneralEnquiryLink();
  const waNumber = getWhatsAppNumber();
  const ownerMessage = encodeURIComponent("Hi, I am a property/land owner and I would like to verify and list my property on Abuja Trust Realty.");
  const waOwnerLink = `https://wa.me/${waNumber}?text=${ownerMessage}`;
  const emailLink = "mailto:hello@abujatrust.com?subject=Property/Land Listing Enquiry - Abuja Trust Realty";

  const STEPS = [
    {
      number: "01",
      title: "Owner & Title Verification",
      desc: "Every listing is posted by vetted, individual property and land owners—never anonymous agents. We manually verify title deeds (C of O, RofO, FCDA Allocation) and inspect physical sites."
    },
    {
      number: "02",
      title: "Dual-Unit Size Specifications",
      desc: "Browse listings with complete technical accuracy. Property sizes are automatically synchronized and presented in both square meters (sqm) and hectares (ha)."
    },
    {
      number: "03",
      title: "Shared WhatsApp Handoff",
      desc: "When you find a property, we create a secure WhatsApp introduction. Negotiations occur directly between you and the verified owner, with coordination support."
    }
  ];

  const FAQS = [
    {
      q: "Who is Abuja Trust Realty for?",
      a: "We serve two groups: property/land owners looking for a secure platform to list directly to real clients, and buyers (especially in the diaspora) looking for a verified, stress-free path to buy real estate in Abuja without agent friction."
    },
    {
      q: "How are properties verified?",
      a: "Our team physically inspects each location and checks title documents like Certificate of Occupancy (cofo), Right of Occupancy (RofO), and FCDA Allocation/Approval files. We only list properties where ownership is clear and vetted."
    },
    {
      q: "I am a land or property owner, how do I list?",
      a: "Land and property owners can contact our admin team directly via WhatsApp or Email. We will guide you through our ownership verification process to secure a trusted listing badge."
    },
    {
      q: "What fees are involved?",
      a: "Searching and listing is free. We charge buyers a flat, transparent 5% commission fee upon successful deal closure and title transfer."
    }
  ];

  return (
    <div className={styles.container}>
      {/* Visual Header */}
      <section className={styles.hero}>
        <span className={styles.kicker}>Direct & Vetted Real Estate</span>
        <h1 className={styles.title}>Trust-first property discoveries in Abuja.</h1>
        <div className={styles.divider}></div>
      </section>

      {/* Narrative Section */}
      <section className={styles.narrative}>
        <p className={styles.lead}>
          Abuja Trust Realty was built to solve the primary friction point of Abuja real estate: <strong>the trust deficit.</strong>
        </p>
        <p className={styles.bodyText}>
          By removing speculative middlemen and anonymous agent layers, we create a transparent, stress-free channel where buyers and owners connect directly.
        </p>
      </section>

      {/* Owners & Buyers Split Section */}
      <section className={styles.audienceSection}>
        <h2 className={styles.sectionHeading}>A Platform Built for Both Sides</h2>
        <div className={styles.audienceGrid}>
          {/* Property & Land Owners Card */}
          <div className={styles.audienceCard}>
            <div className={styles.audienceIcon}>
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <h3 className={styles.audienceTitle}>For Property & Land Owners</h3>
            <p className={styles.audienceText}>
              Avoid bloated agent listings that inflate your pricing. List on a secure registry designed to build confidence with premium buyers, including the diaspora.
            </p>
            <ul className={styles.audiencePoints}>
              <li>
                <i className="fa-solid fa-check"></i>
                <span>Secure direct-to-buyer visibility</span>
              </li>
              <li>
                <i className="fa-solid fa-check"></i>
                <span>Vetted title recognition (C of O, RofO, FCDA Allocation)</span>
              </li>
              <li>
                <i className="fa-solid fa-check"></i>
                <span>Zero speculative agent markups on your listing</span>
              </li>
            </ul>
            <div className={styles.audienceCta}>
              <p className={styles.bodyText} style={{ marginBottom: '12px' }}>
                Contact us to submit ownership documents and get your listing vetted:
              </p>
              <div className={styles.ctaButtons} style={{ justifyContent: 'flex-start' }}>
                <a href={waOwnerLink} target="_blank" rel="noopener noreferrer" className={styles.ctaBtn} style={{ margin: 0 }}>
                  <i className="fa-brands fa-whatsapp"></i> WhatsApp Admin
                </a>
                <a href={emailLink} className={styles.emailBtn} style={{ margin: 0 }}>
                  <i className="fa-regular fa-envelope"></i> Email Admin
                </a>
              </div>
            </div>
          </div>

          {/* Buyers Card */}
          <div className={styles.audienceCard}>
            <div className={styles.audienceIcon}>
              <i className="fa-solid fa-house-circle-check"></i>
            </div>
            <h3 className={styles.audienceTitle}>For Verified Buyers</h3>
            <p className={styles.audienceText}>
              Enjoy a stress-free buying journey. No anonymous agents, no phantom properties, and no hidden fees. Every listing is physically inspected and document-verified.
            </p>
            <ul className={styles.audiencePoints}>
              <li>
                <i className="fa-solid fa-check"></i>
                <span>Direct communication with the owner</span>
              </li>
              <li>
                <i className="fa-solid fa-check"></i>
                <span>Clear sizing in sqm & hectares (no guesswork)</span>
              </li>
              <li>
                <i className="fa-solid fa-check"></i>
                <span>Coordinated WhatsApp negotiations for maximum security</span>
              </li>
            </ul>
            <div className={styles.audienceCta}>
              <p className={styles.bodyText} style={{ marginBottom: '12px' }}>
                Browse our registry or speak to coordination team to find your dream property:
              </p>
              <div className={styles.ctaButtons} style={{ justifyContent: 'flex-start' }}>
                <a href={waLink} target="_blank" rel="noopener noreferrer" className={styles.ctaBtn} style={{ margin: 0 }}>
                  <i className="fa-brands fa-whatsapp"></i> Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Flow (How it Works) */}
      <section className={styles.stepsSection}>
        <h2 className={styles.sectionHeading}>The Abuja Trust Realty Standard</h2>
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

      {/* Q&A Section */}
      <section className={styles.faqSection}>
        <h2 className={styles.sectionHeading}>Frequently Asked Questions</h2>
        <div className={styles.faqGrid}>
          {FAQS.map((faq, idx) => (
            <div key={idx} className={styles.faqItem}>
              <h4 className={styles.faqQuestion}>
                <i className="fa-regular fa-circle-question"></i>
                {faq.q}
              </h4>
              <p className={styles.faqAnswer}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className={styles.cta}>
        <h3 className={styles.ctaHeading}>Ready to take the next step?</h3>
        <p className={styles.ctaText}>
          Whether you are looking to buy a stress-free property or submit your listing securely as an owner, our Abuja coordination team is ready to assist.
        </p>
        <div className={styles.ctaButtons}>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.ctaBtn} hover-lift`}
          >
            <i className="fa-brands fa-whatsapp"></i> Chat on WhatsApp
          </a>
          <a href={emailLink} className={`${styles.emailBtn} hover-lift`}>
            <i className="fa-regular fa-envelope"></i> Email Vetting Team
          </a>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Abuja Trust Realty. All rights reserved.</p>
        <p className={styles.footerSubtitle}>Direct, vetted real estate for the diaspora.</p>
      </footer>
    </div>
  );
}
