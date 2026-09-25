'use client'
import React from "react";
import {
  ShoppingCart,
  Package,
  BarChart3,
  Users,
  CheckCircle2,
  ArrowRight,
  Play,
  FileText,
  Truck,
  ChevronRight,
} from "lucide-react";
import Button from "@/elements/Button";
import { useRouter } from "next/navigation";

const MODULES = [
  {
    icon: <ShoppingCart className="w-6 h-6" />,
    title: "Módulo de Ventas",
    desc: "Registra ventas, emite boletas y facturas electrónicas en segundos. Compatible con POS físico y online.",
    color: "#FF821E",
    bg: "rgba(255,130,30,0.10)",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Módulo de Clientes",
    desc: "Gestiona tu cartera de clientes, historial de compras, créditos y fidelización desde un solo lugar.",
    color: "#198E7B",
    bg: "rgba(25,142,123,0.10)",
  },
  {
    icon: <Package className="w-6 h-6" />,
    title: "Módulo de Inventario",
    desc: "Control total de stock en tiempo real. Alertas de bajo stock, lotes, variantes y múltiples almacenes.",
    color: "#3960A9",
    bg: "rgba(57,96,169,0.10)",
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Módulo de SUNAT",
    desc: "Emisión de comprobantes electrónicos, validación de RUC/DNI y declaraciones integradas con SUNAT.",
    color: "#D90429",
    bg: "rgba(217,4,41,0.10)",
  },
  {
    icon: <Truck className="w-6 h-6" />,
    title: "Módulo de Logística",
    desc: "Gestiona pedidos, despachos, guías de remisión y seguimiento de entregas desde un solo panel.",
    color: "#7C3AED",
    bg: "rgba(124,58,237,0.10)",
  },
];

const QUICK_FEATURES = [
  {
    icon: <ShoppingCart className="w-5 h-5" />,
    title: "Ventas más rápidas",
    desc: "Emite boletas y facturas en segundos.",
  },
  {
    icon: <Package className="w-5 h-5" />,
    title: "Control de inventario",
    desc: "Conoce el stock en tiempo real en todas tus tiendas.",
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: "Reportes claros",
    desc: "Toma mejores decisiones con información en tiempo real.",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Hecho para tu negocio",
    desc: "Ideal para zapaterías, bodegas, bazares y más.",
  },
];

const STATS = [
  { label: "Ventas hoy",       value: "S/ 1,250", delta: "+12%", color: "#3960A9" },
  { label: "Prod. vendidos",   value: "24",        delta: "+8%",  color: "#198E7B" },
  { label: "Clientes",         value: "18",        delta: "+20%", color: "#FF821E" },
];

const BAR_HEIGHTS = [40, 62, 35, 78, 55, 92, 68];
const BAR_DAYS = ["L", "M", "M", "J", "V", "S", "D"];

export default function LandingPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen font-sans" style={{ background: "#EEF2F7" }}>

      <section className="relative overflow-hidden pt-16 pb-0 px-6 md:px-16">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-12 min-h-[88vh]">

            <div className="flex-1 space-y-6 text-center lg:text-left pt-6 z-10">

              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                style={{ background: "rgba(25,142,123,0.12)", color: "#198E7B" }}
              >
                <span className="w-2 h-2 rounded-full bg-[#198E7B] animate-pulse" />
                Más de 5,000 negocios ya confían en nosotros
              </div>

              <h1
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight"
                style={{ color: "#1F2F57" }}
              >
                Tu negocio,{" "}
                <span className="relative inline-block" style={{ color: "#1F4363" }}>
                  bajo control.
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 300 10"
                    preserveAspectRatio="none"
                    height="8"
                  >
                    <path
                      d="M0 6 Q 150 10 300 6"
                      stroke="#FF821E"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              <p className="text-xl font-bold" style={{ color: "#3960A9" }}>
                Todo tu negocio en un solo lugar.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
                <Button variant="secondary" onClick={() => router.push('/signup')} icon={ArrowRight} className="text-base px-8 py-3.5 rounded-xl">
                  Probar por 30 días
                </Button>
                <Button variant="outline" icon={Play} className="text-base px-8 py-3.5 rounded-xl">
                  Ver Demo
                </Button>
              </div>

              <div
                className="flex flex-wrap items-center justify-center lg:justify-start gap-5 pt-1 text-sm font-medium"
                style={{ color: "#8D99AE" }}
              >
                {[ "30 días de prueba", "Soporte en español"].map(
                  (t) => (
                    <div key={t} className="flex items-center gap-1.5">
                      <CheckCircle2 size={15} style={{ color: "#198E7B" }} />
                      {t}
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="flex-1 relative w-full max-w-xl lg:max-w-none pb-12">

              <div
                className="absolute top-4 right-0 w-80 h-80 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(25,142,123,0.25) 0%, transparent 70%)",
                }}
              />

              <div
                className="relative rounded-2xl overflow-hidden shadow-2xl ml-4"
                style={{ background: "#1A3A5C" }}
              >
                <div
                  className="flex items-center gap-2 px-4 py-3"
                  style={{ background: "#142E48" }}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-[#EF233C] opacity-80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] opacity-80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E] opacity-80" />
                  <span className="ml-2 text-xs font-semibold text-white/40">
                    PuntoVenta360
                  </span>
                </div>

                <div className="flex">
                  <div
                    className="w-28 px-2 py-4 flex flex-col gap-0.5 shrink-0"
                    style={{ background: "#172F4A" }}
                  >
                    {["Inicio", "Ventas", "Productos", "Inventario", "Clientes", "Reportes"].map(
                      (item, i) => (
                        <div
                          key={item}
                          className="px-3 py-1.5 rounded-lg text-[11px] font-medium"
                          style={{
                            background: i === 0 ? "#3960A9" : "transparent",
                            color: i === 0 ? "#fff" : "rgba(255,255,255,0.45)",
                          }}
                        >
                          {item}
                        </div>
                      )
                    )}
                  </div>

                  <div className="flex-1 p-4" style={{ background: "#EEF2F7" }}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold" style={{ color: "#1F2F57" }}>
                        Resumen de hoy
                      </span>
                      <span className="text-[10px]" style={{ color: "#8D99AE" }}>
                        24 set. 2026
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {STATS.map((s) => (
                        <div key={s.label} className="bg-white rounded-xl p-2.5 shadow-sm">
                          <div
                            className="text-[9px] font-medium mb-1"
                            style={{ color: "#8D99AE" }}
                          >
                            {s.label}
                          </div>
                          <div
                            className="text-xs font-extrabold"
                            style={{ color: s.color }}
                          >
                            {s.value}
                          </div>
                          <div
                            className="text-[9px] font-bold mt-0.5"
                            style={{ color: "#198E7B" }}
                          >
                            ↑ {s.delta}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-white rounded-xl p-3 shadow-sm">
                      <div
                        className="text-[9px] font-bold mb-2"
                        style={{ color: "#1F2F57" }}
                      >
                        Ventas últimos 7 días
                      </div>
                      <div className="flex items-end gap-1.5 h-12">
                        {BAR_HEIGHTS.map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-t-sm transition-all"
                            style={{
                              height: `${h}%`,
                              background: i === 5 ? "#3960A9" : "rgba(57,96,169,0.25)",
                            }}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between mt-1.5">
                        {BAR_DAYS.map((d, i) => (
                          <span
                            key={i}
                            className="flex-1 text-center text-[8px] font-medium"
                            style={{ color: "#8D99AE" }}
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="absolute -bottom-2 left-2 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-3 border border-gray-100"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(57,96,169,0.10)" }}
                >
                  <ShoppingCart size={18} style={{ color: "#3960A9" }} />
                </div>
                <div>
                  <div className="text-[11px] font-semibold" style={{ color: "#8D99AE" }}>
                    Venta registrada
                  </div>
                  <div className="text-sm font-extrabold" style={{ color: "#1F4363" }}>
                    S/ 120.00
                  </div>
                </div>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center ml-1 shrink-0"
                  style={{ background: "#198E7B" }}
                >
                  <CheckCircle2 size={14} color="white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 px-6 md:px-16 mt-16 border-y border-gray-100">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {QUICK_FEATURES.map((f, i) => (
              <div key={i} className="flex items-start gap-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(31,67,99,0.08)", color: "#1F4363" }}
                >
                  {f.icon}
                </div>
                <div>
                  <h3
                    className="text-sm font-bold mb-1"
                    style={{ color: "#1F2F57" }}
                  >
                    {f.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: "#8D99AE" }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 md:px-16" style={{ background: "#EEF2F7" }}>
        <div className="container mx-auto max-w-7xl">

          <div className="text-center mb-14">
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "#FF821E" }}
            >
              Módulos de la plataforma
            </span>
            <h2
              className="text-3xl md:text-4xl font-extrabold mt-2"
              style={{ color: "#1F2F57" }}
            >
              Todo lo que tu negocio necesita
            </h2>
            <p
              className="text-base mt-3 max-w-xl mx-auto leading-relaxed"
              style={{ color: "#8D99AE" }}
            >
              Cada módulo está diseñado para simplificar una parte clave de tu
              operación.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MODULES.map((m, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-7 border border-transparent hover:border-gray-200 hover:shadow-lg transition-all duration-300 group cursor-pointer"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: m.bg, color: m.color }}
                >
                  {m.icon}
                </div>
                <h3
                  className="text-base font-bold mb-2"
                  style={{ color: "#1F2F57" }}
                >
                  {m.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#8D99AE" }}
                >
                  {m.desc}
                </p>
                <div
                  className="flex items-center gap-1 mt-5 text-xs font-bold transition-all group-hover:gap-2"
                  style={{ color: m.color }}
                >
                  Conocer más <ChevronRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6" style={{ background: "#1F4363" }}>
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            ¿Listo para tomar el control?
          </h2>
          <p className="text-base mb-10" style={{ color: "rgba(255,255,255,0.60)" }}>
            Únete a más de 5,000 negocios que ya gestionan sus ventas con
            PuntoVenta360.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="primary" icon={ArrowRight} className="text-base px-10 py-3.5 rounded-xl">
              Crear cuenta gratis
            </Button>
            <Button variant="ghost" icon={Play} className="text-base px-10 py-3.5 rounded-xl border border-white/20">
              Ver Demo
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}