import { ArrowRight, ImageIcon, MoreVertical, Star } from "lucide-react";
import React from "react";

function stockStatus(stockTotal) {
  if (stockTotal === 0)
    return { label: "Agotado", bg: "#FEE2E2", color: "#DC2626" };
  if (stockTotal <= 5)
    return { label: "Stock bajo", bg: "#FEF3C7", color: "#D97706" };
  return { label: "En stock", bg: "#D1FAE5", color: "#059669" };
}

function ImageArea({ imagenUrl, nombre, status }) {
  return (
    <div className="relative w-full h-28 rounded-xl overflow-hidden mb-2.5"
      style={{ border: "0.5px solid rgba(31,47,87,0.08)" }}>
      {imagenUrl ? (
        <img
          src={imagenUrl}
          alt={nombre}
          className="w-full h-full object-cover"
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(31,47,87,0.05)" }}
        >
          <ImageIcon size={28} color="rgba(31,47,87,0.2)" strokeWidth={1.5} />
        </div>
      )}
      {/* Badge de estado overlay */}
      <span
        className="absolute bottom-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full"
        style={{ backgroundColor: status.bg, color: status.color }}
      >
        {status.label}
      </span>
    </div>
  );
}

export default function NewProductCard({
  producto,
  favorito,
  onToggleFav,
  categoriaNombre,
}) {
  const status = stockStatus(producto.stockTotal ?? 0);
  const variantesText =
    producto.tieneVariantes === true ? "Con variantes" : "Sin variantes";
  const stockNum = producto.stockTotal ?? 0;
  const unidad = producto.unidadMedida ?? "Unidad";
  const stockLabel = `${stockNum} ${stockNum === 1 ? unidad : `${unidad}s`}`;
  const precioStr = typeof producto.precioVenta === "number"
    ? producto.precioVenta.toFixed(2).replace(".", ",")
    : "—";

  const accionColor = stockNum === 0 ? "#DC2626" : "#1F2F57";
  const accionLabel = stockNum === 0 ? "Reponer" : "Vender";

  return (
    <div
      className="bg-white rounded-xl overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition-shadow"
      style={{ border: "0.5px solid rgba(31,47,87,0.12)" }}
    >
      {/* Top bar: star + 3-dot */}
      <div className="flex items-center justify-between px-3 pt-3 pb-1.5">
        <button
          onClick={() => onToggleFav(producto.id)}
          aria-label={favorito ? "Quitar de favoritos" : "Agregar a favoritos"}
          className="shrink-0"
        >
          <Star
            size={15}
            strokeWidth={1.5}
            fill={favorito ? "#E8A020" : "none"}
            color={favorito ? "#E8A020" : "rgba(31,47,87,0.3)"}
          />
        </button>
        <button
          aria-label="Mas opciones"
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
        >
          <MoreVertical size={14} color="rgba(31,47,87,0.45)" />
        </button>
      </div>

      {/* Cuerpo */}
      <div className="px-3 flex flex-col flex-1">
        {/* Imagen con badge de estado */}
        <ImageArea
          imagenUrl={producto.imagenUrl}
          nombre={producto.nombre}
          status={status}
        />

        {/* Categoría */}
        {categoriaNombre && (
          <p
            className="text-[10px] uppercase tracking-wide font-medium mb-0.5"
            style={{ color: "rgba(31,47,87,0.4)" }}
          >
            {categoriaNombre}
          </p>
        )}

        {/* Nombre */}
        <p
          className="text-sm font-semibold leading-tight line-clamp-2 mb-1"
          style={{ color: "#1F2F57" }}
        >
          {producto.nombre}
        </p>

        {/* Código + variantes */}
        <p className="text-[11px] mb-2" style={{ color: "rgba(31,47,87,0.45)" }}>
          {producto.codigo} · {variantesText}
        </p>

        {/* Precio + stock */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold" style={{ color: "#1F2F57" }}>
            S/ {precioStr}
          </span>
          <span className="text-[11px]" style={{ color: "rgba(31,47,87,0.5)" }}>
            {stockLabel}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between px-3 py-2.5"
        style={{ borderTop: "0.5px solid rgba(31,47,87,0.08)" }}
      >
        <button
          className="flex items-center gap-1 text-xs font-medium"
          style={{ color: "#3960A9" }}
        >
          Ver detalle
          <ArrowRight size={12} strokeWidth={2} />
        </button>
        <button
          className="text-[11px] font-semibold text-white px-3 py-1 rounded-lg transition-opacity hover:opacity-80"
          style={{ backgroundColor: accionColor }}
        >
          {accionLabel}
        </button>
      </div>
    </div>
  );
}
