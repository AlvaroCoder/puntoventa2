import { MoreVertical, Star } from 'lucide-react';
import React from 'react'


function stockStatus(p) {
  if (p.stock === 0)
    return {
      dot: "#C0392B",
      label: "Sin stock",
      badge: "rgba(192,57,43,0.08)",
    };
  if (p.stock <= p.stock_minimo)
    return {
      dot: "#E8A020",
      label: "Stock bajo",
      badge: "rgba(232,160,32,0.10)",
    };
  return { dot: "#1EB3B2", label: "En stock", badge: "rgba(30,179,178,0.10)" };
}


function Initials({ nombre }) {
  const letters = nombre
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  const colors = ["#3960A9", "#1EB3B2", "#E8A020", "#1F2F57", "#C0392B"];
  const bg = colors[nombre.charCodeAt(0) % colors.length];
  return (
    <div
      className="w-full h-full flex items-center justify-center text-white font-bold text-base rounded-lg"
      style={{ backgroundColor: bg }}
    >
      {letters}
    </div>
  );
}

export default function NewProductCard({ producto, favorito, onToggleFav }) {
    const st = stockStatus(producto);
  return (
    <div
      className="bg-white rounded-xl overflow-hidden  h-32 flex flex-col cursor-pointer hover:shadow-md transition-shadow"
      style={{ border: "0.5px solid rgba(31,47,87,0.12)" }}
    >
      <div className="flex items-start gap-3 p-3 pb-2">
        <button
          onClick={() => onToggleFav(producto.id)}
          aria-label={favorito ? "Quitar de favoritos" : "Agregar a favoritos"}
          className="mt-0.5 shrink-0"
        >
          <Star
            size={15}
            strokeWidth={1.5}
            fill={favorito ? "#E8A020" : "none"}
            color={favorito ? "#E8A020" : "rgba(31,47,87,0.3)"}
          />
        </button>

        <div
          className="w-[72px] h-[72px] shrink-0 rounded-lg overflow-hidden"
          style={{ border: "0.5px solid rgba(31,47,87,0.08)" }}
        >
          <Initials nombre={producto.nombre} />
        </div>

        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-semibold leading-tight line-clamp-2"
            style={{ color: "#1F2F57" }}
          >
            {producto.nombre}
          </p>
          <p
            className="text-xs mt-0.5"
            style={{ color: "rgba(31,47,87,0.45)" }}
          >
            [{producto.codigo}]
          </p>
          {producto.variantes > 0 && (
            <p className="text-xs mt-0.5" style={{ color: "#3960A9" }}>
              [{producto.variantes} Variantes]
            </p>
          )}
          <p
            className="text-sm font-semibold mt-1"
            style={{ color: "#1F2F57" }}
          >
            S/ {producto.precioVenta.toFixed(2).replace(".", ",")}
          </p>
        </div>

        <button
          aria-label="Más opciones"
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 transition-colors shrink-0"
        >
          <MoreVertical size={14} color="rgba(31,47,87,0.45)" />
        </button>
      </div>

      <div
        className="flex items-center justify-between px-3 py-2 mt-auto"
        style={{
          borderTop: "0.5px solid rgba(31,47,87,0.08)",
          backgroundColor: st.badge,
        }}
      >
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: st.dot }}
          />
          <span className="text-xs font-medium" style={{ color: st.dot }}>
            {st.label}
          </span>
        </div>
        <span className="text-xs" style={{ color: "rgba(31,47,87,0.5)" }}>
          {producto.stock} {producto.unidad}s
        </span>
      </div>
    </div>
  );
};