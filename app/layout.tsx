import type { Metadata } from "next";
import { DM_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CEDEAR Real Yield",
  description:
    "Calculá el rendimiento real de tus CEDEARs desglosado en USD, ARS e impacto del tipo de cambio.",
  openGraph: {
    title: "CEDEAR Real Yield",
    description:
      "Calculá el rendimiento real de tus CEDEARs desglosado en USD, ARS e impacto del tipo de cambio.",
    type: "website",
    locale: "es_AR",
  },
  twitter: {
    card: "summary",
    title: "CEDEAR Real Yield",
    description:
      "Calculá el rendimiento real de tus CEDEARs desglosado en USD, ARS e impacto del tipo de cambio.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${dmSans.className} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
