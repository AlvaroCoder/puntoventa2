import React from 'react'
import { motion } from "framer-motion";
import {
  User,
  Clock,
  TrendingUp,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";


const ESTADO_CONFIG = {
  ABIERTA: {
    label: "Abierta",
    bg: "rgba(25,142,123,0.1)",
    color: "#198E7B",
    border: "#198E7B",
  },
  TRASPASO: {
    label: "Traspaso",
    bg: "rgba(255,130,30,0.12)",
    color: "#FF821E",
    border: "#FF821E",
  },
  CERRADA: {
    label: "Cerrada",
    bg: "rgba(31,47,87,0.07)",
    color: "rgba(31,47,87,0.4)",
    border: "rgba(31,47,87,0.2)",
  },
};
const fmt = (v) =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(
    v ?? 0,
  );

  
function InfoRow({ icon, label, value, valueStyle }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-1.5">
        <span style={{ color: "rgba(31,47,87,0.35)" }}>{icon}</span>
        <span className="text-[11px]" style={{ color: "rgba(31,47,87,0.5)" }}>
          {label}
        </span>
      </div>
      <span
        className="text-xs font-semibold"
        style={valueStyle ?? { color: "#1F2F57" }}
      >
        {value}
      </span>
    </div>
  );
}

export default function CajaCard({ caja }) {
  const cfg = ESTADO_CONFIG[caja.estado] ?? ESTADO_CONFIG.CERRADA;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="bg-white rounded-xl overflow-hidden flex flex-col"
      style={{
        border: "0.5px solid rgba(31,47,87,0.1)",
        borderLeft: `3px solid ${cfg.border}`,
      }}
    >
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3
            className="text-sm font-bold leading-tight"
            style={{ color: "#1F2F57" }}
          >
            {caja.nombre}
          </h3>
          <span
            className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold"
            style={{ background: cfg.bg, color: cfg.color }}
          >
            {cfg.label}
          </span>
        </div>
        <p
          className="text-[11px] mt-0.5 font-mono"
          style={{ color: "rgba(31,47,87,0.35)" }}
        >
          {caja.codigo}
        </p>
      </div>

      <div
        className="mx-4"
        style={{ borderTop: "0.5px solid rgba(31,47,87,0.08)" }}
      />

      <div className="px-4 py-3 flex flex-col gap-2 flex-1">
        {caja.estado === "ABIERTA" && (
          <>
            <InfoRow
              icon={<User size={11} />}
              label="Cajero"
              value={caja.cajero}
            />
            <InfoRow
              icon={<Clock size={11} />}
              label="Desde"
              value={caja.hora_apertura}
            />
            <InfoRow
              icon={<TrendingUp size={11} />}
              label="Ventas hoy"
              value={fmt(caja.ventas_hoy)}
              valueStyle={{ color: "#198E7B", fontWeight: 700 }}
            />
            <p
              className="text-[10px] text-right mt-0.5"
              style={{ color: "rgba(31,47,87,0.35)" }}
            >
              {caja.num_ventas} transacciones
            </p>
          </>
        )}

        {caja.estado === "TRASPASO" && (
          <>
            <InfoRow
              icon={<User size={11} />}
              label="Cajero"
              value={caja.cajero}
            />
            <InfoRow
              icon={<Clock size={11} />}
              label="Desde"
              value={caja.hora_apertura}
            />
            <InfoRow
              icon={<ShoppingBag size={11} />}
              label="Monto traspaso"
              value={fmt(caja.monto_traspaso)}
              valueStyle={{ color: "#FF821E", fontWeight: 700 }}
            />
          </>
        )}

        {caja.estado === "CERRADA" && (
          <>
            <InfoRow
              icon={<Clock size={11} />}
              label="Último cierre"
              value={caja.ultimo_cierre}
            />
            <InfoRow
              icon={<User size={11} />}
              label="Cajero"
              value={caja.ultimo_cajero}
            />
            <div className="mt-2">
              <button
                className="flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-70"
                style={{ color: "#3960A9" }}
              >
                Abrir caja <ArrowRight size={12} />
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}