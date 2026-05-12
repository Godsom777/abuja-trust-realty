"use client";

import { useState, useMemo, useEffect } from "react";
import PropertyCard from "@/components/PropertyCard/PropertyCard";
import styles from "./page.module.css";
import { supabase } from "@/lib/supabase";

const DISTRICTS = [
  "All Districts",
  "Maitama",
  "Asokoro",
  "Wuse 2",
  "Gwarinpa",
  "Jabi",
  "Life Camp",
  "Central Business District",
];

const TRANSACTION_TYPES = [
  { value: "all", label: "All Types" },
  { value: "sale", label: "For Sale" },
  { value: "rent", label: "For Rent" },
  { value: "off-plan", label: "Off-Plan" },
];

const PROPERTY_TYPES = [
  { value: "all", label: "All Properties" },
  { value: "residential", label: "Residential" },
  { value: "land", label: "Land" },
  { value: "commercial", label: "Commercial" },
];

export default function BrowseListingsPage() {
  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [district, setDistrict] = useState("All Districts");
  const [transactionType, setTransactionType] = useState("all");
  const [propertyType, setPropertyType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      const { data } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (data) {
        // Map db snake_case to camelCase
        const mapped = data.map(item => ({
          ...item,
          priceNgn: item.price_ngn || item.priceNgn,
          transactionType: item.transaction_type || item.transactionType || "sale",
          propertyType: item.property_type || item.propertyType || "residential",
          sizeSqm: item.size_sqm || item.sizeSqm,
        }));
        setAllListings(mapped);
      }
      setLoading(false);
    }
    fetchListings();
  }, []);

  const activeFilterCount = [
    district !== "All Districts",
    transactionType !== "all",
    propertyType !== "all",
  ].filter(Boolean).length;

  const filtered = useMemo(() => {
    let results = [...allListings];
    if (district !== "All Districts") results = results.filter((l) => l.district === district);
    if (transactionType !== "all") results = results.filter((l) => l.transactionType === transactionType);
    if (propertyType !== "all") results = results.filter((l) => l.propertyType === propertyType);
    if (sortBy === "price-low") results.sort((a, b) => (a.priceNgn || 0) - (b.priceNgn || 0));
    else if (sortBy === "price-high") results.sort((a, b) => (b.priceNgn || 0) - (a.priceNgn || 0));
    return results;
  }, [allListings, district, transactionType, propertyType, sortBy]);

  const resetFilters = () => {
    setDistrict("All Districts");
    setTransactionType("all");
    setPropertyType("all");
  };

  const FilterControls = () => (
    <div className={styles.filters}>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>District</label>
        <select value={district} onChange={(e) => setDistrict(e.target.value)}
          className={styles.filterSelect}>
          {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Transaction</label>
        <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)}
          className={styles.filterSelect}>
          {TRANSACTION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Property Type</label>
        <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}
          className={styles.filterSelect}>
          {PROPERTY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Sort By</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
          className={styles.filterSelect}>
          <option value="newest">Newest First</option>
          <option value="price-low">Price: Low → High</option>
          <option value="price-high">Price: High → Low</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className={styles.searchPageContainer}>
      {/* Header */}
      <section className={styles.header}>
        <div className="container">
          <h1>Search</h1>
          <p className={styles.headerSub}>Find your dream property</p>
        </div>
      </section>

      {/* Mobile Filter Bar */}
      <div className={styles.mobileFilterBar}>
        <div className={styles.mobileFilterRow}>
          <button
            className={styles.mobileFilterToggle}
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <i className="fa-solid fa-sliders"></i>
            Filters
            {activeFilterCount > 0 && (
              <span className={styles.filterBadge}>{activeFilterCount}</span>
            )}
            <i className={`fa-solid fa-chevron-${filtersOpen ? "up" : "down"} ${styles.chevron}`}></i>
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.mobileSortSelect}
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price ↑</option>
            <option value="price-high">Price ↓</option>
          </select>
        </div>

        {filtersOpen && (
          <div className={styles.mobileFilterPanel}>
            <div className={styles.mobileFilterGrid}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>District</label>
                <select value={district} onChange={(e) => setDistrict(e.target.value)} className={styles.filterSelect}>
                  {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Transaction</label>
                <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)} className={styles.filterSelect}>
                  {TRANSACTION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Property Type</label>
                <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className={styles.filterSelect}>
                  {PROPERTY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
            </div>
            {activeFilterCount > 0 && (
              <button className={styles.clearFiltersBtn} onClick={resetFilters}>
                <i className="fa-solid fa-xmark"></i>
                Clear {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Desktop Filters */}
      <section className={styles.filtersSection}>
        <div className="container">
          <FilterControls />
        </div>
      </section>

      {/* Results */}
      <section className={styles.resultsSection}>
        <div className="container">
          <div className={styles.resultsMeta}>
            <span>{filtered.length} properties found</span>
          </div>

          {loading ? (
            <div className={styles.loadingState}>
               <i className="fa-solid fa-spinner fa-spin"></i> Loading...
            </div>
          ) : filtered.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIconWrap}>
                <i className="fa-solid fa-house-circle-xmark"></i>
              </div>
              <h3>No listings match your filters</h3>
              <button className="btn btn-primary" onClick={resetFilters}>
                Reset Filters
              </button>
            </div>
          ) : (
            <div className={styles.grid}>
              {filtered.map((listing) => (
                <PropertyCard key={listing.id} {...listing} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Spacer for bottom nav */}
      <div style={{ height: '80px' }}></div>
    </div>
  );
}
