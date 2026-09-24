import { supabase } from "@/lib/supabase";
import HomeClient from "@/components/home/HomeClient";

export const revalidate = 120; // 2-minute ISR caching to drastically cut Supabase egress

const FALLBACK_DISTRICTS = [
  "Maitama", "Asokoro", "Wuse", "Wuse 2", "Garki", "Garki 2", "Jabi", "Gwarinpa", "Apo", 
  "Life Camp", "Lugbe", "Guzape", "Katampe", "Katampe Extension", "Mabushi", "Utako", 
  "Wuye", "Central Business District", "Lokogoma", "Galadimawa", "Kaura", "Durumi", 
  "Kubwa", "Kuje", "Gwagwalada", "Bwari", "Karsana", "Karmo", "Idu", "Karu", "Nyanya", "Jikwoyi"
].sort();

export default async function HomePage() {
  // 1. Fetch properties from Supabase (lean column selection)
  let listings = [];
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('id, title, slug, price_ngn, transaction_type, property_type, size_sqm, bedrooms, status, cover_image_url, photo, district, location_area, location_city, description, features, created_at')
      .neq('status', 'pending')
      .order('created_at', { ascending: false });
      
    if (data && !error) {
      // Map both case systems to ensure maximum runtime safety
      listings = data.map(item => ({
        ...item,
        price_ngn: item.price_ngn || item.priceNgn || 0,
        transaction_type: item.transaction_type || item.transactionType || 'sale',
        property_type: item.property_type || item.propertyType || 'residential',
        size_sqm: item.size_sqm || item.sizeSqm || 0,
        cover_image_url: item.cover_image_url || item.photo || null,
        location_area: item.district || item.location_area || 'Abuja',
        location_city: item.location_city || 'Abuja'
      }));
    }
  } catch (err) {
    console.error("Error fetching properties from Supabase:", err);
  }

  // 2. Fetch active districts from Supabase
  let districts = [...FALLBACK_DISTRICTS];
  try {
    const { data, error } = await supabase
      .from('districts')
      .select('name')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (data && data.length > 0 && !error) {
      districts = data.map(d => d.name);
    } else {
      // If districts table doesn't have is_active or is empty, try direct select
      const { data: fallbackData } = await supabase
        .from('districts')
        .select('name');
      if (fallbackData && fallbackData.length > 0) {
        districts = fallbackData.map(d => d.name);
      }
    }
  } catch (err) {
    console.warn("Districts query failed. Using hardcoded districts fallback.", err);
  }

  // 3. Render client wrapper
  return (
    <HomeClient
      initialListings={listings}
      initialDistricts={districts}
    />
  );
}
