import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Service On Call - Servis Elektronik Profesional",
  description: "Layanan servis AC, pompa air, mesin cuci, kulkas, dan elektronik lainnya dengan teknisi profesional. Cepat, terpercaya, dan bergaransi.",
  keywords: ["servis elektronik", "servis AC", "pompa air", "mesin cuci", "kulkas", "teknisi profesional", "service on call"],
  authors: [{ name: "Service On Call Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Service On Call - Servis Elektronik Profesional",
    description: "Layanan servis elektronik terpercaya dengan teknisi profesional",
    siteName: "Service On Call",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Service On Call - Servis Elektronik Profesional",
    description: "Layanan servis elektronik terpercaya dengan teknisi profesional",
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
        <Toaster />
      </body>
    </html>
  );
}
