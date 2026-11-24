'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import { QrCode, Copy, Trash2, Clock, Store, Shield, RefreshCw, AlertCircle } from 'lucide-react'
import CustomSelect from '@/shared/components/Selectables/CustomSelect'
import useTienda from '@/modules/inventary/hooks/useTienda'
import { getAllRoles } from '@/Connections/roles'
import { trabajadorService } from '@/modules/trabajador/service/trabajador.service'

const C = { navy: '#1F2F57', teal: '#198E7B', texto: 'rgba(31,47,87,0.5)', bg: '#E1E7F0' }

const VIGENCIA_OPTIONS = [
  { id: 1,   nombre: '1 hora' },
  { id: 4,   nombre: '4 horas' },
  { id: 8,   nombre: '8 horas' },
  { id: 24,  nombre: '1 día (24 h)' },
  { id: 72,  nombre: '3 días' },
  { id: 168, nombre: '1 semana' },
]

function qrImageUrl(texto, size = 220) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(texto)}&bgcolor=ffffff&color=1F2F57&qzone=2`
}

function formatExpiry(expiraEn) {
  if (!expiraEn) return '—'
  const d = new Date(expiraEn)
  return d.toLocaleString('es-PE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })
}

function timeLeft(expiraEn) {
  if (!expiraEn) return null
  const diff = new Date(expiraEn) - Date.now()
  if (diff <= 0) return 'Expirado'
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  return h > 0 ? `${h}h ${m}m restantes` : `${m}m restantes`
}

// ─── QR Display ───────────────────────────────────────────────────────────────
function QRDisplay({ codigo, onCopyCodigo, onCopyLink }) {
  if (!codigo) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-full py-16">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(31,47,87,0.07)' }}>
          <QrCode size={28} style={{ color: C.texto }} />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold" style={{ color: C.navy }}>Genera un código QR</p>
          <p className="text-xs mt-1" style={{ color: C.texto }}>Configura el rol y tienda, luego presiona Generar</p>
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center gap-5 py-4">
      {/* QR image */}
      <div className="p-4 rounded-2xl" style={{ background: '#fff', border: '1px solid rgba(31,47,87,0.1)' }}>
        <img
          src={qrImageUrl(codigo.qr_texto)}
          alt="QR de invitación"
          width={220}
          height={220}
          className="rounded-lg"
        />
      </div>

      {/* Código texto */}
      <div className="flex flex-col items-center gap-1 w-full">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: C.texto }}>Código</p>
        <div
          className="flex items-center gap-3 px-5 py-3 rounded-xl w-full justify-between"
          style={{ background: 'rgba(31,47,87,0.04)', border: '1px dashed rgba(31,47,87,0.2)' }}
        >
          <span className="text-xl font-extrabold font-mono tracking-widest" style={{ color: C.navy }}>
            {codigo.codigo}
          </span>
          <button
            onClick={() => onCopyCodigo(codigo.codigo)}
            className="p-2 rounded-lg transition-all hover:bg-white"
            title="Copiar código"
          >
            <Copy size={16} style={{ color: C.teal }} />
          </button>
        </div>
      </div>

      {/* Meta info */}
      <div className="flex flex-col gap-2 w-full">
        {[
          { icon: Shield, label: 'Rol',    value: codigo.rol?.nombre   ?? '—' },
          { icon: Store,  label: 'Tienda', value: codigo.tienda?.nombre ?? '—' },
          { icon: Clock,  label: 'Expira', value: formatExpiry(codigo.expira_en) },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center justify-between px-4 py-2.5 rounded-xl" style={{ background: 'rgba(31,47,87,0.04)' }}>
            <div className="flex items-center gap-2">
              <Icon size={14} style={{ color: C.texto }} />
              <span className="text-xs" style={{ color: C.texto }}>{label}</span>
            </div>
            <span className="text-xs font-bold" style={{ color: C.navy }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Time left */}
      {codigo.expira_en && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl w-full" style={{ background: 'rgba(25,142,123,0.08)', border: '1px solid rgba(25,142,123,0.2)' }}>
          <Clock size={13} style={{ color: C.teal }} />
          <span className="text-xs font-semibold" style={{ color: C.teal }}>{timeLeft(codigo.expira_en)}</span>
        </div>
      )}

      {/* Copy link */}
      <button
        onClick={() => onCopyLink(codigo.qr_texto)}
        className="w-full text-xs font-semibold py-2.5 rounded-xl transition-all hover:opacity-80 active:scale-95"
        style={{ background: C.teal, color: '#fff' }}
      >
        Copiar enlace de invitación
      </button>
    </div>
  )
}

// ─── Codes list ───────────────────────────────────────────────────────────────
function CodigoRow({ item, onDesactivar }) {
  const [confirmando, setConfirmando] = useState(false)
  const tiempo = timeLeft(item.expira_en)

  return (
    <div
      className="flex items-center justify-between gap-4 px-5 py-4 rounded-xl"
      style={{ border: '0.5px solid rgba(31,47,87,0.1)', background: '#fff' }}
    >
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm font-extrabold font-mono tracking-widest" style={{ color: C.navy }}>{item.codigo}</span>
        <div className="flex items-center gap-2 flex-wrap mt-0.5">
          <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(57,96,169,0.1)', color: '#3960A9' }}>
            {item.rol?.nombre ?? '—'}
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(31,47,87,0.07)', color: C.texto }}>
            {item.tienda?.nombre ?? '—'}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-xs font-semibold" style={{ color: C.teal }}>{tiempo}</span>
        <span className="text-[11px]" style={{ color: C.texto }}>
          {item.solicitudes?.pendientes ?? 0} pendientes
        </span>
      </div>

      <div className="shrink-0">
        {confirmando ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => { onDesactivar(item.id); setConfirmando(false) }}
              className="text-[11px] font-bold px-3 py-1.5 rounded-lg"
              style={{ background: '#EF4444', color: '#fff' }}
            >
              Sí, desactivar
            </button>
            <button onClick={() => setConfirmando(false)} className="text-[11px] font-semibold px-2 py-1.5 rounded-lg" style={{ color: C.texto }}>
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmando(true)}
            className="p-2 rounded-lg transition-all hover:bg-red-50"
            title="Desactivar código"
          >
            <Trash2 size={15} style={{ color: '#EF4444' }} />
          </button>
        )}
      </div>
    </div>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function PageInvitar() {
  const { tiendas } = useTienda()
  const [roles,   setRoles]   = useState([])
  const [form,    setForm]    = useState({ rol_id: '', tienda_id: '', vigencia_horas: 24 })
  const [generating,    setGenerating]    = useState(false)
  const [codigoGenerado, setCodigoGenerado] = useState(null)
  const [codigosActivos, setCodigosActivos] = useState([])
  const [loadingLista,   setLoadingLista]   = useState(true)

  // Cargar roles
  useEffect(() => {
    getAllRoles()
      .then(res => setRoles(Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : []))
      .catch(() => setRoles([]))
  }, [])

  // Cargar códigos vigentes
  const cargarCodigos = useCallback(async () => {
    setLoadingLista(true)
    try {
      const lista = await trabajadorService.getCodigosVigentes()
      setCodigosActivos(lista)
    } catch {
      setCodigosActivos([])
    } finally {
      setLoadingLista(false)
    }
  }, [])

  useEffect(() => { cargarCodigos() }, [cargarCodigos])

  // Generar QR
  const handleGenerar = async () => {
    if (!form.rol_id)    return toast.warning('Selecciona un rol')
    if (!form.tienda_id) return toast.warning('Selecciona una tienda')
    setGenerating(true)
    try {
      const res = await trabajadorService.crearCodigoInvitacion({
        rol_id:          Number(form.rol_id),
        tienda_id:       Number(form.tienda_id),
        vigencia_horas:  Number(form.vigencia_horas),
      })
      if (res.ok && res.data) {
        setCodigoGenerado(res.data)
        toast.success('Código QR generado')
        cargarCodigos()
      } else {
        toast.error(res.message || 'Error al generar el código')
      }
    } catch {
      toast.error('Error inesperado')
    } finally {
      setGenerating(false)
    }
  }

  // Desactivar código
  const handleDesactivar = async (id) => {
    const res = await trabajadorService.desactivarCodigo(id)
    if (res.ok) {
      toast.success('Código desactivado')
      cargarCodigos()
      if (codigoGenerado?.id === id) setCodigoGenerado(null)
    } else {
      toast.error('No se pudo desactivar')
    }
  }

  // Copiar al portapapeles
  const copiar = (texto, label = 'Copiado') => {
    navigator.clipboard.writeText(texto).then(() => toast.success(label))
  }

  return (
    <div className="p-6 flex flex-col gap-5 min-h-screen" style={{ background: C.bg }}>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold" style={{ color: C.navy }}>Invitar empleados</h1>
        <p className="text-xs mt-0.5" style={{ color: C.texto }}>
          Genera un código QR o enlace para que tu equipo se una a la tienda.
        </p>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* ── Panel izquierdo: Configurar ────────────────────────────────── */}
        <div className="bg-white rounded-2xl flex flex-col" style={{ border: '0.5px solid rgba(31,47,87,0.1)' }}>
          <div className="px-6 pt-5 pb-4" style={{ borderBottom: '0.5px solid rgba(31,47,87,0.07)' }}>
            <p className="text-base font-bold" style={{ color: C.navy }}>Configurar invitación</p>
            <p className="text-xs mt-0.5" style={{ color: C.texto }}>Define el rol y la tienda del nuevo empleado</p>
          </div>

          <div className="flex flex-col gap-5 px-6 py-5">

            {/* Tienda */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold" style={{ color: C.navy }}>
                Tienda <span className="text-red-500">*</span>
              </label>
              <CustomSelect
                value={form.tienda_id}
                onChange={v => setForm(p => ({ ...p, tienda_id: v }))}
                options={tiendas}
                labelKey="nombre"
                valueKey="id"
                placeholder="Selecciona una tienda"
              />
            </div>

            {/* Rol */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold" style={{ color: C.navy }}>
                Rol a asignar <span className="text-red-500">*</span>
              </label>
              <CustomSelect
                value={form.rol_id}
                onChange={v => setForm(p => ({ ...p, rol_id: v }))}
                options={roles}
                labelKey="nombre"
                valueKey="id"
                placeholder="Selecciona un rol"
              />
            </div>

            {/* Vigencia */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold" style={{ color: C.navy }}>Vigencia del código</label>
              <CustomSelect
                value={form.vigencia_horas}
                onChange={v => setForm(p => ({ ...p, vigencia_horas: v }))}
                options={VIGENCIA_OPTIONS}
                labelKey="nombre"
                valueKey="id"
                placeholder="24 horas"
              />
            </div>

            {/* Info */}
            <div
              className="flex items-start gap-3 px-4 py-3 rounded-xl text-xs"
              style={{ background: 'rgba(31,47,87,0.04)', border: '1px solid rgba(31,47,87,0.1)' }}
            >
              <AlertCircle size={14} className="shrink-0 mt-0.5" style={{ color: C.texto }} />
              <p style={{ color: C.texto }}>
                El empleado escaneará el QR o ingresará el código al crear su cuenta.
                Podrás ver y aprobar la solicitud desde la lista de trabajadores.
              </p>
            </div>

            {/* Generar */}
            <button
              onClick={handleGenerar}
              disabled={generating || !form.rol_id || !form.tienda_id}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: C.teal }}
            >
              {generating ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <QrCode size={16} />
              )}
              {generating ? 'Generando...' : 'Generar código QR'}
            </button>

          </div>
        </div>

        {/* ── Panel derecho: QR Display ──────────────────────────────────── */}
        <div className="bg-white rounded-2xl flex flex-col" style={{ border: '0.5px solid rgba(31,47,87,0.1)' }}>
          <div className="px-6 pt-5 pb-4" style={{ borderBottom: '0.5px solid rgba(31,47,87,0.07)' }}>
            <p className="text-base font-bold" style={{ color: C.navy }}>Código de invitación</p>
            <p className="text-xs mt-0.5" style={{ color: C.texto }}>Comparte el QR o el código con el nuevo empleado</p>
          </div>
          <div className="flex-1 px-6 pb-6">
            <QRDisplay
              codigo={codigoGenerado}
              onCopyCodigo={(c) => copiar(c, '¡Código copiado!')}
              onCopyLink={(l) => copiar(l, '¡Enlace copiado!')}
            />
          </div>
        </div>

      </div>

      {/* ── Lista de códigos vigentes ──────────────────────────────────────── */}
      <div className="bg-white rounded-2xl" style={{ border: '0.5px solid rgba(31,47,87,0.1)' }}>
        <div
          className="flex items-center justify-between px-6 pt-5 pb-4"
          style={{ borderBottom: '0.5px solid rgba(31,47,87,0.07)' }}
        >
          <div>
            <p className="text-base font-bold" style={{ color: C.navy }}>Códigos activos</p>
            <p className="text-xs mt-0.5" style={{ color: C.texto }}>
              {codigosActivos.length} código{codigosActivos.length !== 1 ? 's' : ''} vigente{codigosActivos.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={cargarCodigos}
            className="p-2 rounded-lg transition-all hover:bg-gray-50"
            title="Actualizar lista"
          >
            <RefreshCw size={15} style={{ color: C.texto }} />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-3">
          {loadingLista ? (
            <div className="flex flex-col gap-2">
              {[1, 2].map(i => (
                <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: 'rgba(31,47,87,0.07)' }} />
              ))}
            </div>
          ) : codigosActivos.length === 0 ? (
            <div className="flex items-center justify-center py-10">
              <p className="text-xs" style={{ color: C.texto }}>No hay códigos vigentes. Genera uno arriba.</p>
            </div>
          ) : (
            codigosActivos.map(item => (
              <CodigoRow key={item.id} item={item} onDesactivar={handleDesactivar} />
            ))
          )}
        </div>
      </div>

    </div>
  )
}
