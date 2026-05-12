import Link from "next/link";
import PropertyCard from "@/components/PropertyCard/PropertyCard";
import styles from "./page.module.css";
import { supabase } from "@/lib/supabase";

export const revalidate = 0; // Disable static caching so it always fetches from Supabase

const DISTRICTS = [
  { name: "All", slug: "all" },
  { name: "Maitama", slug: "maitama" },
  { name: "Asokoro", slug: "asokoro" },
  { name: "Wuse 2", slug: "wuse-2" },
  { name: "Gwarinpa", slug: "gwarinpa" },
  { name: "Jabi", slug: "jabi" },
  { name: "Life Camp", slug: "life-camp" },
  { name: "Garki", slug: "garki" },
  { name: "Katampe", slug: "katampe" },
];

export default async function HomePage() {
  const { data: listings, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  // Map snake_case from DB to camelCase for the component if needed
  const mappedListings = (listings || []).map(item => ({
    ...item,
    priceNgn: item.price_ngn || item.priceNgn,
    transactionType: item.transaction_type || item.transactionType || "sale",
    propertyType: item.property_type || item.propertyType || "residential",
    sizeSqm: item.size_sqm || item.sizeSqm,
  }));

  return (
    <div className={styles.ecommerceContainer}>
      {/* App Header */}
      <header className={styles.appHeader}>
        <div className={styles.appHeaderTop}>
          <div className={styles.greeting}>
            <p className={styles.greetingLabel}>Current Location</p>
            <h2 className={styles.greetingLocation}>
              Abuja, NG <i className="fa-solid fa-chevron-down"></i>
            </h2>
          </div>
          <div className={styles.profileAvatar}>
            <i className="fa-regular fa-bell"></i>
          </div>
        </div>

        <div className={styles.searchBar}>
          <i className="fa-solid fa-magnifying-glass"></i>
          <input type="text" placeholder="Search districts, areas..." />
          <button className={styles.filterBtn}>
            <i className="fa-solid fa-sliders"></i>
          </button>
        </div>
      </header>

      {/* Categories (Districts) */}
      <section className={styles.categoriesSection}>
        <div className={styles.categoriesScroll}>
          {DISTRICTS.map((d, index) => (
            <button key={d.slug} className={`${styles.categoryPill} ${index === 0 ? styles.activePill : ''}`}>
              {d.name}
            </button>
          ))}
        </div>
      </section>

      {/* Main Feed */}
      <section className={styles.feedSection}>
        <div className={styles.feedHeader}>
          <h3>Featured for you</h3>
          <Link href="/search" className={styles.viewAll}>See all</Link>
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
            <h4>No properties found</h4>
            <p>Check back later or adjust your search.</p>
          </div>
        )}
      </section>

      {/* E-commerce Special Collections */}
      <section className={styles.collectionsSection}>
        <div className={styles.feedHeader}>
          <h3>Explore Collections</h3>
        </div>
        <div className={styles.collectionsScroll}>
          <div className={`${styles.collectionCard} ${styles.collectionLuxury}`}>
            <h4>Luxury Villas</h4>
            <span>12 Properties</span>
          </div>
          <div className={`${styles.collectionCard} ${styles.collectionOffPlan}`}>
            <h4>Off-Plan Deals</h4>
            <span>5 Properties</span>
          </div>
        </div>
      </section>

      {/* Add spacing at the bottom so the BottomNav doesn't cover content */}
      <div className={styles.bottomNavSpacer}></div>
    </div>
  );
}
