'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Package } from 'lucide-react'

export default function ItemStockBajo({
  id,
  nombre,
  categoria_nombre,
  tienda_nombre,
  stock_disponible,
  stock_minimo,
}) {
  const router = useRouter()

  const colorStock =
    stock_disponible === 0
      ? '#C0392B'
      : stock_disponible <= stock_minimo
      ? '#E8A020'
      : '#1F2F57'

  const handleCrearOC = () => {
    router.push(`/dashboard/logistica/ordenes-compra/crear?producto_id=${id}`)
  }

  return (
    <div
      className="flex items-center gap-3"
      style={{
        background: '#FFFFFF',
        border: '0.5px solid rgba(31,47,87,0.12)',
        borderRadius: 8,
        padding: '12px 16px',
      }}
    >
      {/* Ícono izquierda */}
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          backgroundColor: 'rgba(31,47,87,0.06)',
        }}
      >
        <Package size={16} color="#3960A9" />
      </div>

      {/* Datos centro */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium truncate"
          style={{ color: '#1F2F57' }}
        >
          {nombre}
        </p>
        <p
          className="text-xs truncate"
          style={{ color: 'rgba(31,47,87,0.5)' }}
        >
          {categoria_nombre}
          {tienda_nombre ? ` — ${tienda_nombre}` : ''}
        </p>
      </div>

      {/* Stock y acción derecha */}
      <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
        <p
          className="text-sm font-medium"
          style={{ color: colorStock }}
        >
          {stock_disponible} uds.
        </p>
        <p
          className="text-xs"
          style={{ color: 'rgba(31,47,87,0.4)' }}
        >
          Mínimo: {stock_minimo}
        </p>
        <button
          onClick={handleCrearOC}
          className="text-xs mt-1"
          style={{ color: '#3960A9' }}
        >
          Crear OC
        </button>
      </div>
    </div>
  )
}
