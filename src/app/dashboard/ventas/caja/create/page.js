'use client'
import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronRight, RefreshCw } from 'lucide-react'
import InputFillable from '@/app/dashboard/inventario/productos/crear/components/InputFillable'
import SwitcherLoader from '@/components/Navigation/SwitcherLoader'
import SearchableSelect from '@/app/dashboard/inventario/components/SearchableSelect'
import { useAuth } from '@/Context/AuthContext'
import { createCaja, abrirCaja } from '@/Connections/caja'
import { getTiendasByEmpresa } from '@/Connections/tiendas'
import { toast } from 'react-toastify'

function generarCodigo(nombre) {
    const prefix = nombre.trim().slice(0, 3).toUpperCase().replace(/\s/g, '') || 'CAJ'
    const num    = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')
    return `${prefix}-${num}`
}

const MONEDAS = [
    { value: 'PEN', label: 'PEN — Sol peruano' },
    { value: 'USD', label: 'USD — Dólar americano' },
    { value: 'EUR', label: 'EUR — Euro' },
]

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

function CreateCajaForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { user }     = useAuth()

    const tiendaIdParam = searchParams.get('tiendaId')

    const [nombreFocused, setNombreFocused] = useState(false)
    const [loading, setLoading]             = useState(false)
    const [tiendas, setTiendas]             = useState([])
    const [form, setForm] = useState({
        nombre:   '',
        codigo:   '',
        moneda:   'PEN',
        tiendaId: tiendaIdParam ? Number(tiendaIdParam) : null,
    })

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

    useEffect(() => {
        if (!user?.empresa_id) return
        getTiendasByEmpresa(user.empresa_id)
            .then(res => setTiendas(res?.data?.data?.data ?? res?.data?.data ?? res?.data ?? []))
            .catch(() => toast.error('Error al cargar las tiendas'))
    }, [user?.empresa_id])

    const handleNombreBlur = () => {
        setNombreFocused(false)
        if (!form.codigo && form.nombre.trim())
            set('codigo', generarCodigo(form.nombre))
    }

    const buildPayload = () => ({
        tiendaId: form.tiendaId,
        nombre:   form.nombre,
        codigo:   form.codigo,
        moneda:   form.moneda,
    })

    const validate = () => {
        if (!form.tiendaId) { toast.error('Selecciona una tienda'); return false }
        if (!form.nombre.trim()) { toast.error('Ingresa el nombre de la caja'); return false }
        if (!form.codigo.trim()) { toast.error('Ingresa un código'); return false }
        return true
    }

    const handleCreate = async () => {
        if (!validate()) return
        setLoading(true)
        try {
            await createCaja(buildPayload())
            toast.success('Caja creada correctamente')
            router.push('/dashboard/ventas/caja')
        } catch {
            toast.error('Error al crear la caja')
        } finally {
            setLoading(false)
        }
    }

    const handleCreateAndOpen = async () => {
        if (!validate()) return
        setLoading(true)
      try {
        const sendData = {
          trabajadorId: user?.trabajador_id,
          montoApertura: 0,
          observaciones : "Se creo e inicio la caja"
          }
            const res    = await createCaja(buildPayload())
            const cajaId = res?.data?.data?.id ?? res?.data?.id
            if (cajaId) await abrirCaja(cajaId, sendData)
            toast.success('Caja creada y abierta correctamente')
            router.push('/dashboard/ventas/caja')
        } catch {
            toast.error('Error al crear/abrir la caja')
        } finally {
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
                            onClick={() => router.push('/dashboard/ventas/caja')}
                            className="hover:underline transition-colors hover:text-[#1F2F57]"
                        >
                            Caja
                        </button>
                        <ChevronRight size={12} />
                        <span className="font-semibold" style={{ color: '#1F2F57' }}>
                            {form.nombre || 'Nueva caja'}
                        </span>
                    </nav>

                    <SwitcherLoader loading={loading}>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => router.push('/dashboard/ventas/caja')}
                                className="px-4 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-gray-50"
                                style={{ border: '0.5px solid rgba(31,47,87,0.2)', color: '#1F2F57' }}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleCreate}
                                className="px-5 py-2 rounded-lg text-xs font-bold transition-opacity hover:opacity-90"
                                style={{ background: 'rgba(31,47,87,0.12)', color: '#1F2F57' }}
                            >
                                Crear caja
                            </button>
                            <button
                                type="button"
                                onClick={handleCreateAndOpen}
                                className="px-5 py-2 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-90"
                                style={{ background: '#1F2F57' }}
                            >
                                Crear y abrir
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
                                Caja
                            </p>
                            <InputFillable
                                value={form.nombre}
                                keyValue="nombre"
                                set={set}
                                onFocus={() => setNombreFocused(true)}
                                onBlur={handleNombreBlur}
                                placeholder="Nombre de la caja"
                                nombreFocused={nombreFocused}
                            />
                        </div>

                        <div className="flex flex-col gap-6">

                            <Field label="Tienda" required hint="Local donde se ubicará la caja">
                                <SearchableSelect
                                    options={tiendas}
                                    value={form.tiendaId}
                                    onChange={v => set('tiendaId', v)}
                                    labelKey="nombre"
                                    valueKey="id"
                                    placeholder="Selecciona una tienda"
                                />
                            </Field>

                            <Field label="Código" required hint="Identificador único de la caja">
                                <div className="flex items-center gap-2">
                                    <input
                                        value={form.codigo}
                                        onChange={e => set('codigo', e.target.value.toUpperCase())}
                                        placeholder="Ej: CAJ-001"
                                        className="h-10 px-3.5 rounded-xl text-sm outline-none transition-all"
                                        style={{ ...BASE_INPUT_STYLE, width: '220px' }}
                                        onFocus={onFocusInput}
                                        onBlur={onBlurInput}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => set('codigo', generarCodigo(form.nombre))}
                                        title="Generar código automáticamente"
                                        className="h-10 w-10 rounded-xl flex items-center justify-center transition-colors hover:bg-[#E1E7F0]"
                                        style={{ border: '1px solid rgba(31,47,87,0.18)' }}
                                    >
                                        <RefreshCw size={13} style={{ color: 'rgba(31,47,87,0.45)' }} />
                                    </button>
                                </div>
                            </Field>

                            <Field label="Moneda" hint="Moneda principal de operación">
                                <select
                                    value={form.moneda}
                                    onChange={e => set('moneda', e.target.value)}
                                    className="h-10 px-3.5 rounded-xl text-sm outline-none appearance-none transition-all"
                                    style={{ ...BASE_INPUT_STYLE, width: '260px' }}
                                    onFocus={onFocusInput}
                                    onBlur={onBlurInput}
                                >
                                    {MONEDAS.map(m => (
                                        <option key={m.value} value={m.value}>{m.label}</option>
                                    ))}
                                </select>
                            </Field>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default function PageCreateCaja() {
  
    return (
        <Suspense>
            <CreateCajaForm />
        </Suspense>
    )
}