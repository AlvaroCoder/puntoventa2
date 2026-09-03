'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import {
    Loader2, ArrowLeft, Save, ChevronRight,Phone, MapPin, User, Hash, Calendar, Store
} from 'lucide-react'
import { useAuth } from '@/Context/AuthContext'
import { createTienda } from '@/Connections/tiendas'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/Inputs/Field'
import { IconInput } from '@/components/Inputs/IconInput'

const INITIAL = {
    nombre: '',
    codigo: '',
    direccion: '',
    telefono: '',
    responsable:    '',
    fecha_apertura: '',
}


export default function CreateTiendaPage() {
    const { user }  = useAuth()
    const router    = useRouter()

    const [form, setForm]     = useState(INITIAL)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const handleChange = e => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
    }

    const validate = () => {
        const e = {}
        if (!form.nombre.trim())  e.nombre = 'El nombre de la tienda es obligatorio'
        if (!form.codigo.trim())  e.codigo  = 'El código de tienda es obligatorio'
        return e
    }

    const handleSave = async () => {
        const e = validate()
        if (Object.keys(e).length) { setErrors(e); return }

        setLoading(true)
        try {
            const payload = Object.fromEntries(
                Object.entries({ ...form, empresa_id: user?.empresa_id })
                    .filter(([, v]) => v !== '' && v !== null && v !== undefined)
            )

            const res = await createTienda(payload)

            if (!res.ok || res.status > 400) {
                toast.error(res.message || 'No se pudo crear la tienda')
                return
            }
            toast.success('Tienda creada correctamente')
            router.push('/dashboard/tiendas')
        } catch {
            toast.error('Error inesperado al guardar')
        } finally {
            setLoading(false)
        }
    }

    const SaveBtn = ({ small = false }) => (
        <Button
            onClick={handleSave}
            disabled={loading}
            className={`flex items-center gap-1.5 bg-[#FF821E] hover:bg-[#FF821E]/90 text-white font-bold shadow-sm ${small ? '' : ''}`}
        >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            Guardar Tienda
        </Button>
    )

    return (
        <div className="w-full max-w-3xl mx-auto px-6 py-8">

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Link href="/dashboard/tiendas" className="hover:text-[#1F4363] transition-colors font-medium">
                        Tiendas
                    </Link>
                    <ChevronRight size={14} />
                    <span className="text-[#1F4363] font-semibold">Nueva Tienda</span>
                </div>

            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                <div className="flex items-center gap-4 px-8 pt-7 pb-6 border-b border-gray-100">
                    <div className="w-12 h-12 rounded-xl bg-[#FE811F]/10 flex items-center justify-center shrink-0">
                        <Store size={22} className="text-[#FE811F]" />
                    </div>
                    <div className="flex-1">
                        <input
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            placeholder="Nombre de la tienda"
                            className={`w-full text-2xl font-bold text-[#1F4363] placeholder-gray-300 border-b-2 pb-1 bg-transparent outline-none transition-colors
                                ${errors.nombre ? 'border-red-400' : 'border-gray-200 focus:border-[#FF821E]'}`}
                        />
                        {errors.nombre && (
                            <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 px-8 py-7">

                    <div className="flex flex-col gap-5">

                        <Field label="Código de tienda" required error={errors.codigo}>
                            <IconInput
                                icon={Hash}
                                name="codigo"
                                placeholder="Ej: TDA-001"
                                value={form.codigo}
                                onChange={handleChange}
                                error={errors.codigo}
                            />
                        </Field>

                        <Field label="Dirección">
                            <IconInput
                                icon={MapPin}
                                name="direccion"
                                placeholder="Ej: Av. Ejemplo 123, Lima"
                                value={form.direccion}
                                onChange={handleChange}
                            />
                        </Field>

                        <Field label="Fecha de apertura">
                            <div className="relative">
                                <Calendar size={14} className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
                                <Input
                                    type="date"
                                    name="fecha_apertura"
                                    value={form.fecha_apertura}
                                    onChange={handleChange}
                                    className="pl-9 focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E] text-[#1F4363]"
                                />
                            </div>
                        </Field>

                    </div>

                    <div className="flex flex-col gap-5">

                        <Field label="Responsable">
                            <IconInput
                                icon={User}
                                name="responsable"
                                placeholder="Nombre del responsable"
                                value={form.responsable}
                                onChange={handleChange}
                            />
                        </Field>

                        <Field label="Teléfono">
                            <IconInput
                                icon={Phone}
                                name="telefono"
                                placeholder="Ej: 987654321"
                                value={form.telefono}
                                onChange={handleChange}
                            />
                        </Field>

                    </div>
                </div>

            </div>

            {/* Acciones bottom */}
            <div className="flex justify-end gap-2 mt-4">
                <Button
                    variant="outline"
                    onClick={() => router.push('/dashboard/tiendas')}
                    className="border-gray-200 text-gray-500 hover:bg-gray-50"
                >
                    Cancelar
                </Button>
                <SaveBtn />
            </div>

        </div>
    )
}