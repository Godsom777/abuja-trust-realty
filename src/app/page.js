import { Suspense } from "react";
import { supabase } from "@/lib/supabase";
import HomeClient from "@/components/home/HomeClient";
import { ALL_LOCALITIES, getStateForLocality, getStateShortName } from "@/lib/locations";

export const revalidate = 0; // Disable static caching so it always fetches fresh data from Supabase
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // 1. Fetch properties from Supabase
  let listings = [];
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .neq('status', 'pending')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Supabase properties query error:", error);
    } else if (data) {
      // Map both case systems to ensure maximum runtime safety
      listings = data.map(item => {
        const area = item.district || item.location_area || 'Abuja';
        const state = item.state || getStateForLocality(area);
        const city = item.location_city || getStateShortName(state);

        return {
          ...item,
          price_ngn: item.price_ngn || item.priceNgn || 0,
          transaction_type: item.transaction_type || item.transactionType || 'sale',
          property_type: item.property_type || item.propertyType || 'residential',
          size_sqm: item.size_sqm || item.sizeSqm || 0,
          cover_image_url: item.photo || item.cover_image_url || null,
          location_area: area,
          location_city: city,
          location_state: state,
        };
      });
    }
  } catch (err) {
    console.error("Error fetching properties from Supabase:", err);
  }

  // 2. Fetch active districts from Supabase or fallback to all localities
  let districts = [...ALL_LOCALITIES];
  try {
    const { data, error } = await supabase
      .from('districts')
      .select('name')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (data && data.length > 0 && !error) {
      districts = data.map(d => d.name);
    }
  } catch (err) {
    console.warn("Districts query failed. Using all localities fallback.", err);
  }

  // 3. Render client wrapper
  return (
    <Suspense fallback={null}>
      <HomeClient
        initialListings={listings}
        initialDistricts={districts}
      />
    </Suspense>
  );
}
