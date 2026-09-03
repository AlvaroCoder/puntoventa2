import { Check, Shield, Star, TrendingUp, Users, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link';
import React from 'react'

const STATS = [
  { Icon: Users,       value: "+1,000",  label: "negocios registrados"    },
  { Icon: TrendingUp,  value: "100+",  label: "usuarios activos"    },
  { Icon: Star,        value: "4.9/5",   label: "satisfacción de usuarios" },
  { Icon: Zap,         value: "< 5 min", label: "para empezar a vender"   },
];

const FEATURES = [
  "Gestiona tus ventas, inventario y clientes desde un solo lugar",
  "Conecta tu app a la SUNAT y emite comprobantes electrónicos automáticamente",
  "Reportes en tiempo real para tomar decisiones",
  "Soporte en español incluido sin costo adicional",
];
export default function MarketingPanel() {
    const URL_LOGO   = "https://res.cloudinary.com/dabyqnijl/image/upload/v1787111787/puntoVenta360/Logo_Punto_Venta_wrgis4.png"
    const URL_BG = "https://res.cloudinary.com/dzfrrapfk/image/upload/v1787546104/Screenshot_2026-08-18_at_23.31.08_oahtir.png"

  return (
    <div className="relative hidden md:flex md:w-[42%] flex-col overflow-hidden">
      <div
        className="absolute inset-0 scale-105 blur-[3px]"
        style={{ backgroundImage: `url(${URL_BG})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="absolute inset-0 bg-[#1F4363]/90" />
      <div className="absolute -bottom-24 -right-16 w-72 h-72 bg-[#FE811F]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full p-8">
      <Link href={"/"}>
        <div className="flex items-center gap-2.5 mb-8">
          
          <Image src={URL_LOGO} alt="PuntoVenta360" width={72} height={28} />
          <span className="text-white font-bold text-sm">
            Punto de Venta <span className="text-[#FE811F]">360</span>
            </span>
          
        </div>
        </Link>
        <div className="flex-1 flex flex-col justify-center gap-7">
          <div>

            <h2 className="text-white text-[22px] font-bold leading-snug mb-2">
              Gestiona tu negocio de forma sencilla con Punto de Venta 360
            </h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Todo lo que necesita tu negocio en un solo lugar
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {STATS.map(({ Icon, value, label }) => (
              <div key={label} className="bg-white/8 rounded-2xl p-4 border border-white/10 flex flex-col gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FE811F]/20 flex items-center justify-center">
                  <Icon size={16} className="text-[#FE811F]" />
                </div>
                <p className="text-white font-bold text-xl leading-none">{value}</p>
                <p className="text-white/45 text-xs leading-tight">{label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {FEATURES.map(f => (
              <div key={f} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#1B8D7C]/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={11} className="text-[#1B8D7C]" />
                </div>
                <p className="text-white/65 text-sm leading-snug">{f}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-6">
          <Shield size={13} className="text-white/30" />
          <p className="text-white/25 text-xs">Datos protegidos · © 2026 PuntoVenta360</p>
        </div>

      </div>
    </div>
  )
};