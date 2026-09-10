'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

export default function TarjetaOperacion({
  tipo_label,
  tienda_nombre,
  count,
  tiene_atrasados,
  tienda_id,
}) {
  const router = useRouter()

  const handleVerPendientes = () => {
    router.push(
      `/dashboard/inventario/movimientos?estado=borrador&tienda=${tienda_id}`
    )
  }

  return (
    <div
      className="relative flex flex-col"
      style={{
        background: '#FFFFFF',
        border: '0.5px solid rgba(31,47,87,0.12)',
        borderRadius: 10,
        padding: 16,
        minHeight: 96,
      }}
    >
      {/* Badge Atrasado */}
      {tiene_atrasados && (
        <span
          className="absolute top-2 right-2"
          style={{
            fontSize: 11,
            backgroundColor: '#FEF3E2',
            color: '#E8A020',
            padding: '2px 6px',
            borderRadius: 4,
          }}
        >
          Atrasado
        </span>
      )}

      {/* Tipo de operación */}
      <p
        className="text-sm font-medium leading-snug"
        style={{ color: '#1F2F57' }}
      >
        {tipo_label}
      </p>

      {/* Nombre de la tienda */}
      <p
        className="text-xs mt-0.5"
        style={{ color: '#3960A9' }}
      >
        {tienda_nombre}
      </p>

      {/* Acción o estado vacío */}
      {count > 0 ? (
        <button
          onClick={handleVerPendientes}
          className="mt-3 self-start text-xs text-white rounded-md"
          style={{
            backgroundColor: '#1F2F57',
            padding: '8px 14px',
          }}
        >
          {count} por aprobar
        </button>
      ) : (
        <p
          className="text-xs mt-3"
          style={{ color: 'rgba(31,47,87,0.4)' }}
        >
          0 por procesar
        </p>
      )}
    </div>
  )
}
