import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import EmergencyBanner from "./EmergencyBanner";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <EmergencyBanner />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
