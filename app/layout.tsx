import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Cormorant, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import { getClientConfig } from "@/config/clients";
import { themeToCssProperties } from "@/lib/theme-css";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const cormorant = Cormorant({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-mono",
  display: "swap",
});

const client = getClientConfig();

export const metadata: Metadata = {
  title: `${client.name} — POS & IT Hardware Store Qatar`,
  description: "Shop POS systems, printers, scanners, and atACC ERP solutions from Skynet Solution Qatar. Qatar VAT certified. Free installation.",
  keywords: "POS Qatar, Skynet, atACC ERP, thermal printer, barcode scanner, Doha",
  openGraph: {
    title: `${client.name} — POS & IT Hardware`,
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
    <html
      lang="en"
      className={`h-full ${jakarta.variable} ${cormorant.variable} ${spaceGrotesk.variable} ${plexMono.variable}`}
      data-client={client.id}
      style={themeToCssProperties(client.theme)}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider clientId={client.id}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
