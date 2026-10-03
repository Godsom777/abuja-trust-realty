"use client";

import React, { useState } from 'react';
import RequestPropertyModal from '../RequestPropertyModal/RequestPropertyModal';
import styles from './RequestPropertyCTA.module.css';

/**
 * End-of-Search-Results CTA prompting users to request a custom property via WhatsApp
 * @param {Object} searchContext - current user filter context to pre-fill the form
 */
export default function RequestPropertyCTA({
  searchContext = {},
  variant = 'card' // 'card' | 'compact'
}) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className={`${styles.container} ${variant === 'compact' ? styles.compact : ''}`}>
        <div className={styles.decorPattern} aria-hidden="true" />
        
        <div className={styles.content}>
          <div className={styles.badge}>
            <i className="fa-solid fa-magnifying-glass-location"></i>
            <span>Can't find what you're looking for?</span>
          </div>

          <h3 className={styles.title}>Looking for a specific property?</h3>
          <p className={styles.description}>
            Tell us your exact specifications—neighborhood, bedrooms, and target budget. Our team will source verified listings directly from vetted owners with zero agent friction.
          </p>

          <div className={styles.perks}>
            <span className={styles.perk}>
              <i className="fa-solid fa-check"></i> Title-Verified Owners
            </span>
            <span className={styles.perk}>
              <i className="fa-solid fa-check"></i> Direct WhatsApp Handoff
            </span>
            <span className={styles.perk}>
              <i className="fa-solid fa-check"></i> Free Concierge Service
            </span>
          </div>
        </div>

        <div className={styles.action}>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className={styles.ctaButton}
            id="request-property-button"
          >
            <i className="fa-brands fa-whatsapp"></i>
            Request A Property
          </button>
          <span className={styles.actionSubtext}>
            Instant WhatsApp formulation
          </span>
        </div>
      </div>

      <RequestPropertyModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialContext={searchContext}
      />
    </>
  );
}
