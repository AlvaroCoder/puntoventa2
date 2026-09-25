'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { ChevronRight, RefreshCw, Plus, Trash2, Warehouse } from 'lucide-react'
import { useAuth } from '@/Context/AuthContext'
import { createAlmacen } from '@/Connections/almacen'
import { getTiendasByEmpresa } from '@/Connections/tiendas'
import SwitcherLoader from '@/components/Navigation/SwitcherLoader'
import SearchableSelect from '../../components/SearchableSelect'

const TIPO_ALMACEN = ['VITRINA', 'PRINCIPAL', 'DEPOSITO', 'TRANSITO', 'VIRTUAL']

const TIPO_LABEL = {
    VITRINA:   { label: 'Vitrina',   desc: 'Espacio de exhibición al cliente'     },
    PRINCIPAL: { label: 'Principal', desc: 'Almacén central de la tienda'          },
    DEPOSITO:  { label: 'Depósito',  desc: 'Zona de almacenamiento secundario'     },
    TRANSITO:  { label: 'Tránsito',  desc: 'Mercancía en movimiento entre tiendas' },
    VIRTUAL:   { label: 'Virtual',   desc: 'Almacén lógico sin ubicación física'   },
}

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

function generarCodigoAlmacen(nombre) {
    const prefix = (nombre ?? '').trim().slice(0, 3).toUpperCase().replace(/\s/g, '') || 'ALM'
    const num    = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')
    return `${prefix}-${num}`
}

const ALMACEN_INITIAL = () => ({
    _id:         crypto.randomUUID(),
    nombre:      '',
    codigo:      '',
    tipo:        'VITRINA',
    descripcion: '',
})

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

function AlmacenCard({ almacen, index, total, onChange, onDelete }) {
    const set = (k, v) => onChange(almacen._id, k, v)

    return (
        <div
            className="rounded-xl overflow-hidden"
            style={{ border: '1px solid rgba(31,47,87,0.12)' }}
        >
            <div
                className="flex items-center justify-between px-5 py-3"
                style={{ background: 'rgba(31,47,87,0.04)', borderBottom: '0.5px solid rgba(31,47,87,0.1)' }}
            >
                <div className="flex items-center gap-2">
                    <Warehouse size={14} style={{ color: 'rgba(31,47,87,0.45)' }} />
                    <span className="text-xs font-semibold" style={{ color: '#1F2F57' }}>
                        Almacén {index + 1}
                        {almacen.nombre && (
                            <span className="ml-1.5 font-normal" style={{ color: 'rgba(31,47,87,0.45)' }}>
                                · {almacen.nombre}
                            </span>
                        )}
                    </span>
                </div>
                {total > 1 && (
                    <button
                        type="button"
                        onClick={() => onDelete(almacen._id)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors hover:bg-red-50"
                        style={{ color: '#C0392B' }}
                    >
                        <Trash2 size={12} />
                        Eliminar
                    </button>
                )}
            </div>

            <div className="px-5 py-5 flex flex-col gap-4">

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'rgba(31,47,87,0.45)' }}>
                            Nombre <span style={{ color: '#C0392B' }}>*</span>
                        </label>
                        <input
                            value={almacen.nombre}
                            onChange={e => {
                                set('nombre', e.target.value)
                                if (!almacen.codigo)
                                    set('codigo', generarCodigoAlmacen(e.target.value))
                            }}
                            placeholder="Ej: Vitrina principal"
                            className="h-9 px-3 rounded-lg text-sm outline-none transition-all"
                            style={BASE_INPUT_STYLE}
                            onFocus={onFocusInput}
                            onBlur={onBlurInput}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'rgba(31,47,87,0.45)' }}>
                            Código
                        </label>
                        <div className="flex gap-1.5">
                            <input
                                value={almacen.codigo}
                                onChange={e => set('codigo', e.target.value.toUpperCase())}
                                placeholder="Ej: VIT-001"
                                className="flex-1 h-9 px-3 rounded-lg text-sm outline-none transition-all min-w-0"
                                style={BASE_INPUT_STYLE}
                                onFocus={onFocusInput}
                                onBlur={onBlurInput}
                            />
                            <button
                                type="button"
                                onClick={() => set('codigo', generarCodigoAlmacen(almacen.nombre))}
                                title="Generar código"
                                className="h-9 w-9 rounded-lg flex items-center justify-center transition-colors hover:bg-[#E1E7F0] shrink-0"
                                style={{ border: '1px solid rgba(31,47,87,0.18)' }}
                            >
                                <RefreshCw size={12} style={{ color: 'rgba(31,47,87,0.45)' }} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'rgba(31,47,87,0.45)' }}>
                            Tipo
                        </label>
                        <select
                            value={almacen.tipo}
                            onChange={e => set('tipo', e.target.value)}
                            className="h-9 px-3 rounded-lg text-sm outline-none appearance-none transition-all"
                            style={BASE_INPUT_STYLE}
                            onFocus={onFocusInput}
                            onBlur={onBlurInput}
                        >
                            {TIPO_ALMACEN.map(t => (
                                <option key={t} value={t}>{TIPO_LABEL[t]?.label ?? t}</option>
                            ))}
                        </select>
                        {almacen.tipo && (
                            <p className="text-[11px]" style={{ color: 'rgba(31,47,87,0.4)' }}>
                                {TIPO_LABEL[almacen.tipo]?.desc}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'rgba(31,47,87,0.45)' }}>
                            Descripción
                        </label>
                        <input
                            value={almacen.descripcion}
                            onChange={e => set('descripcion', e.target.value)}
                            placeholder="Breve descripción (opcional)"
                            className="h-9 px-3 rounded-lg text-sm outline-none transition-all"
                            style={BASE_INPUT_STYLE}
                            onFocus={onFocusInput}
                            onBlur={onBlurInput}
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}

/* ── página ── */
export default function Page() {
    const { user }  = useAuth()
    const router    = useRouter()

    const [tiendaId, setTiendaId]             = useState(null)
    const [tiendaError, setTiendaError]       = useState(null)
    const [tiendas, setTiendas]               = useState([])
    const [loadingTiendas, setLoadingTiendas] = useState(true)
    const [almacenes, setAlmacenes]           = useState([ALMACEN_INITIAL()])
    const [loading, setLoading]               = useState(false)

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

    const addAlmacen    = () => setAlmacenes(prev => [...prev, ALMACEN_INITIAL()])
    const removeAlmacen = id => setAlmacenes(prev => prev.filter(a => a._id !== id))
    const updateAlmacen = (id, k, v) =>
        setAlmacenes(prev => prev.map(a => a._id === id ? { ...a, [k]: v } : a))

    const handleSave = async () => {
        let valid = true

        if (!tiendaId) {
            setTiendaError('Selecciona una tienda')
            valid = false
        } else {
            setTiendaError(null)
        }

        const sinNombre = almacenes.filter(a => !a.nombre.trim())
        if (sinNombre.length > 0) {
            toast.error('Todos los almacenes deben tener nombre')
            valid = false
        }

        if (!valid) return

        setLoading(true)
        try {
            const results = await Promise.all(
                almacenes.map(({ _id: _unused, nombre, codigo, tipo, descripcion }) =>
                    createAlmacen({
                        tiendaId:    Number(tiendaId),
                        nombre:      nombre.trim(),
                        codigo:      codigo.trim(),
                        tipo,
                        ...(descripcion.trim() && { descripcion: descripcion.trim() }),
                    })
                )
            )

            const fallidos = results.filter(r => !r.ok && r.status > 400)
            if (fallidos.length > 0) {
                toast.error(`${fallidos.length} almacén(es) no pudieron crearse`)
                return
            }

            const n = almacenes.length
            toast.success(n === 1 ? 'Almacén creado' : `${n} almacenes creados`)
            router.push('/dashboard/inventario/almacenes')
        } catch {
            toast.error('Error inesperado al guardar')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#E1E7F0]">

            {/* ── top bar ── */}
            <div className="bg-white px-8 py-4" style={{ borderBottom: '0.5px solid rgba(31,47,87,0.1)' }}>
                <div className="flex items-center justify-between gap-4">

                    <nav className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(31,47,87,0.45)' }}>
                        <button
                            onClick={() => router.push('/dashboard/inventario')}
                            className="hover:underline transition-colors hover:text-[#1F2F57]"
                        >
                            Inventario
                        </button>
                        <ChevronRight size={12} />
                        <button
                            onClick={() => router.push('/dashboard/inventario/almacenes')}
                            className="hover:underline transition-colors hover:text-[#1F2F57]"
                        >
                            Almacenes
                        </button>
                        <ChevronRight size={12} />
                        <span className="font-semibold" style={{ color: '#1F2F57' }}>
                            Nuevo Almacén
                        </span>
                    </nav>

                    <SwitcherLoader loading={loading}>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => router.push('/dashboard/inventario/almacenes')}
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

            {/* ── contenido ── */}
            <div className="px-8 py-6 max-w-4xl mx-auto w-full flex flex-col gap-4">

                {/* Tarjeta: Tienda */}
                <div className="bg-white rounded-xl overflow-visible" style={{ border: '0.5px solid rgba(31,47,87,0.12)' }}>
                    <div className="px-8 py-7 flex flex-col gap-6">

                        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(31,47,87,0.4)' }}>
                            Tienda
                        </p>

                        <Field label="Tienda" required hint="Tienda a la que pertenecen los almacenes">
                            {loadingTiendas ? (
                                <div
                                    className="h-11 rounded-lg flex items-center px-3.5 gap-2"
                                    style={{ border: '1px solid rgba(31,47,87,0.18)', background: '#fff' }}
                                >
                                    <svg
                                        className="animate-spin"
                                        width="14" height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="rgba(31,47,87,0.4)"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                    >
                                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                                    </svg>
                                    <span className="text-sm" style={{ color: 'rgba(31,47,87,0.38)' }}>
                                        Cargando tiendas...
                                    </span>
                                </div>
                            ) : (
                                <div>
                                    <SearchableSelect
                                        value={tiendaId}
                                        onChange={v => { setTiendaId(v); setTiendaError(null) }}
                                        options={tiendas}
                                        labelKey="nombre"
                                        valueKey="id"
                                        placeholder="Selecciona una tienda"
                                    />
                                    {tiendaError && (
                                        <p className="text-xs mt-1.5" style={{ color: '#C0392B' }}>
                                            {tiendaError}
                                        </p>
                                    )}
                                </div>
                            )}
                        </Field>

                    </div>
                </div>

                {/* Tarjeta: Almacenes */}
                <div className="bg-white rounded-xl overflow-visible" style={{ border: '0.5px solid rgba(31,47,87,0.12)' }}>
                    <div className="px-8 py-7 flex flex-col gap-5">

                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-semibold" style={{ color: '#1F2F57' }}>
                                    Almacenes
                                    <span
                                        className="ml-2 text-[10px] font-medium px-2 py-0.5 rounded-full"
                                        style={{ background: 'rgba(31,47,87,0.07)', color: 'rgba(31,47,87,0.5)' }}
                                    >
                                        {almacenes.length} {almacenes.length === 1 ? 'almacén' : 'almacenes'}
                                    </span>
                                </p>
                                <p className="text-[11px] mt-0.5" style={{ color: 'rgba(31,47,87,0.4)' }}>
                                    Configura cada almacén que deseas registrar en la tienda seleccionada.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={addAlmacen}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors hover:opacity-80 shrink-0"
                                style={{ background: 'rgba(57,96,169,0.1)', color: '#3960A9' }}
                            >
                                <Plus size={13} />
                                Agregar almacén
                            </button>
                        </div>

                        {almacenes.map((almacen, i) => (
                            <AlmacenCard
                                key={almacen._id}
                                almacen={almacen}
                                index={i}
                                total={almacenes.length}
                                onChange={updateAlmacen}
                                onDelete={removeAlmacen}
                            />
                        ))}

                    </div>
                </div>

            </div>
        </div>
    )
}