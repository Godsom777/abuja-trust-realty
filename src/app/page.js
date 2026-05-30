import { supabase } from "@/lib/supabase";
import HomeClient from "@/components/home/HomeClient";

export const revalidate = 0; // Disable static caching so it always fetches fresh data from Supabase

const FALLBACK_DISTRICTS = [
  "Maitama",
  "Asokoro",
  "Wuse",
  "Wuse 2",
  "Garki",
  "Jabi",
  "Gwarinpa",
  "Apo",
  "Life Camp",
  "Lugbe",
  "Katampe"
];

export default async function HomePage() {
  // 1. Fetch properties from Supabase
  let listings = [];
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (data && !error) {
      // Map both case systems to ensure maximum runtime safety
      listings = data.map(item => ({
        ...item,
        price_ngn: item.price_ngn || item.priceNgn || 0,
        transaction_type: item.transaction_type || item.transactionType || 'sale',
        property_type: item.property_type || item.propertyType || 'residential',
        size_sqm: item.size_sqm || item.sizeSqm || 0,
        cover_image_url: item.cover_image_url || item.photo || null
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
