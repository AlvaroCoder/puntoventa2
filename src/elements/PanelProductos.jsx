import React from 'react'
import CardProducto from '../app/dashboard/inventario/productos/crear/components/CardProducto';
import { AlertTriangle, Box } from 'lucide-react';

export default function PanelProductos({ products, onDelete }) {
  const units = products.reduce(
    (a, p) => a + (Number(p.stock_inicial) || 0),
    0,
  );
  const zeros = products.filter((p) => Number(p.stock_inicial) === 0).length;
  return (
    <aside className="sticky top-4 flex max-h-[calc(100vh-32px)] min-h-[620px] flex-col overflow-hidden rounded-xl border border-[#1F2F57]/10 bg-white shadow-[0_3px_12px_rgba(31,47,87,.07)]">
      <div className="border-b border-[#1F2F57]/10 p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold">Productos del lote</h2>
          <span className="rounded-full bg-[#3960A9]/10 px-3 py-1 text-sm font-bold text-[#3960A9]">
            {products.length} productos
          </span>
        </div>
        <p className="mt-1 text-sm text-[#1F2F57]/60">
          {units} unidades en total
        </p>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto bg-[#E1E7F0]/32 p-4">
        {products.length ? (
          products.map((p) => (
            <CardProducto key={p.id} product={p} onDelete={onDelete} />
          ))
        ) : (
          <div className="grid h-full min-h-80 place-items-center text-center">
            <div>
              <Box
                size={58}
                stroke={1.2}
                className="mx-auto text-[#3960A9]/55"
              />
              <h3 className="mt-3 font-extrabold">
                Aún no has agregado productos
              </h3>
              <p className="mx-auto mt-1 max-w-xs text-sm text-[#1F2F57]/55">
                Completa el formulario y haz clic en Agregar al lote.
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="border-t border-[#1F2F57]/10 bg-white p-4">
        <div className="flex items-center justify-between font-bold">
          <span>{products.length} productos</span>
          <span>{units} unidades</span>
        </div>
        {zeros > 0 && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#E8A020]/12 px-3 py-2 text-sm font-bold text-[#E8A020]">
            <AlertTriangle size={18} />
            {zeros} {zeros === 1 ? "producto" : "productos"} sin stock asignado
          </div>
        )}
      </div>
    </aside>
  );
}
