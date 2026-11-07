'use client'
import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Store,
  Plus,
  TrendingUp,
  ShoppingBag,
  LayoutGrid,
  Banknote,
  ChevronDown,
} from 'lucide-react'
import CajaCard from '@/components/Cards/CajaCard'
import SwitcherLoader from '@/components/Navigation/SwitcherLoader'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const fmt = v =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(v ?? 0)

const MOCK_ACTIVIDAD = [
  { id: 1, hora: '16:28', monto: 260.00,  caja: 'Caja Stack', cajero: 'Rosa C.', metodo: 'Efectivo' },
  { id: 2, hora: '15:54', monto: 159.90,  caja: 'Caja Stack', cajero: 'Rosa C.', metodo: 'Yape'     },
  { id: 3, hora: '14:15', monto: 319.96,  caja: 'Caja Stack', cajero: 'Rosa C.', metodo: 'Tarjeta'  },
  { id: 4, hora: '13:40', monto:  49.90,  caja: 'Caja Stack', cajero: 'Rosa C.', metodo: 'Efectivo' },
  { id: 5, hora: '12:05', monto:  89.90,  caja: 'Caja Stack', cajero: 'Rosa C.', metodo: 'Efectivo' },
]

// ---------------------------------------------------------------------------
// MetricCard
// ---------------------------------------------------------------------------

function MetricCard({ label, value, subvalue, color, icon: Icon }) {
  return (
    <div
      className="bg-white rounded-xl px-5 py-4"
      style={{ border: '0.5px solid rgba(31,47,87,0.1)' }}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-medium" style={{ color: 'rgba(31,47,87,0.45)' }}>
          {label}
        </p>
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: `${color}15` }}
        >
          <Icon size={14} style={{ color }} />
        </div>
      </div>
      <p className="text-xl font-extrabold" style={{ color }}>
        {value}
      </p>
      {subvalue && (
        <p className="text-[11px] mt-0.5" style={{ color: 'rgba(31,47,87,0.4)' }}>
          {subvalue}
        </p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// ActividadHoy
// ---------------------------------------------------------------------------

function ActividadHoy() {
  return (
    <div
      className="bg-white rounded-xl p-4 sticky top-4"
      style={{ border: '0.5px solid rgba(31,47,87,0.1)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold" style={{ color: '#1F2F57' }}>
          Actividad de hoy
        </span>
        <button
          className="text-[11px] font-medium hover:underline"
          style={{ color: '#3960A9' }}
        >
          Ver todas →
        </button>
      </div>

      {MOCK_ACTIVIDAD.length === 0 ? (
        <p className="text-[11px] text-center py-4" style={{ color: 'rgba(31,47,87,0.4)' }}>
          Sin ventas registradas hoy
        </p>
      ) : (
        <div className="flex flex-col">
          {MOCK_ACTIVIDAD.map((a, idx) => (
            <div
              key={a.id}
              className="py-2.5"
              style={{
                borderTop: idx === 0 ? 'none' : '1px solid rgba(31,47,87,0.06)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold" style={{ color: '#1F2F57' }}>
                  {a.hora}
                </span>
                <span className="text-xs font-bold" style={{ color: '#198E7B' }}>
                  {fmt(a.monto)}
                </span>
              </div>
              <p className="text-[11px] mt-0.5" style={{ color: 'rgba(31,47,87,0.5)' }}>
                {a.caja} · {a.cajero} · {a.metodo}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// PageVentas (UI pura)
// ---------------------------------------------------------------------------

export default function PageVentas({ tiendas = [], loading = false, metrics = {} }) {
  const router = useRouter()
  const [tiendaFiltro, setTiendaFiltro] = useState('Todas')

  const {
    totalVentasHoy = 0,
    totalTransacciones = 0,
    cajasAbiertas = 0,
    totalCajas = 0,
    efectivoEnCajas = 0,
  } = metrics

  const tiendasFiltradas = useMemo(() => {
    if (tiendaFiltro === 'Todas') return tiendas
    return tiendas.filter(t => String(t.id) === String(tiendaFiltro))
  }, [tiendas, tiendaFiltro])

  const fechaHoy = new Date().toLocaleDateString('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  const fechaHoyFormateada = fechaHoy.charAt(0).toUpperCase() + fechaHoy.slice(1)

  return (
    <div className="p-6 flex flex-col gap-5 bg-[#E1E7F0] min-h-full">

      {/* ------------------------------------------------------------------ */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-extrabold" style={{ color: '#1F2F57' }}>
            Hoy en tus tiendas
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(31,47,87,0.55)' }}>
            {fechaHoyFormateada}
            {totalCajas > 0 && (
              <span>
                {' '}· {cajasAbiertas} de {totalCajas}{' '}
                {totalCajas === 1 ? 'caja abierta' : 'cajas abiertas'}
              </span>
            )}
          </p>
        </div>

        {/* Selector de tienda — solo visible si hay más de una */}
        {tiendas.length > 1 && (
          <div className="relative flex-shrink-0">
            <select
              value={tiendaFiltro}
              onChange={e => setTiendaFiltro(e.target.value)}
              className="appearance-none bg-white text-xs font-semibold rounded-lg pl-3 pr-8 py-2 cursor-pointer focus:outline-none"
              style={{
                border: '0.5px solid rgba(31,47,87,0.15)',
                color: '#1F2F57',
              }}
            >
              <option value="Todas">Todas las tiendas</option>
              {tiendas.map(t => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </select>
            <ChevronDown
              size={13}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'rgba(31,47,87,0.45)' }}
            />
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Métricas                                                            */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard
          label="Ventas de hoy"
          value={fmt(totalVentasHoy)}
          color="#198E7B"
          icon={TrendingUp}
        />
        <MetricCard
          label="Transacciones"
          value={totalTransacciones}
          color="#3960A9"
          icon={ShoppingBag}
        />
        <MetricCard
          label="Cajas abiertas"
          value={`${cajasAbiertas} de ${totalCajas}`}
          color="#1F2F57"
          icon={LayoutGrid}
        />
        <MetricCard
          label="Efectivo en cajas"
          value={fmt(efectivoEnCajas)}
          color="#FF821E"
          icon={Banknote}
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Cuerpo: tiendas + panel actividad                                  */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex gap-5 items-start">

        {/* Columna principal */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          <SwitcherLoader loading={loading}>
            {tiendasFiltradas.length === 0 && !loading ? (
              <div
                className="bg-white rounded-xl p-8 flex flex-col items-center gap-2"
                style={{ border: '0.5px solid rgba(31,47,87,0.1)' }}
              >
                <p className="text-sm font-semibold" style={{ color: 'rgba(31,47,87,0.4)' }}>
                  No hay tiendas registradas
                </p>
              </div>
            ) : (
              tiendasFiltradas.map(tienda => {
                const cajasAbiertasTienda = tienda.cajas.filter(c => c.estado === 'ABIERTA').length

                return (
                  <div key={tienda.id} className="flex flex-col gap-3">

                    {/* Cabecera de tienda */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(31,47,87,0.07)' }}
                      >
                        <Store size={14} style={{ color: '#1F2F57' }} />
                      </div>

                      <span className="text-sm font-bold" style={{ color: '#1F2F57' }}>
                        {tienda.nombre}
                      </span>

                      {tienda.ubicacion && (
                        <>
                          <span style={{ color: 'rgba(31,47,87,0.3)' }}>·</span>
                          <span className="text-xs" style={{ color: 'rgba(31,47,87,0.45)' }}>
                            {tienda.ubicacion}
                          </span>
                        </>
                      )}

                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{
                          background: 'rgba(31,47,87,0.06)',
                          color: 'rgba(31,47,87,0.4)',
                        }}
                      >
                        {tienda.cajas.length} {tienda.cajas.length === 1 ? 'caja' : 'cajas'}
                      </span>

                      {cajasAbiertasTienda > 0 && (
                        <span
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                          style={{ background: '#198E7B15', color: '#198E7B' }}
                        >
                          {cajasAbiertasTienda} abierta
                        </span>
                      )}

                      <button
                        onClick={() =>
                          router.push(`/dashboard/ventas/caja/create?tiendaId=${tienda.id}`)
                        }
                        className="ml-auto flex items-center gap-1 text-[11px] font-semibold hover:underline flex-shrink-0"
                        style={{ color: '#3960A9' }}
                      >
                        <Plus size={12} />
                        Agregar caja
                      </button>
                    </div>

                    {/* Lista de cajas o estado vacío */}
                    {tienda.cajas.length === 0 ? (
                      <button
                        onClick={() =>
                          router.push(`/dashboard/ventas/caja/create?tiendaId=${tienda.id}`)
                        }
                        className="rounded-xl border-2 border-dashed p-6 flex flex-col items-center gap-2 hover:bg-blue-50/20 transition-all w-full"
                        style={{ borderColor: 'rgba(31,47,87,0.2)' }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = '#3960A9')}
                        onMouseLeave={e =>
                          (e.currentTarget.style.borderColor = 'rgba(31,47,87,0.2)')
                        }
                      >
                        <div
                          className="w-8 h-8 rounded-full border-2 flex items-center justify-center"
                          style={{ borderColor: 'rgba(31,47,87,0.25)' }}
                        >
                          <Plus size={16} style={{ color: 'rgba(31,47,87,0.4)' }} />
                        </div>
                        <p
                          className="text-xs font-semibold"
                          style={{ color: 'rgba(31,47,87,0.5)' }}
                        >
                          Crea la primera caja de esta tienda
                        </p>
                      </button>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {tienda.cajas.map(caja => (
                          <CajaCard key={caja.id} caja={caja} />
                        ))}
                      </div>
                    )}

                  </div>
                )
              })
            )}
          </SwitcherLoader>
        </div>

        {/* Panel de actividad — solo visible en lg+ */}
        <div className="hidden lg:block w-72 flex-shrink-0">
          <ActividadHoy />
        </div>

      </div>
    </div>
  )
}
