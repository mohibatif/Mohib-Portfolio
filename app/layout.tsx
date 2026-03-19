import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mohib Atif",
  description: "Designer & Builder. AI Enthusiast. University of Management & Technology.",
  openGraph: {
    title: "Mohib Atif — Portfolio",
    description: "Chat with my 3D AI clone.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
