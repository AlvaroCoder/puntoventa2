'use client'
import React, { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Store,
  Plus,
  TrendingUp,
  Banknote,
  Lock,
} from 'lucide-react'
import CajaCard from '@/components/Cards/CajaCard'
import SwitcherLoader from '@/components/Navigation/SwitcherLoader'
import MetricCard from '@/components/Cards/MetricCard'
import { Title } from '@/shared/components/Title'

const fmt = v =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(v ?? 0)

function fechaArrayADate([y, m, d, h = 0, min = 0, s = 0]) {
  return new Date(y, m - 1, d, h, min, s)
}
function esDeUnDiaAnterior(fechaArray) {
  if (!Array.isArray(fechaArray)) return false
  const apertura = fechaArrayADate(fechaArray)
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  return apertura < hoy
}

export default function PageVentas({ tiendas = [], loading = false, metrics = {}, cajaSesiones = null }) {
  const router = useRouter()
  const [tiendaFiltro, setTiendaFiltro] = useState(tiendas[0]?.id)

  const {
    totalVentasHoy = 0,
    cajasAbiertas = 0,
    totalCajas = 0,
    efectivoEnCajas = 0,
  } = metrics

  const tiendasFiltradas = useMemo(() => {
    return tiendas.filter(t => String(t.id) === String(tiendaFiltro))
  }, [tiendas, tiendaFiltro])

  const fechaHoy = new Date().toLocaleDateString('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  const fechaHoyFormateada = fechaHoy.charAt(0).toUpperCase() + fechaHoy.slice(1)

  const [isLateHour, setIsLateHour] = useState(false)

  useEffect(() => {
    const check = () => setIsLateHour(new Date().getHours() >= 23)
    check()
    const id = setInterval(check, 60_000)
    return () => clearInterval(id)
  }, [])

  const cajasPendienteCierre = useMemo(() => {
    if (!cajaSesiones?.porTienda) return []
    const result = []
    cajaSesiones.porTienda.forEach(pt => {
      const tienda = tiendas.find(t => t.id === pt.tienda_id)
      if (!tienda) return
      pt.sesiones.forEach(sesion => {
        if (sesion.estado !== 'ABIERTA') return
        const esAnterior = esDeUnDiaAnterior(sesion.fechaApertura)
        if (!isLateHour && !esAnterior) return
        const caja = tienda.cajas.find(c => c.id === sesion.cajaId)
        if (!caja) return
        result.push({
          sesionId: sesion.id,
          cajaId: caja.id,
          cajaNombre: caja.nombre,
          tiendaNombre: tienda.nombre,
          cajero: caja.cajero ?? '-',
          horaApertura: caja.hora_apertura ?? '-',
          ventasHoy: caja.ventas_hoy ?? 0,
          esDeAyer: esAnterior,
        })
      })
    })
    return result
  }, [cajaSesiones, tiendas, isLateHour])

  return (
    <div className="p-6 flex flex-col gap-5 bg-[#E1E7F0] min-h-screen">
      {cajasPendienteCierre.map((item) => (
        <div
          key={item.sesionId}
          className="rounded-xl p-4 flex items-start gap-4"
          style={{
            background: "rgba(255,130,30,0.06)",
            border: "1.5px solid rgba(255,130,30,0.3)",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: "rgba(255,130,30,0.12)" }}
          >
            <Lock size={18} style={{ color: "#FF821E" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-bold text-azulMarino" >
              Tienes una caja abierta: {item.cajaNombre}
            </p>
            <p
              className="text-xs mt-0.5 leading-relaxed"
              style={{ color: "rgba(31,47,87,0.6)" }}
            >
              Tienda {item.tiendaNombre} · {item.cajero} · abierta desde{" "}
              {item.horaApertura} · lleva {fmt(item.ventasHoy)} vendido.
              {item.esDeAyer && (
                <span style={{ color: "#FF821E", fontWeight: 600 }}>
                  {" "}
                  Fue abierta ayer.
                </span>
              )}{" "}
              Ciérrala al terminar el turno para cuadrar el efectivo.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={() =>
                  router.push(
                    `/dashboard/ventas/caja/pos?cajaId=${item.cajaId}`,
                  )
                }
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  border: "1px solid rgba(31,47,87,0.2)",
                  color: "#1F2F57",
                  background: "#fff",
                }}
              >
                Ir a vender
              </button>
              <button
                onClick={() =>
                  router.push(
                    `/dashboard/ventas/caja/cerrar?cajaId=${item.cajaId}&sesionId=${item.sesionId}`,
                  )
                }
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-1.5 transition-all hover:opacity-90"
                style={{ background: "#FF821E" }}
              >
                <Lock size={11} />
                Cerrar caja
              </button>
            </div>
          </div>
        </div>
      ))}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <Title> Hoy en tus negocio</Title>
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
            <div className="flex flex-row gap-2 flex-wrap">
              {tiendas?.map((tienda) => (
                <button
                  key={tienda.id}
                  onClick={() => setTiendaFiltro(String(tienda.id))}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                  style={
                    String(tiendaFiltro) === String(tienda.id)
                      ? {
                          background: "#1F2F57",
                          color: "#fff",
                          border: "1.5px solid #1F2F57",
                        }
                      : {
                          background: "#fff",
                          color: "rgba(31,47,87,0.6)",
                          border: "1.5px solid rgba(31,47,87,0.12)",
                        }
                  }
                >
                  <Store size={11} />
                  {tienda.nombre}
                </button>
              ))}
            </div>
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
                        <button
                          onClick={() =>
                            router.push(
                              `/dashboard/ventas/caja/create?tiendaId=${tienda.id}`,
                            )
                          }
                          className="rounded-xl border-2 border-dashed p-6 flex flex-col items-center gap-2 hover:bg-blue-50/20 transition-all"
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
                            Agregar caja
                          </p>
                        </button>
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
