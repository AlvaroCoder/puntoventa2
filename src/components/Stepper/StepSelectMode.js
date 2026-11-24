'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Check, Link2 } from 'lucide-react'

const URL_LOGO_FULL = "https://res.cloudinary.com/dabyqnijl/image/upload/v1788581897/01_bl0vpw.png"

const NEGOCIO_ITEMS = [
  'Creas tu empresa y tu primera tienda',
  'Te pedimos RUC y razón social',
]
const EMPLEADO_ITEMS = [
  'Solo creas tu usuario, sin datos de empresa',
  'Te unes con el código o enlace del dueño',
]

function OptionCard({ selected, onClick, icon, title, description, items, badge }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-start p-6 rounded-2xl text-left w-full transition-all duration-200"
      style={{
        border: selected ? '2px solid #198E7B' : '1.5px solid rgba(31,47,87,0.15)',
        background: selected ? 'rgba(25,142,123,0.04)' : '#fff',
        outline: 'none',
      }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-2xl"
        style={{
          background: selected ? 'rgba(25,142,123,0.12)' : 'rgba(31,47,87,0.07)',
          color: selected ? '#198E7B' : '#1F2F57',
        }}
      >
        {icon}
      </div>

      <h3 className="text-base font-extrabold mb-1" style={{ color: '#1F2F57' }}>{title}</h3>
      <p className="text-sm mb-4 leading-relaxed" style={{ color: 'rgba(31,47,87,0.55)' }}>{description}</p>

      <div className="flex flex-col gap-2 mb-5">
        {items.map(item => (
          <div key={item} className="flex items-start gap-2">
            <Check size={14} className="mt-0.5 shrink-0" style={{ color: '#198E7B' }} />
            <span className="text-sm" style={{ color: 'rgba(31,47,87,0.7)' }}>{item}</span>
          </div>
        ))}
      </div>

      <span
        className="text-xs font-semibold px-3 py-1.5 rounded-full"
        style={{
          background: selected ? 'rgba(25,142,123,0.1)' : 'rgba(31,47,87,0.06)',
          color:      selected ? '#198E7B'              : 'rgba(31,47,87,0.5)',
        }}
      >
        {badge}
      </span>
    </button>
  )
}

export default function StepSelectMode({ onSelect }) {
  const [seleccion, setSeleccion] = useState(null)

  return (
    <div className="flex flex-col h-full px-8 md:px-10 py-8 gap-6">

      {/* Logo */}
      <Image src={URL_LOGO_FULL} width={180} height={56} alt="PuntoVenta360" className="shrink-0" />

      {/* Título */}
      <div>
        <h1 className="text-2xl font-extrabold" style={{ color: '#1F2F57' }}>
          ¿Cómo vas a usar PuntoVenta360?
        </h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(31,47,87,0.5)' }}>
          Elige una opción. Así te pedimos solo lo necesario.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <OptionCard
          selected={seleccion === 'negocio'}
          onClick={() => setSeleccion('negocio')}
          icon="🏪"
          title="Tengo un negocio"
          description="Quiero vender, controlar mi stock y emitir boletas."
          items={NEGOCIO_ITEMS}
          badge="3 pasos · 3 minutos"
        />
        <OptionCard
          selected={seleccion === 'empleado'}
          onClick={() => setSeleccion('empleado')}
          icon="👤"
          title="Trabajo en una tienda"
          description="Soy vendedor, cajero o almacenero de un negocio que ya usa PuntoVenta360."
          items={EMPLEADO_ITEMS}
          badge="2 pasos · 1 minuto"
        />
      </div>

      {/* Banner invitación */}
      <div
        className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm"
        style={{ background: 'rgba(25,142,123,0.06)', border: '1px solid rgba(25,142,123,0.15)' }}
      >
        <Link2 size={16} className="shrink-0 mt-0.5" style={{ color: '#198E7B' }} />
        <p style={{ color: 'rgba(31,47,87,0.7)' }}>
          ¿Te llegó un <strong>enlace de invitación</strong> por WhatsApp o correo?
          Ábrelo directamente: ya tendrá tu tienda y tu rol listos.
        </p>
      </div>

      {/* Footer */}
      <div className="mt-auto flex flex-col gap-4">
        <p className="text-xs text-center" style={{ color: 'rgba(31,47,87,0.4)' }}>
          Al registrarte aceptas nuestros{' '}
          <Link href="/terms" className="font-bold hover:underline" style={{ color: '#1F2F57' }}>Términos de Uso</Link>
          {' '}y{' '}
          <Link href="/privacy" className="font-bold hover:underline" style={{ color: '#1F2F57' }}>Privacidad</Link>
          .{' '}¿Ya tienes cuenta?{' '}
          <Link href="/login" className="font-bold hover:underline" style={{ color: '#FE811F' }}>Iniciar Sesión</Link>
        </p>

        <div className="flex justify-end">
          <button
            type="button"
            disabled={!seleccion}
            onClick={() => seleccion && onSelect(seleccion)}
            className="flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm text-white transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: seleccion ? '#198E7B' : '#198E7B' }}
          >
            Crear mi usuario →
          </button>
        </div>
      </div>

    </div>
  )
}
