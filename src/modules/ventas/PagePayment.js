'use client'
import { useEffect, useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ArrowLeft,
  User,
  Banknote,
  Smartphone,
  CreditCard,
  Layers,
} from 'lucide-react'
import { toast } from 'react-toastify'
import PosSteps from '@/modules/ventas/components/PosSteps'
import { ventasService } from '@/modules/ventas/service/ventas.service'

/* ─── helpers ─────────────────────────────────────────────────────────────── */

function roundUp50(n) {
  return Math.ceil(n / 50) * 50
}

function initials(nombre = '') {
  return nombre
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase()
}

/* ─── sub-components ──────────────────────────────────────────────────────── */

function SectionTitle({ children }) {
  return (
    <p
      className="text-xs font-semibold uppercase tracking-wider mb-3"
      style={{ color: 'rgba(31,47,87,0.45)' }}
    >
      {children}
    </p>
  )
}

function Card({ children, style, className = '' }) {
  return (
    <div
      className={`bg-white rounded-2xl p-5 ${className}`}
      style={{ border: '0.5px solid rgba(31,47,87,0.1)', ...style }}
    >
      {children}
    </div>
  )
}

/* ─── MÉTODO PAGO icons mapping ───────────────────────────────────────────── */

const METODOS = [
  { key: 'EFECTIVO', label: 'Efectivo', Icon: Banknote },
  { key: 'YAPE', label: 'Yape / Plin', Icon: Smartphone },
  { key: 'TARJETA', label: 'Tarjeta', Icon: CreditCard },
  { key: 'MIXTO', label: 'Mixto', Icon: Layers },
]

export default function PagePayment() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const cajaId = searchParams.get('cajaId')

  /* ── sessionStorage ── */
  const [cartData, setCartData] = useState(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('pos_cart')
    if (!raw) {
      router.replace(`/dashboard/ventas/caja/pos?cajaId=${cajaId ?? ''}`)
      return
    }
    try {
      setCartData(JSON.parse(raw))
    } catch {
      router.replace(`/dashboard/ventas/caja/pos?cajaId=${cajaId ?? ''}`)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── form state ── */
  const [tipoComprobante, setTipoComprobante] = useState('BOLETA')
  const [metodo, setMetodo] = useState('EFECTIVO')
  const [efectivo, setEfectivo] = useState('')
  const [submitting, setSubmitting] = useState(false)

  /* ── derived ── */
  const carrito = cartData?.carrito ?? []
  const cliente = cartData?.cliente ?? null

  const total = useMemo(
    () =>
      carrito.reduce((sum, l) => sum + l.precio * l.qty - (parseFloat(l.descuento) || 0), 0),
    [carrito]
  )

  const opGravada = useMemo(() => parseFloat((total / 1.18).toFixed(2)), [total])
  const igv = useMemo(() => parseFloat((total - opGravada).toFixed(2)), [total, opGravada])

  const montoEfectivo = parseFloat(efectivo) || 0
  const cambio = metodo === 'EFECTIVO' && montoEfectivo > total
    ? parseFloat((montoEfectivo - total).toFixed(2))
    : 0

  const pills = useMemo(() => {
    const exact = parseFloat(total.toFixed(2))
    const up50  = roundUp50(exact)
    return [
      { label: 'Monto exacto', value: exact },
      { label: `S/ ${up50}`, value: up50 },
      { label: `S/ ${up50 + 50}`, value: up50 + 50 },
      { label: `S/ ${up50 + 100}`, value: up50 + 100 },
    ]
  }, [total])

  const handleSubmit = async () => {
    if (!cartData) return
    setSubmitting(true)
    try {
      const { cajaSesionId, tiendaId, trabajadorId, empresaId } = cartData

      const detalles = carrito.map((line) => {
        const descuentoLinea = parseFloat(line.descuento) || 0
        const baseImponible  = line.precio * line.qty - descuentoLinea
        const igvLinea       = parseFloat((baseImponible * 0.18).toFixed(2))
        return {
          productoId:        line.id,
          varianteId:        line.varianteSeleccionada?.id ?? null,
          cantidad:          line.qty,
          precioUnitario:    line.precio,
          descuento:         descuentoLinea,
          igv:               igvLinea,
          impuesto:          0,
        }
      })

      const montoRecibido =
        metodo === 'EFECTIVO' ? (parseFloat(efectivo) || total) : total

      const dataVenta = {
        empresaId,
        tiendaId,
        cajaSesionId,
        trabajadorId,
        clienteId:       cliente?.id ?? null,
        tipoPago:        metodo,
        tipoComprobante,
        descuento:       0,
        montoRecibido,
        observaciones:   null,
        detalles,
      }

      const ventaRes = await ventasService.createVenta(dataVenta)
      if (ventaRes.error) {
        toast.error(ventaRes.message || 'Error al registrar la venta')
        return
      }

      sessionStorage.setItem(
        'pos_venta',
        JSON.stringify({
          ...ventaRes.data,
          carrito,
          cliente,
          tipoComprobante,
          metodo,
          total,
          montoRecibido,
          cambio,
          opGravada,
          igv,
        })
      )

      router.push(`/dashboard/ventas/caja/pos/success?cajaId=${cajaId ?? ''}`)
    } catch (err) {
      toast.error('Error inesperado al procesar el pago')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  /* ── loading guard ── */
  if (!cartData) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: '#E8EDF5' }}>
        <div className="w-8 h-8 rounded-full border-2 border-[#1F2F57] border-t-transparent animate-spin" />
      </div>
    )
  }

  const compLabel = tipoComprobante === 'BOLETA' ? 'boleta' : 'factura'

  /* ════════════════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen" style={{ background: '#E8EDF5' }}>

      {/* ── Top bar ── */}
      <div
        className="bg-white px-6 py-3 flex items-center justify-between gap-4"
        style={{ borderBottom: '0.5px solid rgba(31,47,87,0.1)' }}
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm transition-opacity hover:opacity-70"
          style={{ color: '#1F2F57' }}
        >
          <ArrowLeft size={15} />
          <span className="font-medium">Volver</span>
        </button>

        <PosSteps paso={2} />

        <div style={{ width: 72 }} />
      </div>

      {/* ── Body ── */}
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-5 items-start">

        {/* ══ Left: form ══ */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">

          {/* CLIENTE */}
          <Card>
            <SectionTitle>Cliente</SectionTitle>
            {cliente ? (
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold"
                  style={{ background: '#198E7B' }}
                >
                  {initials(cliente.nombre ?? `${cliente.nombre ?? ''}`)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: '#1F2F57' }}>
                    {cliente.nombre}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(31,47,87,0.5)' }}>
                    {cliente.dni ?? cliente.documento} &middot; {cliente.telefono ?? '—'}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(25,142,123,0.1)', color: '#198E7B' }}
                  >
                    Elegido en la venta
                  </span>
                  <button
                    onClick={() => router.back()}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors hover:bg-gray-50"
                    style={{ border: '0.5px solid rgba(31,47,87,0.2)', color: '#1F2F57' }}
                  >
                    Cambiar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(31,47,87,0.07)' }}
                >
                  <User size={18} style={{ color: 'rgba(31,47,87,0.4)' }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm" style={{ color: 'rgba(31,47,87,0.5)' }}>
                    Sin cliente asignado
                  </p>
                </div>
                <button
                  onClick={() => router.back()}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors hover:bg-gray-50"
                  style={{ border: '0.5px solid rgba(31,47,87,0.2)', color: '#1F2F57' }}
                >
                  Agregar
                </button>
              </div>
            )}
          </Card>

          {/* COMPROBANTE */}
          <Card>
            <SectionTitle>¿Qué comprobante emites?</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'BOLETA', title: 'Boleta', sub: 'Para personas · con DNI' },
                { key: 'FACTURA', title: 'Factura', sub: 'Para empresas · requiere RUC' },
              ].map(({ key, title, sub }) => {
                const active = tipoComprobante === key
                return (
                  <button
                    key={key}
                    onClick={() => setTipoComprobante(key)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all"
                    style={{
                      border: active
                        ? '1.5px solid #1F2F57'
                        : '1px solid rgba(31,47,87,0.15)',
                      background: active ? 'rgba(31,47,87,0.03)' : '#fff',
                    }}
                  >
                    {/* radio dot */}
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center"
                      style={{
                        border: active ? '1.5px solid #1F2F57' : '1.5px solid rgba(31,47,87,0.3)',
                      }}
                    >
                      {active && (
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ background: '#1F2F57' }}
                        />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#1F2F57' }}>
                        {title}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(31,47,87,0.5)' }}>
                        {sub}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </Card>

          {/* MÉTODO DE PAGO */}
          <Card>
            <SectionTitle>Método de pago</SectionTitle>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {METODOS.map(({ key, label, Icon }) => {
                const active = metodo === key
                return (
                  <button
                    key={key}
                    onClick={() => setMetodo(key)}
                    className="flex flex-col items-center gap-2 py-4 px-2 rounded-xl transition-all"
                    style={{
                      border: active
                        ? '1.5px solid #1F2F57'
                        : '1px solid rgba(31,47,87,0.15)',
                      background: active ? 'rgba(31,47,87,0.04)' : '#fff',
                    }}
                  >
                    <Icon
                      size={20}
                      style={{ color: active ? '#1F2F57' : 'rgba(31,47,87,0.45)' }}
                    />
                    <span
                      className="text-xs font-medium text-center"
                      style={{ color: active ? '#1F2F57' : 'rgba(31,47,87,0.6)' }}
                    >
                      {label}
                    </span>
                  </button>
                )
              })}
            </div>
          </Card>

          {/* MONTO RECIBIDO (solo EFECTIVO) */}
          {metodo === 'EFECTIVO' && (
            <Card>
              <SectionTitle>Monto recibido</SectionTitle>

              {/* Input grande */}
              <div
                className="flex items-center gap-0 rounded-xl overflow-hidden mb-4"
                style={{ border: '2px solid #1F2F57' }}
              >
                <span
                  className="px-4 py-3 text-2xl font-bold bg-white select-none"
                  style={{ color: '#1F2F57', borderRight: '1px solid rgba(31,47,87,0.15)' }}
                >
                  S/
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={efectivo}
                  onChange={(e) => setEfectivo(e.target.value)}
                  placeholder={total.toFixed(2)}
                  className="flex-1 px-4 py-3 text-2xl font-bold outline-none bg-white"
                  style={{ color: '#1F2F57' }}
                />
              </div>

              {/* Quick pills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {pills.map((p) => {
                  const active = parseFloat(efectivo) === p.value
                  return (
                    <button
                      key={p.label}
                      onClick={() => setEfectivo(String(p.value))}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                      style={{
                        background: active ? '#1F2F57' : '#fff',
                        color: active ? '#fff' : '#1F2F57',
                        border: active
                          ? '1px solid #1F2F57'
                          : '1px solid rgba(31,47,87,0.2)',
                      }}
                    >
                      {p.label}
                    </button>
                  )
                })}
              </div>

              {/* Vuelto */}
              {montoEfectivo > 0 && (
                <div
                  className="flex items-center justify-between px-4 py-3 rounded-xl"
                  style={{ background: '#E4F5F1' }}
                >
                  <span className="text-sm font-medium" style={{ color: '#198E7B' }}>
                    Vuelto
                  </span>
                  <span className="text-lg font-bold" style={{ color: '#198E7B' }}>
                    S/ {cambio > 0 ? cambio.toFixed(2) : '0.00'}
                  </span>
                </div>
              )}
            </Card>
          )}

          {/* Bottom actions */}
          <div className="flex items-center gap-3 mt-1 pb-8">
            <button
              onClick={() => router.back()}
              className="px-5 py-3 rounded-xl text-sm font-medium transition-colors hover:bg-gray-50"
              style={{ border: '0.5px solid rgba(31,47,87,0.2)', color: '#1F2F57' }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: '#FF821E' }}
            >
              {submitting
                ? 'Procesando...'
                : `Cobrar S/ ${total.toFixed(2)} y emitir ${compLabel}`}
            </button>
          </div>
        </div>

        {/* ══ Right: summary ══ */}
        <div className="flex-shrink-0 lg:sticky lg:top-4 flex flex-col gap-3">
          <Card>
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
              <p className="text-base font-bold" style={{ color: '#1F2F57' }}>
                Resumen
              </p>
              <button
                onClick={() => router.back()}
                className="text-xs font-medium transition-opacity hover:opacity-70"
                style={{ color: '#198E7B' }}
              >
                Editar
              </button>
            </div>
            <p className="text-xs mb-4" style={{ color: 'rgba(31,47,87,0.5)' }}>
              {carrito.reduce((s, l) => s + l.qty, 0)} art&iacute;culos &middot;{' '}
              {tipoComprobante === 'BOLETA' ? 'Boleta B001' : 'Factura F001'}
            </p>
            {cliente && (
              <p className="text-xs mb-4 font-medium" style={{ color: '#1F2F57' }}>
                {cliente.nombre}
              </p>
            )}

            {/* Item list */}
            <div className="flex flex-col gap-2.5 mb-4">
              {carrito.map((line, i) => (
                <div key={i} className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: '#1F2F57' }}>
                      {line.nombre}
                    </p>
                    {line.varianteSeleccionada && (
                      <p className="text-[11px] mt-0.5" style={{ color: 'rgba(31,47,87,0.45)' }}>
                        {[line.varianteSeleccionada.talla, line.varianteSeleccionada.color]
                          .filter(Boolean)
                          .join(' · ')}{' '}
                        &times; {line.qty}
                      </p>
                    )}
                    {!line.varianteSeleccionada && (
                      <p className="text-[11px] mt-0.5" style={{ color: 'rgba(31,47,87,0.45)' }}>
                        &times; {line.qty}
                      </p>
                    )}
                  </div>
                  <p className="text-xs font-semibold flex-shrink-0" style={{ color: '#1F2F57' }}>
                    S/ {(line.precio * line.qty).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Separator */}
            <div className="border-t mb-3" style={{ borderColor: 'rgba(31,47,87,0.07)' }} />

            {/* Totals */}
            <div className="flex flex-col gap-1.5 mb-4">
              <div className="flex justify-between">
                <span className="text-xs" style={{ color: 'rgba(31,47,87,0.55)' }}>
                  Op. gravada
                </span>
                <span className="text-xs" style={{ color: '#1F2F57' }}>
                  S/ {opGravada.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs" style={{ color: 'rgba(31,47,87,0.55)' }}>
                  IGV (18%)
                </span>
                <span className="text-xs" style={{ color: '#1F2F57' }}>
                  S/ {igv.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Navy total box */}
            <div
              className="flex items-center justify-between px-4 py-3.5 rounded-xl"
              style={{ background: '#1F2F57' }}
            >
              <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Total a cobrar
              </span>
              <span className="text-xl font-bold text-white">
                S/ {total.toFixed(2)}
              </span>
            </div>
          </Card>
        </div>

      </div>
    </div>
  )
}
