"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Badge from '../../ui/Badge/Badge';
import { formatConvertedPrice } from '@/lib/currency';
import { useAppStore } from '@/store/useAppStore';
import styles from './PropertyCard.module.css';

export default function PropertyCard({ property, viewMode = 'list' }) {
  const { currency, toggleSaveProperty, savedProperties } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!property) return null;

  const {
    id,
    title,
    slug,
    location_area,
    location_city,
    price_ngn,
    bedrooms,
    size_sqm,
    status = 'available',
    transaction_type = 'sale',
    cover_image_url
  } = property;

  const isSaved = mounted && savedProperties.includes(id);

  // Fallback image if cover_image_url is missing
  const imageUrl = cover_image_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800';
  const isVideo = imageUrl && (imageUrl.endsWith('.mp4') || imageUrl.endsWith('.webm') || imageUrl.endsWith('.mov') || imageUrl.includes('video'));

  const formattedPrice = price_ngn
    ? formatConvertedPrice(price_ngn, currency, true)
    : 'Price on Enquiry';

  const typeLabel = transaction_type === 'rent' ? 'For Rent' : transaction_type === 'off-plan' ? 'Off-Plan' : 'For Sale';

  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveProperty(id);
  };

  // Helper to format/abbreviate long district names for cleaner grid columns
  const formatLocation = (loc) => {
    if (!loc) return '';
    const mapping = {
      "central business district": "CBD",
      "katampe extension": "Katampe Ext",
      "wuse 2": "Wuse II",
      "garki 2": "Garki II"
    };
    const key = loc.toLowerCase().trim();
    return mapping[key] || loc;
  };

  const area = formatLocation(location_area || property.district || 'Abuja');
  const city = location_city || 'Abuja';

  return (
    <Link href={`/property/${slug}`} className={`${styles.card} ${viewMode === 'grid' ? styles.cardGrid : ''}`}>
      {/* 16:9 Aspect Ratio Media Wrapper — 100% naked visual design */}
      <div className={styles.mediaContainer}>
        {isVideo ? (
          <video
            src={imageUrl}
            className={styles.image}
            muted
            loop
            autoPlay
            playsInline
          />
        ) : (
          <img
            src={imageUrl}
            alt={title}
            className={styles.image}
            loading="lazy"
          />
        )}
      </div>

      {/* Card Info Content */}
      <div className={styles.content}>
        {/* Row 1: Spaced location + type on the left, Airbnb-style status dot indicator on the right */}
        <div className={styles.metaRow}>
          <div className={styles.metaLeft}>
            <span className={styles.location}>
              <i className={`fa-solid fa-location-dot ${styles.locationIcon}`}></i>
              {area}
            </span>
            <span className={styles.metaDot}>•</span>
            <span className={styles.typeText}>{typeLabel}</span>
          </div>
          <div className={`${styles.statusIndicator} ${styles[status]}`}>
            <span className={styles.statusDot}></span>
            <span className={styles.statusLabel}>{status}</span>
          </div>
        </div>

        {/* Row 2: Serif Title */}
        <h3 className={styles.title}>{title}</h3>

        {/* Row 3: Specifications with visual separators */}
        <div className={styles.specsRow}>
          {bedrooms !== undefined && bedrooms !== null && (
            <span className={styles.specItem}>
              <i className="fa-solid fa-bed"></i>
              {bedrooms} {bedrooms === 1 ? 'Bed' : 'Beds'}
            </span>
          )}
          {bedrooms !== undefined && bedrooms !== null && size_sqm !== undefined && size_sqm !== null && size_sqm > 0 && (
            <span className={styles.specDivider}>|</span>
          )}
          {size_sqm !== undefined && size_sqm !== null && size_sqm > 0 && (
            <span className={styles.specItem}>
              <i className="fa-solid fa-ruler-combined"></i>
              {size_sqm.toLocaleString()} m²
            </span>
          )}
        </div>

        {/* Row 4: Price & Tactile Circular Save Button aligned side-by-side */}
        <div className={styles.footerRow}>
          <span className={styles.price}>{formattedPrice}</span>
          
          <button
            onClick={handleSaveClick}
            className={`${styles.saveBtn} ${isSaved ? styles.saved : ''}`}
            aria-label={isSaved ? "Remove from saved" : "Save property"}
          >
            <i className={`${isSaved ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
          </button>
        </div>
      </div>
    </Link>
  );
}
