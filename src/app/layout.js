import { Suspense } from "react";
import "./globals.css";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

export const metadata = {
  title: "emanon. | Vetted Properties Direct from Owners",
  description: "A premium, direct property showcase for buyers everywhere. Fully verified property listings in Abuja, Lagos, Imo, and Enugu directly from vetted owners.",
  keywords: [
    "Nigeria real estate",
    "Abuja real estate",
    "Lagos properties",
    "Imo real estate",
    "Enugu properties",
    "buy property Abuja",
    "buy property Lagos",
    "vetted property listings Nigeria",
    "global property investment Nigeria",
    "direct owner properties Nigeria"
  ],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "emanon — Verified Real Estate in Abuja, Lagos, Imo & Enugu",
    description: "Discover curated real estate in Abuja, Lagos, Imo, and Enugu directly from vetted individual owners. Vetted by our team, trusted by Nigerians abroad.",
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
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
