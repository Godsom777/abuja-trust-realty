import { supabase } from "@/lib/supabase";
import AbujaBrowseClient from "./AbujaBrowseClient";
import { ALL_LOCALITIES, getStateForLocality, getStateShortName } from "@/lib/locations";

export const revalidate = 0; // Disable static caching so it always fetches fresh data from Supabase
export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Search Properties — Verified Listings in Abuja, Lagos, Imo & Enugu | emanon",
  description: "Browse verified residential and commercial properties, land, and off-plan investments across Abuja, Lagos, Imo, and Enugu.",
};

export default async function BrowseListingsPage() {
  let listings = [];
  try {
    const { data: properties, error } = await supabase
      .from('properties')
      .select('*')
      .neq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching properties for /abuja from Supabase:", error);
    } else if (properties) {
      listings = properties.map((item) => {
        const area = item.district || item.location_area || 'Abuja';
        const state = item.state || getStateForLocality(area);
        const city = item.location_city || getStateShortName(state);

        return {
          ...item,
          district: area,
          location_area: area,
          location_state: state,
          location_city: city,
          priceNgn: item.price_ngn || item.priceNgn,
          transactionType: item.transaction_type || item.transactionType || "sale",
          propertyType: item.property_type || item.propertyType || "residential",
          sizeSqm: item.size_sqm || item.sizeSqm,
          photo: item.photo || item.cover_image_url,
        };
      });
    }
  } catch (err) {
    console.error("Error fetching properties for /abuja:", err);
  }

  let districts = ["All Localities", ...ALL_LOCALITIES];
  try {
    const { data: districtsData } = await supabase
      .from('districts')
      .select('name')
      .order('name', { ascending: true });

    if (districtsData && districtsData.length > 0) {
      districts = ["All Localities", ...districtsData.map((d) => d.name)];
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
