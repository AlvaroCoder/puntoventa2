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
import { Title } from '@/shared/components/Title'
import Title2 from '@/shared/components/Title2'


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
    title: 'NUBEFACT',
    subtitle: 'Facturación electrónica',
    href: '/dashboard/bd/clientes',
    Icon: ReceiptLongIcon,
    bg: '#1B8D7C',
    badge: { label: '1 rechazado', color: 'orange' },
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
  const { user } = useAuth();
  console.log("User : ", user)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  const firstName = user?.email.split('@')[0]
  
  const roleLabel     = user?.esAdmin ? 'Administrador' : 'Empleado'

  return (
    <div className="p-6 max-w-5xl mx-auto flex flex-col gap-8">
      <div className="flex items-center justify-between mt-10 gap-4">
        <div className="flex items-center gap-3">
          <Title>Bienvenido, {firstName}!</Title>
          <span className="bg-[#1B8D7C]/15 text-[#1B8D7C] text-xs font-semibold px-2.5 py-1 rounded-full">
            {roleLabel}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <p
            className="text-xs font-medium hidden sm:block"
            style={{ color: "rgba(31,67,99,0.45)" }}
          >
            {formatDate(now)}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-base font-bold text-azulMarino" >
          Tus módulos
        </h2>
        <div className="grid grid-cols-5 gap-4">
          {MODULES.map((mod) => (
            <button
              key={mod.id}
              onClick={() => router.push(mod.href)}
              className="flex flex-col items-center gap-3 hover:scale-105 transition-transform active:scale-95 bg-white shadow-sm px-4 py-6 rounded-md"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: mod.bg }}
              >
                <mod.Icon sx={{ fontSize: 28, color: "#fff" }} />
              </div>
              <div className="flex flex-col items-center gap-1">
                <Title2 className='text-lg'>{mod.title}</Title2>
                <p
                  className="text-xs text-center"
                  style={{ color: "rgba(31,67,99,0.5)" }}
                >
                  {mod.subtitle}
                </p>
                {mod.badge && (
                  <span
                    className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full mt-0.5"
                    style={
                      mod.badge.color === "orange"
                        ? { background: "#FFF1E6", color: "#D97706" }
                        : { background: "#E8F5F3", color: "#1B8D7C" }
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
  );
}
