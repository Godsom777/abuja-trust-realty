"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import Header from "@/components/layout/Header/Header";
import BottomNav from "@/components/layout/BottomNav/BottomNav";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  
  // Check if we are inside the administrative panel
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    // Admin routes render fully unconstrained (full screen) without public layout elements
    return (
      <div className="admin-root-container">
        {children}
      </div>
    );
  }

  // Public pages render in the elegant 600px mobile container
  return (
    <main>
      <Header />
      <div style={{ flex: 1, paddingBottom: "90px" }}>
        {children}
      </div>
      <Suspense fallback={null}>
        <BottomNav />
      </Suspense>
    </main>
  );
}
