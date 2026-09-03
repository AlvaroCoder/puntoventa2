'use client';
import Image from 'next/image'
import Link from 'next/link'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuItem,
} from '../ui/dropdown-menu'
import { useAuth } from '@/Context/AuthContext'
import { logout } from '@/lib/authentication'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import BadgeIcon from '@mui/icons-material/Badge'
import LogoutIcon from '@mui/icons-material/Logout'
import { Search, Bell, ArrowRight } from 'lucide-react'

import PersonAddIcon    from '@mui/icons-material/PersonAdd'
import AddIcon          from '@mui/icons-material/Add'
import SearchMuiIcon    from '@mui/icons-material/Search'
import EditIcon         from '@mui/icons-material/Edit'
import RemoveIcon       from '@mui/icons-material/Remove'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import QrCode2Icon      from '@mui/icons-material/QrCode2'
import VisibilityIcon   from '@mui/icons-material/Visibility'
import ReceiptIcon      from '@mui/icons-material/Receipt'
import PeopleIcon        from '@mui/icons-material/People'
import StorefrontIcon    from '@mui/icons-material/Storefront'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import InventoryIcon     from '@mui/icons-material/Inventory'
import ReceiptLongIcon   from '@mui/icons-material/ReceiptLong'

const ALL_ITEMS = [
    { label:'Clientes',                    module:'Clientes',      href:'/dashboard/clientes',          Icon:PeopleIcon,        bg:'#1F4363', type:'module' },
    { label:'Agregar Nuevo Cliente',       module:'Clientes',      href:'/dashboard/clientes/crear',          Icon:PersonAddIcon,     bg:'#1F4363', type:'action' },
    { label:'Nuevo Crédito',               module:'Clientes',      href:'/dashboard/bd/clientes',          Icon:AddIcon,           bg:'#1F4363', type:'action' },
    { label:'Buscar Crédito',              module:'Clientes',      href:'/dashboard/bd/clientes',          Icon:SearchMuiIcon,     bg:'#1F4363', type:'action' },
    { label:'Editar Cliente',              module:'Clientes',      href:'/dashboard/bd/clientes',          Icon:EditIcon,          bg:'#1F4363', type:'action' },
    { label:'Eliminar Cliente',            module:'Clientes',      href:'/dashboard/bd/clientes',          Icon:RemoveIcon,        bg:'#1F4363', type:'action' },

    { label: 'Ventas', module: 'Ventas', href: '/dashboard/bd/ventas', Icon: ShoppingCartIcon, bg: '#FE811F', type: 'module' },
    { label:'Nueva Venta',                 module:'Ventas',         href:'/dashboard/bd/ventas',            Icon:AddIcon,           bg:'#FE811F', type:'action' },
    { label:'Buscar Venta',                module:'Ventas',         href:'/dashboard/bd/ventas',            Icon:SearchMuiIcon,     bg:'#FE811F', type:'action' },

    { label:'Logística',                   module:'Logística',      href:'/dashboard/bd/logistica',         Icon:LocalShippingIcon, bg:'#1B8D7C', type:'module' },
    { label:'Nueva Orden de Compra',       module:'Logística',      href:'/dashboard/bd/logistica',         Icon:AddIcon,           bg:'#1B8D7C', type:'action' },
    { label:'Visualizar Ordenes de Compra',module:'Logística',      href:'/dashboard/bd/logistica',         Icon:VisibilityIcon,    bg:'#1B8D7C', type:'action' },
    { label:'Editar Orden de Compra',      module:'Logística',      href:'/dashboard/bd/logistica',         Icon:EditIcon,          bg:'#1B8D7C', type:'action' },
    { label:'Nueva entrada de Mercancía',  module:'Logística',      href:'/dashboard/bd/logistica',         Icon:LocalShippingIcon, bg:'#1B8D7C', type:'action' },
    { label: 'Ver entrada de Mercancía', module: 'Logística', href: '/dashboard/bd/logistica', Icon: SearchMuiIcon, bg: '#1B8D7C', type: 'action' },
    
    { label:'Inventario',                  module:'Inventario',     href:'/dashboard/bd/inventario',        Icon:InventoryIcon,     bg:'#1F4363', type:'module' },
    { label:'Nuevo Producto',              module:'Inventario',     href:'/dashboard/bd/inventario/create', Icon:AddIcon,           bg:'#1F4363', type:'action' },
    { label:'Importar Productos',          module:'Inventario',     href:'/dashboard/bd/inventario',        Icon:FileDownloadIcon,  bg:'#1F4363', type:'action' },
    { label:'Buscar Producto',             module:'Inventario',     href:'/dashboard/bd/inventario',        Icon:SearchMuiIcon,     bg:'#1F4363', type:'action' },
    { label:'Escanear Nuevo Producto',     module:'Inventario',     href:'/dashboard/bd/inventario',        Icon:QrCode2Icon,       bg:'#1F4363', type:'action' },
    { label:'Eliminar Producto',           module:'Inventario',     href:'/dashboard/bd/inventario',        Icon:RemoveIcon,        bg:'#1F4363', type:'action' },


    { label: 'Tiendas', module: 'Tiendas', href: '/dashboard/tiendas', Icon: StorefrontIcon, bg: '#FE811F', type: 'module' },
    { label:'Nueva Tienda',                module:'Tiendas',        href:'/dashboard/tiendas/crear',           Icon:AddIcon,           bg:'#FE811F', type:'action' },
    { label:'Buscar Tienda',               module:'Tiendas',        href:'/dashboard/tiendas',           Icon:SearchMuiIcon,     bg:'#FE811F', type:'action' },
    { label:'Eliminar Tienda',             module:'Tiendas',        href:'/dashboard/bd/tiendas',           Icon:RemoveIcon,        bg:'#FE811F', type:'action' },

    { label: 'SUNAT / NUBEFACT', module: 'SUNAT', href: '/dashboard/bd/clientes', Icon: ReceiptLongIcon, bg: '#1B8D7C', type: 'module' },
    { label:'Generar Factura',             module:'SUNAT',          href:'/dashboard/bd/clientes',          Icon:ReceiptIcon,       bg:'#1B8D7C', type:'action' },
    { label:'Generar Boleta',              module:'SUNAT',          href:'/dashboard/bd/clientes',          Icon:ReceiptIcon,       bg:'#1B8D7C', type:'action' },

    { label: 'Personal', module: 'Personal', href: '/dashboard/bd/trabajadores', Icon: BadgeIcon, bg: '#1F4363', type: 'module' },
    { label:'Nuevo Personal',              module:'Personal',       href:'/dashboard/bd/trabajadores',      Icon:AddIcon,           bg:'#1F4363', type:'action' },
    { label:'Eliminar Personal',           module:'Personal',       href:'/dashboard/bd/trabajadores',      Icon:RemoveIcon,        bg:'#1F4363', type:'action' },
]


const NIVEL_LABEL = {
    999: { label: 'Dueño',         color: 'bg-[#FE811F]/15 text-[#FE811F]' },
    4:   { label: 'Administrador', color: 'bg-[#1F4363]/10 text-[#1F4363]' },
    3:   { label: 'Supervisor',    color: 'bg-purple-100 text-purple-700'   },
    2:   { label: 'Cajero',        color: 'bg-teal-100 text-teal-700'       },
    1:   { label: 'Vendedor',      color: 'bg-gray-100 text-gray-600'       },
    0:   { label: 'Invitado',      color: 'bg-gray-100 text-gray-400'       },
}

const URL_LOGO = "https://res.cloudinary.com/dabyqnijl/image/upload/v1787804945/LOGO/01_lbpeuw.png"

function CommandPalette({ open, onClose }) {
    const router = useRouter()
    const inputRef = useRef(null)
    const listRef = useRef(null)
    const itemRefs = useRef([])
    const [query, setQuery]             = useState('')
    const [selectedIdx, setSelectedIdx] = useState(0)

    const filtered = query.trim() === ''
        ? ALL_ITEMS
        : ALL_ITEMS.filter(item =>
            item.label.toLowerCase().includes(query.toLowerCase()) ||
            item.module.toLowerCase().includes(query.toLowerCase())
          )

    const grouped = filtered.reduce((acc, item) => {
        if (!acc[item.module]) acc[item.module] = []
        acc[item.module].push(item)
        return acc
    }, {})

    useEffect(() => {
        if (!open) return
        setQuery('')
        setSelectedIdx(0)
        const t = setTimeout(() => inputRef.current?.focus(), 30)
        return () => clearTimeout(t)
    }, [open])

    useEffect(() => { setSelectedIdx(0) }, [query])

    useEffect(() => {
        itemRefs.current[selectedIdx]?.scrollIntoView({ block: 'nearest' })
    }, [selectedIdx])

    useEffect(() => {
        if (!open) return
        const onKey = (e) => {
            if (e.key === 'Escape')     { e.preventDefault(); onClose(); return }
            if (e.key === 'ArrowDown')  { e.preventDefault(); setSelectedIdx(p => Math.min(p + 1, filtered.length - 1)) }
            if (e.key === 'ArrowUp')    { e.preventDefault(); setSelectedIdx(p => Math.max(p - 1, 0)) }
            if (e.key === 'Enter') {
                e.preventDefault()
                const item = filtered[selectedIdx]
                if (item) { router.push(item.href); onClose() }
            }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [open, selectedIdx, filtered, onClose, router])

    if (!open) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100">
                    <Search size={16} className="text-gray-400 shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Buscar módulos y acciones..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        className="flex-1 text-sm text-[#1F4363] placeholder-gray-300 outline-none bg-transparent"
                    />
                    <kbd className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded font-mono shrink-0">
                        Esc
                    </kbd>
                </div>

                <div ref={listRef} className="max-h-72 overflow-y-auto">
                    {filtered.length === 0 ? (
                        <div className="px-4 py-10 text-center">
                            <p className="text-sm text-gray-400">
                                Sin resultados para <span className="font-semibold text-gray-500">{query}</span>
                            </p>
                        </div>
                    ) : (
                        Object.entries(grouped).map(([moduleName, items]) => (
                            <div key={moduleName}>
                                <p className="px-4 pt-3 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    {moduleName}
                                </p>
                                {items.map((item) => {
                                    const globalIdx = filtered.indexOf(item)
                                    const isSelected = globalIdx === selectedIdx
                                    return (
                                        <button
                                            key={`${item.module}-${item.label}`}
                                            ref={el => { itemRefs.current[globalIdx] = el }}
                                            onClick={() => { router.push(item.href); onClose() }}
                                            onMouseEnter={() => setSelectedIdx(globalIdx)}
                                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-75
                                                ${isSelected ? 'bg-[#1F4363]/[0.07]' : ''}`}
                                        >
                                            {/* Icono */}
                                            <div
                                                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                                                style={{ backgroundColor: `${item.bg}22` }}
                                            >
                                                <item.Icon style={{ fontSize: 14, color: item.bg }} />
                                            </div>

                                            <span className={`flex-1 text-sm ${isSelected ? 'font-semibold text-[#1F4363]' : 'font-medium text-gray-700'}`}>
                                                {item.label}
                                            </span>

                                            {item.type === 'module' && (
                                                <span className="text-[10px] font-semibold text-gray-300 bg-gray-100 px-2 py-0.5 rounded-full shrink-0">
                                                    módulo
                                                </span>
                                            )}

                                            <ArrowRight size={13} className={`shrink-0 transition-colors ${isSelected ? 'text-[#1F4363]' : 'text-gray-200'}`} />
                                        </button>
                                    )
                                })}
                            </div>
                        ))
                    )}
                </div>

                <div className="border-t border-gray-100 px-4 py-2.5 flex items-center gap-5">
                    <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
                        <kbd className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono text-[10px]">↑</kbd>
                        <kbd className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono text-[10px]">↓</kbd>
                        Navegar
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
                        <kbd className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono text-[10px]">↵</kbd>
                        Abrir
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
                        <kbd className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono text-[10px]">Esc</kbd>
                        Cerrar
                    </span>
                </div>
            </div>
        </div>
    )
}

export default function TopBarNavigationDashbord() {
    const { user } = useAuth()
    const initials  = user?.nombre_completo?.split(' ').map(n => n[0]?.toUpperCase()).join('') || ''
    const nivelInfo = NIVEL_LABEL[user?.nivel_permiso] ?? NIVEL_LABEL[0]
    const [paletteOpen, setPaletteOpen] = useState(false)

    const openPalette  = useCallback(() => setPaletteOpen(true),  [])
    const closePalette = useCallback(() => setPaletteOpen(false), [])

    useEffect(() => {
        const onKey = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                setPaletteOpen(p => !p)
            }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [])

    return (
        <nav className="w-full h-16 bg-white sticky top-0 z-10 flex items-center justify-between px-6 shrink-0 border-b border-grisClaro shadow-sm">

            <Link href="/dashboard/home" className="flex items-center gap-2.5">
                <Image
                    src={URL_LOGO}
                    alt="Logo Punto de Venta 360"
                    width={44}
                    height={44}
                />
                <span className="text-sm font-bold text-azulMarino">
                    Punto de Venta <span className="text-verdeAgua">360</span>
                </span>
            </Link>

            <button
                onClick={openPalette}
                className="flex items-center gap-2 w-[500px] px-3.5 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-400 hover:border-[#1F4363]/30 hover:bg-white transition-colors"
            >
                <Search size={14} className="shrink-0" />
                <span className="flex-1 text-left text-gray-400">Buscar funcionalidad...</span>
                <div className="flex items-center gap-0.5 shrink-0">
                    <kbd className="bg-white border border-gray-200 text-gray-400 text-[10px] px-1.5 py-0.5 rounded font-mono leading-none">⌘</kbd>
                    <kbd className="bg-white border border-gray-200 text-gray-400 text-[10px] px-1.5 py-0.5 rounded font-mono leading-none">K</kbd>
                </div>
            </button>

            <div className="flex items-center gap-1.5">

                <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-azulMarino hover:bg-grisClaro transition-colors">
                    <Bell size={16} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FE811F]" />
                </button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="ml-1 w-9 h-9 rounded-full bg-[#1F4363] flex items-center justify-center text-white font-bold text-xs shrink-0 hover:bg-[#1a3557] transition-colors focus:outline-none">
                            {initials || <PersonOutlineIcon style={{ fontSize: 17 }} />}
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-64 p-2 shadow-lg border border-gray-100 rounded-xl mt-1">

                        <div className="flex items-center gap-3 px-2 py-3">
                            <div className="w-10 h-10 rounded-full bg-[#1F4363] flex items-center justify-center text-white font-bold text-sm shrink-0">
                                {initials || <PersonOutlineIcon style={{ fontSize: 18 }} />}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <p className="font-bold text-[#1F4363] text-sm truncate">
                                    {user?.nombre_completo ?? 'Usuario'}
                                </p>
                                <p className="text-xs text-gray-400 truncate">
                                    {user?.email ?? ''}
                                </p>
                                <span className={`mt-1 text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${nivelInfo.color}`}>
                                    {nivelInfo.label}
                                </span>
                            </div>
                        </div>

                        <DropdownMenuSeparator className="my-1" />

                        <DropdownMenuItem asChild className="rounded-lg cursor-pointer px-3 py-2.5 hover:bg-[#1F4363]/5 focus:bg-[#1F4363]/5">
                            <Link href="/dashboard/perfil" className="flex items-center gap-3 text-[#1F4363]">
                                <PersonOutlineIcon style={{ fontSize: 17 }} />
                                <span className="text-sm font-medium">Ver perfil</span>
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild className="rounded-lg cursor-pointer px-3 py-2.5 hover:bg-[#1F4363]/5 focus:bg-[#1F4363]/5">
                            <Link href="/dashboard/notificaciones" className="flex items-center gap-3 text-[#1F4363]">
                                <NotificationsNoneIcon style={{ fontSize: 17 }} />
                                <span className="text-sm font-medium">Notificaciones</span>
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem className="rounded-lg cursor-pointer px-3 py-2.5 hover:bg-[#1F4363]/5 focus:bg-[#1F4363]/5">
                            <div className="flex items-center gap-3 text-[#1F4363]">
                                <BadgeIcon style={{ fontSize: 17 }} />
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">Nivel de acceso</span>
                                    <span className="text-xs text-gray-400">Permiso {user?.nivel_permiso ?? 0}</span>
                                </div>
                            </div>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="my-1" />

                        <DropdownMenuItem asChild className="rounded-lg cursor-pointer px-3 py-2.5 hover:bg-red-50 focus:bg-red-50">
                            <form action={logout} className="w-full">
                                <button type="submit" className="flex items-center gap-3 text-red-500 w-full">
                                    <LogoutIcon style={{ fontSize: 17 }} />
                                    <span className="text-sm font-medium">Cerrar sesión</span>
                                </button>
                            </form>
                        </DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
            <CommandPalette open={paletteOpen} onClose={closePalette} />
        </nav>
    )
}