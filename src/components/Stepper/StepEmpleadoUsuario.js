'use client'
import React, { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, CreditCard } from 'lucide-react'
import Link from 'next/link'

const REQS = [
  { key: 'len',   label: 'Mínimo 8 caracteres', test: p => p.length >= 8 },
  { key: 'upper', label: 'Una mayúscula',        test: p => /[A-Z]/.test(p) },
  { key: 'num',   label: 'Un número',            test: p => /\d/.test(p) },
]

export default function StepEmpleadoUsuario({ formData, onChange, errors }) {
  const [showPass, setShowPass] = useState(false)
  const { email = '', password = '' } = formData
  const passResults = REQS.map(r => ({ ...r, ok: r.test(password) }))

  return (
    <div className="flex flex-col gap-5 animate-in slide-in-from-right-4 duration-300">

      <div>
        <h2 className="text-2xl font-extrabold" style={{ color: '#1F2F57' }}>Crea tu usuario</h2>
        <p className="text-sm mt-1" style={{ color: 'rgba(31,47,87,0.5)' }}>
          Solo lo necesario para que tu jefe te reconozca.
        </p>
      </div>

      {/* Google button (UI only) */}
      <button
        type="button"
        className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-semibold text-sm transition-all hover:bg-gray-50 active:scale-[0.98]"
        style={{ border: '1.5px solid rgba(31,47,87,0.2)', color: '#1F2F57' }}
      >
        <svg width="18" height="18" viewBox="0 0 48 48">
          <path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.7 33.9 29.8 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 20-8 20-20 0-1.3-.2-2.7-.5-4z"/>
        </svg>
        Continuar con Google
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: 'rgba(31,47,87,0.1)' }} />
        <span className="text-xs" style={{ color: 'rgba(31,47,87,0.4)' }}>o con tu correo</span>
        <div className="flex-1 h-px" style={{ background: 'rgba(31,47,87,0.1)' }} />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold" style={{ color: '#1F2F57' }}>
          Correo <span className="text-red-500">(*)</span>
        </label>
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
          style={{
            border: errors?.email ? '1.5px solid #EF4444' : '1.5px solid rgba(31,47,87,0.2)',
            background: '#fff',
          }}
        >
          <Mail size={16} style={{ color: 'rgba(31,47,87,0.4)' }} />
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            placeholder="correo@ejemplo.com"
            className="flex-1 outline-none text-sm bg-transparent"
            style={{ color: '#1F2F57' }}
          />
        </div>
        {errors?.email && <p className="text-xs text-red-500">{errors.email}</p>}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold" style={{ color: '#1F2F57' }}>
          Contraseña <span className="text-red-500">(*)</span>
        </label>
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
          style={{
            border: errors?.password ? '1.5px solid #EF4444' : password ? '1.5px solid #198E7B' : '1.5px solid rgba(31,47,87,0.2)',
            background: '#fff',
          }}
        >
          <Lock size={16} style={{ color: 'rgba(31,47,87,0.4)' }} />
          <input
            type={showPass ? 'text' : 'password'}
            name="password"
            value={password}
            onChange={onChange}
            placeholder="••••••••••"
            className="flex-1 outline-none text-sm bg-transparent"
            style={{ color: '#1F2F57' }}
          />
          <button type="button" onClick={() => setShowPass(p => !p)} className="shrink-0">
            {showPass
              ? <EyeOff size={16} style={{ color: 'rgba(31,47,87,0.4)' }} />
              : <Eye     size={16} style={{ color: 'rgba(31,47,87,0.4)' }} />
            }
          </button>
        </div>
        {errors?.password && <p className="text-xs text-red-500">{errors.password}</p>}

        {password.length > 0 && (
          <div className="flex items-center gap-4 mt-1 flex-wrap">
            {passResults.map(r => (
              <span
                key={r.key}
                className="flex items-center gap-1 text-xs font-medium"
                style={{ color: r.ok ? '#198E7B' : 'rgba(31,47,87,0.4)' }}
              >
                {r.ok ? '✓' : '·'} {r.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Info box */}
      <div
        className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm"
        style={{ background: 'rgba(31,47,87,0.04)', border: '1px solid rgba(31,47,87,0.1)' }}
      >
        <CreditCard size={16} className="shrink-0 mt-0.5" style={{ color: 'rgba(31,47,87,0.4)' }} />
        <p style={{ color: 'rgba(31,47,87,0.6)' }}>
          No te pedimos DNI ni RUC. Si tu tienda lo necesita (por ejemplo, para planilla),
          el dueño te lo pedirá después.
        </p>
      </div>

      {/* Terms */}
      <p className="text-xs text-center" style={{ color: 'rgba(31,47,87,0.4)' }}>
        Al registrarte aceptas nuestros{' '}
        <Link href="/terms" className="font-bold hover:underline" style={{ color: '#1F2F57' }}>Términos de Uso</Link>
        {' '}y{' '}
        <Link href="/privacy" className="font-bold hover:underline" style={{ color: '#1F2F57' }}>Privacidad</Link>.{' '}
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="font-bold hover:underline" style={{ color: '#FE811F' }}>Iniciar Sesión</Link>
      </p>

    </div>
  )
}
