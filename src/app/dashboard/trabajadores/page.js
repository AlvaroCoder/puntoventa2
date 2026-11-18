'use client'
import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Users } from 'lucide-react'
import useTrabajadores from '@/modules/trabajador/hooks/useTrabajadores'
import PageTrabajadores from '@/modules/trabajador/PageTrabajadores'
import PageRolesPermisos from '@/modules/trabajador/PageRolesPermisos'

const TABS = [
  { key: 'empleados', label: 'Empleados' },
  { key: 'roles',     label: 'Roles y permisos' },
]

function PersonalContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab') ?? 'empleados'

  const { trabajadores, loading, setTrabajadores } = useTrabajadores()
  const [query, setQuery] = useState('')

  const handleInvitar = () => router.push('/dashboard/trabajadores/invitar')
  const handleEditar  = (id) => router.push(`/dashboard/trabajadores/editar?id=${id}`)
  const handleEliminar = (id) => {
    if (!confirm('¿Eliminar este empleado? Esta acción no se puede deshacer.')) return
    setTrabajadores(prev => prev.filter(t => t.id !== id))
  }

  const goTab = (key) => {
    router.push(key === 'empleados' ? '/dashboard/trabajadores' : '/dashboard/trabajadores?tab=roles')
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#E8EDF5]">
      {/* Header con tabs */}
      <div
        className="bg-white px-6 pt-5 pb-0"
        style={{ borderBottom: '1px solid rgba(31,47,87,0.1)' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(31,47,87,0.07)' }}
          >
            <Users size={16} style={{ color: '#1F2F57' }} />
          </div>
          <span className="text-xl font-bold" style={{ color: '#1F2F57' }}>Personal</span>
        </div>
        <div className="flex gap-0">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => goTab(t.key)}
              className="px-5 py-2.5 text-sm font-semibold transition-all"
              style={{
                color: tab === t.key ? '#1F2F57' : 'rgba(31,47,87,0.45)',
                borderBottom: tab === t.key ? '2px solid #1F2F57' : '2px solid transparent',
                marginBottom: -1,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido según tab activo */}
      {tab === 'roles'
        ? <PageRolesPermisos />
        : (
          <PageTrabajadores
            trabajadores={trabajadores}
            loading={loading}
            query={query}
            setQuery={setQuery}
            handleInvitar={handleInvitar}
            handleEditar={handleEditar}
            handleEliminar={handleEliminar}
          />
        )
      }
    </div>
  )
}

export default function Page() {
  return (
    <Suspense>
      <PersonalContent />
    </Suspense>
  )
}
