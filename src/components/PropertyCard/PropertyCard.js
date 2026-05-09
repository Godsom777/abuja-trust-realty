import Link from "next/link";
import styles from "./PropertyCard.module.css";

const formatPrice = (price) => {
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
  propertyType = "residential",
  priceNgn,
  bedrooms,
  bathrooms,
  sizeSqm,
  photo,
  verified = true,
  featured = false,
}) {
  const transLabel = TRANSACTION_LABELS[transactionType] || transactionType;

  return (
    <Link href={slug} className={`card ${styles.card}`}>
      {/* Image */}
      <div className={styles.imageWrap}>
        <div
          className={styles.image}
          style={{
            backgroundImage: photo
              ? `url(${photo})`
              : `linear-gradient(135deg, var(--color-warm-sand), var(--color-warm-sand-dark))`,
          }}
        />
        <div className={styles.overlay} />

        {/* Badges */}
        <div className={styles.badges}>
          <span
            className={`badge ${
              transactionType === "sale"
                ? "badge-sale"
                : transactionType === "off-plan"
                ? "badge-featured"
                : "badge-rent"
            }`}
          >
            {transLabel}
          </span>
          {featured && (
            <span className="badge badge-featured">
              <i className="fa-solid fa-star"></i> Featured
            </span>
          )}
        </div>

        {/* Verified Stamp */}
        {verified && (
          <div className={styles.verifiedStamp}>
            <i className="fa-solid fa-circle-check"></i>
            Verified
          </div>
        )}
      </div>

      {/* Body */}
      <div className={styles.body}>
        <div className={styles.location}>
          <i className="fa-solid fa-location-dot"></i>
          {district}, Abuja
        </div>

        <h3 className={styles.title}>{title}</h3>

        <div className={styles.price}>{formatPrice(priceNgn)}</div>

        {/* Features */}
        <div className={styles.features}>
          {bedrooms != null && (
            <span className={styles.feature}>
              <i className="fa-solid fa-bed"></i>
              {bedrooms} Bed{bedrooms > 1 ? "s" : ""}
            </span>
          )}
          {bathrooms != null && (
            <span className={styles.feature}>
              <i className="fa-solid fa-bath"></i>
              {bathrooms} Bath{bathrooms > 1 ? "s" : ""}
            </span>
          )}
          {sizeSqm != null && (
            <span className={styles.feature}>
              <i className="fa-solid fa-ruler-combined"></i>
              {sizeSqm.toLocaleString()} sqm
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
