"use client";

import Link from "next/link";
import slugify from "slugify";
import { useAppStore } from "@/store/useAppStore";
import styles from "./PropertyCard.module.css";

const formatPrice = (price) => {
  if (!price) return "₦0";
  if (price >= 1_000_000_000) return `₦${(price / 1_000_000_000).toFixed(1)}B`;
  if (price >= 1_000_000) return `₦${(price / 1_000_000).toFixed(0)}M`;
  if (price >= 1_000) return `₦${(price / 1_000).toFixed(0)}K`;
  return `₦${price.toLocaleString()}`;
};

const TRANSACTION_LABELS = {
  sale: "For Sale",
  rent: "For Rent",
  "off-plan": "Off-Plan",
};

export default function PropertyCard({
  id,
  title,
  slug = "#",
  district,
  transactionType = "sale",
  priceNgn,
  bedrooms,
  sizeSqm,
  photo,
  verified = true,
}) {
  const { savedProperties, toggleSaveProperty } = useAppStore();
  const isSaved = savedProperties.includes(id);

  const transLabel = TRANSACTION_LABELS[transactionType] || transactionType;
  const districtSlug = district ? slugify(district.toLowerCase()) : "unspecified";
  const detailUrl = slug.startsWith("/") ? slug : `/abuja/${districtSlug}/${slug}`;
  const isVideo =
    photo &&
    (photo.endsWith(".mp4") ||
      photo.endsWith(".webm") ||
      photo.endsWith(".mov") ||
      photo.includes("video"));

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (id) toggleSaveProperty(id);
  };

  return (
    <Link href={detailUrl} className={styles.card}>
      {/* Full-bleed Media */}
      {isVideo ? (
        <video
          src={photo}
          className={styles.media}
          muted
          loop
          autoPlay
          playsInline
        />
      ) : (
        <div
          className={styles.media}
          style={{
            backgroundImage: photo
              ? `url(${photo})`
              : `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600')`,
          }}
        />
      )}

      {/* Gradient overlay — darkens from transparent to rich bottom */}
      <div className={styles.overlay} />

      {/* Top badges row */}
      <div className={styles.topRow}>
        <span
          className={`${styles.badge} ${
            transactionType === "sale"
              ? styles.badgeSale
              : transactionType === "rent"
              ? styles.badgeRent
              : styles.badgeOffPlan
          }`}
        >
          {transLabel}
        </span>
        {verified && (
          <span className={styles.badgeVerified}>
            <i className="fa-solid fa-circle-check"></i>
          </span>
        )}
      </div>

      {/* Save (heart) button */}
      <button
        className={`${styles.saveBtn} ${isSaved ? styles.saveBtnActive : ""}`}
        onClick={handleSave}
        aria-label={isSaved ? "Remove from saved" : "Save property"}
      >
        <i className={`${isSaved ? "fa-solid" : "fa-regular"} fa-heart`}></i>
      </button>

      {/* Text overlay block at the bottom */}
      <div className={styles.textOverlay}>
        {/* Price in Clash Display */}
        <div className={styles.price}>{formatPrice(priceNgn)}</div>

        <h3 className={styles.title}>{title}</h3>

        <div className={styles.metaRow}>
          <span className={styles.location}>
            <i className="fa-solid fa-location-dot"></i>
            {district}, Abuja
          </span>

          {/* Specs inline */}
          <div className={styles.specs}>
            {bedrooms != null && (
              <span className={styles.spec}>
                <i className="fa-solid fa-bed"></i>
                {bedrooms}
              </span>
            )}
            {sizeSqm != null && sizeSqm > 0 && (
              <span className={styles.spec}>
                <i className="fa-solid fa-ruler-combined"></i>
                {sizeSqm >= 10000
                  ? `${(sizeSqm / 10000).toFixed(2)}ha`
                  : `${sizeSqm.toLocaleString()}sqm`}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
