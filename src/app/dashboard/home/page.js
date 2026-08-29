'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/Context/AuthContext'
import PeopleIcon        from '@mui/icons-material/People'
import ShoppingCartIcon  from '@mui/icons-material/ShoppingCart'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import InventoryIcon     from '@mui/icons-material/Inventory'
import StorefrontIcon    from '@mui/icons-material/Storefront'
import ReceiptLongIcon   from '@mui/icons-material/ReceiptLong'
import BadgeIcon         from '@mui/icons-material/Badge'

const MODULES = [
    { id:'clientes',  title:'Clientes',       subtitle:'Clientes y créditos',       href:'/dashboard/clientes',    Icon:PeopleIcon,        bg:'#1F4363', hover:'#1a3557' },
    { id:'ventas',    title:'Ventas',          subtitle:'Registro de ventas',         href:'/dashboard/bd/ventas',      Icon:ShoppingCartIcon,  bg:'#FE811F', hover:'#e5731a' },
    { id:'logistica', title:'Logística',       subtitle:'Órdenes y mercancía',        href:'/dashboard/bd/logistica',   Icon:LocalShippingIcon, bg:'#1B8D7C', hover:'#167567' },
    { id:'inventario',title:'Inventario',      subtitle:'Productos y stock',          href:'/dashboard/bd/inventario',  Icon:InventoryIcon,     bg:'#1F4363', hover:'#1a3557' },
    { id:'tiendas',   title:'Tiendas',         subtitle:'Gestión de sucursales',      href:'/dashboard/bd/tiendas',     Icon:StorefrontIcon,    bg:'#FE811F', hover:'#e5731a' },
    { id:'sunat',     title:'SUNAT/NUBEFACT',  subtitle:'Facturación electrónica',    href:'/dashboard/bd/clientes',    Icon:ReceiptLongIcon,   bg:'#1B8D7C', hover:'#167567' },
    { id:'personal',  title:'Personal',        subtitle:'Gestión de empleados',       href:'/dashboard/bd/trabajadores',Icon:BadgeIcon,         bg:'#1F4363', hover:'#1a3557' },
]

const DAYS   = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado']
const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
function formatDate(d) {
    const hh = String(d.getHours()).padStart(2,'0')
    const mm = String(d.getMinutes()).padStart(2,'0')
    return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}  ·  ${hh}:${mm}`
}

function ModuleTile({ title, subtitle, href, Icon, bg, hover }) {
    const [hovered, setHovered] = useState(false)
    return (
        <Link href={href}>
            <div
                className="flex flex-col items-center gap-3 p-5 rounded-2xl transition-all duration-150 cursor-pointer"
                style={{ backgroundColor: hovered ? '#F5F7FA' : 'transparent' }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-150"
                    style={{
                        backgroundColor: hovered ? hover : bg,
                        transform:  hovered ? 'translateY(-3px)' : 'translateY(0)',
                        boxShadow:  hovered ? `0 8px 20px ${bg}45` : '0 2px 6px rgba(0,0,0,0.08)',
                    }}
                >
                    <Icon style={{ fontSize: 30, color: '#FFFFFF' }} />
                </div>
                <div className="text-center">
                    <p className="text-sm font-semibold text-[#1F4363] leading-tight">{title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-tight">{subtitle}</p>
                </div>
            </div>
        </Link>
    )
}

/* ── Página principal ─────────────────────────────────────────────────── */
export default function HomePage() {
    const { user }  = useAuth()
    const [now, setNow] = useState(new Date())

    /* Reloj */
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

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1">
                {MODULES.map(mod => (
                    <ModuleTile key={mod.id} {...mod} />
                ))}
            </div>

        </div>
    )
}