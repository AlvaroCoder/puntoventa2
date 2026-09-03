'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { ChevronRight, ChevronDown, Hash, Text, Warehouse, Loader2, Save, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/Context/AuthContext'
import { Field } from '@/components/Inputs/Field'
import { IconInput } from '@/components/Inputs/IconInput'
import { Button } from '@/components/ui/button'
import { createAlmacen } from '@/Connections/almacen'
import { getTiendasByEmpresa } from '@/Connections/tiendas'

const TIPO_ALMACEN = ['VITRINA', 'PRINCIPAL', 'DEPOSITO', 'TRANSITO', 'VIRTUAL']

const TIPO_LABEL = {
    VITRINA:   { label: 'Vitrina',   desc: 'Espacio de exhibición al cliente'    },
    PRINCIPAL: { label: 'Principal', desc: 'Almacén central de la tienda'         },
    DEPOSITO:  { label: 'Depósito',  desc: 'Zona de almacenamiento secundario'    },
    TRANSITO:  { label: 'Tránsito',  desc: 'Mercancía en movimiento entre tiendas'},
    VIRTUAL:   { label: 'Virtual',   desc: 'Almacén lógico sin ubicación física'  },
}

const INITIAL = {
    tiendaId:    '',
    nombre:      '',
    codigo:      '',
    tipo:        'VITRINA',
    descripcion: '',
}

/* ── Select estilizado ────────────────────────────────────────── */
function StyledSelect({ name, value, onChange, options, placeholder, error }) {
    return (
        <div className="relative">
            <select
                name={name}
                value={value}
                onChange={onChange}
                className={`w-full h-10 pl-3 pr-9 rounded-lg border bg-white text-sm text-[#1F4363] appearance-none
                    focus:outline-none focus:ring-2 focus:ring-[#FF821E]/30 focus:border-[#FF821E] transition-colors
                    ${error ? 'border-red-400' : 'border-gray-200'}
                    ${!value ? 'text-gray-400' : ''}`}
            >
                {placeholder && <option value="" disabled>{placeholder}</option>}
                {options.map(o => (
                    <option key={typeof o === 'string' ? o : o.value} value={typeof o === 'string' ? o : o.value}>
                        {typeof o === 'string' ? o : o.label}
                    </option>
                ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
        </div>
    )
}

export default function Page() {
    const { user }  = useAuth()
    const router    = useRouter()

    const [form, setForm]       = useState(INITIAL)
    const [errors, setErrors]   = useState({})
    const [loading, setLoading] = useState(false)
    const [tiendas, setTiendas] = useState([])
    const [loadingTiendas, setLoadingTiendas] = useState(true)

    /* Cargar tiendas de la empresa */
    useEffect(() => {
        if (!user?.empresa_id) return
        async function fetchTiendas() {
            try {
                const res = await getTiendasByEmpresa(user.empresa_id)
                setTiendas(res?.data?.data ?? [])
            } catch {
                toast.error('No se pudieron cargar las tiendas')
            } finally {
                setLoadingTiendas(false)
            }
        }
        fetchTiendas()
    }, [user])

    const handleChange = e => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
    }

    const validate = () => {
        const e = {}
        if (!form.tiendaId)         e.tiendaId = 'Selecciona una tienda'
        if (!form.nombre.trim())    e.nombre   = 'El nombre es obligatorio'
        if (form.nombre.length > 100) e.nombre = 'Máximo 100 caracteres'
        if (!form.codigo.trim())    e.codigo   = 'El código es obligatorio'
        if (form.codigo.length > 20)  e.codigo = 'Máximo 20 caracteres'
        if (!form.tipo)             e.tipo     = 'Selecciona un tipo'
        return e
    }

    const handleSave = async () => {
        const e = validate()
        if (Object.keys(e).length) { setErrors(e); return }

        setLoading(true)
        try {
            const payload = {
                tiendaId:    Number(form.tiendaId),
                nombre:      form.nombre.trim(),
                codigo:      form.codigo.trim(),
                tipo:        form.tipo,
                ...(form.descripcion.trim() && { descripcion: form.descripcion.trim() }),
            }

            const res = await createAlmacen(payload)

            if (!res.ok || res.status > 400) {
                toast.error(res.message || 'No se pudo crear el almacén')
                return
            }
            toast.success('Almacén creado correctamente')
            router.push('/dashboard/almacen')
        } catch {
            toast.error('Error inesperado al guardar')
        } finally {
            setLoading(false)
        }
    }

    const tiendaOpts = tiendas.map(t => ({ value: String(t.id), label: t.nombre }))

    return (
        <div className="w-full max-w-3xl mx-auto px-6 py-8">

            {/* Breadcrumb + acciones */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Link href="/dashboard/almacenes" className="hover:text-[#1F4363] transition-colors font-medium">
                        Almacenes
                    </Link>
                    <ChevronRight size={14} />
                    <span className="text-[#1F4363] font-semibold">Nuevo Almacén</span>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => router.push('/dashboard/almacenes')}
                        className="flex items-center gap-1.5 border-gray-200 text-gray-500 hover:bg-gray-50"
                    >
                        <ArrowLeft size={15} />
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-1.5 bg-[#FF821E] hover:bg-[#FF821E]/90 text-white font-bold shadow-sm"
                    >
                        {loading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                        Guardar Almacén
                    </Button>
                </div>
            </div>

            {/* Tarjeta principal */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                {/* Header con nombre */}
                <div className="flex items-center gap-4 px-8 pt-7 pb-6 border-b border-gray-100">
                    <div className="w-12 h-12 rounded-xl bg-[#1F4363]/8 flex items-center justify-center shrink-0">
                        <Warehouse size={22} className="text-[#1F4363]" />
                    </div>
                    <div className="flex-1">
                        <input
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            placeholder="Nombre del almacén"
                            maxLength={100}
                            className={`w-full text-2xl font-bold text-[#1F4363] placeholder-gray-300 border-b-2 pb-1 bg-transparent outline-none transition-colors
                                ${errors.nombre ? 'border-red-400' : 'border-gray-200 focus:border-[#FF821E]'}`}
                        />
                        {errors.nombre
                            ? <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>
                            : <p className="text-xs text-gray-400 mt-1">{form.nombre.length}/100 caracteres</p>
                        }
                    </div>
                </div>

                {/* Campos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 px-8 py-7">

                    {/* Tienda */}
                    <Field label="Tienda" required error={errors.tiendaId}>
                        {loadingTiendas ? (
                            <div className="h-10 rounded-lg border border-gray-200 bg-gray-50 flex items-center px-3 gap-2">
                                <Loader2 size={14} className="animate-spin text-gray-400" />
                                <span className="text-sm text-gray-400">Cargando tiendas...</span>
                            </div>
                        ) : (
                            <StyledSelect
                                name="tiendaId"
                                value={form.tiendaId}
                                onChange={handleChange}
                                options={tiendaOpts}
                                placeholder="Selecciona una tienda"
                                error={errors.tiendaId}
                            />
                        )}
                    </Field>

                    {/* Código */}
                    <Field label="Código de almacén" required error={errors.codigo}>
                        <IconInput
                            icon={Hash}
                            name="codigo"
                            placeholder="Ej: ALM-001"
                            value={form.codigo}
                            onChange={handleChange}
                            maxLength={20}
                            error={errors.codigo}
                        />
                    </Field>

                    {/* Tipo */}
                    <Field label="Tipo de almacén" required error={errors.tipo}>
                        <StyledSelect
                            name="tipo"
                            value={form.tipo}
                            onChange={handleChange}
                            options={TIPO_ALMACEN}
                            error={errors.tipo}
                        />
                        {form.tipo && (
                            <p className="text-xs text-gray-400 -mt-0.5">
                                {TIPO_LABEL[form.tipo]?.desc}
                            </p>
                        )}
                    </Field>

                    {/* Descripción */}
                    <Field label="Descripción" error={errors.descripcion}>
                        <IconInput
                            icon={Text}
                            name="descripcion"
                            placeholder="Descripción opcional del almacén"
                            value={form.descripcion}
                            onChange={handleChange}
                            error={errors.descripcion}
                        />
                    </Field>

                </div>
            </div>

            {/* Acciones bottom */}
            <div className="flex justify-end gap-2 mt-4">
                <Button
                    variant="outline"
                    onClick={() => router.push('/dashboard/almacenes')}
                    className="border-gray-200 text-gray-500 hover:bg-gray-50"
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-1.5 bg-[#FF821E] hover:bg-[#FF821E]/90 text-white font-bold shadow-sm"
                >
                    {loading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                    Guardar Almacén
                </Button>
            </div>

        </div>
    )
}
