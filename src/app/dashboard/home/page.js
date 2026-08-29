'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/Context/AuthContext'
import { Search, ArrowRight } from 'lucide-react'
import PeopleIcon        from '@mui/icons-material/People'
import ShoppingCartIcon  from '@mui/icons-material/ShoppingCart'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import InventoryIcon     from '@mui/icons-material/Inventory'
import StorefrontIcon    from '@mui/icons-material/Storefront'
import ReceiptLongIcon   from '@mui/icons-material/ReceiptLong'
import BadgeIcon         from '@mui/icons-material/Badge'

import PersonAddIcon    from '@mui/icons-material/PersonAdd'
import AddIcon          from '@mui/icons-material/Add'
import SearchMuiIcon    from '@mui/icons-material/Search'
import EditIcon         from '@mui/icons-material/Edit'
import RemoveIcon       from '@mui/icons-material/Remove'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import QrCode2Icon      from '@mui/icons-material/QrCode2'
import VisibilityIcon   from '@mui/icons-material/Visibility'
import ReceiptIcon      from '@mui/icons-material/Receipt'

const MODULES = [
    { id:'clientes',  title:'Clientes',       subtitle:'Clientes y créditos',       href:'/dashboard/bd/clientes',    Icon:PeopleIcon,        bg:'#1F4363', hover:'#1a3557' },
    { id:'ventas',    title:'Ventas',          subtitle:'Registro de ventas',         href:'/dashboard/bd/ventas',      Icon:ShoppingCartIcon,  bg:'#FE811F', hover:'#e5731a' },
    { id:'logistica', title:'Logística',       subtitle:'Órdenes y mercancía',        href:'/dashboard/bd/logistica',   Icon:LocalShippingIcon, bg:'#1B8D7C', hover:'#167567' },
    { id:'inventario',title:'Inventario',      subtitle:'Productos y stock',          href:'/dashboard/bd/inventario',  Icon:InventoryIcon,     bg:'#1F4363', hover:'#1a3557' },
    { id:'tiendas',   title:'Tiendas',         subtitle:'Gestión de sucursales',      href:'/dashboard/bd/tiendas',     Icon:StorefrontIcon,    bg:'#FE811F', hover:'#e5731a' },
    { id:'sunat',     title:'SUNAT/NUBEFACT',  subtitle:'Facturación electrónica',    href:'/dashboard/bd/clientes',    Icon:ReceiptLongIcon,   bg:'#1B8D7C', hover:'#167567' },
    { id:'personal',  title:'Personal',        subtitle:'Gestión de empleados',       href:'/dashboard/bd/trabajadores',Icon:BadgeIcon,         bg:'#1F4363', hover:'#1a3557' },
]

const ALL_ITEMS = [
    { label:'Clientes',                    module:'Clientes',      href:'/dashboard/bd/clientes',          Icon:PeopleIcon,        bg:'#1F4363', type:'module' },
    { label:'Agregar Nuevo Cliente',       module:'Clientes',      href:'/dashboard/bd/clientes',          Icon:PersonAddIcon,     bg:'#1F4363', type:'action' },
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

    { label: 'Tiendas', module: 'Tiendas', href: '/dashboard/bd/tiendas', Icon: StorefrontIcon, bg: '#FE811F', type: 'module' },
    { label:'Nueva Tienda',                module:'Tiendas',        href:'/dashboard/bd/tiendas',           Icon:AddIcon,           bg:'#FE811F', type:'action' },
    { label:'Buscar Tienda',               module:'Tiendas',        href:'/dashboard/bd/tiendas',           Icon:SearchMuiIcon,     bg:'#FE811F', type:'action' },
    { label:'Eliminar Tienda',             module:'Tiendas',        href:'/dashboard/bd/tiendas',           Icon:RemoveIcon,        bg:'#FE811F', type:'action' },

    { label: 'SUNAT / NUBEFACT', module: 'SUNAT', href: '/dashboard/bd/clientes', Icon: ReceiptLongIcon, bg: '#1B8D7C', type: 'module' },
    { label:'Generar Factura',             module:'SUNAT',          href:'/dashboard/bd/clientes',          Icon:ReceiptIcon,       bg:'#1B8D7C', type:'action' },
    { label:'Generar Boleta',              module:'SUNAT',          href:'/dashboard/bd/clientes',          Icon:ReceiptIcon,       bg:'#1B8D7C', type:'action' },

    { label: 'Personal', module: 'Personal', href: '/dashboard/bd/trabajadores', Icon: BadgeIcon, bg: '#1F4363', type: 'module' },
    { label:'Nuevo Personal',              module:'Personal',       href:'/dashboard/bd/trabajadores',      Icon:AddIcon,           bg:'#1F4363', type:'action' },
    { label:'Eliminar Personal',           module:'Personal',       href:'/dashboard/bd/trabajadores',      Icon:RemoveIcon,        bg:'#1F4363', type:'action' },
]

const DAYS   = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado']
const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
function formatDate(d) {
    const hh = String(d.getHours()).padStart(2,'0')
    const mm = String(d.getMinutes()).padStart(2,'0')
    return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}  ·  ${hh}:${mm}`
}

function CommandPalette({ open, onClose }) {
    const router       = useRouter()
    const inputRef     = useRef(null)
    const listRef      = useRef(null)
    const itemRefs     = useRef([])
    const [query, setQuery]             = useState('')
    const [selectedIdx, setSelectedIdx] = useState(0)

    /* Filtrado + agrupado */
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

    /* Abrir → enfocar input + resetear */
    useEffect(() => {
        if (!open) return
        setQuery('')
        setSelectedIdx(0)
        const t = setTimeout(() => inputRef.current?.focus(), 30)
        return () => clearTimeout(t)
    }, [open])

    /* Resetear selección al cambiar query */
    useEffect(() => { setSelectedIdx(0) }, [query])

    /* Hacer scroll al ítem seleccionado */
    useEffect(() => {
        itemRefs.current[selectedIdx]?.scrollIntoView({ block: 'nearest' })
    }, [selectedIdx])

    /* Navegar con teclado */
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
                {/* Input de búsqueda */}
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

                {/* Lista de resultados */}
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
                                {/* Cabecera de grupo */}
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

                                            {/* Etiqueta */}
                                            <span className={`flex-1 text-sm ${isSelected ? 'font-semibold text-[#1F4363]' : 'font-medium text-gray-700'}`}>
                                                {item.label}
                                            </span>

                                            {/* Badge tipo */}
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

                {/* Footer con atajos de teclado */}
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
    const [now, setNow]         = useState(new Date())
    const [query, setQuery]     = useState('')
    const [paletteOpen, setPaletteOpen] = useState(false)

    const openPalette  = useCallback(() => setPaletteOpen(true),  [])
    const closePalette = useCallback(() => setPaletteOpen(false), [])

    /* Reloj */
    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 60_000)
        return () => clearInterval(id)
    }, [])

    /* Atajo Ctrl+K / Cmd+K */
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setPaletteOpen(p => !p)
            }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [])

    const firstName = user?.nombre_completo?.split(' ')[0] ?? 'Usuario'
    const roleLabel = user?.esAdmin ? 'Administrador' : 'Empleado'

    const filteredModules = MODULES.filter(m =>
        query === '' ||
        m.title.toLowerCase().includes(query.toLowerCase()) ||
        m.subtitle.toLowerCase().includes(query.toLowerCase())
    )

    return (
        <div className="w-full max-w-3xl mx-auto py-8 px-2">

            {/* Cabecera */}
            <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold text-[#1F4363]">Bienvenido, {firstName}!</h1>
                    <span className="bg-[#1B8D7C]/15 text-[#1B8D7C] text-xs font-semibold px-2.5 py-1 rounded-full">
                        {roleLabel}
                    </span>
                </div>
                <p className="text-xs text-gray-400 font-medium pt-1">{formatDate(now)}</p>
            </div>

            {/* Buscador — abre el palette al hacer click */}
            <button
                onClick={openPalette}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-300 hover:border-[#1F4363]/30 hover:text-gray-400 transition-colors shadow-sm mb-8 text-left"
            >
                <Search size={15} className="shrink-0" />
                <span className="flex-1">Buscar módulos y acciones...</span>
                <div className="flex items-center gap-1 shrink-0">
                    <kbd className="bg-gray-100 text-gray-400 text-[11px] px-1.5 py-0.5 rounded font-mono">⌘</kbd>
                    <kbd className="bg-gray-100 text-gray-400 text-[11px] px-1.5 py-0.5 rounded font-mono">K</kbd>
                </div>
            </button>

            {/* Grid de módulos */}
            {filteredModules.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1">
                    {filteredModules.map(mod => (
                        <ModuleTile key={mod.id} {...mod} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                        <Search size={20} className="text-gray-300" />
                    </div>
                    <p className="text-sm text-gray-400">
                        Sin resultados para <span className="font-semibold text-gray-500">{query}</span>
                    </p>
                </div>
            )}

            {/* Command Palette */}
            <CommandPalette open={paletteOpen} onClose={closePalette} />
        </div>
    )
}