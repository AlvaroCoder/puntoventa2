'use client'
import React, { useState, useEffect } from 'react'
import LinkButtonCard from '@/shared/components/LinkButtonCard'
import { useAuth } from '@/Context/AuthContext'
import ShoppingCartIcon  from '@mui/icons-material/ShoppingCart'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import InventoryIcon from '@mui/icons-material/Inventory'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import BadgeIcon from '@mui/icons-material/Badge'

const MODULES = [
  {
    id: "inventario",
    title: "Inventario",
    subtitle: "Productos y stock",
    href: "/dashboard/inventario",
    Icon: InventoryIcon,
    bg: "#1F4363",
    hover: "#1a3557",
  },
  {
    id: "ventas",
    title: "Punto de Venta",
    subtitle: "Gestiona tu Punto de venta",
    href: "/dashboard/ventas",
    Icon: ShoppingCartIcon,
    bg: "#FE811F",
    hover: "#e5731a",
  },
  {
    id: "logistica",
    title: "Logística",
    subtitle: "Ordenes de compra y entradas",
    href: "/dashboard/logistica",
    Icon: LocalShippingIcon,
    bg: "#1B8D7C",
    hover: "#167567",
  },
  {
    id: "personal",
    title: "Personal",
    subtitle: "Gestión de empleados",
    href: "/dashboard/trabajadores",
    Icon: BadgeIcon,
    bg: "#1F4363",
    hover: "#1a3557",
  },
  {
    id: "sunat",
    title: "SUNAT/NUBEFACT",
    subtitle: "Facturación electrónica",
    href: "/dashboard/bd/clientes",
    Icon: ReceiptLongIcon,
    bg: "#1B8D7C",
    hover: "#167567",
  },
];

const DAYS   = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado']
const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
function formatDate(d) {
    const hh = String(d.getHours()).padStart(2,'0')
    const mm = String(d.getMinutes()).padStart(2,'0')
    return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}  ·  ${hh}:${mm}`
}


export default function Page() {
    const { user }  = useAuth()
        const [now, setNow] = useState(new Date())
    
        useEffect(() => {
            const id = setInterval(() => setNow(new Date()), 60_000)
            return () => clearInterval(id)
        }, [])
    
        const firstName = user?.nombre_completo?.split(' ')[0] ?? 'Usuario'
        const roleLabel = user?.esAdmin ? 'Administrador' : 'Empleado'
    
        return (
            <div className="w-full max-w-3xl mx-auto py-8 px-2">
    
                <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold text-[#1F4363]">Bienvenido, {firstName}!</h1>
                        <span className="bg-[#1B8D7C]/15 text-[#1B8D7C] text-xs font-semibold px-2.5 py-1 rounded-full">
                            {roleLabel}
                        </span>
                    </div>
                    <p className="text-xs text-gray-400 font-medium pt-1">{formatDate(now)}</p>
                </div>
    
                <div className="grid grid-cols-3  gap-1">
                    {MODULES.map(mod => (
                        <LinkButtonCard key={mod.id} {...mod} />
                    ))}
                </div>
    
            </div>
        )
}