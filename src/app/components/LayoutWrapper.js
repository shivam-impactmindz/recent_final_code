"use client"; // Mark this as a client component

import { usePathname } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const hideLayout = pathname === "/login"; // Hide Header/Footer on login page

  return (
    <>
      {!hideLayout && <Header />}
      <main className="main-content">{children}</main>
      {!hideLayout && <Footer />}
    </>
  );
}
