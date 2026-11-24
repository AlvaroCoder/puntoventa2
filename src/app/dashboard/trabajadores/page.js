'use client'
import React, { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import useTrabajadores from '@/modules/trabajador/hooks/useTrabajadores'
import PageTrabajadores from '@/modules/trabajador/PageTrabajadores'


function PersonalContent() {
  const router = useRouter()

  const { trabajadores, loading, setTrabajadores } = useTrabajadores();
  const [query, setQuery] = useState('')

  const handleInvitar = () => router.push('/dashboard/trabajadores/invitar')
  const handleEditar  = (id) => router.push(`/dashboard/trabajadores/editar?id=${id}`)
  const handleEliminar = (id) => {
    if (!confirm('¿Eliminar este empleado? Esta acción no se puede deshacer.')) return
    setTrabajadores(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#E8EDF5]">
      <PageTrabajadores
        trabajadores={trabajadores}
        loading={loading}
        query={query}
        setQuery={setQuery}
        handleInvitar={handleInvitar}
        handleEditar={handleEditar}
        handleEliminar={handleEliminar}
      />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <PersonalContent />
    </Suspense>
  )
}
