'use client'

import React from 'react'
import TarjetaMetrica from './TarjetaMetrica'

function SkeletonMetrica() {
  return (
    <div
      className="animate-pulse rounded-[10px]"
      style={{
        backgroundColor: 'rgba(31,47,87,0.06)',
        height: 104,
      }}
    />
  )
}

const METRICAS = (kpis) => [
  {
    label:    'Total productos',
    value:    kpis?.total_productos ?? 0,
    color:    '#1F2F57',
    sublabel: null,
    href:     null,
  },
  {
    label:    'Stock bajo',
    value:    kpis?.stock_bajo ?? 0,
    color:    '#E8A020',
    sublabel: 'revisar',
    href:     '/dashboard/inventario/productos?filtro=stock_bajo',
  },
  {
    label:    'Sin stock',
    value:    kpis?.sin_stock ?? 0,
    color:    '#C0392B',
    sublabel: 'urgente',
    href:     '/dashboard/inventario/productos?filtro=sin_stock',
  },
  {
    label:    'Por vencer',
    value:    kpis?.por_vencer ?? 0,
    color:    '#E8A020',
    sublabel: 'en 7 días',
    href:     '/dashboard/inventario/productos?filtro=por_vencer',
  },
]

export default function ResumenStock({ kpis, loading }) {
  return (
    <div>
      <p
        className="text-xs uppercase tracking-wide mb-3"
        style={{ color: 'rgba(31,47,87,0.55)' }}
      >
        Estado del stock
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {loading ? (
          <>
            <SkeletonMetrica />
            <SkeletonMetrica />
            <SkeletonMetrica />
            <SkeletonMetrica />
          </>
        ) : (
          METRICAS(kpis).map((m) => (
            <TarjetaMetrica
              key={m.label}
              label={m.label}
              value={m.value}
              color={m.color}
              sublabel={m.sublabel}
              href={m.href}
            />
          ))
        )}
      </div>
    </div>
  )
}
