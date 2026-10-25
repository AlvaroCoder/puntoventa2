'use client'
import React, { useState, useMemo } from 'react'
import { toast } from 'react-toastify'
import { deleteTienda, updateTienda } from '@/Connections/tiendas'
import PageTienda from '@/modules/inventary/PageTienda'
import useTienda from '@/modules/inventary/hooks/useTienda'
export default function Page() {
    const { tiendas, loading, error, setTiendas } = useTienda();
    const [query, setQuery]       = useState('')
    const [tiendaEdit, setTiendaEdit] = useState(null)

    const filtered = useMemo(() => {
        if (!query.trim()) return tiendas
        const q = query.toLowerCase()
        return tiendas.filter(t =>
            (t.nombre      ?? '').toLowerCase().includes(q) ||
            (t.codigo      ?? '').toLowerCase().includes(q) ||
            (t.responsable ?? '').toLowerCase().includes(q) ||
            (t.direccion   ?? '').toLowerCase().includes(q)
        )
    }, [tiendas, query])

    const handleEdit = tienda => setTiendaEdit(tienda)

    const handleDelete = async id => {
        if (!confirm('¿Eliminar esta tienda? Esta acción no se puede deshacer.')) return
        const res = await fetch('/api/tienda/' + id, { method: 'DELETE' });
        if (res.ok) {
            setTiendas(prev => prev.filter(t => t.id !== id))
            toast.success('Tienda eliminada')
        } else {
            toast.error(res.message || 'Error al eliminar')
        }
    }

    const handleToggleEstado = async tienda => {
        const res = await updateTienda(tienda.id, { activa: !tienda.activa })
        if (res.ok) {
            const updated = { ...tienda, activa: !tienda.activa }
            setTiendas(prev => prev.map(t => t.id === tienda.id ? updated : t))
            toast.success(updated.activa ? 'Tienda activada' : 'Tienda desactivada')
        } else {
            toast.error(res.message || 'Error al cambiar estado')
        }
    }

    return (
     <PageTienda
        query={query}
        loading={loading}
        filtered={filtered}
        setQuery={setQuery}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleToggleEstado={handleToggleEstado}
      />
    );
}