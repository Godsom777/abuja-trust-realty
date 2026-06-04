"use client";

import React from 'react';
import { getGeneralEnquiryLink, getWhatsAppNumber } from '@/lib/whatsapp';
import styles from './WhatsAppFAB.module.css';

export default function WhatsAppFAB() {
  const waLink = getGeneralEnquiryLink();
  const phone = getWhatsAppNumber();
  const callLink = `tel:+${phone}`;

  return (
    <div className={styles.fabContainer}>
      <a
        href={callLink}
        className={`${styles.fabCall} hover-lift`}
        title="Call Us"
      >
        <i className="fa-solid fa-phone"></i>
      </a>
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.fab} hover-lift`}
        title="Enquire on WhatsApp"
      >
        <i className="fa-brands fa-whatsapp styles.waIcon"></i>
        <span className={styles.label}>Enquire</span>
      </a>
    </div>
  );
}
