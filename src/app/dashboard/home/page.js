'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/Context/AuthContext'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import RemoveIcon from '@mui/icons-material/Remove'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import QrCode2Icon from '@mui/icons-material/QrCode2'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import LinkIcon from '@mui/icons-material/Link'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ReceiptIcon from '@mui/icons-material/Receipt'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'

const INITIAL_SECTIONS = [
    {
        id: 'clientes',
        title: 'Clientes',
        href: '/dashboard/bd/clientes',
        visible: true,
        cards: [
            { Icon: PersonAddIcon, label: 'Agregar Nuevo Cliente', href: '/dashboard/bd/clientes' },
            { Icon: AddIcon,       label: 'Nuevo Crédito',        href: '/dashboard/bd/clientes' },
            { Icon: SearchIcon,    label: 'Buscar crédito',       href: '/dashboard/bd/clientes' },
            { Icon: EditIcon,      label: 'Editar Cliente',       href: '/dashboard/bd/clientes' },
            { Icon: RemoveIcon,    label: 'Eliminar Cliente',     href: '/dashboard/bd/clientes' },
        ],
    },
    {
        id: 'ventas',
        title: 'Ventas',
        href: '/dashboard/bd/ventas',
        visible: true,
        cards: [
            { Icon: AddIcon,    label: 'Nueva Venta',  href: '/dashboard/bd/ventas' },
            { Icon: SearchIcon, label: 'Buscar Venta', href: '/dashboard/bd/ventas' },
        ],
    },
    {
        id: 'logistica',
        title: 'Logística',
        href: '/dashboard/bd/logistica',
        visible: true,
        cards: [
            { Icon: AddIcon,             label: 'Nueva Orden de Compra',      href: '/dashboard/bd/logistica' },
            { Icon: VisibilityIcon,      label: 'Visualizar Ordenes de Compra', href: '/dashboard/bd/logistica' },
            { Icon: EditIcon,            label: 'Editar Orden de Compra',     href: '/dashboard/bd/logistica' },
            { Icon: LocalShippingIcon,   label: 'Nueva entrada de Mercancía', href: '/dashboard/bd/logistica' },
            { Icon: SearchIcon,          label: 'Ver entrada de Mercancía',   href: '/dashboard/bd/logistica' },
        ],
    },
    {
        id: 'inventario',
        title: 'Inventario',
        href: '/dashboard/bd/inventario',
        visible: true,
        cards: [
            { Icon: AddIcon,           label: 'Nuevo Producto',         href: '/dashboard/bd/inventario/create' },
            { Icon: FileDownloadIcon,  label: 'Importar Productos',     href: '/dashboard/bd/inventario' },
            { Icon: SearchIcon,        label: 'Buscar Producto',        href: '/dashboard/bd/inventario' },
            { Icon: QrCode2Icon,       label: 'Escanear Nuevo Producto', href: '/dashboard/bd/inventario' },
            { Icon: RemoveIcon,        label: 'Eliminar Producto',      href: '/dashboard/bd/inventario' },
        ],
    },
    {
        id: 'tiendas',
        title: 'Tiendas',
        href: '/dashboard/bd/tiendas',
        visible: true,
        cards: [
            { Icon: AddIcon,    label: 'Nueva Tienda',   href: '/dashboard/bd/tiendas' },
            { Icon: SearchIcon, label: 'Buscar Tienda',  href: '/dashboard/bd/tiendas' },
            { Icon: RemoveIcon, label: 'Eliminar Tienda', href: '/dashboard/bd/tiendas' },
        ],
    },
    {
        id: 'sunat',
        title: 'SUNAT/NUBEFACT',
        href: '/dashboard/bd/clientes',
        visible: true,
        cards: [
            { Icon: ReceiptIcon, label: 'Generar Factura', href: '/dashboard/bd/clientes' },
            { Icon: ReceiptIcon, label: 'Generar Boleta',  href: '/dashboard/bd/clientes' },
        ],
    },
    {
        id: 'personal',
        title: 'Personal',
        href: '/dashboard/bd/trabajadores',
        visible: true,
        cards: [
            { Icon: AddIcon,    label: 'Nuevo Personal',   href: '/dashboard/bd/trabajadores' },
            { Icon: RemoveIcon, label: 'Eliminar Personal', href: '/dashboard/bd/trabajadores' },
        ],
    },
]

const PALETTE = [
    { bg: '#1F4363', text: '#FFFFFF', hover: '#1a3557' },
    { bg: '#FE811F', text: '#FFFFFF', hover: '#e5731a' },
    { bg: '#1B8D7C', text: '#FFFFFF', hover: '#167567' },
    { bg: '#FFFFFF',  text: '#1F4363', hover: '#F0F0F0', border: '1px solid #D9D9D9' },
    { bg: '#D9D9D9',  text: '#1F4363', hover: '#C8C8C8' },
]

const DAYS    = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const MONTHS  = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

function formatDate(d) {
    const day  = DAYS[d.getDay()]
    const date = d.getDate()
    const mon  = MONTHS[d.getMonth()]
    const hh   = String(d.getHours()).padStart(2, '0')
    const mm   = String(d.getMinutes()).padStart(2, '0')
    return `${day}, ${date} ${mon}. ${hh}:${mm}`
}

function ActionCard({ Icon, label, href, palette }) {
    return (
        <Link href={href}>
            <div
                className="flex items-center gap-3 rounded-xl px-4 py-4 transition-colors cursor-pointer min-h-[68px] group"
                style={{ backgroundColor: palette.bg, border: palette.border ?? 'none' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = palette.hover}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = palette.bg}
            >
                <Icon style={{ fontSize: 22, flexShrink: 0, color: palette.text }} />
                <span className="text-sm font-medium leading-tight" style={{ color: palette.text }}>{label}</span>
            </div>
        </Link>
    )
}

function Section({ section, isFirst, isLast, onMoveUp, onMoveDown, onToggle }) {
    return (
        <div className="mb-7">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                    <Link
                        href={section.href}
                        className="text-[15px] font-semibold text-[#1F4363] underline underline-offset-2 hover:text-[#FF821E] transition-colors"
                    >
                        {section.title}
                    </Link>
                    <Link href={section.href}>
                        <LinkIcon style={{ fontSize: 15, color: '#8D99AE' }} />
                    </Link>
                </div>
                <div className="flex items-center gap-2">
                    {!isFirst && (
                        <button onClick={onMoveUp} className="text-gray-400 hover:text-[#1F4363] transition-colors">
                            <ArrowUpwardIcon style={{ fontSize: 17 }} />
                        </button>
                    )}
                    {!isLast && (
                        <button onClick={onMoveDown} className="text-gray-400 hover:text-[#1F4363] transition-colors">
                            <ArrowDownwardIcon style={{ fontSize: 17 }} />
                        </button>
                    )}
                    <button onClick={onToggle} className="text-gray-400 hover:text-[#1F4363] transition-colors">
                        {section.visible
                            ? <VisibilityIcon style={{ fontSize: 17 }} />
                            : <VisibilityOffIcon style={{ fontSize: 17 }} />
                        }
                    </button>
                </div>
            </div>

            {section.visible && (
                <div className="grid grid-cols-3 gap-3">
                    {section.cards.map((card, i) => (
                        <ActionCard key={i} {...card} palette={PALETTE[i % PALETTE.length]} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default function HomePage() {
    const { user } = useAuth()
    const [sections, setSections] = useState(INITIAL_SECTIONS)
    const [now, setNow] = useState(new Date())

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 60_000)
        return () => clearInterval(id)
    }, [])

    const firstName = user?.nombre_completo?.split(' ')[0] ?? 'Usuario'
    const roleLabel = user?.esAdmin ? 'Administrador' : 'Empleado'

    const moveUp = (i) => setSections(prev => {
        if (i === 0) return prev
        const next = [...prev]
        ;[next[i - 1], next[i]] = [next[i], next[i - 1]]
        return next
    })

    const moveDown = (i) => setSections(prev => {
        if (i === prev.length - 1) return prev
        const next = [...prev]
        ;[next[i], next[i + 1]] = [next[i + 1], next[i]]
        return next
    })

    const toggleVisibility = (i) =>
        setSections(prev => prev.map((s, idx) => idx === i ? { ...s, visible: !s.visible } : s))

    return (
        <div className="w-full max-w-4xl mx-auto py-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold text-[#1F4363]">
                        Bienvenido, {firstName}!
                    </h1>
                    <span className="bg-[#198E7B] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                        {roleLabel}
                    </span>
                </div>
                <p className="text-sm text-gray-400 font-medium">{formatDate(now)}</p>
            </div>

            {/* Sections */}
            {sections.map((section, i) => (
                <Section
                    key={section.id}
                    section={section}
                    isFirst={i === 0}
                    isLast={i === sections.length - 1}
                    onMoveUp={() => moveUp(i)}
                    onMoveDown={() => moveDown(i)}
                    onToggle={() => toggleVisibility(i)}
                />
            ))}
        </div>
    )
}