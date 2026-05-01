'use client'
import React, { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import Button from "@/elements/Button";
import Link from "next/link";
import { useAuth } from "@/Context/AuthContext";

export default function TopBar() {
  const { user, isAuthenticated } = useAuth();
  console.log('User ', user);
  console.log('Esta autenticado : ', isAuthenticated);
  
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 h-20 flex items-center">
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        <Link href={"/"}>
        <div className="flex items-center gap-2">
           <div className="w-10 h-10 bg-[#FF821E] rounded-xl flex items-center justify-center text-white font-extrabold shadow-lg shadow-orange-500/20">
            360
          </div>
          <span className="text-2xl font-bold text-[#1F4363] tracking-tight">PUNTOVENTA</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-[#333333] font-medium">
          <Link href="/features" className="hover:text-[#FF821E] transition-colors">Soluciones</Link>
          <Link href="/precios" className="hover:text-[#FF821E] transition-colors">Precios</Link>
          <Link href="/demo" className="hover:text-[#FF821E] transition-colors">Demo</Link>
        </div>

        {
          isAuthenticated ? 
            (<div className="hidden md:flex">
              <Link
                href={"/dashboard"}
                className="flex flex-row gap-4 items-center p-3 rounded-xl border-spacing-4 border-[#1F4363] hover:text-[#FF821E] hover:border-[#FF821E] transition-colors border"
              >
                <p>Ir a Dashboard</p> <ArrowRight size={20}/>
              </Link>
            </div>) :
            ( <div className="hidden md:flex items-center gap-4">
                <Link
                  href={"/login"}
                  className="font-bold text-[#1F4363] hover:text-[#FF821E] transition-colors">
                  Iniciar Sesión
                </Link>
                <Link
                  href={"/signup"}
                >
                  <Button variant="primary">Registrate</Button>
                </Link>
              </div>)
        }

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-[#1F4363]">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-20 left-0 w-full bg-white border-b border-gray-100 p-6 md:hidden flex flex-col gap-4 shadow-xl">
          <a href="#features" className="text-[#333333] font-medium py-2">Soluciones</a>
          <a href="#precios" className="text-[#333333] font-medium py-2">Precios</a>
          <Button variant="outline" className="w-full">Iniciar Sesión</Button>
          <Button variant="primary" className="w-full">Prueba Gratis</Button>
        </div>
      )}
    </nav>
  );
}