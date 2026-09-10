'use client'

import React from 'react'
import Link from 'next/link'

export default function TarjetaMetrica({ label, value, color, sublabel, href }) {
  const valorNumerico = typeof value === 'number' ? value : 0
  const colorEfectivo = valorNumerico === 0 ? 'rgba(31,47,87,0.4)' : color

  const NumeroElement = href && valorNumerico > 0 ? (
    <Link href={href} className="hover:underline cursor-pointer" style={{ color: colorEfectivo }}>
      {value}
    </Link>
  ) : (
    <span style={{ color: colorEfectivo }}>{value ?? '—'}</span>
  )

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '0.5px solid rgba(31,47,87,0.12)',
        borderRadius: 10,
        padding: 16,
      }}
    >
      <p
        className="text-xs mb-2"
        style={{ color: 'rgba(31,47,87,0.55)' }}
      >
        {label}
      </p>

      <p className="text-3xl font-medium" aria-hidden="true">
        {NumeroElement}
        <span className="sr-only">
          {value} {label}
        </span>
      </p>

      {sublabel && (
        <p
          className="text-xs mt-1"
          style={{
            color: valorNumerico === 0 ? 'rgba(31,47,87,0.35)' : colorEfectivo,
          }}
        >
          {sublabel}
        </p>
      )}
    </div>
  )
}
