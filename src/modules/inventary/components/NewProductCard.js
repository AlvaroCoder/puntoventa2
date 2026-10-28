import { ArrowRight, ImageIcon, MoreVertical, Star } from "lucide-react";
import React from "react";
import ImageArea from "./ImageArea";
import { useRouter } from "next/navigation";

function stockStatus(stockTotal) {
  if (stockTotal === 0)
    return { label: "Agotado", bg: "#FEE2E2", color: "#DC2626" };
  if (stockTotal <= 5)
    return { label: "Stock bajo", bg: "#FEF3C7", color: "#D97706" };
  return { label: "En stock", bg: "#D1FAE5", color: "#059669" };
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
  const router = useRouter();
  return (
    <div
      className="bg-white rounded-xl overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition-shadow"
      style={{ border: "0.5px solid rgba(31,47,87,0.12)" }}
    >
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

      <div className="px-3 flex flex-col flex-1">
        <ImageArea
          imagenUrl={producto.imagenUrl}
          nombre={producto.nombre}
          status={status}
        />

        {categoriaNombre && (
          <p
            className="text-[10px] uppercase tracking-wide font-medium mb-0.5"
            style={{ color: "rgba(31,47,87,0.4)" }}
          >
            {categoriaNombre}
          </p>
        )}

        <p
          className="text-sm font-semibold leading-tight line-clamp-2 mb-1"
          style={{ color: "#1F2F57" }}
        >
          {producto.nombre}
        </p>

        <p
          className="text-[11px] mb-2"
          style={{ color: "rgba(31,47,87,0.45)" }}
        >
          {producto.codigo} · {variantesText}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold" style={{ color: "#1F2F57" }}>
            S/ {precioStr}
          </span>
          <span className="text-[11px]" style={{ color: "rgba(31,47,87,0.5)" }}>
            {stockLabel}
          </span>
        </div>
      </div>

      <div
        className="flex items-center justify-between px-3 py-2.5"
        style={{ borderTop: "0.5px solid rgba(31,47,87,0.08)" }}
      >
        <button
          className="flex items-center gap-1 text-xs font-medium"
          style={{ color: "#3960A9" }}
          onClick={() => router.push(`/dashboard/inventario/productos/${producto?.id}`)}
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
