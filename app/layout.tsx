import type { Metadata } from "next";
import { Inter, Cormorant } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Skynet Solution — POS & IT Hardware Store Qatar",
  description: "Shop POS systems, printers, scanners, and atACC ERP solutions from Skynet Solution Qatar. Qatar VAT certified. Free installation.",
  keywords: "POS Qatar, Skynet, atACC ERP, thermal printer, barcode scanner, Doha",
  openGraph: {
    title: "Skynet Solution — POS & IT Hardware",
    description: "Qatar's trusted POS and ERP partner since 2012.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full ${inter.variable} ${cormorant.variable}`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
