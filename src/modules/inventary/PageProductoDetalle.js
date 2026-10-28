'use client';
import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronRight,
  Pencil,
  PackagePlus,
  ShoppingCart,
  SlidersHorizontal,
  ImageIcon,
  Info,
  ArrowRight,
} from 'lucide-react';
import Switch from '@/modules/inventary/components/Switch';
import Image from 'next/image';
import CardMetricas from '@/shared/components/CardMetricas';

function fmt(n) {
  return typeof n === 'number' ? n.toFixed(2) : '—';
}

function calcMargen(precio, costo) {
  if (!precio || !costo || precio === 0) return null;
  return Math.round(((precio - costo) / precio) * 100);
}

function stockBadgeStyle(estado) {
  if (estado === 'Agotado')
    return { bg: '#FEE2E2', color: '#DC2626' };
  if (estado === 'Stock bajo')
    return { bg: '#FEF3C7', color: '#D97706' };
  return { bg: '#D1FAE5', color: '#059669' };
}

function cellStyle(value, minimo) {
  if (value === 0)
    return { background: '#FEF2F2', color: '#EF4444', fontWeight: 600 };
  if (value <= minimo)
    return { background: '#FFFBEB', color: '#D97706', fontWeight: 500 };
  return { color: '#1F2F57', fontWeight: 500 };
}

function MovimientoIcon({ tipo }) {
  const props = { size: 14, strokeWidth: 2 };
  if (tipo === 'venta') return <ShoppingCart {...props} />;
  if (tipo === 'ingreso') return <PackagePlus {...props} />;
  return <SlidersHorizontal {...props} />;
}

function movimientoIconColor(tipo) {
  if (tipo === 'venta') return '#DC2626';
  if (tipo === 'ingreso') return '#059669';
  return '#6366F1';
}

function CardHeader({ title, action }) {
  return (
    <div
      className="flex items-center justify-between px-5 py-3.5"
      style={{ borderBottom: '0.5px solid rgba(31,47,87,0.07)' }}
    >
      <span className="text-sm font-semibold" style={{ color: '#1F2F57' }}>
        {title}
      </span>
      {action && action}
    </div>
  );
}

function FieldRow({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span
        className="text-[10px] uppercase tracking-wide font-medium"
        style={{ color: 'rgba(31,47,87,0.45)' }}
      >
        {label}
      </span>
      <span className="text-sm" style={{ color: '#1F2F57' }}>
        {value || '—'}
      </span>
    </div>
  );
}

function CardInfoGeneral({ producto }) {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{ border: '0.5px solid rgba(31,47,87,0.08)' }}
    >
      <CardHeader title="Información general" />
      <div className="p-5 flex gap-5">
        <div className="flex flex-col gap-2 shrink-0">
          <div
            className="w-[130px] h-[130px] rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(31,47,87,0.04)', border: '0.5px solid rgba(31,47,87,0.10)' }}
          >
            {producto.imagenUrl ? (
              <Image
                src={producto.imagenUrl}
                alt={producto.nombre}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <ImageIcon size={32} color="rgba(31,47,87,0.2)" strokeWidth={1.5} />
            )}
          </div>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{
                  background: 'rgba(31,47,87,0.03)',
                  border: '0.5px solid rgba(31,47,87,0.09)',
                }}
              >
                <ImageIcon size={12} color="rgba(31,47,87,0.18)" strokeWidth={1.5} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-4 content-start">
          <FieldRow label="Nombre" value={producto.nombre} />
          <FieldRow label="Categoría" value={producto.categoria} />
          <FieldRow label="Marca" value={producto.marca} />
          <FieldRow label="Código de barras" value={producto.codigoBarras} />
          <div className="col-span-2">
            <FieldRow label="Descripción" value={producto.descripcion} />
          </div>
          <FieldRow label="Unidad" value={producto.unidadMedida} />
        </div>
      </div>
    </div>
  );
}

function CardPrecio({ producto }) {
  const ganancia = producto.precioVenta - producto.costoUnitario;
  const margen = calcMargen(producto.precioVenta, producto.costoUnitario);

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{ border: '0.5px solid rgba(31,47,87,0.08)' }}
    >
      <CardHeader title="Precio y ganancia" />
      <div className="p-5 flex flex-col gap-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1">
            <span
              className="text-[10px] uppercase tracking-wide font-medium"
              style={{ color: 'rgba(31,47,87,0.45)' }}
            >
              Precio de venta
            </span>
            <span className="text-xl font-bold" style={{ color: '#1F2F57' }}>
              S/ {fmt(producto.precioVenta)}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span
              className="text-[10px] uppercase tracking-wide font-medium"
              style={{ color: 'rgba(31,47,87,0.45)' }}
            >
              Costo
            </span>
            <span className="text-xl font-bold" style={{ color: '#1F2F57' }}>
              S/ {fmt(producto.costoUnitario)}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span
              className="text-[10px] uppercase tracking-wide font-medium"
              style={{ color: 'rgba(31,47,87,0.45)' }}
            >
              Ganancia por {producto.unidadMedida?.toLowerCase() ?? 'unidad'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold" style={{ color: '#059669' }}>
                S/ {fmt(ganancia)}
              </span>
              {margen !== null && (
                <span
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                  style={{ background: '#D1FAE5', color: '#059669' }}
                >
                  Margen {margen}%
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span
              className="text-[10px] uppercase tracking-wide font-medium"
              style={{ color: 'rgba(31,47,87,0.45)' }}
            >
              IGV
            </span>
            <span className="text-sm font-medium" style={{ color: '#1F2F57' }}>
              {producto.aplicaIgv ? 'Incluido en el precio' : 'No aplica'}
            </span>
            {producto.aplicaIgv && (
              <span
                className="text-[10px]"
                style={{ color: 'rgba(31,47,87,0.5)' }}
              >
                Gravado {producto.impuestoPorcentaje}%
              </span>
            )}
          </div>
        </div>

        {producto.notaPrecioVariante && (
          <div
            className="flex items-start gap-2 px-3 py-2.5 rounded-xl"
            style={{ background: 'rgba(57,96,169,0.06)', border: '0.5px solid rgba(57,96,169,0.15)' }}
          >
            <Info size={13} color="#3960A9" strokeWidth={2} className="mt-0.5 shrink-0" />
            <span className="text-xs" style={{ color: '#3960A9' }}>
              {producto.notaPrecioVariante}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function CardStock({ producto }) {
  const { colores, tallas, stockMatrix, stockMinimoPorTalla, unidadMedida } = producto;

  const totalPorTalla = tallas.reduce((acc, t) => {
    acc[t] = colores.reduce((sum, c) => sum + (stockMatrix[c]?.[t] ?? 0), 0);
    return acc;
  }, {});

  const totalPorColor = colores.reduce((acc, c) => {
    acc[c] = tallas.reduce((sum, t) => sum + (stockMatrix[c]?.[t] ?? 0), 0);
    return acc;
  }, {});

  const totalGeneral = colores.reduce((sum, c) => sum + totalPorColor[c], 0);

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{ border: '0.5px solid rgba(31,47,87,0.08)' }}
    >
      <CardHeader
        title="Stock por talla y color"
        action={
          <button
            className="flex items-center gap-1.5 h-7 px-3 rounded-lg text-[11px] font-medium transition-colors hover:opacity-80"
            style={{
              background: '#1F2F57',
              color: '#fff',
            }}
          >
            Ajustar stock
            <ArrowRight size={11} strokeWidth={2} />
          </button>
        }
      />

      <div className="px-5 py-3 flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs" style={{ color: 'rgba(31,47,87,0.55)' }}>
          Total {totalGeneral} {totalGeneral === 1 ? unidadMedida?.toLowerCase() : `${unidadMedida?.toLowerCase()}s`} en 2 almacenes · mínimo {stockMinimoPorTalla} {unidadMedida?.toLowerCase()}
        </span>
        <button
          className="flex items-center gap-1 h-7 px-2.5 rounded-lg text-[11px] font-medium"
          style={{
            background: 'rgba(31,47,87,0.05)',
            color: 'rgba(31,47,87,0.7)',
            border: '0.5px solid rgba(31,47,87,0.12)',
          }}
        >
          Todos los almacenes
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="px-5 pb-5 overflow-x-auto">
        <table className="w-full text-xs border-separate" style={{ borderSpacing: '2px' }}>
          <thead>
            <tr>
              <th
                className="text-left px-2 py-2 rounded-lg text-[10px] uppercase tracking-wide font-semibold"
                style={{ color: 'rgba(31,47,87,0.45)', minWidth: 64 }}
              >
                Color
              </th>
              {tallas.map((t) => (
                <th
                  key={t}
                  className="text-center px-2 py-2 rounded-lg text-[10px] uppercase tracking-wide font-semibold"
                  style={{ color: 'rgba(31,47,87,0.45)', minWidth: 44 }}
                >
                  {t}
                </th>
              ))}
              <th
                className="text-center px-2 py-2 rounded-lg text-[10px] uppercase tracking-wide font-semibold"
                style={{ color: 'rgba(31,47,87,0.45)', minWidth: 44 }}
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {colores.map((color) => (
              <tr key={color}>
                <td
                  className="px-2 py-2 rounded-lg font-medium"
                  style={{ color: '#1F2F57' }}
                >
                  {color}
                </td>
                {tallas.map((talla) => {
                  const val = stockMatrix[color]?.[talla] ?? 0;
                  const cs = cellStyle(val, stockMinimoPorTalla);
                  return (
                    <td
                      key={talla}
                      className="text-center px-2 py-2 rounded-lg"
                      style={cs}
                    >
                      {val}
                    </td>
                  );
                })}
                <td
                  className="text-center px-2 py-2 rounded-lg font-semibold"
                  style={{ color: '#1F2F57', background: 'rgba(31,47,87,0.04)' }}
                >
                  {totalPorColor[color]}
                </td>
              </tr>
            ))}
            <tr>
              <td
                className="px-2 py-2 rounded-lg text-[10px] uppercase tracking-wide font-semibold"
                style={{ color: 'rgba(31,47,87,0.5)', background: 'rgba(31,47,87,0.04)' }}
              >
                Total
              </td>
              {tallas.map((t) => (
                <td
                  key={t}
                  className="text-center px-2 py-2 rounded-lg font-semibold text-[11px]"
                  style={{ color: '#1F2F57', background: 'rgba(31,47,87,0.04)' }}
                >
                  {totalPorTalla[t]}
                </td>
              ))}
              <td
                className="text-center px-2 py-2 rounded-lg font-bold text-[11px]"
                style={{ color: '#1F2F57', background: 'rgba(31,47,87,0.07)' }}
              >
                {totalGeneral}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: '#EF4444' }} />
            <span className="text-[10px]" style={{ color: 'rgba(31,47,87,0.55)' }}>
              Agotado
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: '#D97706' }} />
            <span className="text-[10px]" style={{ color: 'rgba(31,47,87,0.55)' }}>
              Bajo el mínimo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────
// Sección Derecha — Card: Alertas y venta
// ─────────────────────────────────────────────

function CardAlertas({ alertaMinimo, setAlertaMinimo, visibleEnCaja, setVisibleEnCaja, unidadMedida }) {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{ border: '0.5px solid rgba(31,47,87,0.08)' }}
    >
      <CardHeader title="Alertas y venta" />
      <div className="p-5 flex flex-col gap-4">
        {/* Alerta de mínimo */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs" style={{ color: 'rgba(31,47,87,0.7)' }}>
            Avisarme cuando queden menos de
          </span>
          <input
            type="number"
            min={0}
            value={alertaMinimo}
            onChange={(e) => setAlertaMinimo(Number(e.target.value))}
            className="w-12 h-7 text-center text-sm font-semibold rounded-lg outline-none"
            style={{
              border: '1px solid rgba(31,47,87,0.18)',
              color: '#1F2F57',
              background: 'rgba(31,47,87,0.03)',
            }}
          />
          <span className="text-xs" style={{ color: 'rgba(31,47,87,0.7)' }}>
            {unidadMedida?.toLowerCase() ?? 'unidad'}s por talla
          </span>
        </div>

        {/* Separador */}
        <div style={{ borderTop: '0.5px solid rgba(31,47,87,0.08)' }} />

        {/* Visible en caja */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium" style={{ color: '#1F2F57' }}>
              Visible en caja
            </span>
            <span className="text-[11px]" style={{ color: 'rgba(31,47,87,0.45)' }}>
              {visibleEnCaja ? 'Disponible para ventas' : 'No aparece en el POS'}
            </span>
          </div>
          <Switch on={visibleEnCaja} toggle={() => setVisibleEnCaja((v) => !v)} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Sección Derecha — Card: Movimientos
// ─────────────────────────────────────────────

function CardMovimientos({ movimientos }) {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{ border: '0.5px solid rgba(31,47,87,0.08)' }}
    >
      <CardHeader
        title="Movimientos"
        action={
          <button className="flex items-center gap-0.5 text-xs font-medium" style={{ color: '#3960A9' }}>
            Ver todos
            <ArrowRight size={12} strokeWidth={2} />
          </button>
        }
      />
      <div className="px-5 py-3 flex flex-col divide-y" style={{ '--tw-divide-opacity': 1 }}>
        {movimientos.map((m, idx) => {
          const iconColor = movimientoIconColor(m.tipo);
          const cantidadPositivo = m.cantidad > 0;
          return (
            <div
              key={m.id}
              className="flex items-center gap-3 py-3"
              style={{ borderColor: 'rgba(31,47,87,0.06)' }}
            >
              {/* Ícono tipo */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                style={{ background: `${iconColor}14` }}
              >
                <span style={{ color: iconColor }}>
                  <MovimientoIcon tipo={m.tipo} />
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-[11px] font-medium truncate"
                  style={{ color: '#1F2F57' }}
                >
                  {m.tipo.charAt(0).toUpperCase() + m.tipo.slice(1)} · {m.referencia}
                </p>
                <p
                  className="text-[10px] truncate"
                  style={{ color: 'rgba(31,47,87,0.45)' }}
                >
                  {m.detalle} · {m.tiempo}
                </p>
              </div>

              <span
                className="text-xs font-bold tabular-nums shrink-0"
                style={{ color: cantidadPositivo ? '#059669' : '#DC2626' }}
              >
                {cantidadPositivo ? '+' : ''}{m.cantidad}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function PageProductoDetalle({
  producto,
  loading,
  alertaMinimo,
  setAlertaMinimo,
  visibleEnCaja,
  setVisibleEnCaja,
  handleReponer,
  handleEditar,
}) {
  if (loading) {
    return (
      <div className="p-6 bg-[#E1E7F0] min-h-full flex flex-col gap-4">
        {/* Skeleton header */}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded animate-pulse" style={{ background: 'rgba(31,47,87,0.1)' }} />
          <div className="w-24 h-4 rounded-lg animate-pulse" style={{ background: 'rgba(31,47,87,0.1)' }} />
        </div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="w-64 h-7 rounded-xl animate-pulse" style={{ background: 'rgba(31,47,87,0.1)' }} />
            <div className="w-48 h-3 rounded-lg animate-pulse" style={{ background: 'rgba(31,47,87,0.07)' }} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-40 rounded-2xl animate-pulse ${i <= 2 ? 'col-span-2' : 'col-span-1'}`}
              style={{ background: 'rgba(31,47,87,0.08)' }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!producto) return null;

  const stockBadge = stockBadgeStyle(producto.estadoStock);
  const ganancia = producto.precioVenta - producto.costoUnitario;

  return (
    <div className="p-6 bg-[#E1E7F0] min-h-full flex flex-col gap-5">

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5">
        <Link
          href="/dashboard/inventario/productos"
          className="flex items-center gap-1 text-xs transition-opacity hover:opacity-70"
          style={{ color: 'rgba(31,47,87,0.55)' }}
        >
          <ArrowLeft size={13} strokeWidth={2} />
          Productos
        </Link>
        <ChevronRight size={12} color="rgba(31,47,87,0.3)" />
        <span className="text-xs font-medium" style={{ color: '#1F2F57' }}>
          {producto.nombre}
        </span>
      </div>

      {/* Header de página */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold" style={{ color: '#1F2F57' }}>
              {producto.nombre}
            </h1>
            {/* Badge estado stock */}
            <span
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: stockBadge.bg, color: stockBadge.color }}
            >
              {producto.estadoStock}
            </span>
            {/* Badge activo en venta */}
            {producto.activoEnVenta && (
              <span
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                style={{ background: '#D1FAE5', color: '#059669' }}
              >
                Activo en venta
              </span>
            )}
          </div>
          <p className="text-xs" style={{ color: 'rgba(31,47,87,0.5)' }}>
            {producto.codigo} · {producto.categoria} · actualizado {producto.ultimaEdicion}
          </p>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleReponer}
            className="h-9 px-4 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
            style={{
              background: 'rgba(31,47,87,0.08)',
              color: '#1F2F57',
              border: '0.5px solid rgba(31,47,87,0.15)',
            }}
          >
            Reponer stock
          </button>
          <button
            onClick={handleEditar}
            className="flex items-center gap-1.5 h-9 px-4 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-85"
            style={{ background: '#3960A9' }}
          >
            <Pencil size={13} strokeWidth={2} />
            Editar producto
          </button>
        </div>
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">

        {/* Columna izquierda (col-span-2) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <CardInfoGeneral producto={producto} />
          <CardPrecio producto={producto} />
          <CardStock producto={producto} />
        </div>

        {/* Columna derecha (col-span-1) */}
        <div className="flex flex-col gap-4">
          <CardMetricas producto={producto} />
          <CardAlertas
            alertaMinimo={alertaMinimo}
            setAlertaMinimo={setAlertaMinimo}
            visibleEnCaja={visibleEnCaja}
            setVisibleEnCaja={setVisibleEnCaja}
            unidadMedida={producto.unidadMedida}
          />
          <CardMovimientos movimientos={producto.movimientos} />
        </div>
      </div>
    </div>
  );
}
