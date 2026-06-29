import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_ICON_PATH, SITE_NAME, SITE_TAGLINE } from "@/lib/site";
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
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
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
    title: SITE_NAME,
    description: SITE_TAGLINE,
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
  },
  icons: {
    icon: SITE_ICON_PATH,
    apple: SITE_ICON_PATH,
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
