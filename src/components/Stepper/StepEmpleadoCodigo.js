'use client'
import React, { useState } from 'react'
import { QrCode, Hash, Camera } from 'lucide-react'

export default function StepEmpleadoCodigo({ errors }) {
  const [tab, setTab]     = useState('qr')   // 'qr' | 'codigo'
  const [codigo, setCodigo] = useState('')

  return (
    <div className="flex flex-col gap-5 animate-in slide-in-from-right-4 duration-300">

      <div>
        <h2 className="text-2xl font-extrabold" style={{ color: '#1F2F57' }}>Únete a una tienda</h2>
        <p className="text-sm mt-1" style={{ color: 'rgba(31,47,87,0.5)' }}>
          Pídele al dueño el código QR o el código de invitación.
        </p>
      </div>

      {/* Tabs */}
      <div
        className="flex p-1 rounded-xl"
        style={{ background: 'rgba(31,47,87,0.07)' }}
      >
        {[
          { key: 'qr',     label: 'Escanear QR',      Icon: QrCode },
          { key: 'codigo', label: 'Ingresar código',   Icon: Hash },
        ].map(({ key, label, Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
            style={{
              background: tab === key ? '#fff'                   : 'transparent',
              color:      tab === key ? '#1F2F57'                : 'rgba(31,47,87,0.5)',
              boxShadow:  tab === key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* QR tab */}
      {tab === 'qr' && (
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-56 h-56 rounded-2xl flex flex-col items-center justify-center gap-3"
            style={{ border: '2px dashed rgba(31,47,87,0.2)', background: 'rgba(31,47,87,0.03)' }}
          >
            <Camera size={36} style={{ color: 'rgba(31,47,87,0.25)' }} />
            <p className="text-xs text-center px-6" style={{ color: 'rgba(31,47,87,0.4)' }}>
              Apunta la cámara al código QR que te compartió el dueño
            </p>
          </div>
          <button
            type="button"
            className="text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:opacity-90 active:scale-95"
            style={{ background: '#198E7B', color: '#fff' }}
          >
            Activar cámara
          </button>
          <p className="text-xs" style={{ color: 'rgba(31,47,87,0.4)' }}>
            Se pedirá permiso de acceso a la cámara
          </p>
        </div>
      )}

      {/* Código tab */}
      {tab === 'codigo' && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold" style={{ color: '#1F2F57' }}>
              Código de invitación <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={codigo}
              onChange={e => setCodigo(e.target.value.toUpperCase())}
              placeholder="Ej: TIENDA-A1B2C3"
              maxLength={20}
              className="w-full px-4 py-3.5 rounded-xl text-sm font-mono tracking-widest outline-none transition-all"
              style={{
                border: errors?.codigo
                  ? '1.5px solid #EF4444'
                  : codigo ? '1.5px solid #198E7B' : '1.5px solid rgba(31,47,87,0.2)',
                color: '#1F2F57',
              }}
            />
            {errors?.codigo && <p className="text-xs text-red-500">{errors.codigo}</p>}
          </div>

          <div
            className="px-4 py-3 rounded-xl text-sm"
            style={{ background: 'rgba(25,142,123,0.06)', border: '1px solid rgba(25,142,123,0.15)' }}
          >
            <p style={{ color: 'rgba(31,47,87,0.7)' }}>
              El dueño puede compartirte el código desde{' '}
              <strong style={{ color: '#1F2F57' }}>Personal → Invitar empleado</strong>.
            </p>
          </div>
        </div>
      )}

    </div>
  )
}
