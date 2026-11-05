import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tarot aquí",
  description: "Lecturas de tarot online con Sofía",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
