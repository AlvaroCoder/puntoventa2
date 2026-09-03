'use client'
import React, { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { Search } from 'lucide-react'
import { useAuth } from '@/Context/AuthContext'
import { getTiendasByEmpresa, deleteTienda, updateTienda } from '@/Connections/tiendas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import TableTiendas from '@/components/Tables/TableTiendas'
import SliderFormTienda from '@/components/Forms/SliderFormTienda'
import AddIcon from '@mui/icons-material/Add'
import { Title } from '@/components/Titles/Title'

export default function PageTiendas() {
    const { user } = useAuth()

    const [tiendas, setTiendas] = useState([])
    const [loading, setLoading]       = useState(true)
    const [query, setQuery]           = useState('')
    const [showForm, setShowForm]     = useState(false)
    const [tiendaEdit, setTiendaEdit] = useState(null)

    useEffect(() => {
        if (!user?.empresa_id) return
        async function load() {
            setLoading(true)
            try {
                const res = await getTiendasByEmpresa(user.empresa_id)
                setTiendas(res?.data?.data?.data ?? res?.data?.data ?? res?.data ?? [])
            } catch {
                toast.error('Error al cargar las tiendas')
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [user])


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

    const handleAddSuccess = nueva => {
        setTiendas(prev => [nueva, ...prev])
        setShowForm(false)
    }

    const handleUpdateSuccess = actualizada => {
        setTiendas(prev => prev.map(t => t.id === actualizada.id ? actualizada : t))
        setTiendaEdit(null)
    }

    const handleEdit = tienda => {
        setTiendaEdit(tienda)
        setShowForm(true)
    }

    const handleDelete = async id => {
        if (!confirm('¿Eliminar esta tienda? Esta acción no se puede deshacer.')) return
        const res = await deleteTienda(id)
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
        <div className="w-full p-8">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <Title>Tiendas</Title>
                    <p className="text-sm text-gray-400">Administra las tiendas o locales de tu empresa</p>
                </div>
                <Button
                    onClick={() => { setTiendaEdit(null); setShowForm(true) }}
                    className="flex items-center gap-2 bg-[#FF821E] hover:bg-[#FF821E]/90 text-white font-bold shadow-sm"
                >
                    <AddIcon style={{ fontSize: 18 }} />
                    Nueva Tienda
                </Button>
            </div>

            <div className="relative max-w-sm mb-4">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                    placeholder="Buscar por nombre, código o responsable..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="pl-9 focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <TableTiendas
                    data={filtered}
                    loading={loading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleEstado={handleToggleEstado}
                />
            </motion.div>

            <SliderFormTienda
                open={showForm}
                onClose={() => { setShowForm(false); setTiendaEdit(null) }}
                tiendaData={tiendaEdit}
                onAddSuccess={handleAddSuccess}
                onUpdateSuccess={handleUpdateSuccess}
            />

        </div>
    )
}