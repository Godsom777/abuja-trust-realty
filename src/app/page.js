import Link from "next/link";
import PropertyCard from "@/components/PropertyCard/PropertyCard";
import styles from "./page.module.css";
import { supabase } from "@/lib/supabase";

export const revalidate = 0; // Disable static caching so it always fetches from Supabase

export default async function HomePage() {
  const { data: listings, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4);

  // Map snake_case from DB to camelCase for the component if needed
  const mappedListings = (listings || []).map(item => ({
    ...item,
    priceNgn: item.price_ngn || item.priceNgn,
    transactionType: item.transaction_type || item.transactionType || "sale",
    propertyType: item.property_type || item.propertyType || "residential",
    sizeSqm: item.size_sqm || item.sizeSqm,
  }));

  const CATEGORIES = [
    { name: "Houses", icon: "fa-house", slug: "residential", color: "#e8f5e9", iconColor: "#2e7d32" },
    { name: "Apartments", icon: "fa-building", slug: "residential", color: "#e3f2fd", iconColor: "#1565c0" },
    { name: "Land", icon: "fa-map", slug: "land", color: "#fff3e0", iconColor: "#ef6c00" },
    { name: "Commercial", icon: "fa-shop", slug: "commercial", color: "#f3e5f5", iconColor: "#7b1fa2" },
  ];

  return (
    <div className={styles.homeContainer}>
      {/* Intro Hero Section - eBay Style */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Discover your perfect place in <span>Abuja</span>
          </h1>
          <p className={styles.heroSubtitle}>
            The safest marketplace to buy, rent, or sell properties. Verified listings, zero stress.
          </p>

          <div className={styles.searchContainer}>
            <div className={styles.searchInputWrapper}>
              <i className="fa-solid fa-magnifying-glass"></i>
              <input type="text" placeholder="Search for Maitama, Wuse, Asokoro..." />
            </div>
            <button className={styles.searchBtn}>Search</button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className={styles.categoriesSection}>
        <h2 className={styles.sectionTitle}>Shop by Category</h2>
        <div className={styles.categoryGrid}>
          {CATEGORIES.map((cat, idx) => (
            <Link href={`/abuja?type=${cat.slug}`} key={idx} className={styles.categoryCard}>
              <div className={styles.categoryIconWrap} style={{ backgroundColor: cat.color }}>
                <i className={`fa-solid ${cat.icon}`} style={{ color: cat.iconColor }}></i>
              </div>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Banner (Like eBay Guarantee) */}
      <section className={styles.trustSection}>
        <div className={styles.trustBanner}>
          <div className={styles.trustIcon}>
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <div className={styles.trustText}>
            <h3>Abuja Trust Guarantee</h3>
            <p>Every listing is verified by our agents before publishing. Buy and rent with 100% peace of mind.</p>
          </div>
          <Link href="/how-it-works" className={styles.trustLink}>Learn more</Link>
        </div>
      </section>

      {/* Featured Items Feed */}
      <section className={styles.featuredSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Daily Featured Properties</h2>
          <Link href="/abuja" className={styles.viewAll}>See all <i className="fa-solid fa-arrow-right"></i></Link>
        </div>
        
        {error ? (
          <div className={styles.emptyState}>
            <i className="fa-solid fa-triangle-exclamation"></i>
            <p>Could not connect to database.</p>
          </div>
        ) : mappedListings.length > 0 ? (
          <div className={styles.feedGrid}>
            {mappedListings.map((listing) => (
              <PropertyCard key={listing.id} {...listing} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconWrap}>
              <i className="fa-solid fa-house-chimney-crack"></i>
            </div>
            <p>No properties found. Check back later.</p>
          </div>
        )}
      </section>

      {/* Add spacing at the bottom so the BottomNav doesn't cover content */}
      <div className={styles.bottomNavSpacer}></div>
    </div>
  );
}
