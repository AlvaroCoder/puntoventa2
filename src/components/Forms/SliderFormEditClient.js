'use client'
import React, { useEffect, useState } from 'react'
import { X, ChevronDown, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { updateCliente } from '@/Connections/clientes'

const TIPO_DOCUMENTO = ['DNI', 'RUC', 'C.E.', 'Pasaporte']
const CATEGORIAS     = ['RESPONSABLE', 'REGULAR', 'MOROSO', 'DEUDOR', 'VIP']

export default function SliderFormEditClient({ open, onClose, clientData, onSuccess }) {
    const [form, setForm]         = useState({})
    const [loadingSave, setLoadingSave] = useState(false)

    // Sincronizar el form cuando cambia el cliente seleccionado
    useEffect(() => {
        if (clientData) {
            setForm({
                tipo_documento: clientData.tipo_documento   ?? 'DNI',
                numero_documento: clientData.numero_documento ?? '',
                nombre_completo:  clientData.nombre_completo  ?? '',
                email: clientData.email             ?? '',
                telefono: clientData.telefono          ?? '',
                direccion: clientData.direccion         ?? '',
                categoria: clientData.categoria         ?? 'REGULAR',
            })
        }
    }, [clientData])

    const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const handleSubmit = async e => {
        e.preventDefault()
        if (!form.nombre_completo || !form.numero_documento) {
            toast.warn('Completa los campos obligatorios')
            return
        }
        setLoadingSave(true)
        try {
            const res = await updateCliente(clientData.id, {
                ...form,
                empresa_id: clientData.empresa_id,
            })
            if (!res.ok) {
                toast.error(res.message || 'Error al actualizar el cliente')
                return
            }
            toast.success('Cliente actualizado correctamente')
            onSuccess({ ...clientData, ...form })
            onClose()
        } catch {
            toast.error('Error inesperado al guardar')
        } finally {
            setLoadingSave(false)
        }
    }

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            <div className={`fixed inset-y-0 right-0 w-full max-w-[480px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>

                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <div>
                        <h2 className="font-bold text-[#1F4363] text-lg">Editar Cliente</h2>
                        <p className="text-sm text-gray-400 truncate max-w-[300px]">
                            {clientData?.nombre_completo ?? ''}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">

                    {/* Documento */}
                    <div>
                        <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">
                            Documento <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                            <div className="relative w-36 shrink-0">
                                <select
                                    name="tipo_documento"
                                    value={form.tipo_documento ?? ''}
                                    onChange={handleChange}
                                    className="w-full h-10 pl-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-[#1F4363] appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF821E]/30 focus:border-[#FF821E]"
                                >
                                    {TIPO_DOCUMENTO.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="absolute right-2.5 top-3 text-gray-400 pointer-events-none" />
                            </div>
                            <Input
                                name="numero_documento"
                                placeholder="Número de documento"
                                value={form.numero_documento ?? ''}
                                onChange={handleChange}
                                className="flex-1 focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                            />
                        </div>
                    </div>

                    {/* Nombre completo */}
                    <div>
                        <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">
                            Nombre completo <span className="text-red-500">*</span>
                        </label>
                        <Input
                            name="nombre_completo"
                            placeholder="Ej: Alvaro Felipe Pupuche Morales"
                            value={form.nombre_completo ?? ''}
                            onChange={handleChange}
                            className="focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">
                            Correo electrónico
                        </label>
                        <Input
                            name="email"
                            type="email"
                            placeholder="correo@ejemplo.com"
                            value={form.email ?? ''}
                            onChange={handleChange}
                            className="focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                        />
                    </div>

                    {/* Teléfono */}
                    <div>
                        <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">
                            Teléfono
                        </label>
                        <Input
                            name="telefono"
                            placeholder="Ej: 920663473"
                            value={form.telefono ?? ''}
                            onChange={handleChange}
                            className="focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                        />
                    </div>

                    {/* Dirección */}
                    <div>
                        <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">
                            Dirección
                        </label>
                        <Input
                            name="direccion"
                            placeholder="Ej: Av. Los Jardines 123"
                            value={form.direccion ?? ''}
                            onChange={handleChange}
                            className="focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                        />
                    </div>

                    {/* Categoría */}
                    <div>
                        <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">
                            Categoría
                        </label>
                        <div className="relative">
                            <select
                                name="categoria"
                                value={form.categoria ?? ''}
                                onChange={handleChange}
                                className="w-full h-10 pl-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-[#1F4363] appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF821E]/30 focus:border-[#FF821E]"
                            >
                                {CATEGORIAS.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                </form>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
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
                        disabled={loadingSave}
                        className="flex-1 bg-[#FF821E] hover:bg-[#FF821E]/90 text-white font-bold"
                    >
                        {loadingSave && <Loader2 size={15} className="animate-spin mr-2" />}
                        Guardar cambios
                    </Button>
                </div>

            </div>
        </>
    )
}
