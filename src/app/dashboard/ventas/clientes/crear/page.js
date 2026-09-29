'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, Search } from 'lucide-react'
import InputFillable from '@/app/dashboard/inventario/productos/crear/components/InputFillable'
import SwitcherLoader from '@/components/Navigation/SwitcherLoader'
import { useAuth } from '@/Context/AuthContext'
import { createCliente } from '@/Connections/clientes'
import { toast } from 'react-toastify'

const TIPOS_DOCUMENTO = [
    { label: 'DNI',       value: 1 },
    { label: 'RUC',       value: 2 },
    { label: 'Carnet de extranjería', value: 3 },
    { label: 'Pasaporte', value: 4 },
]

const CATEGORIAS_CLIENTE = ['REGULAR', 'RESPONSABLE', 'VIP', 'DEUDOR', 'MOROSO']

const BASE_INPUT_STYLE = {
    border:     '1px solid rgba(31,47,87,0.18)',
    color:      '#1F2F57',
    background: '#fff',
}
const onFocusInput = e => {
    e.target.style.borderColor = '#3960A9'
    e.target.style.boxShadow   = '0 0 0 3px rgba(57,96,169,0.1)'
}
const onBlurInput = e => {
    e.target.style.borderColor = 'rgba(31,47,87,0.18)'
    e.target.style.boxShadow   = 'none'
}

function Field({ label, required, hint, children }) {
    return (
        <div className="grid items-start gap-6" style={{ gridTemplateColumns: '160px 1fr' }}>
            <div className="pt-2.5">
                <p className="text-sm font-semibold" style={{ color: '#1F2F57' }}>
                    {label}
                    {required && <span className="ml-0.5" style={{ color: '#C0392B' }}>*</span>}
                </p>
                {hint && (
                    <p className="text-[11px] mt-0.5" style={{ color: 'rgba(31,47,87,0.4)' }}>
                        {hint}
                    </p>
                )}
            </div>
            <div className="min-w-0">{children}</div>
        </div>
    )
}

export default function CreateClientePage() {
    const router = useRouter()
    const { user } = useAuth()

    const [nombreFocused, setNombreFocused] = useState(false)
    const [loading, setLoading]             = useState(false)
    const [form, setForm] = useState({
        nombre_completo:  '',
        tipo_documento:   1,
        numero_documento: '',
        categoria:        'REGULAR',
        email:            '',
        telefono:         '',
        direccion:        '',
        fecha_nacimiento: '',
    })

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

    const handleSave = async () => {
        setLoading(true)
        try {
            const payload = {
                empresa_id:       user?.empresa_id,
                tipo_documento:   Number(form.tipo_documento),
                numero_documento: form.numero_documento,
                nombre_completo:  form.nombre_completo,
                categoria:        form.categoria,
                ...(form.email            && { email:            form.email }),
                ...(form.telefono         && { telefono:         form.telefono }),
                ...(form.direccion        && { direccion:        form.direccion }),
                ...(form.fecha_nacimiento && { fecha_nacimiento: form.fecha_nacimiento }),
            }
            await createCliente(payload);
            
            toast.success("Se creo correctamente el ")
            router.push("/dashboard/ventas/clientes")
        } catch (err) {
            toast.error("Hubo un error al crear el cliente");
            console.log("Cliente error ", err);
            
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#E1E7F0]">

            <div className="bg-white px-8 py-4" style={{ borderBottom: '0.5px solid rgba(31,47,87,0.1)' }}>
                <div className="flex items-center justify-between gap-4">

                    <nav className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(31,47,87,0.45)' }}>
                        <button
                            onClick={() => router.push('/dashboard/ventas')}
                            className="hover:underline transition-colors hover:text-[#1F2F57]"
                        >
                            Ventas
                        </button>
                        <ChevronRight size={12} />
                        <button
                            onClick={() => router.push('/dashboard/ventas/clientes')}
                            className="hover:underline transition-colors hover:text-[#1F2F57]"
                        >
                            Clientes
                        </button>
                        <ChevronRight size={12} />
                        <span className="font-semibold" style={{ color: '#1F2F57' }}>
                            {form.nombre_completo || 'Nuevo cliente'}
                        </span>
                    </nav>

                    <SwitcherLoader loading={loading}>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => router.push('/dashboard/ventas/clientes')}
                                className="px-4 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-gray-50"
                                style={{ border: '0.5px solid rgba(31,47,87,0.2)', color: '#1F2F57' }}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                className="px-5 py-2 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-90"
                                style={{ background: '#1F2F57' }}
                            >
                                Guardar
                            </button>
                        </div>
                    </SwitcherLoader>
                </div>
            </div>

            <div className="px-8 py-6 max-w-4xl mx-auto w-full flex flex-col gap-4">

                <div className="bg-white rounded-xl overflow-visible" style={{ border: '0.5px solid rgba(31,47,87,0.12)' }}>
                    <div className="px-8 py-7 flex flex-col gap-7">

                        <div>
                            <p
                                className="text-xs font-semibold uppercase tracking-wider mb-2"
                                style={{ color: 'rgba(31,47,87,0.4)' }}
                            >
                                Cliente
                            </p>
                            <InputFillable
                                value={form.nombre_completo}
                                keyValue="nombre_completo"
                                set={set}
                                onFocus={() => setNombreFocused(true)}
                                onBlur={() => setNombreFocused(false)}
                                placeholder="Nombre completo del cliente"
                                nombreFocused={nombreFocused}
                            />
                        </div>

                        <div className="flex flex-col gap-6">

                            <Field label="Tipo documento" required hint="Tipo de documento de identidad">
                                <select
                                    value={form.tipo_documento}
                                    onChange={e => set('tipo_documento', e.target.value)}
                                    className="h-10 px-3.5 rounded-xl text-sm outline-none appearance-none transition-all"
                                    style={{ ...BASE_INPUT_STYLE, width: '260px' }}
                                    onFocus={onFocusInput}
                                    onBlur={onBlurInput}
                                >
                                    {TIPOS_DOCUMENTO.map(t => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                            </Field>

                            <Field label="N° documento" required hint="Número según tipo seleccionado">
                                <div className="flex items-center gap-2">
                                    <input
                                        value={form.numero_documento}
                                        onChange={e => set('numero_documento', e.target.value)}
                                        placeholder={form.tipo_documento == 1 ? 'Ej: 76543401' : form.tipo_documento == 2 ? 'Ej: 20512345678' : 'Ej: 00123456'}
                                        maxLength={form.tipo_documento == 2 ? 11 : 8}
                                        className="h-10 px-3.5 rounded-xl text-sm outline-none transition-all"
                                        style={{ ...BASE_INPUT_STYLE, width: '220px' }}
                                        onFocus={onFocusInput}
                                        onBlur={onBlurInput}
                                    />
                                    {(form.tipo_documento == 1 || form.tipo_documento == 2) && (
                                        <button
                                            type="button"
                                            title="Buscar en SUNAT"
                                            className="h-10 w-10 rounded-xl flex items-center justify-center transition-colors hover:bg-[#E1E7F0]"
                                            style={{ border: '1px solid rgba(31,47,87,0.18)' }}
                                        >
                                            <Search size={13} style={{ color: 'rgba(31,47,87,0.45)' }} />
                                        </button>
                                    )}
                                </div>
                            </Field>

                            <Field label="Categoría" hint="Clasificación del cliente">
                                <select
                                    value={form.categoria}
                                    onChange={e => set('categoria', e.target.value)}
                                    className="h-10 px-3.5 rounded-xl text-sm outline-none appearance-none transition-all"
                                    style={{ ...BASE_INPUT_STYLE, width: '220px' }}
                                    onFocus={onFocusInput}
                                    onBlur={onBlurInput}
                                >
                                    {CATEGORIAS_CLIENTE.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </Field>

                        </div>
                    </div>
                </div>

                {/* Configuración avanzada */}
                <div className="bg-white rounded-xl overflow-visible" style={{ border: '0.5px solid rgba(31,47,87,0.12)' }}>
                    <div className="px-8 py-7 flex flex-col gap-7">

                        <div>
                            <p className="text-sm font-semibold" style={{ color: '#1F2F57' }}>
                                Configuración avanzada
                                <span
                                    className="ml-2 text-[10px] font-medium px-2 py-0.5 rounded-full"
                                    style={{ background: 'rgba(31,47,87,0.07)', color: 'rgba(31,47,87,0.5)' }}
                                >
                                    Opcional
                                </span>
                            </p>
                            <p className="text-[11px] mt-0.5" style={{ color: 'rgba(31,47,87,0.4)' }}>
                                Datos de contacto y personales adicionales del cliente.
                            </p>
                        </div>

                        <div className="flex flex-col gap-6">

                            <Field label="Email" hint="Correo electrónico de contacto">
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => set('email', e.target.value)}
                                    placeholder="Ej: cliente@email.com"
                                    className="h-10 px-3.5 rounded-xl text-sm outline-none transition-all w-full"
                                    style={{ ...BASE_INPUT_STYLE, maxWidth: '340px' }}
                                    onFocus={onFocusInput}
                                    onBlur={onBlurInput}
                                />
                            </Field>

                            <Field label="Teléfono" hint="Número de contacto">
                                <input
                                    value={form.telefono}
                                    onChange={e => set('telefono', e.target.value)}
                                    placeholder="Ej: 987 654 321"
                                    className="h-10 px-3.5 rounded-xl text-sm outline-none transition-all"
                                    style={{ ...BASE_INPUT_STYLE, width: '220px' }}
                                    onFocus={onFocusInput}
                                    onBlur={onBlurInput}
                                />
                            </Field>

                            <Field label="Dirección" hint="Domicilio o dirección del cliente">
                                <input
                                    value={form.direccion}
                                    onChange={e => set('direccion', e.target.value)}
                                    placeholder="Ej: Av. Los Olivos 123, Lima"
                                    className="h-10 px-3.5 rounded-xl text-sm outline-none transition-all w-full"
                                    style={BASE_INPUT_STYLE}
                                    onFocus={onFocusInput}
                                    onBlur={onBlurInput}
                                />
                            </Field>

                            <Field label="Fecha nacimiento" hint="Fecha de nacimiento del cliente">
                                <input
                                    type="date"
                                    value={form.fecha_nacimiento}
                                    onChange={e => set('fecha_nacimiento', e.target.value)}
                                    className="h-10 px-3.5 rounded-xl text-sm outline-none transition-all"
                                    style={{ ...BASE_INPUT_STYLE, width: '200px' }}
                                    onFocus={onFocusInput}
                                    onBlur={onBlurInput}
                                />
                            </Field>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}