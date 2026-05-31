"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PhotoGallery from './PhotoGallery/PhotoGallery';
import Badge from '../ui/Badge/Badge';
import SpecChip from '../ui/SpecChip/SpecChip';
import { formatConvertedPrice, getComparisonPriceString } from '@/lib/currency';
import { getPropertyEnquiryLink } from '@/lib/whatsapp';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';
import styles from './PropertyDetailClient.module.css';

export default function PropertyDetailClient({ property, media = [] }) {
  const router = useRouter();
  const { currency, toggleSaveProperty, savedProperties } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [enquiring, setEnquiring] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!property) {
    return (
      <div className={styles.errorContainer}>
        <h3>Property not found</h3>
        <button onClick={() => router.push('/')} className={styles.backLink}>
          Return to home
        </button>
      </div>
    );
  }

  const {
    id,
    title,
    description,
    location_area,
    location_city,
    price_ngn,
    bedrooms,
    size_sqm,
    status = 'available',
    transaction_type = 'sale',
    features = []
  } = property;

  const isSaved = mounted && savedProperties.includes(id);

  // Map database media url strings or fallback to cover image
  const imageUrls = media.length > 0
    ? media.map(m => m.url)
    : property.photo || property.cover_image_url
      ? [property.photo || property.cover_image_url]
      : [];

  const mainPrice = price_ngn
    ? formatConvertedPrice(price_ngn, currency, false)
    : 'Price on Enquiry';

  const sideBySideText = price_ngn ? getComparisonPriceString(price_ngn) : '';

  const handleBack = () => {
    router.back();
  };

  const handleSaveToggle = () => {
    toggleSaveProperty(id);
  };

  // WhatsApp Enquiry click logging + redirection
  const handleEnquiry = async () => {
    setEnquiring(true);
    const link = getPropertyEnquiryLink(property, currency);
    
    try {
      // Fire-and-forget lightweight event log to Supabase for admin metrics
      // enquiry_log columns: property_id, property_title, property_location, enquiry_type, currency_shown
      await supabase.from('enquiry_log').insert({
        property_id: id,
        property_title: title,
        property_location: `${location_area}, ${location_city}`,
        enquiry_type: 'property',
        currency_shown: currency.toUpperCase()
      });
    } catch (err) {
      console.warn("Could not write metrics log to Supabase:", err);
    }

    // Direct redirection to pre-filled WhatsApp deep link
    window.open(link, '_blank', 'noopener,noreferrer');
    setEnquiring(false);
  };

  const typeLabel = transaction_type === 'rent' ? 'For Rent' : transaction_type === 'off-plan' ? 'Off-Plan' : 'For Sale';

  return (
    <div className={styles.container}>
      {/* Visual Sticky Action Header */}
      <div className={styles.navBar}>
        <button onClick={handleBack} className={styles.circleBtn} aria-label="Go back">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <button onClick={handleSaveToggle} className={`${styles.circleBtn} ${isSaved ? styles.saved : ''}`} aria-label="Bookmark property">
          <i className={`${isSaved ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
        </button>
      </div>

      {/* Main Image Lightbox Gallery */}
      <PhotoGallery images={imageUrls} />

      {/* Descriptive Specifications Block */}
      <div className={styles.detailsBody}>
        <div className={styles.metaRow}>
          <Badge status={status} />
          <span className={`${styles.typeBadge} ${transaction_type === 'rent' ? styles.typeRent : styles.typeSale}`}>
            {typeLabel}
          </span>
        </div>

        <h1 className={styles.title}>{title}</h1>

        <div className={styles.location}>
          <i className="fa-solid fa-location-dot"></i>
          {location_area}, {location_city}
        </div>

        {/* Pricing Segment */}
        <div className={styles.priceContainer}>
          <span className={styles.mainPrice}>{mainPrice}</span>
          {sideBySideText && (
            <span className={styles.comparison}>{sideBySideText}</span>
          )}
        </div>

        {/* Spec Chips Matrix */}
        <div className={styles.specs}>
          {bedrooms !== undefined && bedrooms !== null && (
            <SpecChip iconClass="fa-bed" value={bedrooms} label="Beds" />
          )}
          {size_sqm !== undefined && size_sqm !== null && size_sqm > 0 && (
            <SpecChip 
              iconClass="fa-ruler-combined" 
              value={`${size_sqm.toLocaleString()} sqm (${(size_sqm / 10000).toLocaleString(undefined, { maximumFractionDigits: 4 })} ha)`} 
              label="Size" 
            />
          )}
        </div>

        <div className={styles.divider}></div>

        {/* Detailed Narrative */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Overview</h3>
          <p className={styles.descriptionText}>{description || 'No description available for this listing.'}</p>
        </div>

        {/* Vetted Features Checkboxes */}
        {features.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Vetted Amenities</h3>
            <div className={styles.featuresGrid}>
              {features.map((feature, idx) => (
                <div key={idx} className={styles.featureItem}>
                  <i className="fa-solid fa-circle-check"></i>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Privacy-First Location Map Embed */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Location</h3>
          <div className={styles.mapContainer}>
            <div className={styles.mapPlaceholder}>
              <i className="fa-solid fa-map-location-dot"></i>
              <span className={styles.mapAreaLabel}>{location_area}, Abuja</span>
              <span className={styles.mapSecurityText}>Approximate listing area shown for privacy & security.</span>
            </div>
          </div>
        </div>
      </div>

      {/* High-Impact Bottom WhatsApp Anchor Bar */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomBarInner}>
          <div className={styles.bottomPriceGroup}>
            <span className={styles.bottomLabel}>Direct Price</span>
            <span className={styles.bottomPrice}>{mainPrice}</span>
          </div>
          
          <button
            onClick={handleEnquiry}
            disabled={enquiring || status === 'sold'}
            className={`${styles.enquireBtn} hover-lift`}
          >
            {enquiring ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                Connecting...
              </>
            ) : status === 'sold' ? (
              'Sold / Unavailable'
            ) : (
              <>
                <i className="fa-brands fa-whatsapp"></i>
                Direct WhatsApp Inquiry
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
