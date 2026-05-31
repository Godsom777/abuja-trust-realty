import React from 'react';
import PropertyCard from '../PropertyCard/PropertyCard';
import styles from './PropertyGrid.module.css';

/**
 * Grid Component to render list of properties
 * @param {Array} properties 
 * @param {boolean} loading 
 * @param {string} emptyMessage 
 */
export default function PropertyGrid({ properties = [], loading = false, emptyMessage = 'No properties found. Check back later.', viewMode = 'list' }) {
  
  if (loading) {
    return (
      <div className={`${styles.grid} ${viewMode === 'grid' ? styles.isGridView : ''}`}>
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className={`${styles.skeletonCard} ${viewMode === 'grid' ? styles.skeletonCardGrid : ''}`}>
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
    <div className={`${styles.grid} ${viewMode === 'grid' ? styles.isGridView : ''}`}>
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} viewMode={viewMode} />
      ))}
    </div>
  );
}
