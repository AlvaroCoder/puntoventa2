"use client";
import { ShowerSharp } from "@mui/icons-material";
import { Sheet, Trash } from "lucide-react";
import { useState } from "react";
export default function CardProducto({ product, onDelete }) {
  const [confirm, setConfirm] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const shoe = product.categoria?.startsWith("Calzado");
  function remove() {
    setLeaving(true);
    setTimeout(() => onDelete(product.id), 150);
  }
  return (
    <article
      className={`animate-slide-in rounded-lg border border-[#1F2F57]/15 bg-white p-3.5 transition hover:border-[#3960A9] ${leaving ? "animate-fade-out" : ""}`}
    >
      <div className="flex gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#3960A9]/10 text-[#3960A9]">
          {shoe ? <ShowerSharp size={22} /> : <Sheet size={22} />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="truncate text-[15px] font-extrabold">
                {product.nombre}
              </h3>
              <p className="text-xs text-[#1F2F57]/50">{product.codigo}</p>
            </div>
            <div className="whitespace-nowrap font-extrabold text-[#3960A9]">
              S/ {Number(product.precio_venta || 0).toFixed(2)}
            </div>
          </div>
          <div className="mt-2 truncate text-sm text-[#1F2F57]/58">
            {product.categoria || "Sin categoría"}
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-bold ${product.stock_inicial > 0 ? "bg-[#1EB3B2]/15 text-[#1F2F57]" : "bg-[#E8A020]/15 text-[#E8A020]"}`}
            >
              Stock: {product.stock_inicial} {product.unidad || "unidades"}
            </span>
            {confirm ? (
              <div className="flex items-center gap-2 text-sm">
                <b>¿Eliminar?</b>
                <button
                  onClick={remove}
                  className="rounded bg-[#C0392B] px-2 py-1 font-bold text-white"
                >
                  Sí
                </button>
                <button
                  onClick={() => setConfirm(false)}
                  className="rounded border border-[#1F2F57]/20 px-2 py-1 font-bold"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirm(true)}
                className="flex items-center gap-1 text-sm font-bold text-[#C0392B] hover:underline"
              >
                <Trash size={16} />
                Eliminar
              </button>
            )}
          </div>
          {product.tiene_variantes && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {product.variantes.map((v, i) => (
                <span
                  key={i}
                  className="rounded-full bg-[#E1E7F0] px-2 py-1 text-xs font-semibold"
                >
                  {v.talla || "—"} ({v.stock})
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
