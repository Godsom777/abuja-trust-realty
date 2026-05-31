"use client";

import React, { useState } from 'react';
import styles from './PhotoGallery.module.css';

/**
 * Premium Photo Gallery Component with hand-built lightbox and video support
 * @param {Array} images - Array of image/video URL strings
 */
export default function PhotoGallery({ images = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Helper to check if a URL is a video file
  const isVideoUrl = (url) => {
    if (!url) return false;
    return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov') || url.includes('video') || url.includes('/video/');
  };

  // If no images provided, use a default fallback
  const galleryImages = images.length > 0 
    ? images 
    : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200'];

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const currentItem = galleryImages[currentIndex];

  return (
    <div className={styles.gallery}>
      {/* Main Image/Video Viewport */}
      <div 
        className={styles.viewport} 
        onClick={() => {
          if (!isVideoUrl(currentItem)) {
            setLightboxOpen(true);
          }
        }}
        style={{ cursor: isVideoUrl(currentItem) ? 'default' : 'zoom-in' }}
      >
        {isVideoUrl(currentItem) ? (
          <video
            src={currentItem}
            controls
            className={styles.mainVideo}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <img
            src={currentItem}
            alt={`View ${currentIndex + 1}`}
            className={styles.mainImage}
          />
        )}
        <div className={styles.overlay} />

        {/* Floating Indicator */}
        <div className={styles.counter}>
          <i className="fa-regular fa-images"></i>
          {currentIndex + 1} / {galleryImages.length}
        </div>

        {/* Navigation Arrows (Only show if multiple items) */}
        {galleryImages.length > 1 && (
          <>
            <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={handlePrev} aria-label="Previous">
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={handleNext} aria-label="Next">
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </>
        )}
      </div>

      {/* Horizontal Thumbnail Stripe */}
      {galleryImages.length > 1 && (
        <div className={styles.thumbnails}>
          {galleryImages.map((img, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={idx}
                className={`${styles.thumbBtn} ${isActive ? styles.thumbActive : ''}`}
                onClick={() => setCurrentIndex(idx)}
              >
                {isVideoUrl(img) ? (
                  <div className={styles.thumbVideoWrapper}>
                    <video src={img} className={styles.thumbVideo} muted preload="metadata" />
                    <div className={styles.playOverlay}>
                      <i className="fa-solid fa-circle-play"></i>
                    </div>
                  </div>
                ) : (
                  <img src={img} alt={`Thumb ${idx + 1}`} className={styles.thumbImage} />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div className={styles.lightbox} onClick={() => setLightboxOpen(false)}>
          <button className={styles.closeBtn} onClick={() => setLightboxOpen(false)} aria-label="Close Lightbox">
            <i className="fa-solid fa-xmark"></i>
          </button>
          
          <div className={styles.lightboxViewport} onClick={(e) => e.stopPropagation()}>
            {isVideoUrl(currentItem) ? (
              <video
                src={currentItem}
                controls
                autoPlay
                className={styles.lightboxVideo}
              />
            ) : (
              <img
                src={currentItem}
                alt={`Fullscreen view ${currentIndex + 1}`}
                className={styles.lightboxImage}
              />
            )}
            
            {galleryImages.length > 1 && (
              <>
                <button className={`${styles.lightboxNav} ${styles.lightboxPrev}`} onClick={handlePrev} aria-label="Previous">
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <button className={`${styles.lightboxNav} ${styles.lightboxNext}`} onClick={handleNext} aria-label="Next">
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </>
            )}
            
            <div className={styles.lightboxCounter}>
              {currentIndex + 1} / {galleryImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
