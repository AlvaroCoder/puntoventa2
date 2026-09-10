'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Package } from 'lucide-react'
import { useAuth } from '@/Context/AuthContext'
import { getTiendasByEmpresa } from '@/Connections/tiendas'

export const InventarioContext = createContext({ tiendaId: null })

const NAV_LINKS = [
  { label: 'Resumen',      href: '/dashboard/inventario' },
  { label: 'Productos', href: '/dashboard/inventario/productos' },
  { label : 'Almacenes', href: '/dashboard/inventario/almacenes' },
  { label: 'Movimientos', href: '/dashboard/inventario/movimientos' },
]

const STORAGE_KEY = 'inventario_tienda_id'

export default function InventarioLayout({ children }) {
  const { user } = useAuth()
  const pathname = usePathname()

  const [tiendas, setTiendas]   = useState([])
  const [tiendaId, setTiendaId] = useState(null)
  const [loadingTiendas, setLoadingTiendas] = useState(true)

  useEffect(() => {
    if (!user?.empresa_id) return
    async function cargarTiendas() {
      setLoadingTiendas(true)
      try {
        const res = await getTiendasByEmpresa(user.empresa_id)
        const lista = res?.data?.data ?? res?.data ?? []
        setTiendas(lista)

        const guardado = typeof window !== 'undefined'
          ? localStorage.getItem(STORAGE_KEY)
          : null

        const existe = lista.find(t => String(t.id) === String(guardado))
        if (existe) {
          setTiendaId(String(existe.id))
        } else if (lista.length > 0) {
          const primero = String(lista[0].id)
          setTiendaId(primero)
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, primero)
          }
        }
      } catch (err) {
        console.error('[InventarioLayout] Error cargando tiendas:', err)
      } finally {
        setLoadingTiendas(false)
      }
    }
    cargarTiendas()
  }, [user?.empresa_id])

  const handleTiendaChange = (e) => {
    const val = e.target.value
    setTiendaId(val)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, val)
    }
  }

  const tiendaActual = tiendas.find(t => String(t.id) === String(tiendaId))

  const isActive = (href) => {
    if (href === '/dashboard/inventario') {
      return pathname === '/dashboard/inventario'
    }
    return pathname.startsWith(href)
  }

  return (
    <InventarioContext.Provider value={{ tiendaId }}>
      <div className="flex flex-col min-h-screen bg-[#E1E7F0]">

        {/* Topbar del módulo */}
        <div
          className="bg-white flex items-center justify-between px-6"
          style={{
            height: 52,
            borderBottom: '0.5px solid rgba(31,47,87,0.1)',
            flexShrink: 0,
          }}
        >
          {/* Izquierda: ícono + título */}
          <div className="flex items-center gap-2">
            <Package size={18} color="#3960A9" />
            <span
              className="text-lg font-semibold"
              style={{ color: '#1F2F57' }}
            >
              Inventario
            </span>
          </div>

        </div>

        {/* Submenú de navegación */}
        <div
          className="bg-white overflow-x-auto"
          style={{
            borderBottom: '0.5px solid rgba(31,47,87,0.1)',
            flexShrink: 0,
          }}
        >
          <div className="flex items-center gap-7 px-6" style={{ minWidth: 'max-content' }}>
            {NAV_LINKS.map(link => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm py-3 whitespace-nowrap transition-colors"
                  style={{
                    color: active ? '#1F2F57' : 'rgba(31,47,87,0.45)',
                    borderBottom: active ? '2px solid #1EB3B2' : '2px solid transparent',
                    fontWeight: active ? 500 : 400,
                  }}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Contenido de la página */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </InventarioContext.Provider>
  )
}