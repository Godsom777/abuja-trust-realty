"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import PropertyGrid from '../property/PropertyGrid/PropertyGrid';
import WhatsAppFAB from '../property/WhatsAppFAB/WhatsAppFAB';
import styles from './HomeClient.module.css';

// Districts to scroll in the marquee strip
const MARQUEE_DISTRICTS = [
  'Maitama', 'Asokoro', 'Wuse 2', 'Gwarinpa', 'Jabi',
  'Life Camp', 'Katampe', 'Apo', 'Garki', 'Utako',
  'Wuye', 'Mabushi', 'Guzape', 'Lugbe', 'Kaura',
];

// Animated counter hook — counts up when the ref enters the viewport
function useCountUp(target, duration = 1600, startOnVisible = true) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    if (!startOnVisible) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const tick = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration, startOnVisible]);

  return { count, ref };
}

export default function HomeClient({ initialListings = [], initialDistricts = [] }) {
  const router = useRouter();
  const { savedProperties, viewMode, setViewMode } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const searchParams = useSearchParams();
  const filter = searchParams ? searchParams.get('filter') : null;

  // Animated counters
  const { count: propCount, ref: propRef } = useCountUp(120);
  const { count: respCount, ref: respRef } = useCountUp(48);
  const { count: verCount, ref: verRef } = useCountUp(100);

  // Safe client-side hydration to prevent SSR mismatch
  useEffect(() => {
    useAppStore.persist.rehydrate();
    setMounted(true);
  }, []);

  const currentViewMode = mounted ? viewMode : 'list';

  const filterTypes = [
    { key: 'all', label: 'All Listings' },
    { key: 'sale', label: 'For Sale' },
    { key: 'rent', label: 'For Rent' },
    { key: 'off-plan', label: 'Off-Plan' }
  ];

  // Client-side filtering logic
  const filteredListings = useMemo(() => {
    let list = initialListings;

    if (filter === 'saved') {
      if (!mounted) return [];
      list = list.filter(listing => savedProperties.includes(listing.id));
    }

    const filtered = list.filter((listing) => {
      if (selectedType !== 'all' && (listing.transaction_type || '').toLowerCase() !== selectedType) {
        return false;
      }
      if (selectedDistrict !== 'all') {
        const area = (listing.location_area || '').toLowerCase();
        const city = (listing.location_city || '').toLowerCase();
        const dist = selectedDistrict.toLowerCase();
        if (area !== dist && city !== dist) return false;
      }
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

    const sorted = [...filtered];
    if (sortBy === 'price-asc') {
      sorted.sort((a, b) => (a.price_ngn || 0) - (b.price_ngn || 0));
    } else if (sortBy === 'price-desc') {
      sorted.sort((a, b) => (b.price_ngn || 0) - (a.price_ngn || 0));
    } else if (sortBy === 'rooms-desc') {
      sorted.sort((a, b) => (b.bedrooms || 0) - (a.bedrooms || 0));
    } else if (sortBy === 'size-desc') {
      sorted.sort((a, b) => (b.size_sqm || 0) - (a.size_sqm || 0));
    } else if (sortBy === 'location-asc') {
      sorted.sort((a, b) => {
        const locA = (a.location_area || a.district || 'Abuja').toLowerCase();
        const locB = (b.location_area || b.district || 'Abuja').toLowerCase();
        return locA.localeCompare(locB);
      });
    } else if (sortBy === 'type-asc') {
      sorted.sort((a, b) => {
        const typeA = (a.property_type || a.propertyType || 'residential').toLowerCase();
        const typeB = (b.property_type || b.propertyType || 'residential').toLowerCase();
        return typeA.localeCompare(typeB);
      });
    } else {
      sorted.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }

    return sorted;
  }, [initialListings, selectedType, selectedDistrict, searchQuery, filter, savedProperties, mounted, sortBy]);

  return (
    <div className={styles.container}>

      {/* ── Editorial Hero Block with staggered entry animations ── */}
      <section className={styles.hero}>
        <div className={styles.tagLineBlock}>
          <span
            className={`${styles.subtitle} animate-fade-up`}
            style={{ '--delay': '60ms' }}
          >
            Curated Real Estate
          </span>
          <h1
            className={`${styles.headline} animate-fade-up`}
            style={{ '--delay': '140ms' }}
          >
            Find your home,<br />from anywhere.
          </h1>
          <p
            className={`${styles.description} animate-fade-up`}
            style={{ '--delay': '220ms' }}
          >
            Vetted individual owners. Zero agent friction. Secure WhatsApp handoffs.
            Trusted by Nigerians in the diaspora.
          </p>
        </div>

        {/* Scrolling District Marquee Strip */}
        <div
          className={`${styles.marqueeStrip} animate-fade-up`}
          style={{ '--delay': '290ms' }}
          aria-hidden="true"
        >
          <div className={styles.marqueeTrack}>
            {/* Duplicated for seamless looping */}
            {[...MARQUEE_DISTRICTS, ...MARQUEE_DISTRICTS].map((d, i) => (
              <span key={i} className={styles.marqueeItem}>
                <i className="fa-solid fa-location-dot"></i>
                {d}
              </span>
            ))}
          </div>
        </div>

        {/* Instantly Responsive Search Input */}
        <div
          className={`${styles.searchWrap} animate-fade-up`}
          style={{ '--delay': '360ms' }}
        >
          <i className="fa-solid fa-magnifying-glass"></i>
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

      {/* ── Filter Controls Row ── */}
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

        {/* District Select */}
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
              <option key={dist} value={dist}>{dist}</option>
            ))}
          </select>
        </div>

        {/* Sort Select */}
        <div className={styles.selectWrap}>
          <label htmlFor="sort-select" className={styles.selectLabel}>Sort By</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.select}
          >
            <option value="newest">Newest Listed</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="rooms-desc">Rooms: Most First</option>
            <option value="size-desc">Size: Largest First</option>
            <option value="location-asc">Location: A → Z</option>
            <option value="type-asc">Type: A → Z</option>
          </select>
        </div>
      </section>

      {/* ── Vetted listings grid ── */}
      <section className={styles.gridSection}>
        <div className={styles.gridHeader}>
          <div className={styles.gridTitleBlock}>
            <h2 className={styles.gridTitle}>
              {filter === 'saved' ? 'Saved Properties' : 'Vetted Properties'}
            </h2>
            <span className={styles.count}>{filteredListings.length} found</span>
          </div>

          {/* Segmented layout mode toggle */}
          <div className={styles.toggleContainer}>
            <button
              onClick={() => setViewMode('list')}
              className={`${styles.toggleBtn} ${currentViewMode === 'list' ? styles.toggleBtnActive : ''}`}
              aria-label="List View"
              title="List View"
            >
              <i className="fa-solid fa-bars"></i>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`${styles.toggleBtn} ${currentViewMode === 'grid' ? styles.toggleBtnActive : ''}`}
              aria-label="Grid View"
              title="Grid View"
            >
              <i className="fa-solid fa-table-cells-large"></i>
            </button>
          </div>
        </div>

        {filter === 'saved' && mounted && savedProperties.length === 0 ? (
          <div className={styles.savedEmptyState}>
            <div className={styles.savedEmptyIcon}>
              <i className="fa-regular fa-heart"></i>
            </div>
            <h3 className={styles.savedEmptyTitle}>Your Saved Collection is Empty</h3>
            <p className={styles.savedEmptyText}>
              Keep track of properties you're interested in. Tap the heart icon on any property card to save it here.
            </p>
            <button
              onClick={() => router.push('/')}
              className={`btn btn-primary ${styles.exploreBtn}`}
            >
              <i className="fa-solid fa-magnifying-glass"></i>
              Explore Listings
            </button>
          </div>
        ) : (
          <PropertyGrid
            properties={filteredListings}
            loading={filter === 'saved' && !mounted}
            viewMode={currentViewMode}
            emptyMessage={
              searchQuery || selectedType !== 'all' || selectedDistrict !== 'all'
                ? "No properties match your current filters. Try resetting search or type parameters."
                : "No properties listed yet. Check back soon!"
            }
          />
        )}
      </section>

      {/* ── Elevated Trust Section: Icon Trio + Animated Counters ── */}
      <section className={styles.trustSection}>

        {/* Part 1: Icon Trio Strip */}
        <div className={styles.trustIconStrip}>
          <div className={styles.trustIconCard}>
            <div className={styles.trustIconCircle}>
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <span className={styles.trustIconLabel}>Title Verified</span>
          </div>
          <div className={styles.trustIconCard}>
            <div className={styles.trustIconCircle}>
              <i className="fa-solid fa-user-slash"></i>
            </div>
            <span className={styles.trustIconLabel}>Zero Agents</span>
          </div>
          <div className={styles.trustIconCard}>
            <div className={styles.trustIconCircle}>
              <i className="fa-brands fa-whatsapp"></i>
            </div>
            <span className={styles.trustIconLabel}>Direct WhatsApp</span>
          </div>
        </div>

        {/* Part 2: Animated Counters */}
        <div className={styles.trustCounterRow}>
          <div className={styles.trustCounter} ref={propRef}>
            <span className={styles.counterNum}>{propCount}+</span>
            <span className={styles.counterLabel}>Properties Vetted</span>
          </div>
          <div className={styles.trustCounterDivider} />
          <div className={styles.trustCounter} ref={respRef}>
            <span className={styles.counterNum}>{respCount}h</span>
            <span className={styles.counterLabel}>Avg. Response</span>
          </div>
          <div className={styles.trustCounterDivider} />
          <div className={styles.trustCounter} ref={verRef}>
            <span className={styles.counterNum}>{verCount}%</span>
            <span className={styles.counterLabel}>Owner Verified</span>
          </div>
        </div>

      </section>

      {/* WhatsApp General Floating CTA */}
      <WhatsAppFAB />
    </div>
  );
}
