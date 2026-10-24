'use client';
import { ArrowLeft, Banknote, CreditCard, Smartphone, Building2, Check, Receipt, FileText } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { createVenta } from '@/Connections/ventas';
import { createMovimiento } from "@/Connections/caja";

const fmt = (v) =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(v ?? 0);

const COMPROBANTES = [
  { id: 'BOLETA',  label: 'Boleta',  icon: Receipt   },
  { id: 'FACTURA', label: 'Factura', icon: FileText   },
];

const METODOS = [
  { id: 'EFECTIVO',     label: 'Efectivo',     icon: Banknote,     color: '#198E7B' },
  { id: 'TARJETA',      label: 'Tarjeta',       icon: CreditCard,   color: '#3960A9' },
  { id: 'YAPE',         label: 'Yape',          icon: Smartphone,   color: '#6B21A8' },
  { id: 'PLIN',         label: 'Plin',          icon: Smartphone,   color: '#0EA5E9' },
  { id: 'TRANSFERENCIA',label: 'Transferencia', icon: Building2,    color: '#FF821E' },
];

export default function PosPaymentPanel({
  carrito,
  onVolver,
  cajaId,
  cajaSesionId,
  trabajadorId,
  empresaId,
  tiendaId,
  cliente,
}) {
  const [metodo, setMetodo]               = useState(null);
  const [tipoComprobante, setTipoComprobante] = useState('BOLETA');
  const [descuento, setDescuento]         = useState('');
  const [efectivo, setEfectivo]           = useState('');
  const [loading, setLoading]             = useState(false);

  const subtotal = carrito.reduce(
    (s, l) => s + l.precio * (1 - l.descuento / 100) * l.qty,
    0,
  );
  const descuentoAmt = Math.min(subtotal, Math.max(0, parseFloat(descuento) || 0));
  const total        = subtotal - descuentoAmt;
  const cambio       = metodo === 'EFECTIVO'
    ? Math.max(0, (parseFloat(efectivo) || 0) - total)
    : 0;

  const handleSubmit = async () => {
    if (!metodo || loading) return;
    setLoading(true);
    try {
      const detalles = carrito.map(line => ({
        productoId:     line.id,
        cantidad:       line.qty,
        precioUnitario: line.precio,
        descuento:      line.descuento,
      }));
      const dataVenta = {
        empresaId,
        tiendaId,
        cajaSesionId,
        trabajadorId,
        clienteId:       cliente?.id ?? null,
        tipoPago:        metodo,
        tipoComprobante,
        descuento:       descuentoAmt,
        montoRecibido:   metodo === 'EFECTIVO' ? (parseFloat(efectivo) || total) : total,
        detalles,
      };
      console.log('dataVenta', dataVenta);
      const ventaRes = await createVenta(dataVenta);
      console.log('ventaRes', ventaRes.message);
      if (ventaRes.error) {
        toast.error(ventaRes.message || 'Error al registrar la venta');
        return;
      }
      console.log("Venta registrada:", ventaRes.data);
      const ventaId = ventaRes?.data?.id ?? ventaRes?.data?.data?.id;
      await createMovimiento(cajaId, {
        cajaSesionId,
        trabajadorId,
        tipoMovimiento: 'INGRESO',
        monto:          total,
        concepto:       `Venta - ${tipoComprobante}`,
        referenciaId:   ventaId,
        referenciaTipo: 'VENTA',
      });
      toast.success('Venta registrada correctamente');
      onVolver();
    } catch {
      toast.error('Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">

      <div
        className="flex items-center gap-3 px-5 py-3.5 shrink-0"
        style={{ borderBottom: '0.5px solid rgba(31,47,87,0.1)' }}
      >
        <button
          onClick={onVolver}
          className="flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-60"
          style={{ color: 'rgba(31,47,87,0.5)' }}
        >
          <ArrowLeft size={14} />
          Volver
        </button>
        <span className="text-sm font-bold" style={{ color: '#1F2F57' }}>
          Cobro
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-5 flex flex-col gap-6">

          <section className="flex flex-col gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'rgba(31,47,87,0.45)' }}>
              Tipo de comprobante
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {COMPROBANTES.map(({ id, label, icon: Icon }) => {
                const isActive = tipoComprobante === id;
                return (
                  <button
                    key={id}
                    onClick={() => setTipoComprobante(id)}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-xl transition-all active:scale-95"
                    style={{
                      background: isActive ? 'rgba(31,47,87,0.07)' : 'rgba(31,47,87,0.03)',
                      border:     `1.5px solid ${isActive ? '#1F2F57' : 'rgba(31,47,87,0.1)'}`,
                    }}
                  >
                    <Icon size={15} style={{ color: isActive ? '#1F2F57' : 'rgba(31,47,87,0.35)', flexShrink: 0 }} />
                    <span
                      className="text-[12px] font-semibold"
                      style={{ color: isActive ? '#1F2F57' : 'rgba(31,47,87,0.5)' }}
                    >
                      {label}
                    </span>
                    {isActive && (
                      <Check size={12} style={{ color: '#1F2F57', marginLeft: 'auto', flexShrink: 0 }} strokeWidth={3} />
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'rgba(31,47,87,0.45)' }}>
              Método de pago
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              {METODOS.map(({ id, label, icon: Icon, color }) => {
                const isActive = metodo === id;
                return (
                  <button
                    key={id}
                    onClick={() => setMetodo(id)}
                    className="flex flex-col items-center gap-2 py-4 rounded-xl transition-all active:scale-95"
                    style={{
                      background: isActive ? `${color}14` : 'rgba(31,47,87,0.03)',
                      border:     `1.5px solid ${isActive ? color : 'rgba(31,47,87,0.1)'}`,
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ background: isActive ? `${color}20` : 'rgba(31,47,87,0.06)' }}
                    >
                      <Icon size={17} style={{ color: isActive ? color : 'rgba(31,47,87,0.35)' }} />
                    </div>
                    <span
                      className="text-[11px] font-semibold leading-none"
                      style={{ color: isActive ? color : 'rgba(31,47,87,0.5)' }}
                    >
                      {label}
                    </span>
                    {isActive && (
                      <div
                        className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ background: color }}
                      >
                        <Check size={9} color="#fff" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {metodo === 'EFECTIVO' && (
            <section className="flex flex-col gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'rgba(31,47,87,0.45)' }}>
                Monto recibido
              </p>
              <div className="relative">
                <span
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold"
                  style={{ color: 'rgba(31,47,87,0.4)' }}
                >
                  S/
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.10"
                  value={efectivo}
                  onChange={e => setEfectivo(e.target.value)}
                  placeholder={fmt(total).replace('S/\xa0', '')}
                  className="w-full h-11 pl-9 pr-4 rounded-xl text-sm outline-none transition-all"
                  style={{ border: '1px solid rgba(31,47,87,0.18)', color: '#1F2F57', background: '#fff' }}
                  onFocus={e => { e.target.style.borderColor = '#198E7B'; e.target.style.boxShadow = '0 0 0 3px rgba(25,142,123,0.1)'; }}
                  onBlur={e  => { e.target.style.borderColor = 'rgba(31,47,87,0.18)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </section>
          )}

          <section className="flex flex-col gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'rgba(31,47,87,0.45)' }}>
              Descuento adicional (S/)
            </p>
            <div className="relative">
              <span
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold"
                style={{ color: 'rgba(31,47,87,0.4)' }}
              >
                S/
              </span>
              <input
                type="number"
                min="0"
                step="0.10"
                value={descuento}
                onChange={e => setDescuento(e.target.value)}
                placeholder="0.00"
                className="w-full h-11 pl-9 pr-4 rounded-xl text-sm outline-none transition-all"
                style={{ border: '1px solid rgba(31,47,87,0.18)', color: '#1F2F57', background: '#fff' }}
                onFocus={e => { e.target.style.borderColor = '#FF821E'; e.target.style.boxShadow = '0 0 0 3px rgba(255,130,30,0.1)'; }}
                onBlur={e  => { e.target.style.borderColor = 'rgba(31,47,87,0.18)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
          </section>

          {/* Resumen de la orden */}
          <section className="flex flex-col gap-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'rgba(31,47,87,0.45)' }}>
              Resumen
            </p>
            <div
              className="rounded-xl p-4 flex flex-col gap-2"
              style={{ background: 'rgba(31,47,87,0.03)', border: '0.5px solid rgba(31,47,87,0.08)' }}
            >
              {carrito.map((line, i) => (
                <div key={i} className="flex justify-between items-center gap-2">
                  <span className="text-xs truncate" style={{ color: 'rgba(31,47,87,0.6)' }}>
                    {line.qty}× {line.nombre}
                  </span>
                  <span className="text-xs font-semibold shrink-0" style={{ color: '#1F2F57' }}>
                    {fmt(line.precio * (1 - line.descuento / 100) * line.qty)}
                  </span>
                </div>
              ))}

              <div style={{ borderTop: '0.5px solid rgba(31,47,87,0.1)', marginTop: 4, paddingTop: 8 }}>
                <div className="flex justify-between text-[11px]" style={{ color: 'rgba(31,47,87,0.5)' }}>
                  <span>Subtotal</span>
                  <span>{fmt(subtotal)}</span>
                </div>
                {descuentoAmt > 0 && (
                  <div className="flex justify-between text-[11px]" style={{ color: '#FF821E' }}>
                    <span>Descuento</span>
                    <span>-{fmt(descuentoAmt)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold mt-1.5" style={{ color: '#1F2F57' }}>
                  <span>Total</span>
                  <span>{fmt(total)}</span>
                </div>
                {metodo === 'EFECTIVO' && (parseFloat(efectivo) || 0) > 0 && (
                  <div
                    className="flex justify-between text-xs font-bold mt-1.5 pt-1.5"
                    style={{ borderTop: '0.5px solid rgba(31,47,87,0.1)', color: '#198E7B' }}
                  >
                    <span>Cambio</span>
                    <span>{fmt(cambio)}</span>
                  </div>
                )}
              </div>
            </div>
          </section>

        </div>
      </div>

      <div
        className="p-4 shrink-0"
        style={{ borderTop: '0.5px solid rgba(31,47,87,0.1)' }}
      >
        <button
          disabled={!metodo || loading}
          onClick={handleSubmit}
          className="w-full h-12 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed"
          style={{ background: metodo ? '#198E7B' : 'rgba(31,47,87,0.15)' }}
        >
          {loading ? 'Procesando...' : metodo ? `Procesar ${fmt(total)}` : 'Selecciona un método de pago'}
        </button>
      </div>
    </div>
  );
}