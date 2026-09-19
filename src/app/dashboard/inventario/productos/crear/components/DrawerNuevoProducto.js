'use client'
import { Camera, Check, Plus, RefreshCw, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const DRAWER_INITIAL = {
    nombre: '', codigo: '', codigo_barras: '', tipo: 'Bien',
    categoria_id: '', referencia: '', descripcion: '',
    rastrear: true, unidad: 'UNIDAD', stock_inicial: '',
    impuesto_ventas: '18% IGV', impuesto_compra: '18% IGV',
}

const MOCK_CATEGORIAS = [
    { id: 1, nombre: 'Zapatillas'      },
    { id: 2, nombre: 'Ropa deportiva'  },
    { id: 3, nombre: 'Accesorios'      },
    { id: 4, nombre: 'Calzado'         },
    { id: 5, nombre: 'Textil'          },
]


const UNIDADES = [
    { value: 'UNIDAD', label: 'Unidad (und)' },
    { value: 'PAR',    label: 'Par'           },
    { value: 'PQT3',   label: 'Paquete x3'   },
    { value: 'DOCENA', label: 'Docena'        },
]

const IMPUESTOS = ['18% IGV', 'Exonerado', 'Inafecto']

export function DrawerNuevoProducto({ open, onClose, onAgregar }) {
    const [form, setForm]     = useState(DRAWER_INITIAL)
    const [errors, setErrors] = useState({})

    /* Reset al cerrar (después de la animación) */
    useEffect(() => {
        if (!open) {
            const t = setTimeout(() => { setForm(DRAWER_INITIAL); setErrors({}) }, 300)
            return () => clearTimeout(t)
        }
    }, [open])

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

    const handleGenerar = () => set('codigo', generarCodigo(form.nombre))

    const handleNombreBlur = (e) => {
        if (!form.codigo && e.target.value.trim())
            set('codigo', generarCodigo(e.target.value))
    }

    const validate = () => {
        const e = {}
        if (!form.nombre.trim()) e.nombre = 'Campo requerido'
        if (!form.codigo.trim()) e.codigo = 'Campo requerido'
        return e
    }

    const handleAgregar = () => {
        const e = validate()
        if (Object.keys(e).length) { setErrors(e); return }
        onAgregar(form)
        onClose()
    }

    return (
        <>
            <div
                className="fixed inset-0 z-40 transition-opacity duration-300"
                style={{
                    background:    'rgba(31,47,87,0.2)',
                    opacity:       open ? 1 : 0,
                    pointerEvents: open ? 'auto' : 'none',
                }}
                onClick={onClose}
            />

            {/* Panel */}
            <div
                className="fixed top-0 right-0 bottom-0 z-50 w-[560px] max-w-[95vw] bg-white flex flex-col transition-transform duration-300 ease-out"
                style={{
                    transform:  open ? 'translateX(0)' : 'translateX(100%)',
                    boxShadow:  '-8px 0 40px rgba(31,47,87,0.15)',
                }}
            >
                {/* Header */}
                <div className="px-6 py-5 shrink-0" style={{ borderBottom: '0.5px solid rgba(31,47,87,0.12)' }}>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-base font-bold" style={{ color: '#1F2F57' }}>
                                Nuevo producto
                            </h2>
                            <p className="text-xs mt-0.5" style={{ color: 'rgba(31,47,87,0.55)' }}>
                                Completa la información del producto para agregarlo al lote.
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors shrink-0 mt-0.5"
                        >
                            <X size={16} color="rgba(31,47,87,0.5)" />
                        </button>
                    </div>
                </div>

                {/* Body scrollable */}
                <div className="flex-1 overflow-y-auto">
                    <div className="px-6 py-5 flex flex-col gap-6">

                        {/* ── Información general ─────────────────── */}
                        <section className="flex flex-col gap-4">
                            <h3
                                className="text-sm font-bold pb-2"
                                style={{ color: '#1F2F57', borderBottom: '0.5px solid rgba(31,47,87,0.1)' }}
                            >
                                Información general
                            </h3>

                            {/* Nombre + imagen */}
                            <div className="flex gap-4 items-start">
                                <div className="flex-1 flex flex-col gap-1">
                                    <label className="text-xs font-semibold" style={{ color: '#1F2F57' }}>
                                        Nombre del producto{' '}
                                        <span style={{ color: '#C0392B' }}>*</span>
                                    </label>
                                    <input
                                        value={form.nombre}
                                        onChange={e => {
                                            set('nombre', e.target.value)
                                            if (errors.nombre) setErrors(p => ({ ...p, nombre: '' }))
                                        }}
                                        onBlur={handleNombreBlur}
                                        placeholder="Por ejemplo, hamburguesa de queso"
                                        className="h-9 px-3 rounded-lg text-xs outline-none w-full"
                                        style={{
                                            border:     errors.nombre ? '1px solid #C0392B' : '1px solid rgba(31,47,87,0.2)',
                                            color:      '#1F2F57',
                                        }}
                                    />
                                    {errors.nombre && (
                                        <span className="text-[11px]" style={{ color: '#C0392B' }}>
                                            {errors.nombre}
                                        </span>
                                    )}
                                </div>

                                {/* Imagen placeholder */}
                                <div
                                    className="w-28 rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-gray-50 transition-colors shrink-0 py-4"
                                    style={{ border: '1.5px dashed rgba(31,47,87,0.2)' }}
                                >
                                    <Camera size={22} color="rgba(31,47,87,0.3)" />
                                    <p className="text-[10px] text-center leading-tight font-medium" style={{ color: 'rgba(31,47,87,0.4)' }}>
                                        Agregar imagen
                                    </p>
                                    <p className="text-[9px] text-center leading-tight" style={{ color: 'rgba(31,47,87,0.35)' }}>
                                        JPG, PNG (máx. 2 MB)
                                    </p>
                                </div>
                            </div>

                            {/* Código + Código de barras */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold" style={{ color: '#1F2F57' }}>
                                        Código <span style={{ color: '#C0392B' }}>*</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            value={form.codigo}
                                            onChange={e => {
                                                set('codigo', e.target.value)
                                                if (errors.codigo) setErrors(p => ({ ...p, codigo: '' }))
                                            }}
                                            placeholder="PROD-000001"
                                            className="flex-1 h-9 px-3 rounded-lg text-xs outline-none min-w-0"
                                            style={{
                                                border:     errors.codigo ? '1px solid #C0392B' : '1px solid rgba(31,47,87,0.2)',
                                                color:      '#1F2F57',
                                            }}
                                        />
                                        <button
                                            onClick={handleGenerar}
                                            title="Generar código"
                                            className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-blue-50 shrink-0"
                                            style={{ border: '1px solid rgba(57,96,169,0.3)' }}
                                        >
                                            <RefreshCw size={14} color="#3960A9" />
                                        </button>
                                    </div>
                                    {errors.codigo && (
                                        <span className="text-[11px]" style={{ color: '#C0392B' }}>
                                            {errors.codigo}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold" style={{ color: '#1F2F57' }}>
                                        Código de barras
                                    </label>
                                    <input
                                        value={form.codigo_barras}
                                        onChange={e => set('codigo_barras', e.target.value)}
                                        placeholder="Escanea o ingresa"
                                        className="h-9 px-3 rounded-lg text-xs outline-none"
                                        style={{ border: '1px solid rgba(31,47,87,0.2)', color: '#1F2F57' }}
                                    />
                                </div>
                            </div>

                            {/* Tipo de producto */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold" style={{ color: '#1F2F57' }}>
                                    Tipo de producto <span style={{ color: '#C0392B' }}>*</span>
                                </label>
                                <div className="flex items-center gap-6">
                                    {['Bien', 'Servicio', 'Combo'].map(tipo => (
                                        <label
                                            key={tipo}
                                            className="flex items-center gap-2 cursor-pointer select-none"
                                            onClick={() => set('tipo', tipo)}
                                        >
                                            <div
                                                className="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors"
                                                style={{
                                                    borderColor: form.tipo === tipo ? '#3960A9' : 'rgba(31,47,87,0.25)',
                                                }}
                                            >
                                                {form.tipo === tipo && (
                                                    <div className="w-2 h-2 rounded-full" style={{ background: '#3960A9' }} />
                                                )}
                                            </div>
                                            <span className="text-xs" style={{ color: '#1F2F57' }}>{tipo}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Categoría + Referencia */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold" style={{ color: '#1F2F57' }}>Categoría</label>
                                    <select
                                        value={form.categoria_id}
                                        onChange={e => set('categoria_id', e.target.value)}
                                        className="h-9 px-3 rounded-lg text-xs appearance-none outline-none"
                                        style={{
                                            border:     '1px solid rgba(31,47,87,0.2)',
                                            color:      form.categoria_id ? '#1F2F57' : 'rgba(31,47,87,0.4)',
                                            background: '#fff',
                                        }}
                                    >
                                        <option value="">Selecciona una categoría</option>
                                        {MOCK_CATEGORIAS.map(c => (
                                            <option key={c.id} value={c.id}>{c.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold" style={{ color: '#1F2F57' }}>Referencia</label>
                                    <input
                                        value={form.referencia}
                                        onChange={e => set('referencia', e.target.value)}
                                        placeholder="Ej: Proveedor, marca, modelo"
                                        className="h-9 px-3 rounded-lg text-xs outline-none"
                                        style={{ border: '1px solid rgba(31,47,87,0.2)', color: '#1F2F57' }}
                                    />
                                </div>
                            </div>

                            {/* Descripción */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold" style={{ color: '#1F2F57' }}>
                                    Descripción (opcional)
                                </label>
                                <textarea
                                    value={form.descripcion}
                                    onChange={e => set('descripcion', e.target.value.slice(0, 500))}
                                    placeholder="Agrega una descripción del producto..."
                                    rows={3}
                                    className="px-3 py-2.5 rounded-lg text-xs outline-none resize-none"
                                    style={{ border: '1px solid rgba(31,47,87,0.2)', color: '#1F2F57' }}
                                />
                                <div
                                    className="text-right text-[10px]"
                                    style={{ color: 'rgba(31,47,87,0.4)' }}
                                >
                                    {form.descripcion.length}/500
                                </div>
                            </div>
                        </section>

                        {/* ── Inventario ──────────────────────────── */}
                        <section className="flex flex-col gap-4">
                            <h3
                                className="text-sm font-bold pb-2"
                                style={{ color: '#1F2F57', borderBottom: '0.5px solid rgba(31,47,87,0.1)' }}
                            >
                                Inventario
                            </h3>

                            {/* Rastrear inventario */}
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-semibold" style={{ color: '#1F2F57' }}>
                                    Rastrear inventario
                                </span>
                                <label
                                    className="flex items-center gap-1.5 cursor-pointer select-none"
                                    onClick={() => set('rastrear', !form.rastrear)}
                                >
                                    <div
                                        className="w-4 h-4 rounded flex items-center justify-center transition-colors"
                                        style={{
                                            background: form.rastrear ? '#3960A9' : 'transparent',
                                            border:     `1.5px solid ${form.rastrear ? '#3960A9' : 'rgba(31,47,87,0.3)'}`,
                                        }}
                                    >
                                        {form.rastrear && <Check size={10} color="white" />}
                                    </div>
                                    <span className="text-xs" style={{ color: '#1F2F57' }}>Por cantidad</span>
                                </label>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold" style={{ color: '#1F2F57' }}>
                                        Unidad de medida <span style={{ color: '#C0392B' }}>*</span>
                                    </label>
                                    <select
                                        value={form.unidad}
                                        onChange={e => set('unidad', e.target.value)}
                                        className="h-9 px-3 rounded-lg text-xs appearance-none outline-none"
                                        style={{ border: '1px solid rgba(31,47,87,0.2)', color: '#1F2F57', background: '#fff' }}
                                    >
                                        {UNIDADES.map(u => (
                                            <option key={u.value} value={u.value}>{u.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold" style={{ color: '#1F2F57' }}>
                                        Stock inicial
                                    </label>
                                    <input
                                        type="number"
                                        value={form.stock_inicial}
                                        onChange={e => set('stock_inicial', e.target.value)}
                                        placeholder="0"
                                        min="0"
                                        className="h-9 px-3 rounded-lg text-xs outline-none"
                                        style={{ border: '1px solid rgba(31,47,87,0.2)', color: '#1F2F57' }}
                                    />
                                    <p className="text-[10px]" style={{ color: 'rgba(31,47,87,0.5)' }}>
                                        Cantidad que ingresará en el lote.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* ── Impuestos ───────────────────────────── */}
                        <section className="flex flex-col gap-4">
                            <h3
                                className="text-sm font-bold pb-2"
                                style={{ color: '#1F2F57', borderBottom: '0.5px solid rgba(31,47,87,0.1)' }}
                            >
                                Impuestos
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold" style={{ color: '#1F2F57' }}>
                                        Impuesto de ventas <span style={{ color: '#C0392B' }}>*</span>
                                    </label>
                                    <select
                                        value={form.impuesto_ventas}
                                        onChange={e => set('impuesto_ventas', e.target.value)}
                                        className="h-9 px-3 rounded-lg text-xs appearance-none outline-none"
                                        style={{ border: '1px solid rgba(31,47,87,0.2)', color: '#1F2F57', background: '#fff' }}
                                    >
                                        {IMPUESTOS.map(i => <option key={i} value={i}>{i}</option>)}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold" style={{ color: '#1F2F57' }}>
                                        Impuesto de compra
                                    </label>
                                    <select
                                        value={form.impuesto_compra}
                                        onChange={e => set('impuesto_compra', e.target.value)}
                                        className="h-9 px-3 rounded-lg text-xs appearance-none outline-none"
                                        style={{ border: '1px solid rgba(31,47,87,0.2)', color: '#1F2F57', background: '#fff' }}
                                    >
                                        {IMPUESTOS.map(i => <option key={i} value={i}>{i}</option>)}
                                    </select>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>

                {/* Footer */}
                <div
                    className="px-6 py-4 flex items-center justify-between gap-3 shrink-0"
                    style={{ borderTop: '0.5px solid rgba(31,47,87,0.12)' }}
                >
                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-50"
                        style={{ border: '1px solid rgba(31,47,87,0.2)', color: '#1F2F57' }}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleAgregar}
                        className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold text-white transition-colors hover:opacity-90"
                        style={{ background: '#3960A9' }}
                    >
                        <Plus size={15} />
                        Agregar al lote
                    </button>
                </div>
            </div>
        </>
    )
}