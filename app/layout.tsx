import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Bebas_Neue } from "next/font/google";
import "./globals.css";
import LenisProvider from "../components/LenisProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Randeniya Lake Resort | Luxury Eco-Luxe Sanctuary in Sri Lanka",
  description: "Discover Randeniya Lake Resort, a premium sustainable boutique lodge on the edge of Randeniya Wewa, Sri Lanka. Experience luxury eco-villas, open-air Ayurveda wellness, and bespoke lakeside dining.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${bebas.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900 font-sans">
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
