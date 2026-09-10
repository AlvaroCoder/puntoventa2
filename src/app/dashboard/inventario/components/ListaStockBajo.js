'use client'

import React from 'react'
import Link from 'next/link'
import ItemStockBajo from './ItemStockBajo'

const MAX_VISIBLES = 5

export default function ListaStockBajo({ productos }) {
  if (!productos || productos.length === 0) return null

  const visibles  = productos.slice(0, MAX_VISIBLES)
  const totalResto = productos.length > MAX_VISIBLES ? productos.length : 0

  return (
    <div>
      <p
        className="text-xs uppercase tracking-wide mb-3"
        style={{ color: 'rgba(31,47,87,0.55)' }}
      >
        Productos que necesitan reposición
      </p>

      <div className="flex flex-col gap-2">
        {visibles.map((producto) => (
          <ItemStockBajo
            key={producto.id}
            id={producto.id}
            nombre={producto.nombre}
            categoria_nombre={producto.categoria_nombre}
            tienda_nombre={producto.tienda_nombre}
            stock_disponible={producto.stock_disponible}
            stock_minimo={producto.stock_minimo}
          />
        ))}
      </div>

      {totalResto > 0 && (
        <div className="mt-3">
          <Link
            href="/dashboard/inventario/productos?filtro=stock_bajo"
            className="text-xs underline underline-offset-2"
            style={{ color: '#3960A9' }}
          >
            Ver todos los {productos.length} productos
          </Link>
        </div>
      )}
    </div>
  )
}
