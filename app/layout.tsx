import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/context/AppContext";
import { AuthProvider } from "@/lib/context/AuthContext";
import { QuotationProvider } from "@/lib/context/QuotationContext";
import { initializeMockData } from "@/lib/data/mockData";

// Initialize mock data on client side only
if (typeof window !== 'undefined') {
  initializeMockData();
}

const playfair = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Amaré Decor - Gestión de Decoración de Eventos",
  description: "Sistema de gestión integral para Amaré Decor - Organiza cada detalle con amor",
  icons: {
    icon: "/favicon-new.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          <AppProvider>
            <QuotationProvider>{children}</QuotationProvider>
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
