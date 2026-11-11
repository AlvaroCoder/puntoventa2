'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/Context/AuthContext'
import { Plus, Check } from 'lucide-react'
import ShoppingCartIcon  from '@mui/icons-material/ShoppingCart'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import InventoryIcon     from '@mui/icons-material/Inventory'
import ReceiptLongIcon   from '@mui/icons-material/ReceiptLong'
import BadgeIcon         from '@mui/icons-material/Badge'


const MODULES = [
  {
    id: 'inventario',
    title: 'Inventario',
    subtitle: 'Productos y stock',
    href: '/dashboard/inventario',
    Icon: InventoryIcon,
    bg: '#1F4363',
    badge: { label: '2 con stock bajo', color: 'orange' },
  },
  {
    id: 'ventas',
    title: 'Mi negocio',
    subtitle: 'Gestiona tu negocio y ventas',
    href: '/dashboard/ventas',
    Icon: ShoppingCartIcon,
    bg: '#FE811F',
    badge: { label: '2 cajas abiertas', color: 'teal' },
  },
  {
    id: 'logistica',
    title: 'Logística',
    subtitle: 'Órdenes de compra y entradas',
    href: '/dashboard/logistica',
    Icon: LocalShippingIcon,
    bg: '#1B8D7C',
    badge: { label: '1 orden por recibir', color: 'teal' },
  },
  {
    id: 'personal',
    title: 'Personal',
    subtitle: 'Gestión de empleados',
    href: '/dashboard/trabajadores',
    Icon: BadgeIcon,
    bg: '#1F4363',
    badge: null,
  },
  {
    id: 'sunat',
    title: 'SUNAT/NUBEFACT',
    subtitle: 'Facturación electrónica',
    href: '/dashboard/bd/clientes',
    Icon: ReceiptLongIcon,
    bg: '#1B8D7C',
    badge: { label: '1 rechazado', color: 'orange' },
  },
]

const STEPS = [
  {
    id: 1,
    title: 'Datos del negocio',
    desc: 'RUC, razón social y logo',
    done: true,
  },
  {
    id: 2,
    title: 'Tienda y caja',
    desc: 'Dónde vendes y con qué caja',
    done: true,
  },
  {
    id: 3,
    title: 'Registra tus productos',
    desc: 'Uno por uno o en lote desde Excel',
    active: true,
    href: '/dashboard/inventario/productos/create',
  },
  {
    id: 4,
    title: 'Abre tu caja',
    desc: 'Indica el efectivo inicial',
  },
  {
    id: 5,
    title: 'Haz tu primera venta',
    desc: 'Emite una boleta de prueba',
  },
]

const DAYS   = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado']
const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

function formatDate(d) {
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}  ·  ${hh}:${mm}`
}

export default function Page() {
  const router = useRouter()
  const { user } = useAuth()
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  const firstName     = user?.nombre_completo?.split(' ')[0] ?? 'Usuario'
  const roleLabel     = user?.esAdmin ? 'Administrador' : 'Empleado'
  const completedSteps = STEPS.filter(s => s.done).length

  return (
    <div className="p-6 max-w-5xl mx-auto flex flex-col gap-8">

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold" style={{ color: '#1F4363' }}>
            Bienvenido, {firstName}!
          </h1>
          <span className="bg-[#1B8D7C]/15 text-[#1B8D7C] text-xs font-semibold px-2.5 py-1 rounded-full">
            {roleLabel}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-xs font-medium hidden sm:block" style={{ color: 'rgba(31,67,99,0.45)' }}>
            {formatDate(now)}
          </p>
          <button
            onClick={() => router.push('/dashboard/ventas')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity flex-shrink-0"
            style={{ background: '#FE811F' }}
          >
            <Plus size={15} />
            Nueva venta
          </button>
        </div>
      </div>

      <div
        className="bg-white rounded-2xl p-6"
        style={{ border: '0.5px solid rgba(31,67,99,0.1)' }}
      >
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h2 className="text-base font-bold" style={{ color: '#1F4363' }}>
              Primeros pasos
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(31,67,99,0.5)' }}>
              Completa estos pasos y estarás listo para vender. Te toma unos minutos.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div
              className="w-28 h-1.5 rounded-full overflow-hidden"
              style={{ background: 'rgba(31,67,99,0.1)' }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(completedSteps / STEPS.length) * 100}%`,
                  background: '#1B8D7C',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
            <span className="text-sm font-semibold whitespace-nowrap" style={{ color: '#1F4363' }}>
              {completedSteps} de {STEPS.length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3">
          {STEPS.map(step => (
            <div
              key={step.id}
              className="rounded-xl p-4 flex flex-col gap-3"
              style={{
                border: step.active
                  ? '2px solid #1F4363'
                  : '1px solid rgba(31,67,99,0.12)',
              }}
            >
              {step.done ? (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: '#1B8D7C' }}
                >
                  <Check size={14} color="white" strokeWidth={3} />
                </div>
              ) : (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                  style={
                    step.active
                      ? { background: '#1F4363', color: '#fff' }
                      : { background: 'rgba(31,67,99,0.08)', color: 'rgba(31,67,99,0.35)' }
                  }
                >
                  {step.id}
                </div>
              )}

              <div className="flex flex-col gap-1 flex-1">
                <p className="text-sm font-bold leading-tight" style={{ color: '#1F4363' }}>
                  {step.title}
                </p>
                <p className="text-xs" style={{ color: 'rgba(31,67,99,0.5)' }}>
                  {step.desc}
                </p>
              </div>

              {step.active && (
                <button
                  onClick={() => step.href && router.push(step.href)}
                  className="w-full py-2 rounded-lg text-sm font-bold text-white hover:opacity-90 transition-opacity"
                  style={{ background: '#1F4363' }}
                >
                  Empezar
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-base font-bold" style={{ color: '#1F4363' }}>Módulos</h2>
        <div className="grid grid-cols-5 gap-4">
          {MODULES.map(mod => (
            <button
              key={mod.id}
              onClick={() => router.push(mod.href)}
              className="flex flex-col items-center gap-3 hover:scale-105 transition-transform active:scale-95"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: mod.bg }}
              >
                <mod.Icon sx={{ fontSize: 28, color: '#fff' }} />
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-sm font-bold text-center leading-tight" style={{ color: '#1F4363' }}>
                  {mod.title}
                </p>
                <p className="text-xs text-center" style={{ color: 'rgba(31,67,99,0.5)' }}>
                  {mod.subtitle}
                </p>
                {mod.badge && (
                  <span
                    className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full mt-0.5"
                    style={
                      mod.badge.color === 'orange'
                        ? { background: '#FFF1E6', color: '#D97706' }
                        : { background: '#E8F5F3', color: '#1B8D7C' }
                    }
                  >
                    {mod.badge.label}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}
