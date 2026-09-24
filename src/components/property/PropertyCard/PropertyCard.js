"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatConvertedPrice } from '@/lib/currency';
import { useAppStore } from '@/store/useAppStore';
import styles from './PropertyCard.module.css';

const TRANSACTION_LABELS = {
  sale: 'For Sale',
  rent: 'For Rent',
  'off-plan': 'Off-Plan',
};

const STATUS_COLORS = {
  available: styles.statusAvailable,
  reserved: styles.statusReserved,
  sold: styles.statusSold,
};

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
    cover_image_url,
    photo,
    features = []
  } = property;

  const isSaved = mounted && savedProperties.includes(id);

  // Detect video walkthrough listings
  const isVideoCover = Boolean(
    cover_image_url && (
      cover_image_url.endsWith('.mp4') ||
      cover_image_url.endsWith('.webm') ||
      cover_image_url.endsWith('.mov') ||
      cover_image_url.includes('video')
    )
  );
  const hasVideo = isVideoCover || (
    Array.isArray(features) && features.some(f => typeof f === 'string' && f.toLowerCase().includes('video'))
  );

  // Egress Saver: Never stream video files in listing cards. Use photo cover with video badge.
  const fallbackCover = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800';
  const displayImage = isVideoCover 
    ? (photo && !photo.endsWith('.mp4') ? photo : fallbackCover) 
    : (cover_image_url || photo || fallbackCover);

  const formattedPrice = price_ngn
    ? formatConvertedPrice(price_ngn, currency, true)
    : 'Enquire';

  const typeLabel = TRANSACTION_LABELS[transaction_type] || 'For Sale';

  // Compact size display
  const sizeDisplay = size_sqm && size_sqm > 0
    ? (size_sqm >= 10000
        ? `${(size_sqm / 10000).toFixed(2)}ha`
        : `${size_sqm.toLocaleString()}sqm`)
    : null;

  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveProperty(id);
  };

  const area = location_area || property.district || 'Abuja';

  return (
    <Link
      href={`/property/${slug}`}
      className={`${styles.card} ${viewMode === 'grid' ? styles.cardGrid : ''}`}
    >
      {/* ── Full-bleed Media ── */}
      <div className={styles.mediaWrap}>
        <img
          src={displayImage}
          alt={title}
          className={styles.media}
          loading="lazy"
        />

        {/* Rich gradient overlay */}
        <div className={styles.overlay} />

        {/* Top badges */}
        <div className={styles.topBadges}>
          <span className={`${styles.typeBadge} ${styles[`type_${transaction_type?.replace('-', '_')}`]}`}>
            {typeLabel}
          </span>
          {hasVideo && (
            <span className={styles.videoBadge}>
              <i className="fa-solid fa-play"></i>
              Video Tour
            </span>
          )}
          {status === 'available' && (
            <span className={styles.statusPill}>
              <span className={styles.statusDot} />
              Available
            </span>
          )}
          {status === 'reserved' && (
            <span className={`${styles.statusPill} ${styles.statusPillReserved}`}>
              <span className={styles.statusDot} />
              Reserved
            </span>
          )}
        </div>

        {/* Save button */}
        <button
          onClick={handleSaveClick}
          className={`${styles.saveBtn} ${isSaved ? styles.saved : ''}`}
          aria-label={isSaved ? 'Remove from saved' : 'Save property'}
        >
          <i className={`${isSaved ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
        </button>

        {/* ── Text overlay at bottom ── */}
        <div className={styles.textOverlay}>
          {/* Price in Clash Display */}
          <div className={styles.price}>{formattedPrice}</div>

          <h3 className={styles.title}>{title}</h3>

          <div className={styles.metaRow}>
            <span className={styles.location}>
              <i className="fa-solid fa-location-dot"></i>
              {area}
            </span>
            <div className={styles.specs}>
              {bedrooms != null && (
                <span className={styles.spec}>
                  <i className="fa-solid fa-bed"></i>
                  {bedrooms}
                </span>
              )}
              {sizeDisplay && (
                <span className={styles.spec}>
                  <i className="fa-solid fa-ruler-combined"></i>
                  {sizeDisplay}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
