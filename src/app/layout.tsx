import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Website News — Independent stories. Clear perspectives.",
    template: "%s | Website News",
  },
  description:
    "Website News is an independent English news portal covering world affairs, politics, business, technology, society, culture, and opinion.",
  keywords: [
    "news",
    "English news",
    "world news",
    "politics",
    "business",
    "technology",
    "independent journalism",
  ],
  openGraph: {
    title: "Website News",
    description: "Independent stories. Clear perspectives.",
    type: "website",
    locale: "en_US",
    siteName: "Website News",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sourceSans.variable} ${playfair.variable} h-full`}>
      <body className="min-h-full flex flex-col overflow-x-hidden bg-white font-sans text-neutral-900 antialiased">
        {children}
      </body>
    </html>
  );
}
