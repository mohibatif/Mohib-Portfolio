import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { LoadingSplash } from "@/components/LoadingSplash";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

const departureMono = localFont({
  src: "./fonts/departure-mono.woff2",
  variable: "--font-departure",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mohib Atif",
  description: "Designer & Builder. AI Enthusiast. University of Management & Technology.",
  openGraph: {
    title: "Mohib Atif – Portfolio",
    description: "Chat with my 3D AI clone.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceMono.variable} ${departureMono.variable}`}>
      <body>
        <LoadingSplash />
        {children}
      </body>
    </html>
  );
}
