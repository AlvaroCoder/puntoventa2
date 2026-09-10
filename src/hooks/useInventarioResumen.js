'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import fetchWithAuth from '@/lib/fetchwithAuth'

const MOCK_RESUMEN = {
  kpis: {
    total_productos: 248,
    stock_bajo: 12,
    sin_stock: 4,
    por_vencer: 3,
  },
  operaciones_pendientes: [
    {
      tipo: 'entrada',
      tipo_label: 'Entradas pendientes',
      tienda_id: 1,
      tienda_nombre: 'Local 1 — Centro',
      count: 3,
      tiene_atrasados: true,
    },
    {
      tipo: 'salida',
      tipo_label: 'Salidas pendientes',
      tienda_id: 1,
      tienda_nombre: 'Local 1 — Centro',
      count: 0,
      tiene_atrasados: false,
    },
    {
      tipo: 'transferencia',
      tipo_label: 'Transferencias',
      tienda_id: 1,
      tienda_nombre: 'Local 1 — Centro',
      count: 1,
      tiene_atrasados: false,
    },
    {
      tipo: 'entrada',
      tipo_label: 'Entradas pendientes',
      tienda_id: 2,
      tienda_nombre: 'Local 2 — Mercado',
      count: 0,
      tiene_atrasados: false,
    },
    {
      tipo: 'salida',
      tipo_label: 'Salidas pendientes',
      tienda_id: 2,
      tienda_nombre: 'Local 2 — Mercado',
      count: 0,
      tiene_atrasados: false,
    },
    {
      tipo: 'transferencia',
      tipo_label: 'Transferencias',
      tienda_id: 2,
      tienda_nombre: 'Local 2 — Mercado',
      count: 0,
      tiene_atrasados: false,
    },
  ],
  alertas: [
    { tipo: 'sin_stock',  count: 4  },
    { tipo: 'stock_bajo', count: 12 },
  ],
  productos_stock_bajo: [
    {
      id: 23,
      nombre: 'Zapatilla Nike Running T.38',
      categoria_nombre: 'Zapatillas Deportivas',
      tienda_nombre: 'Local 1',
      stock_disponible: 2,
      stock_minimo: 5,
    },
    {
      id: 41,
      nombre: 'Polo Algodón Blanco M',
      categoria_nombre: 'Polos y Camisetas',
      tienda_nombre: 'Local 1',
      stock_disponible: 0,
      stock_minimo: 3,
    },
    {
      id: 55,
      nombre: 'Jean Skinny Negro T.28',
      categoria_nombre: 'Pantalones y Jeans',
      tienda_nombre: 'Local 2',
      stock_disponible: 1,
      stock_minimo: 4,
    },
  ],
}

const CINCO_MINUTOS = 5 * 60 * 1000

export function useInventarioResumen(tiendaId) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const intervalRef           = useRef(null)

  const fetchResumen = useCallback(async () => {
    if (!tiendaId) return

    setLoading(true)
    setError(null)

    try {
      const url = `http://localhost:8085/api/inventario/resumen?tienda_id=${tiendaId}`
      const res = await fetchWithAuth(url)

      const payload = res?.data?.content ?? res?.data?.data ?? res?.data ?? null

      if (!res || res.error || !payload) {
        throw new Error('Respuesta inválida del servidor')
      }

      setData(payload)
    } catch (err) {
      console.error('[useInventarioResumen] Usando datos mock. Error:', err?.message ?? err)
      setData(MOCK_RESUMEN)
      setError(err?.message ?? 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [tiendaId])

  useEffect(() => {
    fetchResumen()

    intervalRef.current = setInterval(fetchResumen, CINCO_MINUTOS)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [fetchResumen])

  return { data, loading, error, refetch: fetchResumen }
}