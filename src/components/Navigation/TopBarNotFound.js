import { ArrowRight, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useAuth } from "@/Context/AuthContext";

const URL_LOGO =
  "https://res.cloudinary.com/dabyqnijl/image/upload/v1788581897/01_bl0vpw.png";

export default function TopBarNotFound() {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className=" w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 h-20 flex items-center">
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        <Link href={"/"}>
          <div className="flex items-center gap-2">
            <Image
              src={URL_LOGO}
              alt="Logo de Punto de venta"
              width={200}
              height={50}
            />
          </div>
        </Link>

 

        {isAuthenticated ? (
          <div className="hidden md:flex">
            <Link
              href={"/dashboard"}
              className="flex flex-row gap-4 items-center p-3 rounded-xl border-spacing-4 border-[#1F4363] hover:text-[#FF821E] hover:border-[#FF821E] transition-colors border"
            >
              <p>Ir a Dashboard</p> <ArrowRight size={20} />
            </Link>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-4">
            <Link href={"/signup"}>
              <Button variant="primary">Probar 30 días</Button>
            </Link>
          </div>
        )}

      </div>

    </nav>
  );
}