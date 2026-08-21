'use client'
import React, { useState, useEffect } from 'react'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { login } from '@/lib/authentication'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/Context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

/* ── Slides del panel derecho ─────────────────────────────────────────── */
const SLIDES = [
    {
        tag: 'Inventario inteligente',
        heading: 'Ahorra estrés lidiando tu inventario',
        body: 'Controla stock en tiempo real, recibe alertas de bajo stock y gestiona movimientos sin complicaciones.',
        imgSrc: '/images/login-slide-inventario.png',
        imgAlt: 'Panel de inventario inteligente',
    },
    {
        tag: 'Todo en uno',
        heading: 'Ahorra tiempo y dinero con distintas apps en una sola',
        body: 'Ventas, clientes, créditos, caja y logística reunidos en una plataforma pensada para tu negocio.',
        imgSrc: '/images/login-slide-apps.png',
        imgAlt: 'Múltiples funciones unificadas',
    },
    {
        tag: 'Control total',
        heading: 'Gestiona tus tiendas desde cualquier lugar',
        body: 'Accede a reportes en tiempo real, supervisa a tu equipo y toma decisiones con datos concretos.',
        imgSrc: '/images/login-slide-tiendas.png',
        imgAlt: 'Gestión remota de tiendas',
    },
]

/* ── Decoración de arcos (SVG) ────────────────────────────────────────── */
function ArcDecoration() {
    return (
        <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 560 700"
            fill="none"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle cx="520" cy="680" r="260" stroke="white" strokeOpacity="0.05" strokeWidth="1.5" fill="none" />
            <circle cx="520" cy="680" r="380" stroke="white" strokeOpacity="0.04" strokeWidth="1.5" fill="none" />
            <circle cx="520" cy="680" r="500" stroke="white" strokeOpacity="0.03" strokeWidth="1.5" fill="none" />
            <circle cx="-20"  cy="60"  r="160" stroke="white" strokeOpacity="0.04" strokeWidth="1"   fill="none" />
            <circle cx="-20"  cy="60"  r="260" stroke="white" strokeOpacity="0.03" strokeWidth="1"   fill="none" />
        </svg>
    )
}

function ImagePlaceholder({ imgSrc, imgAlt }) {
    return (
        <div className="relative w-full rounded-2xl overflow-hidden bg-white/10 border border-white/15"
             style={{ aspectRatio: '16/9' }}>
            {/* Cuando tengas la imagen real, reemplaza este bloque por <Image ... /> */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.5">
                        <rect x="3" y="3" width="18" height="18" rx="3"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <path d="M21 15l-5-5L5 21"/>
                    </svg>
                </div>
                <p className="text-white/30 text-xs font-medium text-center px-4">{imgAlt}</p>
            </div>
        </div>
    )
}

/* ── Panel derecho con slider ─────────────────────────────────────────── */
function MarketingPanel() {
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        const id = setInterval(() => setCurrent(p => (p + 1) % SLIDES.length), 5000)
        return () => clearInterval(id)
    }, [])

    const slide = SLIDES[current]

    return (
        <div className="relative flex-1 h-full bg-[#1F4363] flex flex-col justify-between px-10 py-12 overflow-hidden">
            <ArcDecoration />

            {/* Logo */}
            <div className="relative z-10 flex items-center gap-2.5">
                <Image
                    src="https://res.cloudinary.com/dabyqnijl/image/upload/v1787111787/puntoVenta360/Logo_Punto_Venta_wrgis4.png"
                    alt="Punto de Venta 360"
                    width={80}
                    height={32}
                />
                <span className="text-white font-bold text-base">
                    Punto de Venta <span className="text-[#FE811F]">360</span>
                </span>
            </div>

            {/* Slide content */}
            <div className="relative z-10 flex-1 flex flex-col justify-center gap-7 py-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -18 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="flex flex-col gap-6"
                    >
                        {/* Imagen maquetada */}
                        <ImagePlaceholder imgSrc={slide.imgSrc} imgAlt={slide.imgAlt} />

                        {/* Texto */}
                        <div className="flex flex-col gap-3">
                            <span className="inline-flex items-center gap-1.5 w-fit bg-[#FE811F]/20 text-[#FE811F] text-xs font-semibold px-3 py-1 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#FE811F]" />
                                {slide.tag}
                            </span>
                            <h2 className="text-white font-bold text-2xl leading-snug">
                                {slide.heading}
                            </h2>
                            <p className="text-white/55 text-sm leading-relaxed">
                                {slide.body}
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {SLIDES.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`rounded-full transition-all duration-300 ${
                                i === current
                                    ? 'w-5 h-2 bg-[#FE811F]'
                                    : 'w-2 h-2 bg-white/25 hover:bg-white/40'
                            }`}
                        />
                    ))}
                </div>
                <p className="text-white/25 text-xs">© 2026 Punto de Venta 360</p>
            </div>
        </div>
    )
}

export default function LoginPage() {
    const { loginUser } = useAuth()
    const router = useRouter()
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (error) setError(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        const result = await login(formData)
        if (result.error) {
            setError(result.message || 'Credenciales inválidas')
            setIsLoading(false)
        } else {
            loginUser(result.user)
            router.push('/dashboard/home')
        }
    }

    return (
        <div className="min-h-screen flex">

            {/* ── Panel izquierdo: formulario ─────────────────────────── */}
            <div className="w-full lg:w-[45%] flex items-center justify-center px-8 py-12 bg-white">
                <div className="w-full max-w-[360px]">

                    {/* Logo mobile (oculto en desktop) */}
                    <div className="flex items-center gap-2 mb-10 lg:hidden">
                        <Image
                            src="https://res.cloudinary.com/dabyqnijl/image/upload/v1787111787/puntoVenta360/Logo_Punto_Venta_wrgis4.png"
                            alt="Logo"
                            width={72}
                            height={28}
                        />
                        <span className="font-bold text-[#1F4363]">
                            Punto de Venta <span className="text-[#FE811F]">360</span>
                        </span>
                    </div>

                    {/* Encabezado */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-[#1F4363]">Iniciar sesión</h1>
                        <p className="text-gray-400 text-sm mt-1">Qué bueno verte de nuevo 👋</p>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-500">Correo electrónico</label>
                            <input
                                name="email"
                                type="email"
                                placeholder="tucorreo@empresa.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                autoComplete="email"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-[#1F4363] bg-white focus:outline-none focus:border-[#FE811F] focus:ring-2 focus:ring-[#FE811F]/10 placeholder-gray-300 transition-colors"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-gray-500">Contraseña</label>
                                <Link href="/forget-password" className="text-xs text-gray-400 hover:text-[#FE811F] transition-colors">
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    autoComplete="current-password"
                                    className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 text-sm text-[#1F4363] bg-white focus:outline-none focus:border-[#FE811F] focus:ring-2 focus:ring-[#FE811F]/10 placeholder-gray-300 transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(p => !p)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#1F4363] transition-colors"
                                >
                                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-2.5 text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#FE811F] text-white font-bold py-3.5 rounded-xl hover:bg-[#e5731a] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait mt-1"
                        >
                            {isLoading
                                ? <><Loader2 size={17} className="animate-spin" /> Ingresando...</>
                                : 'Ingresar'
                            }
                        </button>

                    </form>

                    <p className="text-center text-xs text-gray-400 mt-8">
                        ¿No tienes cuenta?{' '}
                        <Link href="/signup" className="text-[#FE811F] font-semibold hover:underline">
                            Crear cuenta gratis
                        </Link>
                    </p>

                </div>
            </div>

            <div className="hidden lg:flex lg:w-[55%]">
                <MarketingPanel />
            </div>

        </div>
    )
}