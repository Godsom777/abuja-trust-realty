import Link from "next/link";
import slugify from "slugify";
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
  const transLabel = TRANSACTION_LABELS[transactionType] || transactionType;

  const districtSlug = district ? slugify(district.toLowerCase()) : 'unspecified';
  const detailUrl = slug.startsWith('/') ? slug : `/abuja/${districtSlug}/${slug}`;
  const isVideo = photo && (photo.endsWith('.mp4') || photo.endsWith('.webm') || photo.endsWith('.mov') || photo.includes('video'));

  return (
    <Link href={detailUrl} className={styles.card}>
      {/* Image */}
      <div className={styles.imageWrap}>
        {isVideo ? (
          <video
            src={photo}
            className={styles.image}
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
            muted
            loop
            autoPlay
            playsInline
          />
        ) : (
          <div
            className={styles.image}
            style={{
              backgroundImage: photo
                ? `url(${photo})`
                : `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600')`,
            }}
          />
        )}
        <div className={styles.overlay} />

        {/* Badges */}
        <div className={styles.badges}>
          <span className={`${styles.badge} ${transactionType === "sale" ? styles["badge-sale"] : ""}`}>
            {transLabel}
          </span>
          {verified && (
            <span className={styles.badge} style={{ color: "var(--color-emerald)" }}>
              <i className="fa-solid fa-circle-check"></i> Verified
            </span>
          )}
        </div>

        {/* Favorite Action */}
        <button className={styles.favoriteBtn} onClick={(e) => e.preventDefault()}>
          <i className="fa-regular fa-heart"></i>
        </button>
      </div>

      {/* Body */}
      <div className={styles.body}>
        <div className={styles.headerRow}>
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.price}>{formatPrice(priceNgn)}</div>
        </div>

        <div className={styles.location}>
          <i className="fa-solid fa-location-dot"></i>
          {district}, Abuja
        </div>

        {/* Features */}
        <div className={styles.features}>
          {bedrooms != null && (
            <span className={styles.feature}>
              <i className="fa-solid fa-bed"></i>
              {bedrooms}
            </span>
          )}
          {sizeSqm != null && sizeSqm > 0 && (
            <span className={styles.feature}>
              <i className="fa-solid fa-ruler-combined"></i>
              {sizeSqm.toLocaleString()} sqm ({(sizeSqm / 10000).toLocaleString(undefined, { maximumFractionDigits: 3 })} ha)
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
