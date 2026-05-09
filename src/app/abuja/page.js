"use client";

import { useState, useMemo } from "react";
import PropertyCard from "@/components/PropertyCard/PropertyCard";
import styles from "./page.module.css";

import { ALL_LISTINGS } from "@/data/listings";

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

const resetState = {
  district: "All Districts",
  transactionType: "all",
  propertyType: "all",
};

export default function BrowseListingsPage() {
  const [district, setDistrict] = useState("All Districts");
  const [transactionType, setTransactionType] = useState("all");
  const [propertyType, setPropertyType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeFilterCount = [
    district !== "All Districts",
    transactionType !== "all",
    propertyType !== "all",
  ].filter(Boolean).length;

  const filtered = useMemo(() => {
    let results = [...ALL_LISTINGS];
    if (district !== "All Districts") results = results.filter((l) => l.district === district);
    if (transactionType !== "all") results = results.filter((l) => l.transactionType === transactionType);
    if (propertyType !== "all") results = results.filter((l) => l.propertyType === propertyType);
    if (sortBy === "price-low") results.sort((a, b) => a.priceNgn - b.priceNgn);
    else if (sortBy === "price-high") results.sort((a, b) => b.priceNgn - a.priceNgn);
    return results;
  }, [district, transactionType, propertyType, sortBy]);

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
          className={styles.filterSelect} id="filter-district">
          {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Transaction</label>
        <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)}
          className={styles.filterSelect} id="filter-transaction">
          {TRANSACTION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Property Type</label>
        <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}
          className={styles.filterSelect} id="filter-property-type">
          {PROPERTY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Sort By</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
          className={styles.filterSelect} id="filter-sort">
          <option value="newest">Newest First</option>
          <option value="price-low">Price: Low → High</option>
          <option value="price-high">Price: High → Low</option>
        </select>
      </div>
    </div>
  );

  return (
    <>
      {/* Header */}
      <section className={styles.header}>
        <div className="container">
          <span className="text-label">Browse Properties</span>
          <h1>Property Listings in Abuja</h1>
          <p className={styles.headerSub}>
            Every listing is verified and reviewed by our team.
            {district !== "All Districts" && ` Showing: ${district}`}
          </p>
        </div>
      </section>

      {/* ── Desktop Filters (always visible, sticky) ── */}
      <section className={styles.filtersSection}>
        <div className="container">
          <FilterControls />
        </div>
      </section>

      {/* ── Mobile Filter Bar ── */}
      <div className={styles.mobileFilterBar}>
        <div className={styles.mobileFilterRow}>
          <button
            className={styles.mobileFilterToggle}
            onClick={() => setFiltersOpen(!filtersOpen)}
            id="mobile-filter-toggle"
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
            id="mobile-filter-sort"
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
                <select value={district} onChange={(e) => setDistrict(e.target.value)}
                  className={styles.filterSelect} id="mobile-filter-district">
                  {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Transaction</label>
                <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)}
                  className={styles.filterSelect} id="mobile-filter-transaction">
                  {TRANSACTION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Property Type</label>
                <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}
                  className={styles.filterSelect} id="mobile-filter-property-type">
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

      {/* Results */}
      <section className={`section-sm ${styles.results}`}>
        <div className="container">
          <div className={styles.resultsMeta}>
            <span className={styles.resultsCount}>
              {filtered.length} verified listing{filtered.length !== 1 ? "s" : ""}
            </span>
            <span className={styles.resultsVerified}>
              <span className={styles.verifiedDot} />
              All listings admin-reviewed
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIconWrap}>
                <i className="fa-solid fa-house-circle-xmark"></i>
              </div>
              <h3>No listings match your filters</h3>
              <p>Try adjusting your search criteria or browse all listings.</p>
              <button className="btn btn-primary" onClick={resetFilters}>
                <i className="fa-solid fa-rotate-left"></i>
                Reset Filters
              </button>
            </div>
          ) : (
            <div className={styles.grid}>
              {filtered.map((listing, i) => (
                <div key={listing.id} className="animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.08}s` }}>
                  <PropertyCard {...listing} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
