"use client";
import { Package, Trash2 } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

const COLOR_HEX = {
  Negro: '#1F2F57', Blanco: '#E5E7EB', Marrón: '#92400E',
  Azul: '#2563EB', Rojo: '#DC2626', Gris: '#6B7280',
  Verde: '#059669', Amarillo: '#F59E0B',
};

export default function CardProducto({ product, onDelete }) {
  const [confirm, setConfirm] = useState(false);
  const [leaving, setLeaving]   = useState(false);

  function remove() {
    setLeaving(true);
    setTimeout(() => onDelete(product.id), 150);
  }

  const initials = (product.nombre ?? '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <article
      className={`animate-slide-in rounded-lg bg-white p-2 transition-all hover:shadow-sm ${leaving ? 'animate-fade-out' : ''}`}
      style={{ border: '0.5px solid rgba(31,47,87,0.12)' }}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div
          className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg"
          style={{ background: '#3960A9' }}
        >
          {product.imagen_preview ? (
            <Image
              src={product.imagen_preview}
              alt={product.nombre}
              fill
              sizes="40px"
              className="object-cover"
            />
          ) : (
            <span className="grid h-full w-full place-items-center text-sm font-extrabold text-white">
              {initials || <Package size={16} />}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1 ">
          {/* Name + price row */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3
                className="truncate text-sm font-extrabold"
                style={{ color: '#1F2F57' }}
              >
                {product.nombre}
              </h3>
              <p
                className="text-[11px] font-mono"
                style={{ color: 'rgba(31,47,87,0.45)' }}
              >
                {product.codigo}
              </p>
            </div>
            <div
              className="shrink-0 text-sm font-extrabold"
              style={{ color: '#3960A9' }}
            >
              S/ {Number(product.precio_venta || 0).toFixed(2)}
            </div>
          </div>

          {/* Stock badge + delete */}
          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-bold"
              style={{
                background: product.stock_inicial > 0
                  ? 'rgba(25,142,123,0.12)'
                  : 'rgba(232,160,32,0.15)',
                color: product.stock_inicial > 0 ? '#198E7B' : '#E8A020',
              }}
            >
              {product.stock_inicial} {product.unidad || 'und'}
            </span>

            {confirm ? (
              <div className="flex items-center gap-1.5 text-xs">
                <span style={{ color: 'rgba(31,47,87,0.55)', fontWeight: 600 }}>
                  ¿Eliminar?
                </span>
                <button
                  onClick={remove}
                  className="rounded-md px-2 py-0.5 text-xs font-bold text-white"
                  style={{ background: '#C0392B' }}
                >
                  Sí
                </button>
                <button
                  onClick={() => setConfirm(false)}
                  className="rounded-md border px-2 py-0.5 text-xs font-bold"
                  style={{ borderColor: 'rgba(31,47,87,0.2)', color: '#1F2F57' }}
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirm(true)}
                className="rounded-md p-1 transition-colors hover:bg-red-50"
                style={{ color: 'rgba(31,47,87,0.3)' }}
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>

          {/* Variant chips */}
          {product.tiene_variantes && product.variantes?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {product.variantes.slice(0, 5).map((v, i) => {
                const hex = COLOR_HEX[v.color];
                const label = [v.color, v.talla].filter(Boolean).join(' / ');
                return (
                  <span
                    key={i}
                    className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                    style={{ background: 'rgba(57,96,169,0.08)', color: '#1F2F57' }}
                  >
                    {hex && (
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{
                          background: hex,
                          border: '0.5px solid rgba(31,47,87,0.15)',
                        }}
                      />
                    )}
                    {label} · {v.stock_inicial ?? 0}
                  </span>
                );
              })}
              {product.variantes.length > 5 && (
                <span
                  className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                  style={{
                    background: 'rgba(31,47,87,0.06)',
                    color: 'rgba(31,47,87,0.5)',
                  }}
                >
                  +{product.variantes.length - 5}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
