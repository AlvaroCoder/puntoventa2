import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/Navigation/TopBar";
import Footer from "@/components/Navigation/Footer";
import GoogleProvider from "@/components/Auth/GoogleProvider"
import { AuthProvider } from "@/Context/AuthContext";
import { ToastContainer } from "react-toastify";

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
        <GoogleProvider>
          <AuthProvider>
            <TopBar/>
            {children}
            <ToastContainer/>
            <Footer/>
          </AuthProvider>
        </GoogleProvider>
      </body>
    </html>
  );
}
