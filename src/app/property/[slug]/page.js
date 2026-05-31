import { supabase } from "@/lib/supabase";
import PropertyDetailClient from "@/components/property/PropertyDetailClient";
import { formatConvertedPrice } from "@/lib/currency";

export const revalidate = 0; // Disable static caching so it always fetches fresh data from Supabase

// Dynamic SEO Metadata Generation
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  try {
    const { data: property } = await supabase
      .from('properties')
      .select('*')
      .eq('slug', slug)
      .single();

    if (property) {
      const title = `${property.title} — Verified Property in ${property.location_area}, Abuja`;
      const priceStr = property.price_ngn 
        ? formatConvertedPrice(property.price_ngn, 'ngn', false) 
        : 'Price on Enquiry';
      const desc = property.description 
        ? property.description.substring(0, 150) + "..." 
        : `Verified property in Abuja. Price: ${priceStr}. Direct owner contact verified.`;

      return {
        title: title,
        description: desc,
        openGraph: {
          title: title,
          description: desc,
          images: property.cover_image_url ? [{ url: property.cover_image_url }] : [],
        }
      };
    }
  } catch (err) {
    console.error("Error generating metadata:", err);
  }

  return {
    title: "Verified Listing — Abuja Trust Realty",
    description: "Verified direct-to-owner property showcase in Abuja, Nigeria."
  };
}

export default async function PropertyDetailPage({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // 1. Fetch single property by slug
  let property = null;
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('slug', slug)
      .single();

    if (data && !error) {
      property = {
        ...data,
        price_ngn: data.price_ngn || data.priceNgn || 0,
        transaction_type: data.transaction_type || data.transactionType || 'sale',
        property_type: data.property_type || data.propertyType || 'residential',
        size_sqm: data.size_sqm || data.sizeSqm || 0,
        cover_image_url: data.cover_image_url || data.photo || null,
        location_area: data.district || data.location_area || 'Abuja',
        location_city: data.location_city || 'Abuja',
        structure_type: data.structure_type || null
      };
    }
  } catch (err) {
    console.error("Error loading property detail:", err);
  }

  // 2. Fetch associated media for slideshow
  let media = [];
  if (property && property.id) {
    try {
      const { data, error } = await supabase
        .from('property_media')
        .select('*')
        .eq('property_id', property.id)
        .order('display_order', { ascending: true });

      if (data && !error) {
        media = data;
      }
    } catch (err) {
      console.warn("Could not load property media, falling back to cover image.", err);
    }
  }

  return (
    <PropertyDetailClient
      property={property}
      media={media}
    />
  );
}
