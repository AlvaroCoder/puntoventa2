'use client'
import React, { useEffect, useState } from 'react'
import { X, ChevronDown, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createTienda, updateTienda } from '@/Connections/tiendas'
import { useAuth } from '@/Context/AuthContext'

const INITIAL = {
    nombre:         '',
    codigo:         '',
    direccion:      '',
    telefono:       '',
    responsable:    '',
    fecha_apertura: new Date().toISOString().slice(0, 10),
}

function generateCodigo() {
    return `T${String(Math.floor(Math.random() * 900) + 100)}`
}

export default function SliderFormTienda({ open, onClose, tiendaData, onAddSuccess, onUpdateSuccess }) {
    const { user } = useAuth()
    const [form, setForm]         = useState(INITIAL)
    const [saving, setSaving]     = useState(false)
    const [sugerido]              = useState(generateCodigo)
    const isEdit = !!tiendaData

    useEffect(() => {
        if (!open) return
        if (tiendaData) {
            setForm({
                nombre:         tiendaData.nombre         ?? '',
                codigo:         tiendaData.codigo         ?? '',
                direccion:      tiendaData.direccion       ?? '',
                telefono:       tiendaData.telefono        ?? '',
                responsable:    tiendaData.responsable     ?? '',
                fecha_apertura: tiendaData.fecha_apertura
                    ? tiendaData.fecha_apertura.slice(0, 10)
                    : new Date().toISOString().slice(0, 10),
            })
        } else {
            setForm(INITIAL)
        }
    }, [tiendaData, open])

    const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const handleSubmit = async e => {
        e?.preventDefault()
        if (!form.nombre.trim()) { toast.warn('El nombre de la tienda es obligatorio'); return }
        if (!form.codigo.trim()) { toast.warn('El código de la tienda es obligatorio'); return }

        setSaving(true)
        try {
            const payload = {
                nombre:      form.nombre.trim(),
                codigo:      form.codigo.trim().toUpperCase(),
                empresa_id:  user?.empresa_id,
                ...(form.direccion   ? { direccion:   form.direccion }   : {}),
                ...(form.telefono    ? { telefono:    form.telefono }    : {}),
                ...(form.responsable ? { responsable: form.responsable } : {}),
                ...(form.fecha_apertura ? { fecha_apertura: form.fecha_apertura } : {}),
            }

            const res = isEdit
                ? await updateTienda(tiendaData.id, payload)
                : await createTienda(payload)

            if (!res.ok) {
                toast.error(res.message || 'Error al guardar la tienda')
                return
            }

            const result = res.data?.data ?? res.data ?? payload
            toast.success(isEdit ? 'Tienda actualizada' : 'Tienda creada correctamente')
            if (isEdit) onUpdateSuccess?.({ ...tiendaData, ...result })
            else        onAddSuccess?.(result)
            setForm(INITIAL)
            onClose()
        } catch {
            toast.error('Error inesperado al guardar')
        } finally {
            setSaving(false)
        }
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div className={`fixed inset-y-0 right-0 w-full max-w-[480px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
                    <div>
                        <h2 className="font-bold text-[#1F4363] text-lg">
                            {isEdit ? 'Editar Tienda' : 'Nueva Tienda'}
                        </h2>
                        <p className="text-sm text-gray-400">
                            {isEdit ? tiendaData?.nombre : 'Completa los datos de la tienda'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">

                    <div>
                        <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">
                            Nombre de la tienda <span className="text-red-500">*</span>
                        </label>
                        <Input
                            name="nombre"
                            placeholder="Ej: Tienda Centro"
                            value={form.nombre}
                            onChange={handleChange}
                            className="focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">
                            Código <span className="text-red-500">*</span>
                            <span className="text-xs font-normal text-gray-400 ml-1">(se convierte a mayúsculas)</span>
                        </label>
                        <div className="relative">
                            <Input
                                name="codigo"
                                placeholder={sugerido}
                                value={form.codigo}
                                onChange={handleChange}
                                className="focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E] pr-16 uppercase"
                            />
                            {!form.codigo && (
                                <button
                                    type="button"
                                    onClick={() => setForm(f => ({ ...f, codigo: sugerido }))}
                                    className="absolute right-2 top-2 text-[10px] text-[#FF821E] hover:underline font-bold"
                                >
                                    Sugerir
                                </button>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">Responsable</label>
                        <Input
                            name="responsable"
                            placeholder="Nombre del encargado"
                            value={form.responsable}
                            onChange={handleChange}
                            className="focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">Teléfono</label>
                        <Input
                            name="telefono"
                            placeholder="Ej: 920663473"
                            value={form.telefono}
                            onChange={handleChange}
                            className="focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">Dirección</label>
                        <Input
                            name="direccion"
                            placeholder="Ej: Av. Principal 123, Lima"
                            value={form.direccion}
                            onChange={handleChange}
                            className="focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">Fecha de apertura</label>
                        <Input
                            name="fecha_apertura"
                            type="date"
                            value={form.fecha_apertura}
                            onChange={handleChange}
                            className="focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                        />
                    </div>

                </form>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex gap-3 shrink-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 border-gray-200 text-gray-500 hover:bg-gray-50"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="flex-1 bg-[#FF821E] hover:bg-[#FF821E]/90 text-white font-bold"
                    >
                        {saving && <Loader2 size={15} className="animate-spin mr-2" />}
                        {isEdit ? 'Guardar cambios' : 'Crear tienda'}
                    </Button>
                </div>

            </div>
        </>
    )
}