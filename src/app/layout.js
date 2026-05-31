import { Suspense } from "react";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

export const metadata = {
  title: "Abuja Trust Realty — Verified Property Discoveries in Abuja",
  description: "A premium, direct property showcase targeting diaspora buyers. Fully verified property listings in Maitama, Asokoro, Wuse, and across Abuja directly from vetted owners.",
  keywords: [
    "Abuja real estate",
    "diaspora property investment Nigeria",
    "verified listings Abuja",
    "Abuja Trust Realty",
    "Maitama houses for sale",
    "luxury apartment Abuja"
  ],
  manifest: "/manifest.json",
  openGraph: {
    title: "Abuja Trust Realty — Verified Abuja Real Estate",
    description: "Discover curated real estate in Abuja, directly from vetted individual owners. Vetted by our team, trusted by Nigerians abroad.",
    type: "website",
    locale: "en_NG",
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F5F0E8",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to Google Fonts for premium page load optimization */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
