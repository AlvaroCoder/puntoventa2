'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, RefreshCw, Plus, Trash2, Warehouse } from 'lucide-react'
import InputFillable from '@/app/dashboard/inventario/productos/crear/components/InputFillable'
import SwitcherLoader from '@/components/Navigation/SwitcherLoader'
import { createTienda } from '@/Connections/tiendas'
import { toast } from 'react-toastify'
import { createAlmacen } from '@/Connections/almacen'
import { useAuth } from '@/Context/AuthContext'

function generarCodigo(nombre) {
    const prefix = nombre.trim().slice(0, 3).toUpperCase().replace(/\s/g, '') || 'TDA'
    const num    = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')
    return `${prefix}-${num}`
}
function generarCodigoAlmacen(nombre) {
    const prefix = nombre.trim().slice(0, 3).toUpperCase().replace(/\s/g, '') || 'ALM'
    const num    = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')
    return `${prefix}-${num}`
}

const TIPOS_ALMACEN = ['VITRINA', 'BODEGA', 'ALMACEN', 'DEPOSITO']

const ALMACEN_INITIAL = () => ({
  _id: crypto.randomUUID(),
  nombre: "",
  codigo: "",
  tipo: "VITRINA",
  descripcion: "",
});

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

/* ── sub-componentes ── */
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

function AlmacenCard({ almacen, index, onChange, onDelete }) {
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
                <button
                    type="button"
                    onClick={() => onDelete(almacen._id)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors hover:bg-red-50"
                    style={{ color: '#C0392B' }}
                >
                    <Trash2 size={12} />
                    Eliminar
                </button>
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
                            {TIPOS_ALMACEN.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
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

export default function CreateTiendaPage() {
    const router = useRouter()
    const { user } = useAuth();
    
    const [nombreFocused, setNombreFocused] = useState(false)
    const [loading, setLoading]             = useState(false)
    const [form, setForm] = useState({
        nombre: '',
        codigo: '',
        direccion: '',
        telefono: '',
        responsable: '',
        fecha_apertura: '',
    })
    const [almacenes, setAlmacenes] = useState([])

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

    const handleNombreBlur = () => {
        setNombreFocused(false)
        if (!form.codigo && form.nombre.trim())
            set('codigo', generarCodigo(form.nombre))
    }

    const addAlmacen    = () => setAlmacenes(prev => [...prev, ALMACEN_INITIAL()])
    const removeAlmacen = (id) => setAlmacenes(prev => prev.filter(a => a._id !== id))
    const updateAlmacen = (id, k, v) =>
        setAlmacenes(prev => prev.map(a => a._id === id ? { ...a, [k]: v } : a))

    const handleSubmit = async () => {
        try {
            setLoading(true);
           
            const payload = {
                empresa_id: user?.empresa_id,
                nombre: form.nombre,
                codigo: form.codigo,
                direccion: form.direccion,
                telefono: form.telefono,
                responsable: form.responsable,
                fecha_apertura: form.fecha_apertura,
            }
            const responseCreateTienda = await createTienda(payload);
            if (!responseCreateTienda.ok) {
               
                toast.error("Error al crear tienda");
                return;
            }

            const jsonResponseCreateTienda = responseCreateTienda.data;
            
            if (almacenes.length > 0) {
                const tiendaId = jsonResponseCreateTienda?.id;
                await Promise.all(
                  almacenes.map(async ({ _id, ...rest }) => {
                    await createAlmacen({ tiendaId, ...rest });
                  }),
                );
            }
            toast.success("Se creo correctamente la tienda")
            router.push('/dashboard/inventario/tienda')
        } catch (error) {
            console.log('ERROR : ', error)
            toast.error('No se pudo guardar la tienda')
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
                            onClick={() => router.push('/dashboard/inventario')}
                            className="hover:underline transition-colors hover:text-[#1F2F57]"
                        >
                            Inventario
                        </button>
                        <ChevronRight size={12} />
                        <button
                            onClick={() => router.push('/dashboard/inventario/tienda')}
                            className="hover:underline transition-colors hover:text-[#1F2F57]"
                        >
                            Tiendas
                        </button>
                        <ChevronRight size={12} />
                        <span className="font-semibold" style={{ color: '#1F2F57' }}>
                            {form.nombre || 'Nueva tienda'}
                        </span>
                    </nav>

                    <SwitcherLoader loading={loading}>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => router.push('/dashboard/inventario/tienda')}
                                className="px-4 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-gray-50"
                                style={{ border: '0.5px solid rgba(31,47,87,0.2)', color: '#1F2F57' }}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
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
                                Tienda
                            </p>
                            <InputFillable
                                value={form.nombre}
                                keyValue="nombre"
                                set={set}
                                onFocus={() => setNombreFocused(true)}
                                onBlur={handleNombreBlur}
                                placeholder="Nombre de la tienda"
                                nombreFocused={nombreFocused}
                            />
                        </div>

                        <div className="flex flex-col gap-6">

                            <Field label="Código" required hint="Identificador único de la tienda">
                                <div className="flex items-center gap-2">
                                    <input
                                        value={form.codigo}
                                        onChange={e => set('codigo', e.target.value.toUpperCase())}
                                        placeholder="Ej: TDA-0001"
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

                            <Field label="Responsable" required hint="Persona encargada de la tienda">
                                <input
                                    value={form.responsable}
                                    onChange={e => set('responsable', e.target.value)}
                                    placeholder="Nombre del encargado"
                                    className="h-10 px-3.5 rounded-xl text-sm outline-none transition-all"
                                    style={{ ...BASE_INPUT_STYLE, width: '100%', maxWidth: '380px' }}
                                    onFocus={onFocusInput}
                                    onBlur={onBlurInput}
                                />
                            </Field>

                            <Field label="Teléfono" hint="Número de contacto de la tienda">
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

                            <Field label="Dirección" hint="Ubicación física de la tienda">
                                <input
                                    value={form.direccion}
                                    onChange={e => set('direccion', e.target.value)}
                                    placeholder="Ej: Av. Ejemplo 123, Lima"
                                    className="h-10 px-3.5 rounded-xl text-sm outline-none transition-all w-full"
                                    style={BASE_INPUT_STYLE}
                                    onFocus={onFocusInput}
                                    onBlur={onBlurInput}
                                />
                            </Field>

                            <Field label="Fecha de apertura" hint="Fecha en que inició operaciones">
                                <input
                                    type="date"
                                    value={form.fecha_apertura}
                                    onChange={e => set('fecha_apertura', e.target.value)}
                                    className="h-10 px-3.5 rounded-xl text-sm outline-none transition-all"
                                    style={{ ...BASE_INPUT_STYLE, width: '200px' }}
                                    onFocus={onFocusInput}
                                    onBlur={onBlurInput}
                                />
                            </Field>

                        </div>
                    </div>
                </div>

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
                                        Opcional
                                    </span>
                                </p>
                                <p className="text-[11px] mt-0.5" style={{ color: 'rgba(31,47,87,0.4)' }}>
                                    Agrega los almacenes o espacios de esta tienda. Podrás añadir más después.
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

                        {almacenes.length === 0 && (
                            <div
                                className="rounded-xl flex flex-col items-center gap-2 py-8 text-center"
                                style={{ border: '1px dashed rgba(31,47,87,0.15)', background: 'rgba(31,47,87,0.02)' }}
                            >
                                <Warehouse size={24} style={{ color: 'rgba(31,47,87,0.2)' }} />
                                <p className="text-xs font-medium" style={{ color: 'rgba(31,47,87,0.35)' }}>
                                    Sin almacenes añadidos
                                </p>
                                <button
                                    type="button"
                                    onClick={addAlmacen}
                                    className="text-xs font-semibold mt-1 transition-opacity hover:opacity-70"
                                    style={{ color: '#3960A9' }}
                                >
                                    + Agregar el primero
                                </button>
                            </div>
                        )}

                        {almacenes.map((almacen, i) => (
                            <AlmacenCard
                                key={almacen._id}
                                almacen={almacen}
                                index={i}
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