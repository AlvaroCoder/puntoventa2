'use client'

import React from 'react'
import Link from 'next/link'
import { AlertCircle, AlertTriangle } from 'lucide-react'

const CONFIG_ALERTA = {
  sin_stock: {
    bg:      '#FDECEA',
    color:   '#C0392B',
    Icono:   AlertCircle,
    texto:   (n) => `${n} productos sin stock`,
    linkLabel: 'Revisar',
    linkHref: '/dashboard/inventario/productos?filtro=sin_stock',
  },
  stock_bajo: {
    bg:      '#FEF3E2',
    color:   '#E8A020',
    Icono:   AlertTriangle,
    texto:   (n) => `${n} productos están por agotarse`,
    linkLabel: 'Revisar productos',
    linkHref: '/dashboard/inventario/productos?filtro=stock_bajo',
  },
}

function BannerItem({ tipo, count }) {
  const cfg = CONFIG_ALERTA[tipo]
  if (!cfg) return null
  const { bg, color, Icono, texto, linkLabel, linkHref } = cfg

  return (
    <div
      className="flex items-center gap-3"
      style={{
        backgroundColor: bg,
        borderRadius: 8,
        padding: '10px 16px',
      }}
    >
      <Icono size={16} color={color} style={{ flexShrink: 0 }} />
      <span className="text-xs flex-1" style={{ color }}>
        {texto(count)}
        {' — '}
        <Link
          href={linkHref}
          className="underline underline-offset-2 font-medium"
          style={{ color }}
        >
          {linkLabel}
        </Link>
      </span>
    </div>
  )
}

export default function AlertasBanner({ alertas }) {
  if (!alertas || alertas.length === 0) return null

  const visibles   = alertas.slice(0, 2)
  const hayMas     = alertas.length > 2

  return (
    <div className="flex flex-col gap-2">
      {visibles.map((alerta) => (
        <BannerItem key={alerta.tipo} tipo={alerta.tipo} count={alerta.count} />
      ))}
      {hayMas && (
        <a
          href="#"
          className="text-xs underline underline-offset-2"
          style={{ color: 'rgba(31,47,87,0.55)' }}
        >
          Ver todas las alertas
        </a>
      )}
    </div>
  )
}
