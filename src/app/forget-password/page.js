'use client'
import React, { useState, useRef, useEffect } from 'react'
import { ArrowRight, ArrowLeft, Loader2, Mail, KeyRound, Lock } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import InputField from '@/elements/InputField'
import InputPassword from '@/elements/InputPassword'
import { RECUPERAR_PASSWORD, VERIFICAR_CODIGO_RESET, RESET_PASSWORD } from '@/conexion/apiconexion'

const TOTAL_STEPS = 3

export default function ForgetPasswordPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const [email, setEmail] = useState('')
    const [codigo, setCodigo] = useState(['', '', '', '', '', ''])
    const [resetToken, setResetToken] = useState('')
    const [nuevaPassword, setNuevaPassword] = useState('')
    const [confirmarPassword, setConfirmarPassword] = useState('')
    const [countdown, setCountdown] = useState(0)

    const inputsRef = useRef([])

    useEffect(() => {
        if (countdown <= 0) return
        const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000)
        return () => clearTimeout(timer)
    }, [countdown])

    const formatCountdown = () => {
        const m = Math.floor(countdown / 60).toString().padStart(2, '0')
        const s = (countdown % 60).toString().padStart(2, '0')
        return `${m}:${s}`
    }

    // Step 1: Enviar código
    const handleEnviarCodigo = async (e) => {
        e.preventDefault()
        setError(null)
        if (!email) { setError('Ingresa tu correo electrónico'); return }
        setIsLoading(true)
        try {
            const res = await RECUPERAR_PASSWORD(email)
            const json = await res.json()
            if (!res.ok) {
                setError(json?.message || 'Error al enviar el código')
            } else {
                setCountdown(15 * 60)
                setStep(2)
            }
        } catch {
            setError('Error de conexión. Verifica tu internet.')
        } finally {
            setIsLoading(false)
        }
    }

    // Step 2: Verificar OTP
    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return
        const newCodigo = [...codigo]
        newCodigo[index] = value.slice(-1)
        setCodigo(newCodigo)
        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus()
        }
    }

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !codigo[index] && index > 0) {
            inputsRef.current[index - 1]?.focus()
        }
    }

    const handleOtpPaste = (e) => {
        e.preventDefault()
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
        if (pasted.length === 6) {
            setCodigo(pasted.split(''))
            inputsRef.current[5]?.focus()
        }
    }

    const handleVerificarCodigo = async (e) => {
        e.preventDefault()
        setError(null)
        const codigoCompleto = codigo.join('')
        if (codigoCompleto.length < 6) { setError('Ingresa el código completo de 6 dígitos'); return }
        setIsLoading(true)
        try {
            const res = await VERIFICAR_CODIGO_RESET(email, codigoCompleto)
            const json = await res.json()
            if (!res.ok) {
                setError(json?.message || 'Código inválido o expirado')
            } else {
                setResetToken(json?.data?.reset_token)
                setStep(3)
            }
        } catch {
            setError('Error de conexión. Verifica tu internet.')
        } finally {
            setIsLoading(false)
        }
    }

    // Step 3: Nueva contraseña
    const handleResetPassword = async (e) => {
        e.preventDefault()
        setError(null)
        if (!nuevaPassword || nuevaPassword.length < 8) { setError('La contraseña debe tener al menos 8 caracteres'); return }
        if (nuevaPassword !== confirmarPassword) { setError('Las contraseñas no coinciden'); return }
        setIsLoading(true)
        try {
            const res = await RESET_PASSWORD(resetToken, nuevaPassword)
            const json = await res.json()
            if (!res.ok) {
                setError(json?.message || 'Error al actualizar la contraseña')
            } else {
                setSuccess('¡Contraseña actualizada! Redirigiendo...')
                setTimeout(() => router.push('/login'), 2000)
            }
        } catch {
            setError('Error de conexión. Verifica tu internet.')
        } finally {
            setIsLoading(false)
        }
    }

    const stepTitles = [
        { title: 'Recuperar contraseña', subtitle: 'Te enviaremos un código a tu correo' },
        { title: 'Verifica tu identidad', subtitle: 'Ingresa el código de 6 dígitos' },
        { title: 'Nueva contraseña', subtitle: 'Elige una contraseña segura' },
    ]

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1F4363] relative overflow-hidden font-sans pt-14">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-[#FF821E] rounded-full mix-blend-multiply filter blur-[120px] opacity-[0.08]"></div>
                <div className="absolute top-[30%] -right-[10%] w-[50%] h-[50%] bg-[#198E7B] rounded-full mix-blend-multiply filter blur-[120px] opacity-[0.08]"></div>
            </div>

            <div className="w-full max-w-md p-6 relative z-10">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-8 md:p-10 border border-white/10">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FF821E] text-white font-extrabold text-2xl shadow-lg shadow-orange-500/30 mb-6">
                            360
                        </div>
                        <h2 className="text-2xl font-bold text-[#333333] tracking-tight">
                            {stepTitles[step - 1].title}
                        </h2>
                        <p className="text-gray-500 text-sm mt-2">{stepTitles[step - 1].subtitle}</p>
                    </div>

                    {/* Progress */}
                    <div className="flex gap-2 mb-8">
                        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < step ? 'bg-[#FF821E]' : 'bg-gray-200'}`}
                            />
                        ))}
                    </div>

                    {/* Step 1: Email */}
                    {step === 1 && (
                        <form onSubmit={handleEnviarCodigo} className="space-y-6">
                            <InputField
                                label="Correo Electrónico"
                                icon={Mail}
                                name="email"
                                type="email"
                                placeholder="ejemplo@empresa.com"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setError(null) }}
                            />
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                                    {error}
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#FF821E] text-white font-bold py-4 rounded-xl shadow-xl shadow-orange-500/20 hover:bg-[#e5700f] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                            >
                                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <>Enviar código <ArrowRight size={20} /></>}
                            </button>
                        </form>
                    )}

                    {/* Step 2: OTP */}
                    {step === 2 && (
                        <form onSubmit={handleVerificarCodigo} className="space-y-6">
                            <p className="text-center text-sm text-gray-500">
                                Código enviado a <span className="font-bold text-[#1F4363]">{email}</span>
                            </p>

                            <div className="flex justify-center gap-3" onPaste={handleOtpPaste}>
                                {codigo.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputsRef.current[index] = el)}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                        className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl outline-none transition-all
                                            border-gray-200 focus:border-[#FF821E] focus:ring-2 focus:ring-[#FF821E]/20
                                            text-[#1F4363]"
                                    />
                                ))}
                            </div>

                            {countdown > 0 && (
                                <p className="text-center text-sm text-gray-400">
                                    El código expira en <span className="font-bold text-[#FF821E]">{formatCountdown()}</span>
                                </p>
                            )}

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => { setStep(1); setError(null); setCodigo(['', '', '', '', '', '']) }}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-[#1F4363] hover:bg-gray-50 transition-colors"
                                >
                                    <ArrowLeft size={18} /> Atrás
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 bg-[#FF821E] text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-500/20 hover:bg-[#e5700f] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                                >
                                    {isLoading ? <Loader2 size={20} className="animate-spin" /> : <>Verificar <ArrowRight size={20} /></>}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Step 3: Nueva contraseña */}
                    {step === 3 && (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <InputPassword
                                label="Nueva Contraseña"
                                name="nuevaPassword"
                                placeholder="Mínimo 8 caracteres"
                                value={nuevaPassword}
                                onChange={(e) => { setNuevaPassword(e.target.value); setError(null) }}
                            />
                            <InputPassword
                                label="Confirmar Contraseña"
                                name="confirmarPassword"
                                placeholder="Repite tu contraseña"
                                value={confirmarPassword}
                                onChange={(e) => { setConfirmarPassword(e.target.value); setError(null) }}
                            />

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
                                    {success}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading || !!success}
                                className="w-full bg-[#FF821E] text-white font-bold py-4 rounded-xl shadow-xl shadow-orange-500/20 hover:bg-[#e5700f] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                            >
                                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <>Actualizar contraseña <ArrowRight size={20} /></>}
                            </button>
                        </form>
                    )}

                    <div className="mt-6 text-center text-sm text-gray-500">
                        <Link href="/login" className="font-bold text-[#1F4363] hover:text-[#FF821E] transition-colors">
                            Volver al inicio de sesión
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
