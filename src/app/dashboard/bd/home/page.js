'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useAuth } from '@/Context/AuthContext'
import { getTiendasByEmpresa } from '@/Connections/tiendas'

import PeopleIcon from '@mui/icons-material/People'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
import WorkIcon from '@mui/icons-material/Work'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import InventoryIcon from '@mui/icons-material/Inventory'
import StoreIcon from '@mui/icons-material/Store'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import PieChartIcon from '@mui/icons-material/PieChart'
import GroupIcon from '@mui/icons-material/Group'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import CloseIcon from '@mui/icons-material/Close'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import StorageIcon from '@mui/icons-material/Storage'
import BarChartIcon from '@mui/icons-material/BarChart'

const BD_ROUTES = [
    { name: 'Clientes',     path: '/dashboard/bd/clientes',     icon: PeopleIcon,       desc: 'Gestiona tu cartera de clientes',        color: '#FF821E' },
    { name: 'Créditos',     path: '/dashboard/bd/creditos',     icon: CreditCardIcon,   desc: 'Control de créditos y cobros',           color: '#1F4363' },
    { name: 'Caja',         path: '/dashboard/bd/caja',         icon: PointOfSaleIcon,  desc: 'Movimientos de caja diarios',            color: '#198E7B' },
    { name: 'Trabajadores', path: '/dashboard/bd/trabajadores', icon: WorkIcon,         desc: 'Administra tu equipo',                   color: '#FF821E' },
    { name: 'Proveedores',  path: '/dashboard/bd/proveedores',  icon: LocalShippingIcon,desc: 'Gestión de proveedores',                 color: '#1F4363' },
    { name: 'Inventario',   path: '/dashboard/bd/inventario',   icon: InventoryIcon,    desc: 'Control de stock y productos',           color: '#198E7B' },
    { name: 'Tiendas',      path: '/dashboard/bd/tiendas',      icon: StoreIcon,        desc: 'Administra tus tiendas',                 color: '#FF821E' },
]

const GRAPH_ROUTES = [
    { name: 'Ventas',       path: '/dashboard/graph/ventas',     icon: TrendingUpIcon,           desc: 'Análisis de ventas',                 color: '#FF821E' },
    { name: 'Finanzas',     path: '/dashboard/graph/finanzas',   icon: AccountBalanceWalletIcon, desc: 'Reporte financiero',                 color: '#1F4363' },
    { name: 'Inventario',   path: '/dashboard/graph/inventario', icon: PieChartIcon,             desc: 'Análisis de stock',                  color: '#198E7B' },
    { name: 'Clientes',     path: '/dashboard/graph/clientes',   icon: GroupIcon,                desc: 'Comportamiento de clientes',         color: '#FF821E' },
]

const TUTORIAL_STEPS = [
    {
        icon: '👋',
        title: '¡Bienvenido a PuntoVenta 360!',
        description: 'Este es tu panel de control principal. Desde aquí puedes gestionar todos los aspectos de tu negocio de forma centralizada.',
    },
    {
        icon: '📌',
        title: 'Barra lateral de navegación',
        description: 'Usa la barra lateral izquierda para moverte entre las secciones. Puedes colapsarla con el botón de flechas para ganar más espacio en pantalla.',
    },
    {
        icon: '🗄️',
        title: 'Sección de Datos',
        description: 'En "Datos" gestionas clientes, créditos, caja, trabajadores, proveedores, inventario y tiendas. Toda la información de tu negocio en un solo lugar.',
    },
    {
        icon: '📊',
        title: 'Sección de Análisis',
        description: 'En "Análisis" visualizas gráficos de ventas, finanzas, inventario y comportamiento de clientes para tomar mejores decisiones.',
    },
    {
        icon: '⚡',
        title: 'Acceso rápido',
        description: 'Usa las tarjetas de esta pantalla para ir directamente a cualquier sección sin pasar por el menú lateral. ¡Más rápido y sencillo!',
    },
]

const containerVariants = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
    hidden:  { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

function getInitials(name = '') {
    return name.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || 'U'
}

export default function PaginaHome() {
    const { user, loading } = useAuth()
    const [tiendas, setTiendas] = useState([])
    const [tiendaLoading, setTiendaLoading] = useState(true)
    const [showTutorial, setShowTutorial] = useState(false)
    const [tutorialStep, setTutorialStep] = useState(0)

    useEffect(() => {
        if (!user?.empresa_id) return
        async function fetchTiendas() {
            try {
                const res = await getTiendasByEmpresa(user.empresa_id)
                setTiendas(res?.data?.data ?? [])
            } catch {
                setTiendas([])
            } finally {
                setTiendaLoading(false)
            }
        }
        fetchTiendas()
    }, [user])

    useEffect(() => {
        const seen = localStorage.getItem('pipo_tutorial_seen')
        if (!seen) setShowTutorial(true)
    }, [])

    const handleCloseTutorial = () => {
        localStorage.setItem('pipo_tutorial_seen', 'true')
        setShowTutorial(false)
        setTutorialStep(0)
    }

    const handleNextStep = () => {
        if (tutorialStep < TUTORIAL_STEPS.length - 1) {
            setTutorialStep(prev => prev + 1)
        } else {
            handleCloseTutorial()
        }
    }

    return (
        <div className="w-full min-h-full">

            {/* ── Tutorial overlay ── */}
            <AnimatePresence>
                {showTutorial && (
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={tutorialStep}
                                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.97 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative overflow-hidden"
                            >
                                {/* accent bar */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF821E] to-[#1F4363] rounded-t-2xl" />

                                <button
                                    onClick={handleCloseTutorial}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <CloseIcon style={{ fontSize: 20 }} />
                                </button>

                                <div className="text-5xl mb-4 select-none">{TUTORIAL_STEPS[tutorialStep].icon}</div>

                                <h2 className="text-lg font-bold text-[#1F4363] mb-2 pr-6">
                                    {TUTORIAL_STEPS[tutorialStep].title}
                                </h2>
                                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                    {TUTORIAL_STEPS[tutorialStep].description}
                                </p>

                                <div className="flex items-center justify-between">
                                    <div className="flex gap-1.5">
                                        {TUTORIAL_STEPS.map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-2 h-2 rounded-full transition-all duration-300"
                                                style={{ backgroundColor: i === tutorialStep ? '#FF821E' : '#E5E7EB', width: i === tutorialStep ? 20 : 8 }}
                                            />
                                        ))}
                                    </div>
                                    <button
                                        onClick={handleNextStep}
                                        className="flex items-center gap-1 bg-[#FF821E] hover:bg-[#FF821E]/90 text-white font-semibold text-sm px-4 py-2 rounded-xl transition-colors shadow-sm"
                                    >
                                        {tutorialStep < TUTORIAL_STEPS.length - 1 ? 'Siguiente' : '¡Comenzar!'}
                                        <NavigateNextIcon style={{ fontSize: 18 }} />
                                    </button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Page content ── */}
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">

                {/* Welcome card */}
                <motion.div variants={itemVariants}>
                    <div className="bg-gradient-to-br from-[#1F4363] to-[#163250] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
                        <div className="flex items-center gap-4">
                            <motion.div
                                initial={{ scale: 0.6, opacity: 0 }}
                                animate={{ scale: 1,   opacity: 1 }}
                                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                                className="w-14 h-14 rounded-2xl bg-[#FF821E] flex items-center justify-center text-white font-extrabold text-lg shadow-lg shrink-0"
                            >
                                {loading ? '·' : getInitials(user?.nombre_completo)}
                            </motion.div>
                            <div>
                                <p className="text-white/50 text-xs font-medium uppercase tracking-wider">Bienvenido de vuelta</p>
                                <h1 className="text-white font-bold text-xl leading-tight">
                                    {loading ? 'Cargando...' : (user?.nombre_completo ?? user?.email ?? 'Usuario')}
                                </h1>
                                <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                                    {user?.esAdmin ? 'Administrador' : 'Trabajador'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4">
                            {/* Tienda chip */}
                            <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 shrink-0">
                                <StoreIcon style={{ fontSize: 22, color: '#FF821E' }} />
                                <div>
                                    <p className="text-white/50 text-xs">Tu tienda</p>
                                    {tiendaLoading ? (
                                        <p className="text-white font-semibold text-sm">Cargando...</p>
                                    ) : tiendas.length > 0 ? (
                                        <>
                                            <p className="text-white font-semibold text-sm">{tiendas[0]?.nombre}</p>
                                            {tiendas.length > 1 && (
                                                <p className="text-white/40 text-xs">{tiendas.length} tiendas</p>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-white/50 font-semibold text-sm">Sin tienda</p>
                                    )}
                                </div>
                            </div>

                            {/* Tutorial trigger */}
                            <button
                                onClick={() => { setTutorialStep(0); setShowTutorial(true) }}
                                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium px-3 py-2 rounded-xl transition-colors shrink-0"
                            >
                                <LightbulbIcon style={{ fontSize: 16, color: '#FF821E' }} />
                                <span className="hidden sm:inline">Tutorial</span>
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* ── Base de datos ── */}
                <motion.div variants={itemVariants}>
                    <div className="flex items-center gap-2 mb-3">
                        <StorageIcon style={{ fontSize: 18, color: '#1F4363' }} />
                        <h2 className="font-bold text-[#1F4363] text-sm uppercase tracking-wider">Base de Datos</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {BD_ROUTES.map((route, idx) => {
                            const Icon = route.icon
                            return (
                                <motion.div
                                    key={route.path}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.06 + 0.25 }}
                                    whileHover={{ y: -4, transition: { duration: 0.15 } }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <Link href={route.path}>
                                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 cursor-pointer hover:border-[#FF821E]/30 hover:shadow-md transition-all group h-full">
                                            <div
                                                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                                                style={{ backgroundColor: `${route.color}18` }}
                                            >
                                                <Icon style={{ fontSize: 22, color: route.color }} />
                                            </div>
                                            <p className="font-semibold text-[#1F4363] text-sm group-hover:text-[#FF821E] transition-colors">
                                                {route.name}
                                            </p>
                                            <p className="text-gray-400 text-xs mt-0.5 leading-snug">{route.desc}</p>
                                        </div>
                                    </Link>
                                </motion.div>
                            )
                        })}
                    </div>
                </motion.div>

                {/* ── Análisis ── */}
                <motion.div variants={itemVariants}>
                    <div className="flex items-center gap-2 mb-3">
                        <BarChartIcon style={{ fontSize: 18, color: '#1F4363' }} />
                        <h2 className="font-bold text-[#1F4363] text-sm uppercase tracking-wider">Análisis</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {GRAPH_ROUTES.map((route, idx) => {
                            const Icon = route.icon
                            return (
                                <motion.div
                                    key={route.path}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.06 + 0.55 }}
                                    whileHover={{ y: -4, transition: { duration: 0.15 } }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <Link href={route.path}>
                                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 cursor-pointer hover:border-[#198E7B]/30 hover:shadow-md transition-all group h-full">
                                            <div
                                                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                                                style={{ backgroundColor: `${route.color}18` }}
                                            >
                                                <Icon style={{ fontSize: 22, color: route.color }} />
                                            </div>
                                            <p className="font-semibold text-[#1F4363] text-sm group-hover:text-[#198E7B] transition-colors">
                                                {route.name}
                                            </p>
                                            <p className="text-gray-400 text-xs mt-0.5 leading-snug">{route.desc}</p>
                                        </div>
                                    </Link>
                                </motion.div>
                            )
                        })}
                    </div>
                </motion.div>

            </motion.div>
        </div>
    )
}