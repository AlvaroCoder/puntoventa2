'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import {
    ChevronDown, Loader2, ArrowLeft, Save,
    User, Building2, Phone, Mail,
    CreditCard, ShoppingBag, ChevronRight,
    Camera
} from 'lucide-react'
import { useAuth } from '@/Context/AuthContext'
import { createCliente } from '@/Connections/clientes'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const URL_LOGO_PROFILE = 'https://res.cloudinary.com/dabyqnijl/image/upload/v1788026847/puntoVenta360/imageProfile_on5tzk.png'

const TIPO_DOCUMENTO = ['DNI', 'RUC', 'C.E.', 'Pasaporte']
const CATEGORIAS     = ['RESPONSABLE', 'REGULAR', 'MOROSO', 'DEUDOR', 'VIP']
const TIPO_PERSONA   = ['Individual', 'Empresa']

const DOC_LONGITUD = { DNI: 8, RUC: 11, 'C.E.': null, Pasaporte: null }

const INITIAL = {
    tipo_documento:   'DNI',
    numero_documento: '',
    nombre_completo:  '',
    email:            '',
    telefono:         '',
    direccion:        '',
    categoria:        'RESPONSABLE',
}

const TABS = [
    { id: 'credito',  label: 'Crédito',              Icon: CreditCard  },
    { id: 'historial', label: 'Historial de compras', Icon: ShoppingBag },
]

/* ── Selector de campo con label ──────────────────────────────── */
function Field({ label, required, error, children }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {label}{required && <span className="text-red-400 ml-0.5">*</span>}
            </label>
            {children}
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    )
}

/* ── Select personalizado ─────────────────────────────────────── */
function Select({ name, value, onChange, options }) {
    return (
        <div className="relative">
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="w-full h-10 pl-3 pr-9 rounded-lg border border-gray-200 bg-white text-sm text-[#1F4363] appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF821E]/30 focus:border-[#FF821E] transition-colors"
            >
                {options.map(o => (
                    <option key={o} value={o}>{o}</option>
                ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
        </div>
    )
}

/* ── Sección de Crédito (maqueta) ─────────────────────────────── */
function CreditoTab() {
    return (
        <div className="py-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                    { label: 'Límite de crédito',  value: 'S/ 0.00',   sub: 'Sin límite configurado'  },
                    { label: 'Deuda actual',        value: 'S/ 0.00',   sub: 'Al día'                  },
                    { label: 'Créditos activos',    value: '0',          sub: 'Sin créditos abiertos'  },
                ].map(({ label, value, sub }) => (
                    <div key={label} className="bg-gray-50 rounded-xl px-5 py-4 border border-gray-100">
                        <p className="text-xs text-gray-400 font-medium mb-1">{label}</p>
                        <p className="text-xl font-bold text-[#1F4363]">{value}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                    </div>
                ))}
            </div>

            <div className="border border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center gap-2 text-center">
                <CreditCard size={28} className="text-gray-300" />
                <p className="text-sm font-semibold text-gray-400">Sin historial de crédito</p>
                <p className="text-xs text-gray-400">
                    Guarda primero el cliente para poder crear créditos
                </p>
            </div>
        </div>
    )
}

/* ── Sección de Historial (maqueta) ───────────────────────────── */
function HistorialTab() {
    return (
        <div className="py-6">
            <div className="border border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center gap-2 text-center">
                <ShoppingBag size={28} className="text-gray-300" />
                <p className="text-sm font-semibold text-gray-400">Sin compras registradas</p>
                <p className="text-xs text-gray-400">
                    El historial de compras aparecerá aquí una vez que el cliente realice su primera venta
                </p>
            </div>
        </div>
    )
}

/* ── Página principal ─────────────────────────────────────────── */
export default function CreateClientPage() {
    const { user }   = useAuth()
    const router     = useRouter()

    const [form, setForm]         = useState(INITIAL)
    const [tipoPersona, setTipoPersona] = useState('Individual')
    const [loading, setLoading]   = useState(false)
    const [errors, setErrors]     = useState({})
    const [activeTab, setActiveTab] = useState('credito')

    const handleChange = e => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
    }

    const validate = () => {
        const e = {}
        if (!form.nombre_completo.trim()) e.nombre_completo = 'El nombre es obligatorio'
        if (!form.numero_documento.trim()) e.numero_documento = 'El número de documento es obligatorio'
        else {
            const len = DOC_LONGITUD[form.tipo_documento]
            if (len && form.numero_documento.length !== len)
                e.numero_documento = `El ${form.tipo_documento} debe tener ${len} dígitos`
        }
        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            e.email = 'El correo electrónico no es válido'
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
            const res = await createCliente(payload)

            if (!res.ok || res.status > 400) {
                toast.error(res.message || 'No se pudo crear el cliente')
                return
            }
            toast.success('Cliente creado correctamente')
            router.push('/dashboard/clientes')
        } catch {
            toast.error('Error inesperado al guardar')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-6 py-8">

            {/* Breadcrumb + acciones */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Link href="/dashboard/clientes" className="hover:text-[#1F4363] transition-colors font-medium">
                        Clientes
                    </Link>
                    <ChevronRight size={14} />
                    <span className="text-[#1F4363] font-semibold">Nuevo Cliente</span>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => router.push('/dashboard/clientes')}
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
                        {loading
                            ? <Loader2 size={15} className="animate-spin" />
                            : <Save size={15} />
                        }
                        Guardar Cliente
                    </Button>
                </div>
            </div>

            {/* Tarjeta principal */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                {/* Tipo de persona */}
                <div className="flex items-center gap-6 px-8 pt-6 pb-0">
                    {TIPO_PERSONA.map(tipo => (
                        <button
                            key={tipo}
                            onClick={() => setTipoPersona(tipo)}
                            className="flex items-center gap-2 text-sm font-medium transition-colors"
                        >
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors
                                ${tipoPersona === tipo
                                    ? 'border-[#FF821E]'
                                    : 'border-gray-300'
                                }`}
                            >
                                {tipoPersona === tipo && (
                                    <div className="w-2 h-2 rounded-full bg-[#FF821E]" />
                                )}
                            </div>
                            <span className={tipoPersona === tipo ? 'text-[#1F4363]' : 'text-gray-400'}>
                                {tipo === 'Individual' ? <User size={14} className="inline mr-1" /> : <Building2 size={14} className="inline mr-1" />}
                                {tipo}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Nombre + Avatar */}
                <div className="flex items-start gap-6 px-8 pt-5 pb-0">
                    <div className="flex-1">
                        <input
                            name="nombre_completo"
                            value={form.nombre_completo}
                            onChange={handleChange}
                            placeholder="Nombre completo del cliente"
                            className={`w-full text-2xl font-bold text-[#1F4363] placeholder-gray-300 border-b-2 pb-2 bg-transparent outline-none transition-colors
                                ${errors.nombre_completo
                                    ? 'border-red-400'
                                    : 'border-gray-200 focus:border-[#FF821E]'
                                }`}
                        />
                        {errors.nombre_completo && (
                            <p className="text-xs text-red-500 mt-1">{errors.nombre_completo}</p>
                        )}
                    </div>

                    {/* Avatar */}
                    <div className="relative shrink-0 group cursor-pointer">
                        <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50 group-hover:border-[#FF821E]/50 transition-colors">
                            <Image
                                src={URL_LOGO_PROFILE}
                                alt="Foto de perfil"
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute inset-0 rounded-xl bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera size={18} className="text-white" />
                        </div>
                    </div>
                </div>

                {/* Separador */}
                <div className="border-t border-gray-100 mx-8 mt-6" />

                {/* Campos en dos columnas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 px-8 py-6">

                    {/* Columna izquierda */}
                    <div className="flex flex-col gap-5">

                        <Field label="Documento" required error={errors.numero_documento}>
                            <div className="flex gap-2">
                                <div className="w-32 shrink-0">
                                    <Select
                                        name="tipo_documento"
                                        value={form.tipo_documento}
                                        onChange={handleChange}
                                        options={TIPO_DOCUMENTO}
                                    />
                                </div>
                                <Input
                                    name="numero_documento"
                                    placeholder="Número de documento"
                                    value={form.numero_documento}
                                    onChange={handleChange}
                                    className={`flex-1 focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E] ${errors.numero_documento ? 'border-red-400' : ''}`}
                                />
                            </div>
                        </Field>

                        <Field label="Dirección">
                            <Input
                                name="direccion"
                                placeholder="Ej: Av. Ejemplo 123, Lima"
                                value={form.direccion}
                                onChange={handleChange}
                                className="focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                            />
                        </Field>

                        <Field label="Categoría">
                            <Select
                                name="categoria"
                                value={form.categoria}
                                onChange={handleChange}
                                options={CATEGORIAS}
                            />
                        </Field>

                    </div>

                    {/* Columna derecha */}
                    <div className="flex flex-col gap-5">

                        <Field label="Teléfono">
                            <div className="relative">
                                <Phone size={14} className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
                                <Input
                                    name="telefono"
                                    placeholder="Ej: 987654321"
                                    value={form.telefono}
                                    onChange={handleChange}
                                    className="pl-9 focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                                />
                            </div>
                        </Field>

                        <Field label="Correo electrónico" error={errors.email}>
                            <div className="relative">
                                <Mail size={14} className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="correo@ejemplo.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    className={`pl-9 focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E] ${errors.email ? 'border-red-400' : ''}`}
                                />
                            </div>
                        </Field>

                    </div>
                </div>

                {/* Tabs */}
                <div className="border-t border-gray-100">
                    <div className="flex items-center gap-0 px-8">
                        {TABS.map(({ id, label, Icon }) => (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors
                                    ${activeTab === id
                                        ? 'border-[#FF821E] text-[#1F4363]'
                                        : 'border-transparent text-gray-400 hover:text-[#1F4363]'
                                    }`}
                            >
                                <Icon size={15} />
                                {label}
                            </button>
                        ))}
                    </div>

                    <div className="px-8">
                        {activeTab === 'credito'   && <CreditoTab />}
                        {activeTab === 'historial' && <HistorialTab />}
                    </div>
                </div>

            </div>

            {/* Acciones bottom */}
            <div className="flex justify-end gap-2 mt-4">
                <Button
                    variant="outline"
                    onClick={() => router.push('/dashboard/clientes')}
                    className="border-gray-200 text-gray-500 hover:bg-gray-50"
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-[#FF821E] hover:bg-[#FF821E]/90 text-white font-bold shadow-sm flex items-center gap-1.5"
                >
                    {loading
                        ? <Loader2 size={15} className="animate-spin" />
                        : <Save size={15} />
                    }
                    Guardar Cliente
                </Button>
            </div>

        </div>
    )
}