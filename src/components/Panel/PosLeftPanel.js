import { Plus, ShoppingCart, User, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
const NUMPAD_ROWS = [
  ["1", "2", "3", "CANT"],
  ["4", "5", "6", "DESC"],
  ["7", "8", "9", "PRECIO"],
  ["+/-", "0", ".", "⌫"],
];

const fmt = (v) =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(
    v ?? 0,
  );

  const MODO_LABEL = { CANT: "Cant.", DESC: "Desc.", PRECIO: "Precio" };
  const MODOS = ["CANT", "DESC", "PRECIO"];
export default function PosLeftPanel({
  carrito,
  setSelectedIdx,
  setBuffer,
  setModo,
  removeLine,
  cliente,
  modo,
  selectedIdx,
  setCarrito,
  buffer,
  setCliente,
  setShowClienteModal,
  onCobrar,
  ordenes = [],
  ordenActualIdx = 0,
  onSelectOrden,
  crearNuevaOrden,
  eliminarOrden,
}) {
  const [confirmarEliminar, setConfirmarEliminar] = useState(null)
    const subtotal = carrito.reduce(
      (s, l) => s + l.precio * (1 - l.descuento / 100) * l.qty,
      0,
    );
    const totalLineas = carrito.reduce((s, l) => s + l.qty, 0);
const handleNumpad = (key) => {
  if (selectedIdx === null || !carrito[selectedIdx]) return;
  let next = buffer;
  if (key === "⌫") {
    next = buffer.slice(0, -1) || "0";
  } else if (key === ".") {
    if (!buffer.includes(".")) next = buffer + ".";
  } else if (key === "+/-") {
    next = buffer.startsWith("-") ? buffer.slice(1) : "-" + buffer;
  } else {
    next = buffer === "0" || buffer === "" ? key : buffer + key;
  }

  setBuffer(next);
  const val = parseFloat(next) || 0;

  setCarrito((prev) => {
    const updated = [...prev];
    const line = { ...updated[selectedIdx] };
    if (modo === "CANT") line.qty = Math.max(1, Math.floor(Math.abs(val)));
    if (modo === "DESC") line.descuento = Math.min(100, Math.max(0, val));
    if (modo === "PRECIO") line.precio = Math.max(0, val);
    updated[selectedIdx] = line;
    return updated;
  });
};
  return (
    <div
      className="w-[360px] shrink-0 flex flex-col bg-white relative"
      style={{ borderRight: "1px solid rgba(31,47,87,0.1)" }}
    >
      {/* ── Confirmación eliminar orden ── */}
      {confirmarEliminar !== null && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center p-5"
          style={{ background: 'rgba(31,47,87,0.45)', backdropFilter: 'blur(3px)' }}
        >
          <div className="bg-white rounded-2xl p-5 w-full flex flex-col gap-4 shadow-2xl">
            <div>
              <p className="text-sm font-bold" style={{ color: '#1F2F57' }}>
                ¿Eliminar Orden {confirmarEliminar + 1}?
              </p>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'rgba(31,47,87,0.6)' }}>
                Tiene {ordenes[confirmarEliminar]?.items.length ?? 0} producto(s) agregado(s).
                El stock reservado quedará disponible para otras órdenes.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmarEliminar(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
                style={{ border: '1px solid rgba(31,47,87,0.2)', color: '#1F2F57' }}
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  eliminarOrden?.(confirmarEliminar)
                  setConfirmarEliminar(null)
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
                style={{ background: '#EF4444' }}
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ── Orden tabs ── */}
      <div
        className="flex items-center gap-1 px-2 py-2 overflow-x-auto"
        style={{ borderBottom: '0.5px solid rgba(31,47,87,0.1)', scrollbarWidth: 'none' }}
      >
        {ordenes.map((orden, idx) => {
          const isActive = idx === ordenActualIdx
          return (
            <button
              key={orden.id}
              onClick={() => onSelectOrden?.(idx)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all"
              style={
                isActive
                  ? { background: '#1F2F57', color: '#fff' }
                  : { background: 'rgba(31,47,87,0.06)', color: 'rgba(31,47,87,0.5)' }
              }
            >
              Orden {idx + 1}
              {orden.items.length > 0 && (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full leading-none"
                  style={
                    isActive
                      ? { background: 'rgba(255,255,255,0.2)', color: '#fff' }
                      : { background: 'rgba(31,47,87,0.1)', color: 'rgba(31,47,87,0.6)' }
                  }
                >
                  {orden.items.length}
                </span>
              )}
              {ordenes.length > 1 && (
                <span
                  onClick={(e) => {
                    e.stopPropagation()
                    if (orden.items.length > 0) {
                      setConfirmarEliminar(idx)
                    } else {
                      eliminarOrden?.(idx)
                    }
                  }}
                  className="flex items-center justify-center w-3.5 h-3.5 rounded-full transition-all opacity-40 hover:opacity-100"
                  style={
                    isActive
                      ? { background: 'rgba(255,255,255,0.15)' }
                      : { background: 'rgba(31,47,87,0.12)' }
                  }
                >
                  <X size={8} />
                </span>
              )}
            </button>
          )
        })}
        <button
          onClick={crearNuevaOrden}
          title="Nueva orden"
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all hover:opacity-80"
          style={{ background: 'rgba(31,47,87,0.06)', color: 'rgba(31,47,87,0.5)' }}
        >
          <Plus size={13} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {carrito.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <ShoppingCart size={40} style={{ color: "rgba(31,47,87,0.12)" }} />
            <p
              className="text-sm font-medium"
              style={{ color: "rgba(31,47,87,0.3)" }}
            >
              La orden está vacía
            </p>
          </div>
        ) : (
          <div className="p-3 flex flex-col gap-1">
            {carrito.map((line, idx) => {
              const lineTotal =
                line.precio * (1 - line.descuento / 100) * line.qty;
              const isSelected = idx === selectedIdx;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedIdx(idx);
                    setBuffer(String(line.qty));
                    setModo("CANT");
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all"
                  style={{
                    background: isSelected
                      ? "rgba(57,96,169,0.06)"
                      : "transparent",
                    border: `1px solid ${isSelected ? "#3960A9" : "transparent"}`,
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs font-semibold truncate"
                      style={{ color: "#1F2F57" }}
                    >
                      {line.nombre}
                    </p>
                    <p
                      className="text-[10px] mt-0.5"
                      style={{ color: "rgba(31,47,87,0.45)" }}
                    >
                      {line.qty} × {fmt(line.precio)}
                      {line.descuento > 0 && (
                        <span
                          className="ml-1.5 font-semibold"
                          style={{ color: "#FF821E" }}
                        >
                          -{line.descuento}%
                        </span>
                      )}
                    </p>
                  </div>
                  <span
                    className="text-xs font-bold shrink-0"
                    style={{ color: "#1F2F57" }}
                  >
                    {fmt(lineTotal)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeLine(idx);
                    }}
                    className="shrink-0 transition-opacity opacity-25 hover:opacity-60"
                  >
                    <X size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {carrito.length > 0 && (
        <div
          className="px-4 py-3 flex flex-col gap-1"
          style={{ borderTop: "0.5px solid rgba(31,47,87,0.08)" }}
        >
          <div
            className="flex justify-between text-[11px]"
            style={{ color: "rgba(31,47,87,0.45)" }}
          >
            <span>Subtotal ({totalLineas} items)</span>
            <span>{fmt(subtotal / 1.18)}</span>
          </div>
          <div
            className="flex justify-between text-[11px]"
            style={{ color: "rgba(31,47,87,0.45)" }}
          >
            <span>IGV (18%)</span>
            <span>{fmt(subtotal - subtotal / 1.18)}</span>
          </div>
          <div
            className="flex justify-between text-sm font-extrabold mt-1.5"
            style={{ color: "#1F2F57" }}
          >
            <span>Total</span>
            <span>{fmt(subtotal)}</span>
          </div>
        </div>
      )}

      <div
        className="p-3 flex flex-col gap-2"
        style={{ borderTop: "0.5px solid rgba(31,47,87,0.1)" }}
      >
        <button
          onClick={() => setShowClienteModal(true)}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs transition-colors hover:bg-gray-50"
          style={{
            border: "1px solid rgba(31,47,87,0.15)",
            color: cliente ? "#1F2F57" : "rgba(31,47,87,0.4)",
          }}
        >
          <User size={13} />
          {cliente ? cliente.nombre_completo : "Seleccionar cliente"}
          {cliente && (
            <X
              size={12}
              className="ml-auto opacity-40 hover:opacity-70"
              onClick={(e) => {
                e.stopPropagation();
                setCliente(null);
              }}
            />
          )}
        </button>

        <div
          className="grid gap-1.5"
          style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr" }}
        >
          {NUMPAD_ROWS.flat().map((key, i) => {
            const isModo = MODOS.includes(key);
            const isActive = isModo && modo === key;
            return (
              <button
                key={i}
                onClick={() => (isModo ? setModo(key) : handleNumpad(key))}
                className="h-10 rounded-lg text-xs font-bold transition-all active:scale-95"
                style={{
                  background: isActive
                    ? "#198E7B"
                    : isModo
                      ? "rgba(31,47,87,0.06)"
                      : "#F4F6FB",
                  color: isActive ? "#fff" : "#1F2F57",
                  border: isActive ? "none" : "1px solid rgba(31,47,87,0.08)",
                }}
              >
                {isModo ? MODO_LABEL[key] : key}
              </button>
            );
          })}
        </div>

        <button
          disabled={carrito.length === 0}
          onClick={carrito.length > 0 ? onCobrar : undefined}
          className="w-full h-11 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed"
          style={{
            background: carrito.length > 0 ? "#1F2F57" : "rgba(31,47,87,0.2)",
          }}
        >
          {carrito.length > 0 ? `Cobrar ${fmt(subtotal)}` : "Cobrar"}
        </button>
      </div>
    </div>
  );
};