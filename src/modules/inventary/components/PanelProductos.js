import React from 'react'
import { AlertTriangle, Box, CheckCircle2 } from 'lucide-react';
import CardProducto from './CardProducto';

const fmt = (v) =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(v ?? 0);

export default function PanelProductos({ products, onDelete, onConfirmar }) {
  const units = products.reduce((a, p) => a + (Number(p.stock_inicial) || 0), 0);
  const zeros = products.filter((p) => Number(p.stock_inicial) === 0).length;
  const costoTotal = products.reduce(
    (a, p) => a + (Number(p.precio_compra) || 0) * (Number(p.stock_inicial) || 0),
    0,
  );

  return (
    <aside className="sticky top-4 flex max-h-[calc(100vh-32px)] min-h-[620px] flex-col overflow-hidden rounded-xl border border-[#1F2F57]/10 bg-white shadow-[0_3px_12px_rgba(31,47,87,.07)]">

      {/* Header */}
      <div className="border-b border-[#1F2F57]/10 p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-extrabold" style={{ color: '#1F2F57' }}>
            En este lote
          </h2>
          <span
            className="rounded-full px-3 py-0.5 text-xs font-bold"
            style={{ background: 'rgba(57,96,169,0.1)', color: '#3960A9' }}
          >
            {products.length} {products.length === 1 ? 'producto' : 'productos'}
          </span>
        </div>
      </div>

      {/* Product list */}
      <div className="flex-1 space-y-2.5 overflow-y-auto p-4" style={{ background: 'rgba(225,231,240,0.3)' }}>
        {products.length ? (
          products.map((p) => (
            <CardProducto key={p.id} product={p} onDelete={onDelete} />
          ))
        ) : (
          <div className="grid h-full min-h-80 place-items-center text-center">
            <div>
              <Box size={52} strokeWidth={1.2} className="mx-auto" style={{ color: 'rgba(57,96,169,0.35)' }} />
              <h3 className="mt-3 text-sm font-extrabold" style={{ color: '#1F2F57' }}>
                Aún no hay productos
              </h3>
              <p className="mx-auto mt-1 max-w-[200px] text-xs" style={{ color: 'rgba(31,47,87,0.5)' }}>
                Completa el formulario y haz clic en Agregar al lote y seguir.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer: resumen + CTA */}
      <div className="border-t border-[#1F2F57]/10 bg-white p-4">
        {products.length > 0 && (
          <div className="mb-3 space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: 'rgba(31,47,87,0.5)' }}>Productos</span>
              <span className="font-semibold" style={{ color: '#1F2F57' }}>{products.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: 'rgba(31,47,87,0.5)' }}>Total unidades</span>
              <span className="font-semibold" style={{ color: '#1F2F57' }}>{units}</span>
            </div>
            {costoTotal > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: 'rgba(31,47,87,0.5)' }}>Costo total</span>
                <span className="font-bold" style={{ color: '#1F2F57' }}>{fmt(costoTotal)}</span>
              </div>
            )}
          </div>
        )}

        {zeros > 0 && (
          <div
            className="mb-3 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold"
            style={{ background: 'rgba(232,160,32,0.12)', color: '#E8A020' }}
          >
            <AlertTriangle size={14} />
            {zeros} {zeros === 1 ? 'producto' : 'productos'} sin stock asignado
          </div>
        )}

        {products.length > 0 && onConfirmar && (
          <button
            onClick={onConfirmar}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl font-bold text-white transition hover:opacity-90"
            style={{ background: '#198E7B' }}
          >
            <CheckCircle2 size={17} />
            Confirmar lote · {products.length} {products.length === 1 ? 'producto' : 'productos'}
          </button>
        )}

        {products.length === 0 && (
          <div
            className="rounded-lg px-3 py-2 text-center text-xs"
            style={{ background: 'rgba(31,47,87,0.04)', color: 'rgba(31,47,87,0.4)' }}
          >
            Agrega al menos un producto para confirmar
          </div>
        )}
      </div>
    </aside>
  );
}
