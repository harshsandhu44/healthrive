import type { Metadata, Viewport } from "next";

import { RootProvider } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://vylune.com"),
  title: "Vylune",
  description:
    "Vylune is a healthcare platform that provides a comprehensive solution for healthcare providers and patients.",
  keywords: "healthcare, medical, platform, appointments, patients, providers",
  authors: [{ name: "Vylune Team" }],
  creator: "Vylune",
  publisher: "Vylune",
  
  // Favicon and icons
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/images/logo-primary.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  
  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vylune.com",
    siteName: "Vylune",
    title: "Vylune - Healthcare Platform",
    description: "Vylune is a healthcare platform that provides a comprehensive solution for healthcare providers and patients.",
    images: [
      {
        url: "/images/logo-primary.png",
        width: 1200,
        height: 630,
        alt: "Vylune - Healthcare Platform",
      },
    ],
  },
  
  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "Vylune - Healthcare Platform",
    description: "Vylune is a healthcare platform that provides a comprehensive solution for healthcare providers and patients.",
    images: ["/images/logo-primary.png"],
    creator: "@vylune",
  },
  
  // Manifest
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#4F46E5" },
    { media: "(prefers-color-scheme: dark)", color: "#4F46E5" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
