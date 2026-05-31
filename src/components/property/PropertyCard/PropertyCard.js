"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Badge from '../../ui/Badge/Badge';
import { formatConvertedPrice } from '@/lib/currency';
import { useAppStore } from '@/store/useAppStore';
import styles from './PropertyCard.module.css';

export default function PropertyCard({ property }) {
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

  const formattedPrice = price_ngn
    ? formatConvertedPrice(price_ngn, currency, true)
    : 'Price on Inquiry';

  const typeLabel = transaction_type === 'rent' ? 'For Rent' : transaction_type === 'off-plan' ? 'Off-Plan' : 'For Sale';

  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveProperty(id);
  };

  return (
    <Link href={`/property/${slug}`} className={styles.card}>
      {/* 16:9 Aspect Ratio Media Wrapper */}
      <div className={styles.mediaContainer}>
        <img
          src={imageUrl}
          alt={title}
          className={styles.image}
          loading="lazy"
        />
        <div className={styles.imageOverlay} />

        {/* Status Badge Group */}
        <div className={styles.badgeGroup}>
          <Badge status={status} />
          <span className={`${styles.typeBadge} ${transaction_type === 'rent' ? styles.typeRent : styles.typeSale}`}>
            {typeLabel}
          </span>
        </div>

        {/* Favorite Save Button */}
        <button
          onClick={handleSaveClick}
          className={`${styles.saveBtn} ${isSaved ? styles.saved : ''}`}
          aria-label={isSaved ? "Remove from saved" : "Save property"}
        >
          <i className={`${isSaved ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
        </button>
      </div>

      {/* Card Info Content */}
      <div className={styles.content}>
        {/* Location Smallcaps */}
        <div className={styles.location}>
          <i className="fa-solid fa-location-dot styles.locationIcon"></i>
          {location_area}, {location_city}
        </div>

        {/* Serif Title */}
        <h3 className={styles.title}>{title}</h3>

        {/* Price & Specs row */}
        <div className={styles.footerRow}>
          <span className={styles.price}>{formattedPrice}</span>
          
          <div className={styles.specs}>
            {bedrooms !== undefined && bedrooms !== null && (
              <span className={styles.specItem}>
                <i className="fa-solid fa-bed"></i>
                {bedrooms}
              </span>
            )}
            {size_sqm !== undefined && size_sqm !== null && size_sqm > 0 && (
              <span className={styles.specItem}>
                <i className="fa-solid fa-ruler-combined"></i>
                {size_sqm.toLocaleString()}m² ({(size_sqm / 10000).toLocaleString(undefined, { maximumFractionDigits: 3 })} ha)
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
