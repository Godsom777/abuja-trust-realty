import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

export const metadata = {
  title: "Abuja Trust Realty — Verified Property Listings in Abuja, Nigeria",
  description:
    "A curated, trust-first property marketplace for verified real estate in Abuja. Browse verified listings from individual owners — trusted by Nigerians in the diaspora.",
  keywords: [
    "Abuja real estate",
    "buy property Abuja",
    "verified property listings Nigeria",
    "Abuja homes for sale",
    "diaspora property investment Nigeria",
    "Maitama houses",
    "Asokoro apartments",
  ],
  openGraph: {
    title: "Abuja Trust Realty — Verified Property Listings",
    description:
      "Browse verified, admin-curated real estate in Abuja. Every owner vetted. Every listing reviewed.",
    locale: "en_NG",
    type: "website",
  },
  manifest: "/manifest.json",
  themeColor: "#1B7A4E",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1B7A4E",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
