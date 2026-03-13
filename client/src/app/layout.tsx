import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
  title: "WallGo | 4K Nature, Cyberpunk & Abstract Wallpapers",
  description: "Download premium high-resolution 4K wallpapers. Explore trending collections of Nature, Cyberpunk, and Abstract Minimalist backgrounds for desktop and mobile.",
  keywords: ["4K Wallpapers", "Nature Wallpapers 4K", "Cyberpunk Wallpapers", "Neon Aesthetic", "Abstract Minimalist", "Desktop Backgrounds", "Mobile Wallpapers", "Premium Wallpapers"],
  authors: [{ name: "WallGo Team" }],
  openGraph: {
    title: "WallGo | Premium 4K Wallpaper Collections",
    description: "High-quality Nature, Cyberpunk, and Abstract wallpapers for all devices.",
    url: "https://www.wallgo.in",
    siteName: "WallGo",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WallGo | Premium 4K Wallpapers",
    description: "Trending Nature, Cyberpunk & Abstract wallpaper collections.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
