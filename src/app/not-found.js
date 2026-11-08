"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  ArrowLeft,
  Search,
  ShoppingCart,
  Package,
  Wallet,
  TrendingUp,
} from "lucide-react";

import TopBarNavigationNotFound from '@/components/Navigation/TopBarNotFound';

function BoxIllustration() {
  return (
    <svg
      width="300"
      height="280"
      viewBox="0 0 300 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="150" cy="268" rx="105" ry="12" fill="rgba(0,0,0,0.12)" />

      {/* Box body */}
      <rect x="45" y="140" width="210" height="118" rx="8" fill="#E8922A" />

      {/* Box sides darker */}
      <rect x="45" y="140" width="210" height="118" rx="8" fill="url(#boxGrad)" />

      {/* 404 label */}
      <rect x="92" y="183" width="116" height="36" rx="7" fill="white" />
      <text
        x="150"
        y="208"
        textAnchor="middle"
        fill="#E8922A"
        fontSize="22"
        fontWeight="800"
        fontFamily="Geist, ui-sans-serif, sans-serif"
      >
        404
      </text>

      {/* Left flap */}
      <path d="M45 140 L150 140 L128 96 L10 96 Z" fill="#CF7A1E" />
      {/* Right flap */}
      <path d="M150 140 L255 140 L278 96 L172 96 Z" fill="#CF7A1E" />

      {/* Inner box top (opening) */}
      <rect x="45" y="136" width="210" height="8" rx="2" fill="rgba(0,0,0,0.08)" />

      {/* Magnifying glass circle */}
      <circle cx="168" cy="82" r="38" fill="white" stroke="#1F2F57" strokeWidth="7" />
      {/* ? text */}
      <text
        x="168"
        y="97"
        textAnchor="middle"
        fill="#1F2F57"
        fontSize="30"
        fontWeight="800"
        fontFamily="Geist, ui-sans-serif, sans-serif"
      >
        ?
      </text>
      {/* Handle */}
      <line
        x1="197"
        y1="111"
        x2="228"
        y2="143"
        stroke="#1F2F57"
        strokeWidth="9"
        strokeLinecap="round"
      />

      <defs>
        <linearGradient id="boxGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(0,0,0,0.08)" />
          <stop offset="10%" stopColor="rgba(0,0,0,0)" />
          <stop offset="90%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const QUICK_LINKS = [
  {
    label: "Vender",
    href: "/dashboard/ventas",
    icon: ShoppingCart,
    bg: "#FDECD6",
    color: "#E8922A",
  },
  {
    label: "Productos",
    href: "/dashboard/inventario",
    icon: Package,
    bg: "#EEF1FA",
    color: "#3960A9",
  },
  {
    label: "Cajas",
    href: "/dashboard/caja",
    icon: Wallet,
    bg: "#E4F5F1",
    color: "#198E7B",
  },
  {
    label: "Reportes",
    href: "/dashboard/reportes",
    icon: TrendingUp,
    bg: "#F0F1F3",
    color: "#6B7A99",
  },
];

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen" style={{ background: "#E8EDF5" }}>
        <TopBarNavigationNotFound/>

      <main className="max-w-5xl mx-auto px-8 flex items-center gap-12 py-20">
        <div className="hidden md:flex flex-shrink-0 items-center justify-center w-80">
          <BoxIllustration />
        </div>

        <div className="flex-1 min-w-0">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: "#1F2F57" }}
          >
            Error 404
          </p>
          <h1
            className="text-4xl font-extrabold mb-4 leading-tight"
            style={{ color: "#1A2845" }}
          >
            Esta página no existe
          </h1>
          <p
            className="text-sm mb-7 leading-relaxed max-w-md"
            style={{ color: "rgba(31,47,87,0.72)" }}
          >
            Puede que el enlace esté mal escrito, que la página se haya movido
            o que ya no la tengas permitida.{" "}
            <strong style={{ color: "#1A2845" }}>Tus datos están a salvo.</strong>
          </p>

          {/* Buttons */}
          <div className="flex gap-3 mb-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "#1A2845" }}
            >
              <Home size={15} /> Ir al inicio
            </Link>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-white transition-colors hover:bg-gray-50"
              style={{
                color: "#1A2845",
                border: "1.5px solid rgba(31,47,87,0.18)",
              }}
            >
              <ArrowLeft size={15} /> Volver atrás
            </button>
          </div>

          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6 bg-white"
            style={{ border: "1.5px solid rgba(31,47,87,0.14)" }}
          >
            <Search size={16} color="rgba(31,47,87,0.38)" />
            <input
              placeholder="¿Qué buscabas? Ej: productos, caja, reportes"
              className="flex-1 outline-none text-sm bg-transparent"
              style={{
                color: "#1A2845",
              }}
            />
          </div>

          <p
            className="text-sm font-semibold mb-3"
            style={{ color: "#1A2845" }}
          >
            O ve directo a:
          </p>
          <div className="flex gap-3 mb-7">
            {QUICK_LINKS.map(({ label, href, icon: Icon, bg, color }) => (
              <Link
                key={label}
                href={href}
                className="flex flex-col items-center gap-2.5 px-4 py-4 rounded-2xl bg-white text-xs font-semibold transition-shadow hover:shadow-md"
                style={{
                  color: "#1A2845",
                  border: "1px solid rgba(31,47,87,0.09)",
                  minWidth: "84px",
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: bg }}
                >
                  <Icon size={20} color={color} />
                </div>
                {label}
              </Link>
            ))}
          </div>

          <p className="text-xs" style={{ color: "rgba(31,47,87,0.5)" }}>
            ¿Llegaste aquí desde un botón del sistema?{" "}
            <a
              href="mailto:soporte@pipoapp.com"
              className="underline font-medium"
              style={{ color: "#3960A9" }}
            >
              Avísanos
            </a>{" "}
            y lo arreglamos.
          </p>
        </div>
      </main>
    </div>
  );
}
