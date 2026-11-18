'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Check, X, ChevronDown } from 'lucide-react'
import { toast } from 'react-toastify'
import { getTrabajadorById, getTrabajadorRoles, toggleEstadoTrabajador, updateTrabajadorRoles } from '@/Connections/trabajadores'
import { getAllRoles } from '@/Connections/roles'
import { getTiendasByUser } from '@/Connections/tiendas'
import { getCajaByTienda } from '@/Connections/caja'
import SwitcherLoader from '@/components/Navigation/SwitcherLoader'

const ROLE_CARDS = [
  { nombre: 'Administrador', desc: 'Todo el sistema' },
  { nombre: 'Cajero',        desc: 'Vende en su caja' },
  { nombre: 'Almacenero',    desc: 'Stock y recepción' },
  { nombre: 'Encargado de tienda', desc: 'Personalizado' },
]

const ROLE_PERMISOS_SUMMARY = {
  Administrador: [
    { ok: true,  label: 'Acceso completo a todos los módulos' },
    { ok: true,  label: 'Configurar empresa, tiendas y planes' },
    { ok: true,  label: 'Ver reportes, costos y estadísticas' },
  ],
  Cajero: [
    { ok: true,  label: 'Vender, cobrar y emitir boletas' },
    { ok: true,  label: 'Abrir y cerrar su caja' },
    { ok: true,  label: 'Vender al crédito a clientes aprobados' },
    { ok: false, label: 'Descuentos, anular ventas, ver costos' },
  ],
  Almacenero: [
    { ok: true,  label: 'Ver y actualizar stock disponible' },
    { ok: true,  label: 'Recibir y registrar órdenes de compra' },
    { ok: false, label: 'Acceso al punto de venta' },
  ],
  'Encargado de tienda': [
    { ok: true,  label: 'Gestionar personal de su tienda' },
    { ok: true,  label: 'Ver reportes de ventas de su tienda' },
    { ok: false, label: 'Configuración global del sistema' },
  ],
}

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0"
      style={{ background: value ? '#198E7B' : 'rgba(31,47,87,0.2)' }}
    >
      <span
        className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
        style={{ transform: value ? 'translateX(1.375rem)' : 'translateX(0.125rem)' }}
      />
    </button>
  )
}

function getInitials(nombre) {
  if (!nombre) return '??'
  const parts = nombre.trim().split(' ')
  return (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? parts[0]?.[1] ?? '')
}

export default function PageEditarTrabajador() {
  const router = useRouter()
  const params = useSearchParams()
  const id = params.get('id')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [trabajador, setTrabajador] = useState(null)
  const [roles, setRoles] = useState([])
  const [tiendas, setTiendas] = useState([])
  const [cajasPorTienda, setCajasPorTienda] = useState({})

  const [accesoActivo, setAccesoActivo] = useState(true)
  const [rolSeleccionado, setRolSeleccionado] = useState(null)
  const [tiendasSeleccionadas, setTiendasSeleccionadas] = useState([])
  const [cajaAsignada, setCajaAsignada] = useState('')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    Promise.all([
      getTrabajadorById(id),
      getAllRoles(),
      getTiendasByUser(),
      getTrabajadorRoles(id),
    ]).then(([tRes, rRes, tiendasRes, rolesAsigRes]) => {
      const t = tRes.data
      const r = rRes.data?.data ?? rRes.data ?? []
      const ts = tiendasRes.data?.data ?? tiendasRes.data ?? []
      const ra = rolesAsigRes.data?.data ?? []

      setTrabajador(t)
      setRoles(r)
      setTiendas(Array.isArray(ts) ? ts : [])
      setAccesoActivo(t?.activo ?? true)

      if (ra.length > 0) {
        const rolId = ra[0]?.rol_id
        const rolObj = r.find(x => x.id === rolId)
        if (rolObj) setRolSeleccionado(rolObj)
        const tiendaIds = ra.map(x => x.tienda_id).filter(Boolean)
        setTiendasSeleccionadas(tiendaIds)
      } else if (r.length > 0) {
        setRolSeleccionado(r[0])
      }
    }).finally(() => setLoading(false))
  }, [id])

  const toggleTienda = useCallback((tiendaId) => {
    setTiendasSeleccionadas(prev =>
      prev.includes(tiendaId) ? prev.filter(x => x !== tiendaId) : [...prev, tiendaId]
    )
  }, [])

  useEffect(() => {
    const activaTiendas = tiendasSeleccionadas.filter(tid => !cajasPorTienda[tid])
    if (activaTiendas.length === 0) return
    activaTiendas.forEach(tiendaId => {
      getCajaByTienda(tiendaId).then(res => {
        const cajas = res.data?.data ?? res.data ?? []
        setCajasPorTienda(prev => ({ ...prev, [tiendaId]: Array.isArray(cajas) ? cajas : [] }))
      })
    })
  }, [tiendasSeleccionadas])

  const isCajero = rolSeleccionado?.nombre?.toLowerCase().includes('cajero')
  const todasLasCajas = tiendasSeleccionadas.flatMap(tid => cajasPorTienda[tid] ?? [])

  const handleGuardar = async () => {
    if (!rolSeleccionado) { toast.error('Selecciona un rol'); return }
    setSaving(true)
    try {
      const promises = []
      if (trabajador && trabajador.activo !== accesoActivo) {
        promises.push(toggleEstadoTrabajador(id, accesoActivo))
      }
      promises.push(updateTrabajadorRoles(id, {
        rol_id: rolSeleccionado.id,
        tienda_ids: tiendasSeleccionadas,
      }))
      const results = await Promise.all(promises)
      const hasError = results.some(r => r?.error)
      if (hasError) { toast.error('Error al guardar. Intenta de nuevo.'); return }
      toast.success('Cambios guardados exitosamente')
      router.push('/dashboard/trabajadores')
    } catch {
      toast.error('Error inesperado')
    } finally {
      setSaving(false)
    }
  }

  const permisosResumen = rolSeleccionado
    ? ROLE_PERMISOS_SUMMARY[rolSeleccionado.nombre] ?? []
    : []

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-[#E8EDF5]">
        <SwitcherLoader loading={true}><div /></SwitcherLoader>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#E8EDF5]">
      {/* contenido scrollable */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col gap-6">

          {/* Back */}
          <button
            onClick={() => router.push('/dashboard/trabajadores')}
            className="flex items-center gap-1.5 text-sm font-medium w-fit"
            style={{ color: '#3960A9' }}
          >
            <ArrowLeft size={15} />
            Empleados
          </button>

          {/* Header trabajador */}
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-bold shrink-0"
              style={{ background: '#1F2F57' }}
            >
              {getInitials(trabajador?.nombre_completo ?? '')}
            </div>
            <div className="flex-1">
              <p className="text-2xl font-bold" style={{ color: '#1F2F57' }}>
                {trabajador?.nombre_completo ?? '—'}
              </p>
              <p className="text-sm mt-0.5" style={{ color: 'rgba(31,47,87,0.5)' }}>
                {trabajador?.email ?? '—'}
                {trabajador?.telefono && <> · {trabajador.telefono}</>}
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <Toggle value={accesoActivo} onChange={setAccesoActivo} />
              <span className="text-sm font-semibold" style={{ color: '#1F2F57' }}>
                Acceso activo
              </span>
            </div>
          </div>

          {/* Sección 1: Rol */}
          <div
            className="bg-white rounded-2xl p-6 flex flex-col gap-5"
            style={{ border: '0.5px solid rgba(31,47,87,0.1)' }}
          >
            <div>
              <p className="text-base font-bold" style={{ color: '#1F2F57' }}>1. Rol</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(31,47,87,0.5)' }}>
                Define qué puede hacer. Los permisos de cada rol se ajustan en{' '}
                <button
                  onClick={() => router.push('/dashboard/trabajadores?tab=roles')}
                  className="underline"
                  style={{ color: '#3960A9' }}
                >
                  Roles y permisos
                </button>.
              </p>
            </div>

            {/* Radio cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {roles.map(rol => {
                const cardMeta = ROLE_CARDS.find(c => c.nombre.toLowerCase() === rol.nombre.toLowerCase())
                const selected = rolSeleccionado?.id === rol.id
                return (
                  <button
                    key={rol.id}
                    onClick={() => setRolSeleccionado(rol)}
                    className="flex flex-col gap-1.5 p-4 rounded-xl text-left transition-all"
                    style={{
                      border: selected ? '2px solid #1F2F57' : '1.5px solid rgba(31,47,87,0.15)',
                      background: selected ? 'rgba(31,47,87,0.03)' : '#fff',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                        style={{
                          borderColor: selected ? '#1F2F57' : 'rgba(31,47,87,0.3)',
                          background: selected ? '#1F2F57' : 'transparent',
                        }}
                      >
                        {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="text-sm font-bold" style={{ color: '#1F2F57' }}>
                        {rol.nombre}
                      </span>
                    </div>
                    <p className="text-xs pl-6" style={{ color: 'rgba(31,47,87,0.5)' }}>
                      {cardMeta?.desc ?? rol.descripcion ?? '—'}
                    </p>
                  </button>
                )
              })}
            </div>

            {/* Resumen de permisos del rol seleccionado */}
            {permisosResumen.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-1.5 pt-1">
                {permisosResumen.map((p, i) => (
                  <div key={i} className="flex items-start gap-2">
                    {p.ok
                      ? <Check size={13} className="mt-0.5 shrink-0" style={{ color: '#198E7B' }} />
                      : <X size={13} className="mt-0.5 shrink-0" style={{ color: '#EF4444' }} />
                    }
                    <span className="text-xs" style={{ color: 'rgba(31,47,87,0.65)' }}>{p.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sección 2: ¿Dónde trabaja? */}
          <div
            className="bg-white rounded-2xl p-6 flex flex-col gap-5"
            style={{ border: '0.5px solid rgba(31,47,87,0.1)' }}
          >
            <div>
              <p className="text-base font-bold" style={{ color: '#1F2F57' }}>2. ¿Dónde trabaja?</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(31,47,87,0.5)' }}>
                Solo verá datos de las tiendas que marques.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tiendas.map(tienda => {
                const checked = tiendasSeleccionadas.includes(tienda.id)
                return (
                  <button
                    key={tienda.id}
                    onClick={() => toggleTienda(tienda.id)}
                    className="flex items-center gap-3 p-4 rounded-xl text-left transition-all"
                    style={{
                      border: checked ? '1.5px solid #3960A9' : '1.5px solid rgba(31,47,87,0.15)',
                      background: '#fff',
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                      style={{
                        background: checked ? '#3960A9' : 'transparent',
                        border: checked ? 'none' : '1.5px solid rgba(31,47,87,0.3)',
                      }}
                    >
                      {checked && <Check size={12} color="white" strokeWidth={3} />}
                    </div>
                    <span className="text-sm font-medium" style={{ color: '#1F2F57' }}>
                      {tienda.nombre}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Caja asignada (solo Cajero + tienda seleccionada) */}
            {isCajero && tiendasSeleccionadas.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold" style={{ color: '#1F2F57' }}>
                  Caja asignada
                </p>
                <div className="relative w-full sm:w-80">
                  <select
                    value={cajaAsignada}
                    onChange={e => setCajaAsignada(e.target.value)}
                    className="w-full h-10 pl-3 pr-9 rounded-lg text-sm appearance-none"
                    style={{
                      border: '1.5px solid rgba(31,47,87,0.2)',
                      color: '#1F2F57',
                      background: '#fff',
                    }}
                  >
                    <option value="">Sin caja asignada</option>
                    {todasLasCajas.map(caja => (
                      <option key={caja.id} value={caja.id}>
                        {caja.nombre} ({caja.codigoCaja ?? `CAJ-${caja.id}`})
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: 'rgba(31,47,87,0.4)' }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom action bar */}
      <div
        className="fixed bottom-0 left-0 right-0 h-16 flex items-center justify-between px-8 bg-white z-30"
        style={{ borderTop: '1px solid rgba(31,47,87,0.1)' }}
      >
        <button
          onClick={() => router.push('/dashboard/trabajadores')}
          className="h-10 px-5 rounded-lg text-sm font-semibold transition-all"
          style={{ border: '1.5px solid rgba(31,47,87,0.2)', color: '#1F2F57' }}
        >
          Cancelar
        </button>
        <button
          onClick={handleGuardar}
          disabled={saving || !rolSeleccionado}
          className="h-10 px-6 rounded-lg text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: '#1F2F57' }}
        >
          {saving ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </div>
  )
}
