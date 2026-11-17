'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ArrowLeft, TrendingUp, Hash, Banknote,
  Printer, Lock, AlertCircle, CheckCircle, ChevronRight,
} from 'lucide-react'
import { getSesionActual, cerrarCaja } from '@/Connections/caja'
import { useAuth } from '@/Context/AuthContext'
import { toast } from 'react-toastify'

const fmt = v =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(v ?? 0)

function MetricCard({ label, value, sub, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-xl p-4 flex flex-col gap-3" style={{ border: '0.5px solid rgba(31,47,87,0.1)' }}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wide" style={{ color: 'rgba(31,47,87,0.4)' }}>
          {label}
        </span>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
          <Icon size={13} style={{ color }} />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold" style={{ color: '#1F2F57' }}>{value}</p>
        {sub && <p className="text-[11px] mt-0.5" style={{ color: 'rgba(31,47,87,0.4)' }}>{sub}</p>}
      </div>
    </div>
  )
}

function RowPago({ label, value, isTotal }) {
  return (
    <div
      className={`flex items-center justify-between py-2.5 px-3 ${isTotal ? 'rounded-lg' : ''}`}
      style={
        isTotal
          ? { background: 'rgba(31,47,87,0.04)' }
          : { borderBottom: '0.5px solid rgba(31,47,87,0.07)' }
      }
    >
      <span
        className={`text-sm ${isTotal ? 'font-bold' : 'font-medium'}`}
        style={{ color: isTotal ? '#1F2F57' : 'rgba(31,47,87,0.65)' }}
      >
        {label}
      </span>
      <span className={`text-sm ${isTotal ? 'font-bold' : ''}`} style={{ color: '#1F2F57' }}>
        {fmt(value)}
      </span>
    </div>
  )
}

export default function PageCerrarCaja() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const cajaId = Number(searchParams.get('cajaId'))
  const sesionIdParam = Number(searchParams.get('sesionId'))

  const [sesion, setSesion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cerrando, setCerrando] = useState(false)
  const [montoCierre, setMontoCierre] = useState('')
  const [observaciones, setObservaciones] = useState('')

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const res = await getSesionActual(cajaId)
        setSesion(res.data)
      } catch {
        toast.error('Error al cargar la sesión')
      } finally {
        setLoading(false)
      }
    }
    if (cajaId) load()
  }, [cajaId])

  const montoApertura = Number(sesion?.montoApertura ?? 0)
  const totalVentas = Number(sesion?.totalVentas ?? 0)
  const numTransacciones = Number(sesion?.numTransacciones ?? 0)
  const ventasEfectivo = Number(sesion?.ventasEfectivo ?? 0)
  const ventasYape = Number(sesion?.ventasYape ?? 0)
  const ventasTarjeta = Number(sesion?.ventasTarjeta ?? 0)
  const totalGeneral = ventasEfectivo + ventasYape + ventasTarjeta

  const efectivoEsperado = montoApertura + ventasEfectivo
  const montoCierreNum = parseFloat(montoCierre) || 0
  const diferencia = montoCierre !== '' ? montoCierreNum - efectivoEsperado : null

  const sesionId = sesionIdParam || sesion?.id

  const fechaAperturaStr = useMemo(() => {
    if (!sesion?.fechaApertura) return '-'
    if (Array.isArray(sesion.fechaApertura)) {
      const [y, m, d, h = 0, min = 0] = sesion.fechaApertura
      return new Date(y, m - 1, d, h, min).toLocaleTimeString('es-PE', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    }
    return '-'
  }, [sesion?.fechaApertura])

  const cajaNombre = sesion?.cajaNombre ?? (cajaId ? `Caja #${cajaId}` : '—')
  const cajeroNombre = sesion?.cajeroNombre ?? sesion?.trabajadorNombre ?? '-'

  const handleCerrar = async () => {
    if (!montoCierre) {
      toast.warning('Ingresa el monto de efectivo en caja')
      return
    }
    setCerrando(true)
    try {
      await cerrarCaja(sesionId, {
        trabajadorId: user?.trabajador_id,
        montoCierreReal: montoCierreNum,
        observaciones: observaciones || null,
      })
      toast.success('Caja cerrada correctamente')
      router.push('/dashboard/ventas')
    } catch {
      toast.error('Error al cerrar la caja')
    } finally {
      setCerrando(false)
    }
  }

  return (
    <div
      className="min-h-[calc(100vh-4rem)] flex flex-col"
      style={{ background: '#E1E7F0' }}
    >
      {/* Scrollable content area */}
      <div className="flex-1 p-6 pb-4 flex flex-col gap-5">
        {/* Header */}
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs font-medium mb-2 hover:opacity-70 transition-opacity"
            style={{ color: 'rgba(31,47,87,0.5)' }}
          >
            <ArrowLeft size={13} />
            Volver
          </button>
          <h1 className="text-xl font-bold" style={{ color: '#1F2F57' }}>
            Cierre de caja
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(31,47,87,0.5)' }}>
            {cajaNombre} · abierta hoy {fechaAperturaStr} por {cajeroNombre} · cuenta el efectivo y confirma.
          </p>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <MetricCard
            label="Ventas del turno"
            value={fmt(totalVentas)}
            sub={`${numTransacciones} transacciones`}
            icon={TrendingUp}
            color="#198E7B"
          />
          <MetricCard
            label="Transacciones"
            value={numTransacciones}
            icon={Hash}
            color="#3960A9"
          />
          <MetricCard
            label="Efectivo de apertura"
            value={fmt(montoApertura)}
            icon={Banknote}
            color="#FF821E"
          />
        </div>

        {/* Two columns */}
        <div className="flex flex-col lg:flex-row gap-5 items-start">
          {/* Left: Ventas por método */}
          <div
            className="flex-1 min-w-0 bg-white rounded-xl overflow-hidden"
            style={{ border: '0.5px solid rgba(31,47,87,0.1)' }}
          >
            <div className="px-4 pt-4 pb-3">
              <h2 className="text-sm font-bold" style={{ color: '#1F2F57' }}>
                Ventas por método de pago
              </h2>
              <p className="text-[11px] mt-0.5" style={{ color: 'rgba(31,47,87,0.4)' }}>
                Resumen del turno actual
              </p>
            </div>
            <div className="mx-4" style={{ borderTop: '0.5px solid rgba(31,47,87,0.08)' }} />
            <div className="p-3 flex flex-col gap-0">
              <RowPago label="Efectivo" value={ventasEfectivo} />
              <RowPago label="Yape / Plin" value={ventasYape} />
              <RowPago label="Tarjeta" value={ventasTarjeta} />
              <div className="mt-2">
                <RowPago label="Total" value={totalGeneral} isTotal />
              </div>
            </div>
          </div>

          {/* Right: Arqueo */}
          <div
            className="w-full lg:w-96 bg-white rounded-xl overflow-hidden"
            style={{ border: '0.5px solid rgba(31,47,87,0.1)' }}
          >
            <div className="px-4 pt-4 pb-3">
              <h2 className="text-sm font-bold" style={{ color: '#1F2F57' }}>
                Arqueo de efectivo
              </h2>
              <p className="text-[11px] mt-0.5" style={{ color: 'rgba(31,47,87,0.4)' }}>
                Verifica el efectivo en caja
              </p>
            </div>
            <div className="mx-4" style={{ borderTop: '0.5px solid rgba(31,47,87,0.08)' }} />

            <div className="p-4 flex flex-col gap-5">
              {/* Calculation rows */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs" style={{ color: 'rgba(31,47,87,0.5)' }}>Apertura</span>
                  <span className="text-xs font-medium" style={{ color: '#1F2F57' }}>{fmt(montoApertura)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs" style={{ color: 'rgba(31,47,87,0.5)' }}>+ Ventas en efectivo</span>
                  <span className="text-xs font-medium" style={{ color: '#1F2F57' }}>{fmt(ventasEfectivo)}</span>
                </div>
                <div className="h-px" style={{ background: 'rgba(31,47,87,0.1)' }} />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold" style={{ color: '#1F2F57' }}>Efectivo esperado</span>
                  <span className="text-sm font-bold" style={{ color: '#1F2F57' }}>{fmt(efectivoEsperado)}</span>
                </div>
              </div>

              {/* Input */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-[11px] font-semibold uppercase tracking-wide"
                  style={{ color: 'rgba(31,47,87,0.5)' }}
                >
                  ¿Cuánto efectivo hay en caja?
                </label>
                <div className="relative">
                  <span
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold"
                    style={{ color: 'rgba(31,47,87,0.4)' }}
                  >
                    S/
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={montoCierre}
                    onChange={e => setMontoCierre(e.target.value)}
                    placeholder="0.00"
                    className="w-full h-12 pl-10 pr-4 rounded-xl text-lg font-semibold outline-none transition-all"
                    style={{
                      border: '1.5px solid rgba(31,47,87,0.18)',
                      color: '#1F2F57',
                      background: '#fff',
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = '#3960A9'
                      e.target.style.boxShadow = '0 0 0 3px rgba(57,96,169,0.1)'
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = 'rgba(31,47,87,0.18)'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>
                <button
                  className="text-left text-xs font-medium flex items-center gap-0.5 hover:opacity-70 transition-opacity"
                  style={{ color: '#3960A9' }}
                >
                  Contar por billetes y monedas
                  <ChevronRight size={11} />
                </button>
              </div>

              {/* Difference indicator */}
              {diferencia !== null && (
                <div
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{
                    background: diferencia >= 0 ? 'rgba(25,142,123,0.08)' : 'rgba(239,68,68,0.08)',
                    border: `1px solid ${diferencia >= 0 ? 'rgba(25,142,123,0.2)' : 'rgba(239,68,68,0.2)'}`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    {diferencia >= 0 ? (
                      <CheckCircle size={14} style={{ color: '#198E7B' }} />
                    ) : (
                      <AlertCircle size={14} style={{ color: '#EF4444' }} />
                    )}
                    <span
                      className="text-xs font-semibold"
                      style={{ color: diferencia >= 0 ? '#198E7B' : '#EF4444' }}
                    >
                      {diferencia > 0 ? 'Sobrante' : diferencia < 0 ? 'Faltante' : 'Sin diferencia'}
                    </span>
                  </div>
                  <span
                    className="text-sm font-bold"
                    style={{ color: diferencia >= 0 ? '#198E7B' : '#EF4444' }}
                  >
                    {diferencia === 0 ? '—' : fmt(Math.abs(diferencia))}
                  </span>
                </div>
              )}

              {/* Observations */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-[11px] font-semibold uppercase tracking-wide"
                  style={{ color: 'rgba(31,47,87,0.5)' }}
                >
                  Observaciones{' '}
                  <span style={{ color: 'rgba(31,47,87,0.3)', fontWeight: 400, textTransform: 'none' }}>
                    (opcional)
                  </span>
                </label>
                <textarea
                  value={observaciones}
                  onChange={e => setObservaciones(e.target.value)}
                  placeholder="Ej: Billete falso encontrado, diferencia justificada..."
                  rows={3}
                  className="w-full px-3.5 py-3 rounded-xl text-sm outline-none resize-none transition-all"
                  style={{
                    border: '1px solid rgba(31,47,87,0.18)',
                    color: '#1F2F57',
                    background: '#fff',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#3960A9'
                    e.target.style.boxShadow = '0 0 0 3px rgba(57,96,169,0.1)'
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'rgba(31,47,87,0.18)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom action bar */}
      <div
        className="px-6 py-3 flex items-center justify-between gap-3"
        style={{
          background: '#fff',
          borderTop: '0.5px solid rgba(31,47,87,0.1)',
          boxShadow: '0 -4px 24px rgba(31,47,87,0.07)',
        }}
      >
        <button
          onClick={() => router.push(`/dashboard/ventas/caja/pos?cajaId=${cajaId}`)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
          style={{ border: '1px solid rgba(31,47,87,0.2)', color: '#1F2F57' }}
        >
          Seguir vendiendo
        </button>

        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
            style={{ border: '1px solid rgba(31,47,87,0.2)', color: '#1F2F57' }}
          >
            <Printer size={14} />
            Imprimir reporte
          </button>
          <button
            onClick={handleCerrar}
            disabled={cerrando || !montoCierre}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: '#1F2F57' }}
          >
            <Lock size={14} />
            {cerrando ? 'Cerrando...' : 'Cerrar caja'}
          </button>
        </div>
      </div>
    </div>
  )
}
