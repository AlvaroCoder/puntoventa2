'use client'
import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Store,
  Plus,
  TrendingUp,

  Banknote,
} from 'lucide-react'
import CajaCard from '@/components/Cards/CajaCard'
import SwitcherLoader from '@/components/Navigation/SwitcherLoader'
import MetricCard from '@/components/Cards/MetricCard'
import { Title } from '@/shared/components/Title'

const fmt = v =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(v ?? 0)

export default function PageVentas({ tiendas = [], loading = false, metrics = {} }) {
  const router = useRouter()
  const [tiendaFiltro, setTiendaFiltro] = useState('Todas')

  const {
    totalVentasHoy = 0,
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
    <div className="p-6 flex flex-col gap-5 bg-[#E1E7F0] min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <Title> Hoy en tus tiendas</Title>
          <p
            className="text-xs mt-0.5"
            style={{ color: "rgba(31,47,87,0.55)" }}
          >
            {fechaHoyFormateada}
            {totalCajas > 0 && (
              <span>
                {" "}
                · {cajasAbiertas} de {totalCajas}{" "}
                {totalCajas === 1 ? "caja abierta" : "cajas abiertas"}
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard
          label="Ventas de hoy"
          value={fmt(totalVentasHoy)}
          color="#198E7B"
          icon={TrendingUp}
        />

        <MetricCard
          label="Efectivo en cajas"
          value={fmt(efectivoEnCajas)}
          color="#FF821E"
          icon={Banknote}
        />
      </div>

      <div className="flex gap-5 items-start">
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          <SwitcherLoader loading={loading}>
            {tiendasFiltradas.length === 0 && !loading ? (
              <div
                className="bg-white rounded-xl p-8 flex flex-col items-center gap-2"
                style={{ border: "0.5px solid rgba(31,47,87,0.1)" }}
              >
                <p
                  className="text-sm font-semibold"
                  style={{ color: "rgba(31,47,87,0.4)" }}
                >
                  No hay tiendas registradas
                </p>
              </div>
            ) : (
              tiendasFiltradas.map((tienda) => {
                const cajasAbiertasTienda = tienda.cajas.filter(
                  (c) => c.estado === "ABIERTA",
                ).length;

                return (
                  <div key={tienda.id} className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(31,47,87,0.07)" }}
                      >
                        <Store size={14} style={{ color: "#1F2F57" }} />
                      </div>

                      <span
                        className="text-sm font-bold"
                        style={{ color: "#1F2F57" }}
                      >
                        {tienda.nombre}
                      </span>

                      {tienda.ubicacion && (
                        <>
                          <span style={{ color: "rgba(31,47,87,0.3)" }}>·</span>
                          <span
                            className="text-xs"
                            style={{ color: "rgba(31,47,87,0.45)" }}
                          >
                            {tienda.ubicacion}
                          </span>
                        </>
                      )}

                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{
                          background: "rgba(31,47,87,0.06)",
                          color: "rgba(31,47,87,0.4)",
                        }}
                      >
                        {tienda.cajas.length}{" "}
                        {tienda.cajas.length === 1 ? "caja" : "cajas"}
                      </span>

                      {cajasAbiertasTienda > 0 && (
                        <span
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                          style={{ background: "#198E7B15", color: "#198E7B" }}
                        >
                          {cajasAbiertasTienda} abierta
                        </span>
                      )}

                      <button
                        onClick={() =>
                          router.push(
                            `/dashboard/ventas/caja/create?tiendaId=${tienda.id}`,
                          )
                        }
                        className="ml-auto flex items-center gap-1 text-[11px] font-semibold hover:underline flex-shrink-0"
                        style={{ color: "#3960A9" }}
                      >
                        <Plus size={12} />
                        Agregar caja
                      </button>
                    </div>

                    {tienda.cajas.length === 0 ? (
                      <button
                        onClick={() =>
                          router.push(
                            `/dashboard/ventas/caja/create?tiendaId=${tienda.id}`,
                          )
                        }
                        className="rounded-xl border-2 border-dashed p-6 flex flex-col items-center gap-2 hover:bg-blue-50/20 transition-all w-full"
                        style={{ borderColor: "rgba(31,47,87,0.2)" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.borderColor = "#3960A9")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.borderColor =
                            "rgba(31,47,87,0.2)")
                        }
                      >
                        <div
                          className="w-8 h-8 rounded-full border-2 flex items-center justify-center"
                          style={{ borderColor: "rgba(31,47,87,0.25)" }}
                        >
                          <Plus
                            size={16}
                            style={{ color: "rgba(31,47,87,0.4)" }}
                          />
                        </div>
                        <p
                          className="text-xs font-semibold"
                          style={{ color: "rgba(31,47,87,0.5)" }}
                        >
                          Crea la primera caja de esta tienda
                        </p>
                      </button>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {tienda.cajas.map((caja) => (
                          <CajaCard key={caja.id} caja={caja} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </SwitcherLoader>
        </div>

      </div>
    </div>
  );
}
