import { notFound } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import { supabase } from "@/lib/supabase";
import PhotoGallery from "@/components/property/PhotoGallery/PhotoGallery";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const fullSlug = "/abuja/" + resolvedParams.slug.join("/");
  
  const { data: listing } = await supabase
    .from('properties')
    .select('*')
    .eq('slug', fullSlug)
    .single();

  if (!listing) return { title: "Property Not Found" };

  return {
    title: `${listing.title} in ${listing.district} — Abuja Trust Realty`,
    description: listing.description || `Verified ${listing.property_type || listing.propertyType} for ${listing.transaction_type || listing.transactionType} in ${listing.district}, Abuja.`,
  };
}

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

export default async function PropertyDetailPage({ params }) {
  const resolvedParams = await params;
  const fullSlug = "/abuja/" + resolvedParams.slug.join("/");

  const { data: rawListing } = await supabase
    .from('properties')
    .select('*')
    .eq('slug', fullSlug)
    .single();

  if (!rawListing) {
    notFound();
  }

  // Normalize snake_case to camelCase just in case
  const listing = {
    ...rawListing,
    priceNgn: rawListing.price_ngn || rawListing.priceNgn,
    transactionType: rawListing.transaction_type || rawListing.transactionType || "sale",
    propertyType: rawListing.property_type || rawListing.propertyType || "residential",
    sizeSqm: rawListing.size_sqm || rawListing.sizeSqm,
  };

  // Fetch associated media for slideshow (photos & videos)
  let media = [];
  try {
    const { data: mediaData, error: mediaError } = await supabase
      .from('property_media')
      .select('*')
      .eq('property_id', listing.id)
      .order('display_order', { ascending: true });

    if (mediaData && !mediaError) {
      media = mediaData.map(m => m.url);
    }
  } catch (err) {
    console.warn("Could not load property media, falling back to cover image.", err);
  }

  // Fallback to cover photo if no gallery media exists
  const mediaUrls = media.length > 0 ? media : [listing.photo].filter(Boolean);

  const transLabel = TRANSACTION_LABELS[listing.transactionType] || listing.transactionType;
  const dealRef = `ABJ-2026-${listing.id.toString().padStart(4, "0")}`;
  const waMessage = encodeURIComponent(
    `Hello Abuja Trust Realty,\n\I am interested in this property:\n*${listing.title}*\nRef: ${dealRef}\nLink: https://abujatrust.com${listing.slug}`
  );
  const waLink = `https://wa.me/2348032591590?text=${waMessage}`;

  return (
    <div className={styles.page}>
      {/* ── Breadcrumbs ── */}
      <div className={styles.breadcrumbsWrap}>
        <div className={`container ${styles.breadcrumbs}`}>
          <Link href="/abuja">Abuja</Link>
          <i className="fa-solid fa-chevron-right"></i>
          <span>{listing.district}</span>
          <i className="fa-solid fa-chevron-right"></i>
          <span className={styles.bcCurrent}>{listing.title}</span>
        </div>
      </div>

      {/* ── Dynamic Hero Gallery (Images/Videos) ── */}
      <div className="container" style={{ marginTop: '24px', marginBottom: '24px' }}>
        <PhotoGallery images={mediaUrls} />
      </div>

      {/* ── Content Layout ── */}
      <div className={`container ${styles.layout}`}>
        {/* Main Column */}
        <div className={styles.mainContent}>
          <div className={styles.header}>
            <div className={styles.location}>
              <i className="fa-solid fa-location-dot"></i>
              {listing.district}, Abuja
            </div>
            <h1 className={styles.title}>{listing.title}</h1>
            
            <div className={styles.metaRow}>
              {listing.verified !== false && (
                <div className={styles.verifiedStamp}>
                  <i className="fa-solid fa-circle-check"></i>
                  Verified Owner
                </div>
              )}
              <div className={styles.refStamp}>
                <i className="fa-solid fa-hashtag"></i>
                Ref: {dealRef}
              </div>
            </div>
          </div>

          <div className={styles.specs}>
            {listing.bedrooms != null && (
              <div className={styles.specBox}>
                <i className="fa-solid fa-bed"></i>
                <span className={styles.specVal}>{listing.bedrooms}</span>
                <span className={styles.specLabel}>Bedrooms</span>
              </div>
            )}
            {listing.sizeSqm != null && listing.sizeSqm > 0 && (
              <div className={styles.specBox}>
                <i className="fa-solid fa-ruler-combined"></i>
                <span className={styles.specVal}>
                  {listing.sizeSqm.toLocaleString()} sqm / {(listing.sizeSqm / 10000).toLocaleString(undefined, { maximumFractionDigits: 4 })} ha
                </span>
                <span className={styles.specLabel}>Property Size</span>
              </div>
            )}
            <div className={styles.specBox}>
              <i className="fa-solid fa-building"></i>
              <span className={styles.specVal} style={{ textTransform: "capitalize" }}>
                {listing.propertyType}
              </span>
              <span className={styles.specLabel}>Property Type</span>
            </div>
          </div>

          <div className={styles.section}>
            <h2>Property Description</h2>
            <div className={styles.description}>
              {listing.description ? (
                <p>{listing.description}</p>
              ) : (
                <p>A highly sought-after {listing.propertyType} property located in the prestigious district of {listing.district}, Abuja. This property has been fully vetted by our administrative team.</p>
              )}
            </div>
          </div>

          <div className={styles.trustBox}>
            <div className={styles.trustIcon}>
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <div className={styles.trustContent}>
              <h3>Trust-First Transaction</h3>
              <p>
                The owner's identity and title documents have been verified. 
                When you express interest, we create a secure WhatsApp group with you, the owner, and our admin team to facilitate a safe transaction. <strong>The buyer pays a 5% commission upon successful deal closure.</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.pricingCard}>
            <div className={styles.priceLabel}>Asking Price</div>
            <div className={styles.priceNgn}>₦{(listing.priceNgn || 0).toLocaleString()}</div>
            <div className={styles.priceAlt}>
              Approx: ${((listing.priceNgn || 0) / 1400).toLocaleString(undefined, { maximumFractionDigits: 0 })} USD
            </div>

            <div className={styles.pricingActions}>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp" style={{ width: "100%", padding: "16px", borderRadius: "12px", justifyContent: "center" }}>
                <i className="fa-brands fa-whatsapp"></i>
                Express Interest
              </a>
              <p className={styles.actionNote}>
                <i className="fa-solid fa-lock"></i>
                No upfront payments required.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* ── Mobile Sticky Bottom CTA ── */}
      <div className={styles.mobileCta}>
        <div className={styles.mobilePrice}>
          <span className={styles.mobilePriceLabel}>Asking Price</span>
          <span className={styles.mobilePriceNgn}>{formatPrice(listing.priceNgn)}</span>
        </div>
        <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp" style={{ borderRadius: "10px", padding: "12px 20px" }}>
          Express Interest
        </a>
      </div>
      
      {/* Spacer for bottom nav */}
      <div style={{ height: '70px' }}></div>
    </div>
  );
}
