'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
import PanelRouteHome from '@/components/Panel/PanelRouteHome'
import WelcomPanel from '@/components/Panel/WelcomePanel'

const BD_ROUTES = [
    { name: 'Clientes', path: '/dashboard/bd/clientes', icon: PeopleIcon, desc: 'Gestiona tu cartera de clientes', color: '#FF821E' },
    { name: 'Créditos', path: '/dashboard/bd/creditos', icon: CreditCardIcon, desc: 'Control de créditos y cobros', color: '#1F4363' },
    { name: 'Caja', path: '/dashboard/bd/caja', icon: PointOfSaleIcon, desc: 'Movimientos de caja diarios', color: '#198E7B' },
    { name: 'Trabajadores', path: '/dashboard/bd/trabajadores', icon: WorkIcon, desc: 'Administra tu equipo', color: '#FF821E' },
    { name: 'Proveedores', path: '/dashboard/bd/proveedores', icon: LocalShippingIcon, desc: 'Gestión de proveedores', color: '#1F4363' },
    { name: 'Inventario', path: '/dashboard/bd/inventario', icon: InventoryIcon, desc: 'Control de stock y productos', color: '#198E7B' },
    { name: 'Tiendas', path: '/dashboard/bd/tiendas', icon: StoreIcon, desc: 'Administra tus tiendas', color: '#FF821E' },
];

const GRAPH_ROUTES = [
    { name: 'Ventas', path: '/dashboard/graph/ventas',     icon: TrendingUpIcon, desc: 'Análisis de ventas', color: '#FF821E' },
    { name: 'Finanzas', path: '/dashboard/graph/finanzas',   icon: AccountBalanceWalletIcon, desc: 'Reporte financiero', color: '#1F4363' },
    { name: 'Inventario', path: '/dashboard/graph/inventario', icon: PieChartIcon, desc: 'Análisis de stock', color: '#198E7B' },
    { name: 'Clientes', path: '/dashboard/graph/clientes',   icon: GroupIcon, desc: 'Comportamiento de clientes', color: '#FF821E' },
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
    }, []);

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

            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                <WelcomPanel
                    itemVariants={itemVariants}
                    setTutorialStep={setTutorialStep}
                    setShowTutorial={setShowTutorial}
                    loading={loading}
                    user={user}
                    tiendaLoading={tiendaLoading}
                    tiendas={tiendas}
                />
                <PanelRouteHome itemVariants={itemVariants} BD_ROUTES={BD_ROUTES} />
                {/**<PanelRouteHome itemVariants={itemVariants} BD_ROUTES={GRAPH_ROUTES} isGraph={true} /> */}

            </motion.div>
        </div>
    )
}