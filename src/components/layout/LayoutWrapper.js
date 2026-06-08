"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import Header from "@/components/layout/Header/Header";
import BottomNav from "@/components/layout/BottomNav/BottomNav";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  
  // Check if we are inside the administrative panel or menu
  const isAdmin = pathname?.startsWith("/admin");
  const isMenu = pathname?.startsWith("/trapHouseMenu");

  if (isAdmin || isMenu) {
    // Admin and isolated routes render fully unconstrained without public layout elements
    return (
      <div className={isAdmin ? "admin-root-container" : ""}>
        {children}
      </div>
    );
  }

  // Public pages render in the elegant 600px mobile container
  return (
    <main>
      <Suspense fallback={<div style={{ height: '60px' }} />}>
        <Header />
      </Suspense>
      <div className="main-content-area">
        {children}
      </div>
      <Suspense fallback={null}>
        <BottomNav />
      </Suspense>
    </main>
  );
}
