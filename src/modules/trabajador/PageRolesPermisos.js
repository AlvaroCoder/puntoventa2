'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Shield, ShoppingCart, Package, Store, ChevronRight, Users } from 'lucide-react'
import { toast } from 'react-toastify'
import { getAllRoles, createRol, updateRol } from '@/Connections/roles'
import { getTrabajadoresByEmpresa } from '@/Connections/trabajadores'
import { useAuth } from '@/Context/AuthContext'

const PERMISSION_SECTIONS = [
  {
    title: 'Punto de venta',
    key: 'punto_de_venta',
    items: [
      { key: 'vender_cobrar',      label: 'Vender y cobrar',                  desc: null },
      { key: 'abrir_cerrar_caja',  label: 'Abrir y cerrar su caja',           desc: null },
      { key: 'ver_esperado_cierre',label: 'Ver lo esperado al cerrar caja',   desc: 'Apagado = conteo a ciegas' },
      { key: 'aplicar_descuentos', label: 'Aplicar descuentos',               desc: 'Apagado = debe pedir autorización' },
      { key: 'anular_ventas',      label: 'Anular ventas',                    desc: null },
      { key: 'vender_credito',     label: 'Vender al crédito',                desc: 'Solo a clientes con línea de crédito aprobada' },
      { key: 'registrar_clientes', label: 'Registrar clientes nuevos',        desc: null },
    ],
  },
  {
    title: 'Inventario',
    key: 'inventario',
    items: [
      { key: 'ver_stock',              label: 'Ver stock disponible',         desc: null },
      { key: 'ver_costos',             label: 'Ver costos',                   desc: null },
      { key: 'crear_editar_productos', label: 'Crear y editar productos',     desc: null },
      { key: 'ingresar_stock',         label: 'Ingresar stock',               desc: null },
    ],
  },
  {
    title: 'Otros módulos',
    key: 'otros',
    items: [
      { key: 'logistica',         label: 'Logística',                    desc: null },
      { key: 'asignar_credito',   label: 'Asignar crédito a clientes',   desc: null },
      { key: 'reportes_ventas',   label: 'Reportes de ventas',           desc: null },
      { key: 'sunat',             label: 'SUNAT/Nubefact',               desc: null },
    ],
  },
]

const PLANTILLAS = {
  Administrador: {
    vista_inicio: 'menu',
    punto_de_venta: { vender_cobrar: true, abrir_cerrar_caja: true, ver_esperado_cierre: true, aplicar_descuentos: true, anular_ventas: true, vender_credito: true, registrar_clientes: true },
    inventario:    { ver_stock: true, ver_costos: true, crear_editar_productos: true, ingresar_stock: true },
    otros:         { logistica: true, asignar_credito: true, reportes_ventas: true, sunat: true },
  },
  Cajero: {
    vista_inicio: 'caja',
    punto_de_venta: { vender_cobrar: true, abrir_cerrar_caja: true, ver_esperado_cierre: false, aplicar_descuentos: false, anular_ventas: false, vender_credito: true, registrar_clientes: true },
    inventario:    { ver_stock: true, ver_costos: false, crear_editar_productos: false, ingresar_stock: false },
    otros:         { logistica: false, asignar_credito: false, reportes_ventas: false, sunat: false },
  },
  Almacenero: {
    vista_inicio: 'menu',
    punto_de_venta: { vender_cobrar: false, abrir_cerrar_caja: false, ver_esperado_cierre: false, aplicar_descuentos: false, anular_ventas: false, vender_credito: false, registrar_clientes: false },
    inventario:    { ver_stock: true, ver_costos: false, crear_editar_productos: true, ingresar_stock: true },
    otros:         { logistica: true, asignar_credito: false, reportes_ventas: false, sunat: false },
  },
  'Encargado de tienda': {
    vista_inicio: 'menu',
    punto_de_venta: { vender_cobrar: true, abrir_cerrar_caja: true, ver_esperado_cierre: true, aplicar_descuentos: true, anular_ventas: true, vender_credito: true, registrar_clientes: true },
    inventario:    { ver_stock: true, ver_costos: true, crear_editar_productos: false, ingresar_stock: true },
    otros:         { logistica: false, asignar_credito: true, reportes_ventas: true, sunat: false },
  },
}

const DEFAULT_PERMISOS = {
  vista_inicio: 'menu',
  punto_de_venta: { vender_cobrar: false, abrir_cerrar_caja: false, ver_esperado_cierre: false, aplicar_descuentos: false, anular_ventas: false, vender_credito: false, registrar_clientes: false },
  inventario:    { ver_stock: false, ver_costos: false, crear_editar_productos: false, ingresar_stock: false },
  otros:         { logistica: false, asignar_credito: false, reportes_ventas: false, sunat: false },
}

const ROL_ICONS = { Administrador: Shield, Cajero: ShoppingCart, Almacenero: Package, 'Encargado de tienda': Store }
const ROL_COLORS = {
  Administrador:       { dot: '#198E7B', bg: 'rgba(25,142,123,0.1)' },
  Cajero:              { dot: '#3960A9', bg: 'rgba(57,96,169,0.1)' },
  Almacenero:          { dot: '#E8A020', bg: 'rgba(232,160,32,0.1)' },
  'Encargado de tienda': { dot: '#9B59B6', bg: 'rgba(155,89,182,0.1)' },
}

function getPermisos(rol) {
  try {
    if (rol?.descripcion && rol.descripcion.startsWith('{')) {
      return JSON.parse(rol.descripcion)
    }
  } catch {}
  return PLANTILLAS[rol?.nombre] ?? DEFAULT_PERMISOS
}

function countEnabled(section, permisos) {
  return section.items.filter(item => permisos[section.key]?.[item.key]).length
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

export default function PageRolesPermisos() {
  const router = useRouter()
  const { user } = useAuth()

  const [roles, setRoles] = useState([])
  const [personasPorRol, setPersonasPorRol] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [rolSelIdx, setRolSelIdx] = useState(0)
  const [permisos, setPermisos] = useState(DEFAULT_PERMISOS)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    setLoading(true)
    const promesas = [getAllRoles()]
    if (user?.empresa_id) promesas.push(getTrabajadoresByEmpresa(user.empresa_id))

    Promise.all(promesas).then(([rRes, tRes]) => {
      const r = rRes.data?.data ?? rRes.data ?? []
      setRoles(Array.isArray(r) ? r : [])

      if (tRes) {
        const ts = tRes.data?.data ?? tRes.data ?? []
        const counts = {}
        ts.forEach(t => { counts[t.rol_id] = (counts[t.rol_id] ?? 0) + 1 })
        setPersonasPorRol(counts)
      }

      if (r.length > 0) setPermisos(getPermisos(r[0]))
    }).finally(() => setLoading(false))
  }, [user?.empresa_id])

  const rolActual = roles[rolSelIdx]

  const handleSelectRol = (idx) => {
    setRolSelIdx(idx)
    setPermisos(getPermisos(roles[idx]))
    setDirty(false)
  }

  const togglePermiso = useCallback((seccion, key) => {
    setPermisos(prev => ({
      ...prev,
      [seccion]: { ...prev[seccion], [key]: !prev[seccion]?.[key] },
    }))
    setDirty(true)
  }, [])

  const setVista = useCallback((vista) => {
    setPermisos(prev => ({ ...prev, vista_inicio: vista }))
    setDirty(true)
  }, [])

  const handleRestaurar = () => {
    if (!rolActual) return
    const plantilla = PLANTILLAS[rolActual.nombre] ?? DEFAULT_PERMISOS
    setPermisos(plantilla)
    setDirty(true)
  }

  const handleGuardar = async () => {
    if (!rolActual) return
    setSaving(true)
    try {
      const res = await updateRol(rolActual.id, {
        nombre: rolActual.nombre,
        descripcion: JSON.stringify(permisos),
      })
      if (res.error) { toast.error(res.message || 'Error al guardar'); return }
      toast.success('Cambios guardados')
      setRoles(prev => prev.map((r, i) => i === rolSelIdx ? { ...r, descripcion: JSON.stringify(permisos) } : r))
      setDirty(false)
    } catch {
      toast.error('Error inesperado')
    } finally {
      setSaving(false)
    }
  }

  const handleCrearRol = async () => {
    const nombre = prompt('Nombre del nuevo rol:')
    if (!nombre?.trim()) return
    const res = await createRol({ nombre: nombre.trim(), descripcion: JSON.stringify(DEFAULT_PERMISOS), nivel_permiso: 1 })
    if (res.error) { toast.error(res.message || 'Error al crear rol'); return }
    const nuevo = res.data
    setRoles(prev => [...prev, nuevo])
    setRolSelIdx(roles.length)
    setPermisos(DEFAULT_PERMISOS)
    setDirty(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#3960A9', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#E8EDF5]">
      <div className="flex-1 overflow-y-auto pb-16">
        <div className="max-w-5xl mx-auto px-6 py-6 flex gap-5">

          {/* Panel izquierdo — lista de roles */}
          <div
            className="w-56 shrink-0 bg-white rounded-2xl p-4 flex flex-col gap-1 self-start"
            style={{ border: '0.5px solid rgba(31,47,87,0.1)' }}
          >
            <p className="text-xs font-bold px-2 pb-2" style={{ color: 'rgba(31,47,87,0.4)' }}>Roles</p>
            {roles.map((rol, idx) => {
              const color = ROL_COLORS[rol.nombre] ?? { dot: '#8D99AE', bg: 'rgba(31,47,87,0.07)' }
              const personas = personasPorRol[rol.id] ?? 0
              const plantillaExiste = !!PLANTILLAS[rol.nombre]
              const esSel = idx === rolSelIdx
              return (
                <button
                  key={rol.id}
                  onClick={() => handleSelectRol(idx)}
                  className="w-full flex items-start gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all"
                  style={{ background: esSel ? '#1F2F57' : 'transparent' }}
                >
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                    style={{ background: esSel ? '#fff' : color.dot }}
                  />
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: esSel ? '#fff' : '#1F2F57' }}
                    >
                      {rol.nombre}
                    </p>
                    <p
                      className="text-[11px]"
                      style={{ color: esSel ? 'rgba(255,255,255,0.6)' : 'rgba(31,47,87,0.45)' }}
                    >
                      {personas} {personas === 1 ? 'persona' : 'personas'} · {plantillaExiste ? 'plantilla' : 'personalizado'}
                    </p>
                  </div>
                </button>
              )
            })}

            <div style={{ borderTop: '1px dashed rgba(31,47,87,0.1)', marginTop: 4, paddingTop: 8 }}>
              <button
                onClick={handleCrearRol}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-blue-50/40"
                style={{ color: '#3960A9' }}
              >
                <Plus size={14} />
                Crear rol
              </button>
            </div>

            <p className="text-[11px] px-2 pt-1 leading-relaxed" style={{ color: 'rgba(31,47,87,0.4)' }}>
              Las plantillas vienen listas. Puedes ajustarlas o crear un rol desde una de ellas.
            </p>
          </div>

          {/* Panel derecho — permisos del rol seleccionado */}
          {rolActual ? (
            <div className="flex-1 flex flex-col gap-4">
              {/* Header del rol */}
              <div
                className="bg-white rounded-2xl px-6 py-5 flex items-start justify-between"
                style={{ border: '0.5px solid rgba(31,47,87,0.1)' }}
              >
                <div>
                  <p className="text-2xl font-bold" style={{ color: '#1F2F57' }}>{rolActual.nombre}</p>
                  <p className="text-sm mt-0.5" style={{ color: 'rgba(31,47,87,0.5)' }}>
                    {PLANTILLAS[rolActual.nombre]
                      ? (rolActual.nombre === 'Cajero' ? 'Vende y cobra en la caja que tiene asignada.' :
                         rolActual.nombre === 'Administrador' ? 'Acceso total al sistema.' :
                         rolActual.nombre === 'Almacenero' ? 'Gestiona el inventario y recibe órdenes de compra.' :
                         'Gestiona su tienda y el personal asignado.')
                      : (rolActual.descripcion?.startsWith('{') ? 'Rol personalizado.' : rolActual.descripcion ?? 'Sin descripción.')}
                  </p>
                </div>
                <button
                  onClick={() => router.push('/dashboard/trabajadores')}
                  className="flex items-center gap-1 text-xs font-semibold shrink-0 mt-1"
                  style={{ color: '#3960A9' }}
                >
                  <Users size={13} />
                  Ver personas con este rol ({personasPorRol[rolActual.id] ?? 0})
                  <ChevronRight size={13} />
                </button>
              </div>

              {/* Vista al iniciar sesión */}
              <div
                className="bg-white rounded-2xl px-6 py-5 flex flex-col gap-4"
                style={{ border: '0.5px solid rgba(31,47,87,0.1)' }}
              >
                <p className="text-sm font-bold" style={{ color: '#1F2F57' }}>¿Qué ve al iniciar sesión?</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { val: 'caja', label: 'Directo a su caja', desc: 'Pantalla simple de venta, sin menú de módulos' },
                    { val: 'menu', label: 'Menú principal',    desc: 'Ve solo los módulos que tenga permitidos' },
                  ].map(opt => {
                    const sel = permisos.vista_inicio === opt.val
                    return (
                      <button
                        key={opt.val}
                        onClick={() => setVista(opt.val)}
                        className="flex flex-col gap-1 p-4 rounded-xl text-left transition-all"
                        style={{
                          border: sel ? '2px solid #1F2F57' : '1.5px solid rgba(31,47,87,0.15)',
                          background: sel ? 'rgba(31,47,87,0.02)' : '#fff',
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                            style={{ borderColor: sel ? '#1F2F57' : 'rgba(31,47,87,0.3)', background: sel ? '#1F2F57' : 'transparent' }}
                          >
                            {sel && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <span className="text-sm font-bold" style={{ color: '#1F2F57' }}>{opt.label}</span>
                        </div>
                        <p className="text-xs pl-6" style={{ color: 'rgba(31,47,87,0.5)' }}>{opt.desc}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Secciones de permisos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PERMISSION_SECTIONS.map((section, si) => {
                  const enabled = countEnabled(section, permisos)
                  const isLarge = si === 0
                  return (
                    <div
                      key={section.key}
                      className={`bg-white rounded-2xl px-6 py-5 flex flex-col gap-3 ${isLarge ? 'sm:col-span-2' : ''}`}
                      style={{ border: '0.5px solid rgba(31,47,87,0.1)' }}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold" style={{ color: '#1F2F57' }}>{section.title}</p>
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(31,47,87,0.07)', color: 'rgba(31,47,87,0.5)' }}
                        >
                          {enabled} de {section.items.length}
                        </span>
                      </div>
                      {section.items.map(item => (
                        <div key={item.key} className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm" style={{ color: '#1F2F57' }}>{item.label}</p>
                            {item.desc && (
                              <p className="text-xs" style={{ color: 'rgba(31,47,87,0.45)' }}>{item.desc}</p>
                            )}
                          </div>
                          <Toggle
                            value={permisos[section.key]?.[item.key] ?? false}
                            onChange={() => togglePermiso(section.key, item.key)}
                          />
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm" style={{ color: 'rgba(31,47,87,0.4)' }}>Selecciona un rol</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer fijo */}
      {dirty && (
        <div
          className="fixed bottom-0 left-0 right-0 h-16 flex items-center justify-between px-8 bg-white z-30"
          style={{ borderTop: '1px solid rgba(31,47,87,0.1)' }}
        >
          <p className="text-xs" style={{ color: 'rgba(31,47,87,0.5)' }}>
            Los cambios se aplican la próxima vez que la persona inicie sesión.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleRestaurar}
              className="h-9 px-4 rounded-lg text-sm font-semibold transition-all"
              style={{ border: '1.5px solid rgba(31,47,87,0.2)', color: '#1F2F57' }}
            >
              Restablecer plantilla
            </button>
            <button
              onClick={handleGuardar}
              disabled={saving}
              className="h-9 px-5 rounded-lg text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: '#1F2F57' }}
            >
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
