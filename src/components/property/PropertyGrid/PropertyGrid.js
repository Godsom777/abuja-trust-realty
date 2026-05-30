import React from 'react';
import PropertyCard from '../PropertyCard/PropertyCard';
import styles from './PropertyGrid.module.css';

/**
 * Grid Component to render list of properties
 * @param {Array} properties 
 * @param {boolean} loading 
 * @param {string} emptyMessage 
 */
export default function PropertyGrid({ properties = [], loading = false, emptyMessage = 'No properties found. Check back later.' }) {
  
  if (loading) {
    return (
      <div className={styles.grid}>
        {[1, 2, 3].map((n) => (
          <div key={n} className={styles.skeletonCard}>
            <div className={`skeleton ${styles.skeletonImage}`} />
            <div className={styles.skeletonContent}>
              <div className={`skeleton ${styles.skeletonLocation}`} />
              <div className={`skeleton ${styles.skeletonTitle}`} />
              <div className={styles.skeletonFooter}>
                <div className={`skeleton ${styles.skeletonPrice}`} />
                <div className={`skeleton ${styles.skeletonSpecs}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <i className="fa-solid fa-house-crack"></i>
        </div>
        <p className={styles.emptyText}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
