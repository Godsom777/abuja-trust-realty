"use client";

import React, { useState, useMemo } from 'react';
import PropertyGrid from '../property/PropertyGrid/PropertyGrid';
import WhatsAppFAB from '../property/WhatsAppFAB/WhatsAppFAB';
import styles from './HomeClient.module.css';

export default function HomeClient({ initialListings = [], initialDistricts = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all'); // 'all' | 'sale' | 'rent' | 'off-plan'
  const [selectedDistrict, setSelectedDistrict] = useState('all');

  const filterTypes = [
    { key: 'all', label: 'All Listings' },
    { key: 'sale', label: 'For Sale' },
    { key: 'rent', label: 'For Rent' },
    { key: 'off-plan', label: 'Off-Plan' }
  ];

  // Client-side filtering logic (Instant response, zero lag!)
  const filteredListings = useMemo(() => {
    return initialListings.filter((listing) => {
      // 1. Transaction Type filter
      if (selectedType !== 'all' && (listing.transaction_type || '').toLowerCase() !== selectedType) {
        return false;
      }
      
      // 2. District filter
      if (selectedDistrict !== 'all') {
        const area = (listing.location_area || '').toLowerCase();
        const city = (listing.location_city || '').toLowerCase();
        const dist = selectedDistrict.toLowerCase();
        if (area !== dist && city !== dist) {
          return false;
        }
      }

      // 3. Search query keyword filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const titleMatch = (listing.title || '').toLowerCase().includes(query);
        const areaMatch = (listing.location_area || '').toLowerCase().includes(query);
        const cityMatch = (listing.location_city || '').toLowerCase().includes(query);
        const descMatch = (listing.description || '').toLowerCase().includes(query);
        return titleMatch || areaMatch || cityMatch || descMatch;
      }

      return true;
    });
  }, [initialListings, selectedType, selectedDistrict, searchQuery]);

  return (
    <div className={styles.container}>
      {/* Editorial Hero Block */}
      <section className={styles.hero}>
        <div className={styles.tagLineBlock}>
          <span className={styles.subtitle}>Curated Real Estate</span>
          <h1 className={styles.headline}>Find your home, from anywhere.</h1>
          <p className={styles.description}>
            Vetted individual owners. Zero agent friction. Secure WhatsApp handoffs. Trusted by Nigerians in the diaspora.
          </p>
        </div>

        {/* Instantly Responsive Search Input */}
        <div className={styles.searchWrap}>
          <i className="fa-solid fa-magnifying-glass styles.searchIcon"></i>
          <input
            type="text"
            placeholder="Search Maitama, Wuse, duplex, size..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className={styles.clearBtn}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>
      </section>

      {/* Filter Controls Row */}
      <section className={styles.filtersSection}>
        {/* Category Horizontal Chips */}
        <div className={styles.chipsRow}>
          {filterTypes.map((type) => {
            const isActive = selectedType === type.key;
            return (
              <button
                key={type.key}
                onClick={() => setSelectedType(type.key)}
                className={`${styles.chip} ${isActive ? styles.chipActive : ''}`}
              >
                {type.label}
              </button>
            );
          })}
        </div>

        {/* District Select Input */}
        <div className={styles.selectWrap}>
          <label htmlFor="district-select" className={styles.selectLabel}>Location</label>
          <select
            id="district-select"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className={styles.select}
          >
            <option value="all">All Abuja Districts</option>
            {initialDistricts.map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Vetted listings grid */}
      <section className={styles.gridSection}>
        <div className={styles.gridHeader}>
          <h2 className={styles.gridTitle}>Vetted Properties</h2>
          <span className={styles.count}>{filteredListings.length} found</span>
        </div>

        <PropertyGrid
          properties={filteredListings}
          emptyMessage={
            searchQuery || selectedType !== 'all' || selectedDistrict !== 'all'
              ? "No properties match your current filters. Try resetting search or type parameters."
              : "No properties listed yet. Check back soon!"
          }
        />
      </section>

      {/* Trust banner */}
      <section className={styles.trustBanner}>
        <div className={styles.trustIcon}>
          <i className="fa-solid fa-shield-halved"></i>
        </div>
        <div className={styles.trustContent}>
          <h4 className={styles.trustTitle}>The Abode Trust Commitment</h4>
          <p className={styles.trustText}>
            Every property listed undergoes title and physical site verification. Negotiations occur on shared WhatsApp groups with platform support.
          </p>
        </div>
      </section>

      {/* WhatsApp General Floating CTA */}
      <WhatsAppFAB />
    </div>
  );
}
