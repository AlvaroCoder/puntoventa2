'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Check,
  Printer,
  MessageCircle,
  Download,
  Mail,
  QrCode,
} from 'lucide-react'
import PosSteps from '@/modules/ventas/components/PosSteps'

/* ─── helpers ─────────────────────────────────────────────────────────────── */

function fmt(n) {
  return parseFloat(n ?? 0).toFixed(2)
}

function horaActual() {
  return new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
}

function truncate(str = '', max = 18) {
  return str.length > max ? str.slice(0, max) + '…' : str
}

/* ─── ticket line ─────────────────────────────────────────────────────────── */

function TkLine({ left, right, bold = false }) {
  return (
    <div
      className="flex justify-between gap-2"
      style={{
        fontFamily: 'monospace',
        fontSize: 11,
        color: bold ? '#1F2F57' : 'rgba(31,47,87,0.75)',
        fontWeight: bold ? 700 : 400,
      }}
    >
      <span style={{ flex: 1 }}>{left}</span>
      <span>{right}</span>
    </div>
  )
}

function TkDash() {
  return (
    <p
      className="my-1.5"
      style={{
        fontFamily: 'monospace',
        fontSize: 11,
        color: 'rgba(31,47,87,0.25)',
        letterSpacing: 2,
      }}
    >
      {'-'.repeat(30)}
    </p>
  )
}

/* ─── option card ─────────────────────────────────────────────────────────── */

function OptionCard({ icon: IconBg, label, sub, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-left transition-all"
      style={{
        border: selected
          ? '1.5px solid #1F2F57'
          : '1px solid rgba(31,47,87,0.12)',
        background: selected ? 'rgba(31,47,87,0.03)' : '#fff',
      }}
    >
      {IconBg}
      <div>
        <p className="text-sm font-semibold" style={{ color: '#1F2F57' }}>
          {label}
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'rgba(31,47,87,0.5)' }}>
          {sub}
        </p>
      </div>
    </button>
  )
}

/* ─── main ────────────────────────────────────────────────────────────────── */

export default function PageSuccess() {
  const router      = useRouter()
  const searchParams = useSearchParams()
  const cajaId       = searchParams.get('cajaId')

  const [ventaData, setVentaData] = useState(null)
  const [hora]                    = useState(horaActual)
  const [printSelected, setPrintSelected]     = useState(true)
  const [whatsappSelected, setWhatsappSelected] = useState(false)

  useEffect(() => {
    const raw = sessionStorage.getItem('pos_venta')
    if (!raw) {
      router.replace(`/dashboard/ventas/caja/pos?cajaId=${cajaId ?? ''}`)
      return
    }
    try {
      setVentaData(JSON.parse(raw))
    } catch {
      router.replace(`/dashboard/ventas/caja/pos?cajaId=${cajaId ?? ''}`)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!ventaData) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: '#E8EDF5' }}>
        <div className="w-8 h-8 rounded-full border-2 border-[#1F2F57] border-t-transparent animate-spin" />
      </div>
    )
  }

  const {
    carrito    = [],
    cliente    = null,
    tipoComprobante = 'BOLETA',
    metodo     = 'EFECTIVO',
    total      = 0,
    montoRecibido = 0,
    cambio     = 0,
    opGravada  = 0,
    igv        = 0,
    nroComprobante,
  } = ventaData

  const isFactura     = tipoComprobante === 'FACTURA'
  const compLabel     = isFactura ? 'Factura' : 'Boleta'
  const nroComp       = nroComprobante ?? (isFactura ? 'F001-00001' : 'B001-00001')
  const metodolabel   = {
    EFECTIVO: 'Efectivo',
    YAPE: 'Yape/Plin',
    TARJETA: 'Tarjeta',
    MIXTO: 'Mixto',
  }[metodo] ?? metodo

  const handleNuevaVenta = () => {
    sessionStorage.removeItem('pos_cart')
    sessionStorage.removeItem('pos_venta')
    router.push(`/dashboard/ventas/caja/pos?cajaId=${cajaId ?? ''}`)
  }

  /* ════════════════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen" style={{ background: '#E8EDF5' }}>

      {/* ── Top bar ── */}
      <div
        className="bg-white px-6 py-3 flex items-center justify-center"
        style={{ borderBottom: '0.5px solid rgba(31,47,87,0.1)' }}
      >
        <PosSteps paso={3} />
      </div>

      {/* ── Body ── */}
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-5">

        {/* ══ Success banner ══ */}
        <div
          className="bg-white rounded-2xl px-6 py-5 flex items-center justify-between gap-4"
          style={{ border: '0.5px solid rgba(31,47,87,0.1)' }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: '#198E7B' }}
            >
              <Check size={24} color="#fff" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-xl font-bold" style={{ color: '#1F2F57' }}>
                Venta cobrada
              </p>
              <p className="text-sm mt-0.5" style={{ color: 'rgba(31,47,87,0.6)' }}>
                {compLabel} {nroComp} &middot; S/ {fmt(total)} &middot; {metodolabel}
              </p>
              <p className="text-xs mt-1 font-medium" style={{ color: '#198E7B' }}>
                Aceptada por SUNAT &middot; {hora}
              </p>
            </div>
          </div>

          {cambio > 0 && (
            <div
              className="flex flex-col items-center px-5 py-3 rounded-xl flex-shrink-0"
              style={{ background: '#E4F5F1' }}
            >
              <span className="text-xs font-medium mb-1" style={{ color: '#198E7B' }}>
                Entrega el vuelto
              </span>
              <span className="text-2xl font-bold" style={{ color: '#198E7B' }}>
                S/ {fmt(cambio)}
              </span>
            </div>
          )}
        </div>

        {/* ══ Two-column ══ */}
        <div className="flex flex-col lg:flex-row gap-5 items-start">

          {/* Left */}
          <div
            className="flex-1 min-w-0 bg-white rounded-2xl p-6 flex flex-col gap-5"
            style={{ border: '0.5px solid rgba(31,47,87,0.1)' }}
          >
            <div>
              <p className="text-base font-bold mb-1" style={{ color: '#1F2F57' }}>
                ¿C&oacute;mo le das el comprobante al cliente?
              </p>
              <p className="text-sm" style={{ color: 'rgba(31,47,87,0.5)' }}>
                Puedes hacer las dos cosas. El comprobante ya qued&oacute; guardado.
              </p>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-3">
              <OptionCard
                selected={printSelected}
                onClick={() => setPrintSelected((v) => !v)}
                icon={
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(31,47,87,0.07)' }}
                  >
                    <Printer size={17} style={{ color: '#1F2F57' }} />
                  </div>
                }
                label="Imprimir ticket"
                sub="Impresora de caja · Epson TM-T20 (80 mm)"
              />
              <OptionCard
                selected={whatsappSelected}
                onClick={() => setWhatsappSelected((v) => !v)}
                icon={
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(25,142,123,0.1)' }}
                  >
                    <MessageCircle size={17} style={{ color: '#198E7B' }} />
                  </div>
                }
                label="Enviar por WhatsApp"
                sub="Le llega el PDF y el enlace de consulta SUNAT"
              />
            </div>

            {/* Footer row */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <p className="text-xs" style={{ color: 'rgba(31,47,87,0.45)' }}>
                Copias: 1 &middot; Se abre el caj&oacute;n de dinero al imprimir
              </p>
              <button
                className="px-4 py-2 rounded-xl text-xs font-bold text-white flex-shrink-0 transition-opacity hover:opacity-90"
                style={{ background: '#1F2F57' }}
              >
                Imprimir ticket
              </button>
            </div>

            {/* Links row */}
            <div className="flex items-center gap-5">
              <button
                className="flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-70"
                style={{ color: '#1F2F57' }}
              >
                <Download size={13} />
                Descargar PDF
              </button>
              <button
                className="flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-70"
                style={{ color: '#1F2F57' }}
              >
                <Mail size={13} />
                Enviar por correo
              </button>
            </div>

            {/* Bottom action row */}
            <div
              className="flex items-center justify-between gap-3 pt-3"
              style={{ borderTop: '0.5px solid rgba(31,47,87,0.08)' }}
            >
              <button
                className="text-xs font-medium transition-opacity hover:opacity-70"
                style={{ color: '#198E7B' }}
              >
                Ver en comprobantes SUNAT
              </button>
              <button
                onClick={handleNuevaVenta}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: '#FF821E' }}
              >
                Nueva venta
              </button>
            </div>
          </div>

          {/* Right: ticket preview */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-2 px-1"
              style={{ color: 'rgba(31,47,87,0.4)' }}
            >
              Vista previa
            </p>

            <div
              className="bg-white rounded-2xl px-5 py-5 flex flex-col"
              style={{ border: '0.5px solid rgba(31,47,87,0.1)', fontFamily: 'monospace' }}
            >
              {/* Company */}
              <p
                className="text-center font-bold mb-0.5"
                style={{ fontSize: 12, color: '#1F2F57' }}
              >
                MI EMPRESA S.A.C.
              </p>
              <p className="text-center" style={{ fontSize: 10, color: 'rgba(31,47,87,0.6)' }}>
                RUC: 20123456789
              </p>
              <p className="text-center" style={{ fontSize: 10, color: 'rgba(31,47,87,0.6)' }}>
                Av. Principal 123 - Lima
              </p>

              <TkDash />

              <p
                className="text-center font-bold"
                style={{ fontSize: 11, color: '#1F2F57' }}
              >
                {isFactura ? 'FACTURA ELECTRÓNICA' : 'BOLETA DE VENTA ELECTRÓNICA'}
              </p>
              <p className="text-center" style={{ fontSize: 11, color: 'rgba(31,47,87,0.65)' }}>
                {nroComp}
              </p>
              <p
                className="text-center mt-0.5"
                style={{ fontSize: 10, color: 'rgba(31,47,87,0.5)' }}
              >
                {new Date().toLocaleDateString('es-PE')}
              </p>

              <TkDash />

              {cliente && (
                <>
                  <p style={{ fontSize: 10, color: 'rgba(31,47,87,0.75)' }}>
                    CLIENTE: {cliente.nombre}
                  </p>
                  {cliente.dni && (
                    <p style={{ fontSize: 10, color: 'rgba(31,47,87,0.75)' }}>
                      DNI: {cliente.dni}
                    </p>
                  )}
                  <TkDash />
                </>
              )}

              {/* Items */}
              {carrito.map((line, i) => (
                <TkLine
                  key={i}
                  left={truncate(line.nombre)}
                  right={`${line.qty}x ${fmt(line.precio)}`}
                />
              ))}

              <TkDash />

              <TkLine left="OP. GRAVADA" right={`S/ ${fmt(opGravada)}`} />
              <TkLine left="IGV 18%" right={`S/ ${fmt(igv)}`} />
              <TkLine left="TOTAL S/" right={fmt(total)} bold />
              <TkLine left={metodolabel.toUpperCase()} right={`S/ ${fmt(montoRecibido)}`} />
              {cambio > 0 && <TkLine left="VUELTO" right={`S/ ${fmt(cambio)}`} />}

              <TkDash />

              {/* QR placeholder */}
              <div className="flex flex-col items-center gap-1 my-2">
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(31,47,87,0.07)' }}
                >
                  <QrCode size={32} style={{ color: 'rgba(31,47,87,0.3)' }} />
                </div>
                <p style={{ fontSize: 9, color: 'rgba(31,47,87,0.4)', textAlign: 'center' }}>
                  Representaci&oacute;n impresa del comprobante electr&oacute;nico
                </p>
              </div>

              <TkDash />

              <p
                className="text-center font-bold mt-1"
                style={{ fontSize: 11, color: '#1F2F57' }}
              >
                ¡Gracias por su compra!
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
