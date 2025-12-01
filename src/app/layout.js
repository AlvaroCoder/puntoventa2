import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import TopBar from "@/components/Navigation/TopBar";
import Footer from "@/components/Navigation/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Punto de Venta 360",
  description: "Página de gestión interna para PIPO S.A.C",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TopBar/>
        {children}
        <Toaster />
        <Footer/>
      </body>
    </html>
  );
}
