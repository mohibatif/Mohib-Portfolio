import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";
import { LoadingSplash } from "@/components/LoadingSplash";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
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
    <html lang="en" className={spaceMono.variable}>
      <body className="antialiased">
        <LoadingSplash />
        {children}
      </body>
    </html>
  );
}
