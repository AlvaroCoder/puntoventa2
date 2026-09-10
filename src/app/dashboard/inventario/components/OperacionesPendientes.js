'use client'

import React from 'react'
import TarjetaOperacion from './TarjetaOperacion'

function SkeletonOperacion() {
  return (
    <div
      className="animate-pulse rounded-[10px]"
      style={{
        backgroundColor: 'rgba(31,47,87,0.06)',
        height: 96,
      }}
    />
  )
}

export default function OperacionesPendientes({ operaciones, tiendaId, loading }) {
  return (
    <div>
      <p
        className="text-xs uppercase tracking-wide mb-3"
        style={{ color: 'rgba(31,47,87,0.55)' }}
      >
        Operaciones pendientes
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {loading ? (
          <>
            <SkeletonOperacion />
            <SkeletonOperacion />
            <SkeletonOperacion />
            <SkeletonOperacion />
          </>
        ) : (
          operaciones?.map((op, idx) => (
            <TarjetaOperacion
              key={`${op.tipo}-${op.tienda_id}-${idx}`}
              tipo_label={op.tipo_label}
              tienda_nombre={op.tienda_nombre}
              count={op.count}
              tiene_atrasados={op.tiene_atrasados}
              tienda_id={op.tienda_id}
            />
          ))
        )}
      </div>
    </div>
  )
}
