import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sharma Pharmacy — Retail Pharmacy & Doctor Consultation | Howrah, Kolkata",
  description:
    "Sharma Pharmacy offers quality medicines, in-house doctor consultations, prescription services, and home delivery. Located at 88, Mirpara Rd, Bhatta Nagar, Liluah, Howrah, West Bengal 711203. Call +91 8336027489.",
  keywords: "pharmacy, medicines, doctor consultation, Howrah, Kolkata, Sharma Pharmacy, medicine delivery",
  openGraph: {
    title: "Sharma Pharmacy — Retail Pharmacy & Doctor Consultation",
    description:
      "Quality medicines, in-house doctor consultations, prescription upload, and home delivery at Sharma Pharmacy, Howrah.",
    type: "website",
    locale: "en_IN",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Pharmacy",
  name: "Sharma Pharmacy",
  description: "Retail Pharmacy with In-House Doctor Consultation",
  url: "https://sharmapharmacy.in",
  telephone: "+91 8336027489",
  email: "somnathsharma2012@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "88, Mirpara Rd, Bhatta Nagar, Liluah",
    addressLocality: "Howrah",
    addressRegion: "West Bengal",
    postalCode: "711203",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 22.6200282,
    longitude: 88.3271886,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-white text-slate-800 antialiased">{children}</body>
    </html>
  );
}
