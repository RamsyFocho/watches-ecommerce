import type { Metadata } from "next";
import { AppProvider } from "@/context/AppContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeProvider";

const defaultOgImageUrl = "https://tse4.mm.bing.net/th/id/OIP.QELyA_ITTrFaVpJ4buYPfgHaEK?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3";

export const metadata: Metadata = {
  title: {
    default: "CelestialGems | Premium & Luxury Watches",
    template: "%s | CelestialGems",
  },
  description: "Discover timeless elegance with CelestialGems. Explore our curated collection of luxury Swiss, Japanese, and designer watches. Find your perfect timepiece today.",
  keywords: ["luxury watches", "designer watches", "Swiss watches", "Japanese watches", "Rolex", "Omega", "Patek Philippe", "buy watches online"],
  openGraph: {
    title: {
      default: "CelestialGems | Premium & Luxury Watches",
      template: "%s | CelestialGems",
    },
    description: "Discover timeless elegance with CelestialGems. Explore our curated collection of luxury watches.",
    images: [
      {
        url: defaultOgImageUrl,
        width: 1200,
        height: 630,
        alt: "CelestialGems - Premium & Luxury Watches",
      },
    ],
    siteName: 'CelestialGems',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: {
      default: "CelestialGems | Premium & Luxury Watches",
      template: "%s | CelestialGems",
    },
    description: "Discover timeless elegance with CelestialGems. Explore our curated collection of luxury watches.",
    images: [defaultOgImageUrl],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
