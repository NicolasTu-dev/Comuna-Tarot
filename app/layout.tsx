import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { PageTransition } from "@/components/page-transition";
import { StarField } from "@/components/landing/star-field";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Comuna Tarot",
  description: "Lecturas de tarot online con Sofía",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${cormorant.variable} ${manrope.variable}`}>
      <body>
        <StarField />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
