"use client";

import React from 'react';
import { getGeneralEnquiryLink } from '@/lib/whatsapp';
import styles from './WhatsAppFAB.module.css';

export default function WhatsAppFAB() {
  const link = getGeneralEnquiryLink();

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.fab} hover-lift`}
      title="Enquire on WhatsApp"
    >
      <i className="fa-brands fa-whatsapp styles.waIcon"></i>
      <span className={styles.label}>Enquire</span>
    </a>
  );
}
