'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import useTrabajadores from '@/modules/trabajador/hooks/useTrabajadores'
import PageTrabajadores from '@/modules/trabajador/PageTrabajadores'

export default function Page() {
  const router = useRouter()
  const { trabajadores, loading, setTrabajadores } = useTrabajadores()
  const [query, setQuery] = useState('')

  const handleInvitar = () => {
    router.push('/dashboard/trabajadores/invitar')
  }

  const handleEditar = (id) => {
    router.push(`/dashboard/trabajadores/${id}/editar`)
  }

  const handleEliminar = (id) => {
    if (!confirm('¿Eliminar este empleado? Esta accion no se puede deshacer.')) return
    // TODO: llamar API de eliminacion cuando esté disponible
    setTrabajadores(prev => prev.filter(t => t.id !== id))
  }

  return (
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
