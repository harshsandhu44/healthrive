import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vylune",
  description:
    "Vylune is a healthcare platform that provides a comprehensive solution for healthcare providers and patients.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
