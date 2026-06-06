import { Suspense } from "react";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

export const metadata = {
  title: "Abuja Realty. | Vetted Properties Direct from Owners",
  description: "A premium, direct property showcase for buyers everywhere. Fully verified property listings in Maitama, Asokoro, Wuse, and across Abuja directly from vetted owners.",
  keywords: [
    "Abuja real estate",
    "buy property Abuja",
    "vetted property listings Abuja",
    "global property investment Nigeria",
    "direct owner properties Abuja"
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
