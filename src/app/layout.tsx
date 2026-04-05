import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SHREE SHIDDI VINAYAK - Premium Cardboard Box Manufacturing",
  description:
    "Manufacturing excellence since 2010. Custom solutions for every packaging need. Premium quality cardboard boxes in all sizes with bulk discounts and fast delivery.",
  keywords: [
    "SHREE SHIDDI VINAYAK",
    "cardboard boxes",
    "packaging",
    "shipping boxes",
    "custom boxes",
    "bulk packaging",
    "corrugated boxes",
  ],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "SHREE SHIDDI VINAYAK - Premium Cardboard Box Manufacturing",
    description:
      "Manufacturing excellence since 2010. Custom solutions for every packaging need.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }
  return (
    <html lang="en" suppressHydrationWarning>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="BoxCare" />
        <link rel="apple-touch-icon" href="/logo.svg" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
