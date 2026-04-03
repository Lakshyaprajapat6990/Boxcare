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
  title: "BoxCraft - Premium Cardboard Box Manufacturing",
  description:
    "Manufacturing excellence since 2010. Custom solutions for every packaging need. Premium quality cardboard boxes in all sizes with bulk discounts and fast delivery.",
  keywords: [
    "BoxCraft",
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
    title: "BoxCraft - Premium Cardboard Box Manufacturing",
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
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
