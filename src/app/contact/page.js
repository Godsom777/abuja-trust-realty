"use client";

import React, { useState } from 'react';
import { getWhatsAppNumber } from '@/lib/whatsapp';
import styles from './contact.module.css';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const waNumber = getWhatsAppNumber();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className={styles.container}>
      {/* Editorial Header */}
      <section className={styles.hero}>
        <span className={styles.kicker}>Get In Touch</span>
        <h1 className={styles.title}>Speak with our coordination team.</h1>
        <div className={styles.divider}></div>
      </section>

      {/* Direct support options cards */}
      <section className={styles.options}>
        <div className={styles.optionCard}>
          <div className={styles.icon}>
            <i className="fa-brands fa-whatsapp"></i>
          </div>
          <h3 className={styles.cardTitle}>Immediate WhatsApp Support</h3>
          <p className={styles.cardDesc}>Speak directly with our team for quick property questions or to facilitate negotiations.</p>
          <a
            href={`https://wa.me/${waNumber}?text=Hi%2C%20I'd%20like%20to%20discuss%20listed%20properties%20with%20an%20agent.`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.waBtn} hover-lift`}
          >
            <i className="fa-brands fa-whatsapp"></i> Open Chat
          </a>
        </div>

        <div className={styles.optionCard}>
          <div className={styles.icon}>
            <i className="fa-regular fa-envelope"></i>
          </div>
          <h3 className={styles.cardTitle}>Documentation & Support</h3>
          <p className={styles.cardDesc}>For formal proposals, title verification documents, and administrative support.</p>
          <a href="mailto:hello@abujatrust.com" className={styles.emailLink}>
            <i className="fa-solid fa-arrow-up-right-from-square"></i> hello@abujatrust.com
          </a>
        </div>
      </section>

      {/* Structured email-like contact form */}
      <section className={styles.formSection}>
        <h3 className={styles.sectionHeading}>Send an Enquiry</h3>
        
        {submitted ? (
          <div className={styles.success}>
            <i className="fa-solid fa-circle-check"></i>
            <h4>Message Transmitted</h4>
            <p>Your enquiry has been successfully logged. Our Abuja team will contact you back within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Full Name</label>
                <input type="text" required placeholder="e.g. Chinedu Okafor" className={styles.input} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email Address</label>
                <input type="email" required placeholder="e.g. chinedu@email.com" className={styles.input} />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Where are you based?</label>
              <input type="text" placeholder="e.g. London, UK / New York, US" className={styles.input} />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>How can we assist you?</label>
              <textarea required rows="4" placeholder="Detail your property preferences or listing details..." className={styles.textarea}></textarea>
            </div>

            <button type="submit" className={`${styles.submitBtn} hover-lift`}>
              <i className="fa-solid fa-paper-plane"></i> Send Enquiry Message
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
