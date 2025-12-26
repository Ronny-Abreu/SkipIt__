import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

const supremeExtrabold = localFont({
  src: "../public/fonts/Supreme_Complete/Fonts/OTF/Supreme-Extrabold.otf",
  variable: "--font-supreme",
  weight: "800",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SkipIt - Sistema de Gestión de Citas",
  description: "Plataforma web para gestión de citas para negocios de servicios personales",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} ${supremeExtrabold.variable}`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

