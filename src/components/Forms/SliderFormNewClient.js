'use client'
import { ChevronDown, Loader2, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { createCliente } from '@/Connections/clientes'
import { useAuth } from '@/Context/AuthContext'

const TIPO_DOCUMENTO = ['DNI', 'RUC', 'C.E.', 'Pasaporte']
const CATEGORIAS = ['RESPONSABLE', 'REGULAR', 'MOROSO', 'DEUDOR', 'VIP']

const INITIAL = {
    tipo_documento:   'DNI',
    numero_documento: '',
    nombre_completo:  '',
    email: '',
    telefono: '',
    direccion: '',
    categoria: 'RESPONSABLE',
}

export default function SliderFormNewClient({ open, onClose, onSuccess }) {
    const { user } = useAuth()
    const [form, setForm] = useState(INITIAL)
    const [loadingSave, setLoadingSave] = useState(false);
    const [errores, setErrores] = useState(null);

    const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const DOC_LONGITUD = { 'DNI': 8, 'RUC': 11, 'C.E.': null, 'Pasaporte': null }

    useEffect(() => {
        if (!errores) return
        const timer = setTimeout(() => setErrores(null), 8000)
        return () => clearTimeout(timer)
    }, [errores])

    const handleSubmit = async e => {
        e.preventDefault()

        if (!form.numero_documento || !form.nombre_completo) {
            toast.warn('Completa los campos obligatorios')
            return
        }

        const longitudEsperada = DOC_LONGITUD[form.tipo_documento]
        if (longitudEsperada && form.numero_documento.length !== longitudEsperada) {
            setErrores({ key: 'documento', value: `El ${form.tipo_documento} debe tener ${longitudEsperada} dígitos` })
            return
        }

        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            setErrores({ key: 'email', value: 'El correo electrónico no es válido' })
            return
        }

        setLoadingSave(true)
        try {
            const payload = Object.fromEntries(
                Object.entries({ ...form, empresa_id: user?.empresa_id })
                    .filter(([, v]) => v !== '' && v !== null && v !== undefined)
            )
            
            const res = await createCliente(payload)
            
            if (!res.ok || res.status > 400) {
                toast(res.message || 'Error al crear el cliente', {
                    type: 'error',
                    position: 'bottom-left'
                });
                setErrores({
                    key: 'all',
                    value: 'No se pudo crear el cliente'
                });

                setForm(INITIAL);

                return
            }
            toast.success('Cliente creado correctamente', {
                position : 'bottom-right'
            })
            onSuccess(res.data ?? payload)
            setForm(INITIAL)
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
                className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-500 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            <div className={`fixed inset-y-0 right-0 w-full max-w-[480px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <div>
                        <h2 className="font-bold text-[#1F4363] text-lg">Nuevo Cliente</h2>
                        <p className="text-sm text-gray-400">Completa los datos del cliente</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">

                    <div>
                        <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">
                            Documento <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                            <div className="relative w-32 shrink-0">
                                <select
                                    name="tipo_documento"
                                    value={form.tipo_documento}
                                    onChange={handleChange}
                                    className="w-full h-10 pl-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-[#1F4363] appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF821E]/30 focus:border-[#FF821E]"
                                >
                                    {TIPO_DOCUMENTO.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="absolute right-2.5 top-3 text-gray-400 pointer-events-none" />
                            </div>

                            <div className='flex-1'>
                                <Input
                                name="numero_documento"
                                placeholder="Número de documento"
                                value={form.numero_documento}
                                onChange={handleChange}
                                className={`flex-1 focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E] ${errores?.key == "all" && 'border-red-400 focus-visible:border-red-200'}`}
                                />
                                {errores?.key == "documento" && <p className='text-xs text-red-500 mt-1'> Documento inválido</p>}
                            </div>

                        </div>
                    
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">
                            Nombre completo <span className="text-red-500">*</span>
                        </label>
                        <Input
                            name="nombre_completo"
                            placeholder="Ej: Example user"
                            value={form.nombre_completo}
                            onChange={handleChange}
                            className={`focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E] ${errores?.key == "all" && 'border-red-400 focus-visible:border-red-200'}`}

                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">
                            Correo electrónico
                        </label>
                        <Input
                            name="email"
                            type="email"
                            placeholder="correo@ejemplo.com"
                            value={form.email}
                            onChange={handleChange}
                            className={`focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E] ${errores?.key == 'all' && 'border-red-400 focus-visible:border-red-200'}`}
                        />
                        {errores?.key == 'email' && <p className='text-xs text-red-500 mt-1'> Email inválido</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">
                            Teléfono
                        </label>
                        <Input
                            name="telefono"
                            placeholder="Ej: 12345678"
                            value={form.telefono}
                            onChange={handleChange}
                            className={`focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E] ${errores?.key == 'all' && 'border-red-400 focus-visible:border-red-200'}`}
                        />

                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">
                            Dirección
                        </label>
                        <Input
                            name="direccion"
                            placeholder="Ej: Direccion 123"
                            value={form.direccion}
                            onChange={handleChange}
                            className={`focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E] ${errores?.key == 'all' && 'border-red-400 focus-visible:border-red-200'}`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">
                            Categoría
                        </label>
                        <div className="relative">
                            <select
                                name="categoria"
                                value={form.categoria}
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
                        type="submit"
                        disabled={loadingSave}
                        onClick={handleSubmit}
                        className="flex-1 bg-[#FF821E] hover:bg-[#FF821E]/90 text-white font-bold"
                    >
                        {loadingSave && <Loader2 size={16} className="animate-spin mr-2" />}
                        Guardar cliente
                    </Button>
                </div>

            </div>
        </>
    )
}
