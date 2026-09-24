import { supabase } from "@/lib/supabase";
import AbujaBrowseClient from "./AbujaBrowseClient";

export const revalidate = 120; // 2-minute ISR caching to drastically reduce Supabase DB egress

const FALLBACK_DISTRICTS = [
  "Maitama", "Asokoro", "Wuse", "Wuse 2", "Garki", "Garki 2", "Jabi", "Gwarinpa", "Apo", 
  "Life Camp", "Lugbe", "Guzape", "Katampe", "Katampe Extension", "Mabushi", "Utako", 
  "Wuye", "Central Business District", "Lokogoma", "Galadimawa", "Kaura", "Durumi", 
  "Kubwa", "Kuje", "Gwagwalada", "Bwari", "Karsana", "Karmo", "Idu", "Karu", "Nyanya", "Jikwoyi"
].sort();

export const metadata = {
  title: "Search Properties in Abuja — Verified Listings | emanon",
  description: "Browse verified residential and commercial properties, land, and off-plan investments across all districts of Abuja.",
};

export default async function BrowseListingsPage() {
  let listings = [];
  try {
    const { data: properties, error } = await supabase
      .from('properties')
      .select('id, title, slug, price_ngn, transaction_type, property_type, size_sqm, bedrooms, status, photo, cover_image_url, district, location_area, location_city, verified, created_at')
      .neq('status', 'pending')
      .order('created_at', { ascending: false });

    if (properties && !error) {
      listings = properties.map((item) => ({
        ...item,
        priceNgn: item.price_ngn || item.priceNgn,
        transactionType: item.transaction_type || item.transactionType || "sale",
        propertyType: item.property_type || item.propertyType || "residential",
        sizeSqm: item.size_sqm || item.sizeSqm,
        photo: item.photo || item.cover_image_url,
      }));
    }
  } catch (err) {
    console.error("Error fetching properties for /abuja:", err);
  }

  let districts = ["All Districts", ...FALLBACK_DISTRICTS];
  try {
    const { data: districtsData } = await supabase
      .from('districts')
      .select('name')
      .order('name', { ascending: true });

    if (districtsData && districtsData.length > 0) {
      districts = ["All Districts", ...districtsData.map((d) => d.name)];
    }
  } catch (err) {
    console.warn("Could not load districts from Supabase, using fallback:", err);
  }

  return (
    <AbujaBrowseClient
      initialListings={listings}
      initialDistricts={districts}
    />
  );
}
