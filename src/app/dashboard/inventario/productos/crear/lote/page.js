'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    Search, Warehouse, Plus, Trash2,
    X, Store, CalendarDays, Hash, Check,
    Loader2, Save, Camera, RefreshCw
} from 'lucide-react';
import {getAlmacenesByUser} from '@/Connections/almacen'
import AlmacenCard from '../components/AlmacenCard';
import SwitcherLoader from '../components/SwitcherLoader';
import { DrawerNuevoProducto } from '../components/DrawerNuevoProducto';

/* ── Constantes ───────────────────────────────────────────────── */
const TALLAS  = ['Única', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '29', '30', '31', '32', '33', '34', '36', '37', '38', '39', '40', '41', '42', '43', '44']
const COLORES = ['Único', 'Negro', 'Blanco', 'Azul', 'Rojo', 'Verde', 'Amarillo', 'Gris', 'Marrón', 'Naranja', 'Rosado']
const PASOS = ['Seleccionar almacén', 'Ingresar productos']

/* ── Stepper ──────────────────────────────────────────────────── */
function Stepper({ paso }) {
    return (
        <div className="flex items-center">
            {PASOS.map((label, i) => {
                const num      = i + 1
                const activo   = paso === num
                const completo = paso > num
                return (
                    <React.Fragment key={num}>
                        <div className="flex items-center gap-2">
                            <div
                                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors"
                                style={{
                                    background: activo || completo ? '#3960A9' : 'transparent',
                                    border:     activo || completo ? 'none' : '1.5px solid rgba(31,47,87,0.25)',
                                    color:      activo || completo ? '#fff'  : 'rgba(31,47,87,0.4)',
                                }}
                            >
                                {completo ? <Check size={13} /> : num}
                            </div>
                            <span
                                className="text-xs font-medium whitespace-nowrap"
                                style={{ color: activo ? '#1F2F57' : 'rgba(31,47,87,0.4)' }}
                            >
                                {label}
                            </span>
                        </div>
                        {i < PASOS.length - 1 && (
                            <div className="w-10 h-px mx-3 shrink-0" style={{ background: 'rgba(31,47,87,0.15)' }} />
                        )}
                    </React.Fragment>
                )
            })}
        </div>
    )
}

/* ── Card de almacén seleccionable ────────────────────────────── */


/* ── Helpers tabla ────────────────────────────────────────────── */
function SelectCell({ value, onChange, options }) {
    return (
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full h-8 px-2 rounded-lg text-xs appearance-none outline-none transition-colors"
            style={{ border: '0.5px solid rgba(31,47,87,0.18)', color: '#1F2F57', background: '#fff' }}
        >
            {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
    )
}

function InputCell({ value, onChange, placeholder, type = 'text', prefix, warn }) {
    return (
        <div className="flex flex-col gap-0.5">
            <div
                className="flex items-center h-8 rounded-lg overflow-hidden"
                style={{
                    border:     warn ? '1px solid #E8A020' : '0.5px solid rgba(31,47,87,0.18)',
                    background: '#fff',
                }}
            >
                {prefix && (
                    <span className="px-2 text-xs shrink-0" style={{ color: 'rgba(31,47,87,0.45)' }}>
                        {prefix}
                    </span>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 h-full px-2 text-xs outline-none bg-transparent"
                    style={{ color: '#1F2F57' }}
                />
            </div>
            {warn && (
                <span className="text-[10px] leading-tight" style={{ color: '#E8A020' }}>
                    Requerido con stock
                </span>
            )}
        </div>
    )
}

function ProductIcon({ nombre }) {
    const letra = nombre?.[0]?.toUpperCase() ?? 'P'
    const bgs   = ['#3960A9', '#1EB3B2', '#E8A020', '#1F2F57', '#6450BE', '#C0392B']
    const bg    = bgs[nombre.charCodeAt(0) % bgs.length]
    return (
        <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ background: bg }}
        >
            {letra}
        </div>
    )
}

export default function LotePage() {
    const router = useRouter()

    const [pasoActual, setPasoActual]          = useState(1)
    const [almacenSeleccionado, setAlmacenSel] = useState(null)
    const [busqAlmacen, setBusqAlmacen] = useState('')
    const [usaTallas, setUsaTallas] = useState(true)
    const [filas, setFilas] = useState([])
    const [guardando, setGuardando] = useState(false)
    const [busquedaFila, setBusquedaFila]      = useState(null)
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [almacenes, setAlmacenes] = useState([]);

    const almacenActual = almacenes.find(a => a.id === almacenSeleccionado)
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function fetchAlmacenes() { 
            try {
                const data = await getAlmacenesByUser();
                setAlmacenes(data?.data || []);
            } catch (error) { 
                console.log('Error fetching almacenes:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchAlmacenes();
    }, []);

    const filteredAlmacenes = useMemo(
        () => almacenes.filter(a =>
            a.nombre.toLowerCase().includes(busqAlmacen.toLowerCase()) ||
            a.tienda.toLowerCase().includes(busqAlmacen.toLowerCase())
        ),
        [busqAlmacen, almacenes]
    )

    const updateFila  = (id, campo, valor) =>
        setFilas(prev => prev.map(f => f.id === id ? { ...f, [campo]: valor } : f))

    const eliminarFila = id => setFilas(prev => prev.filter(f => f.id !== id))

    const handleAgregarDesdeDrawer = (formData) => {
        setFilas(prev => [
            ...prev,
            {
                id:     Date.now(),
                nombre: formData.nombre,
                codigo: formData.codigo,
                talla:  'Única',
                color:  'Único',
                stock:  formData.stock_inicial || '0',
                precio: '',
            }
        ])
    }

    const totalUnidades = useMemo(
        () => filas.reduce((acc, f) => acc + (parseInt(f.stock) || 0), 0),
        [filas]
    )

    const hayErrores = filas.some(f => parseInt(f.stock) > 0 && !f.precio.trim())

    const handleConfirmar = async () => {
        if (hayErrores) return
        setGuardando(true)
        await new Promise(r => setTimeout(r, 1200))
        setGuardando(false)
        router.push('/dashboard/inventario/productos')
    }

    return (
        <div className="min-h-screen bg-[#E1E7F0] pb-24">

            {/* ── Encabezado ──────────────────────────────────────── */}
            <div className="bg-white px-8 py-5" style={{ borderBottom: '0.5px solid rgba(31,47,87,0.1)' }}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-lg font-bold" style={{ color: '#1F2F57' }}>
                            Ingreso de productos en lote
                        </h1>
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(31,47,87,0.55)' }}>
                            Registra varios productos a la vez para el almacén seleccionado.
                        </p>
                    </div>
                    <Stepper paso={pasoActual} />
                </div>
            </div>

            {/* ── PASO 1: Seleccionar almacén ─────────────────────── */}
            {pasoActual === 1 && (
                <div className="px-8 py-6 flex flex-col gap-5 max-w-6xl mx-auto w-full">

                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <h2 className="text-base font-semibold" style={{ color: '#1F2F57' }}>
                                ¿A qué almacén ingresarán los productos?
                            </h2>
                            <p className="text-xs mt-1" style={{ color: 'rgba(31,47,87,0.55)' }}>
                                Selecciona el almacén de destino para este lote.
                            </p>
                        </div>
                        <div
                            className="flex items-center gap-2 px-3 rounded-lg h-9 min-w-[220px]"
                            style={{ background: '#fff', border: '0.5px solid rgba(31,47,87,0.18)' }}
                        >
                            <Search size={14} color="rgba(31,47,87,0.4)" />
                            <input
                                value={busqAlmacen}
                                onChange={e => setBusqAlmacen(e.target.value)}
                                placeholder="Buscar almacén o tienda..."
                                className="bg-transparent outline-none text-xs flex-1 placeholder:text-[rgba(31,47,87,0.35)]"
                                style={{ color: '#1F2F57' }}
                            />
                            {busqAlmacen && (
                                <button onClick={() => setBusqAlmacen('')}>
                                    <X size={13} color="rgba(31,47,87,0.4)" />
                                </button>
                            )}
                        </div>
                    </div>

                    <SwitcherLoader>
                         <p className="text-xs -mt-1" style={{ color: 'rgba(31,47,87,0.45)' }}>
                        {filteredAlmacenes.length} almacén{filteredAlmacenes.length !== 1 ? 'es' : ''} disponible{filteredAlmacenes.length !== 1 ? 's' : ''}
                    </p>
                   </SwitcherLoader>

                    <SwitcherLoader loading={loading}>
                        {filteredAlmacenes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredAlmacenes.map(alm => (
                                <AlmacenCard
                                    key={alm.id}
                                    almacen={alm}
                                    selected={almacenSeleccionado === alm.id}
                                    onSelect={() => setAlmacenSel(alm.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div
                            className="flex flex-col items-center justify-center py-16 bg-white rounded-xl"
                            style={{ border: '0.5px solid rgba(31,47,87,0.12)' }}
                        >
                            <Warehouse size={32} color="rgba(31,47,87,0.2)" />
                            <p className="text-sm mt-3" style={{ color: 'rgba(31,47,87,0.5)' }}>
                                No se encontraron almacenes para <strong>&quot;{busqAlmacen}&quot;</strong>
                            </p>
                        </div>
                    )}
                    </SwitcherLoader>
                </div>
            )}

            {/* ── PASO 2: Ingresar productos ───────────────────────── */}
            {pasoActual === 2 && (
                <div className="px-8 py-6 flex flex-col gap-5 max-w-6xl mx-auto w-full">

                    {/* Info del lote */}
                    <div
                        className="bg-white rounded-xl p-5"
                        style={{ border: '0.5px solid rgba(31,47,87,0.12)' }}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                                     style={{ background: 'rgba(57,96,169,0.08)' }}>
                                    <Store size={18} color="#3960A9" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-wide" style={{ color: 'rgba(31,47,87,0.45)' }}>
                                        Almacén seleccionado
                                    </p>
                                    <p className="text-sm font-semibold" style={{ color: '#1F2F57' }}>
                                        {almacenActual?.nombre ?? '—'}
                                    </p>
                                    <p className="text-xs" style={{ color: '#3960A9' }}>
                                        {almacenActual?.tienda}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                                     style={{ background: 'rgba(30,179,178,0.08)' }}>
                                    <CalendarDays size={18} color="#1EB3B2" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-wide" style={{ color: 'rgba(31,47,87,0.45)' }}>
                                        Fecha de registro
                                    </p>
                                    <p className="text-sm font-semibold" style={{ color: '#1F2F57' }}>
                                        {new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                                     style={{ background: 'rgba(100,80,190,0.08)' }}>
                                    <Hash size={18} color="#6450BE" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[10px] uppercase tracking-wide" style={{ color: 'rgba(31,47,87,0.45)' }}>
                                        Referencia del lote
                                    </p>
                                    <input
                                        defaultValue="LOTE-2024-001"
                                        placeholder="Ej: LOTE-2024-001"
                                        className="text-sm font-semibold outline-none border-b bg-transparent w-full"
                                        style={{ color: '#1F2F57', borderColor: 'rgba(31,47,87,0.15)' }}
                                    />
                                </div>
                            </div>
                            
                        </div>
                    </div>

                    {/* Tabla */}
                    <div
                        className="bg-white rounded-xl overflow-hidden"
                        style={{ border: '0.5px solid rgba(31,47,87,0.12)' }}
                    >
                        <div
                            className="px-5 py-3.5 flex items-center justify-between"
                            style={{ borderBottom: '0.5px solid rgba(31,47,87,0.08)' }}
                        >
                            <h2 className="text-sm font-bold" style={{ color: '#1F2F57' }}>
                                Productos del lote
                            </h2>
                            <span className="text-xs" style={{ color: 'rgba(31,47,87,0.45)' }}>
                                {filas.length} producto{filas.length !== 1 ? 's' : ''}
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm min-w-[720px]">
                                <thead>
                                    <tr style={{ background: 'rgba(31,47,87,0.03)', borderBottom: '0.5px solid rgba(31,47,87,0.08)' }}>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide w-8"
                                            style={{ color: 'rgba(31,47,87,0.45)' }}>#</th>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide"
                                            style={{ color: 'rgba(31,47,87,0.45)' }}>Producto</th>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide w-28"
                                            style={{ color: 'rgba(31,47,87,0.45)' }}>Código</th>
                                        {usaTallas && (
                                            <>
                                                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide w-24"
                                                    style={{ color: 'rgba(31,47,87,0.45)' }}>Talla</th>
                                                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide w-24"
                                                    style={{ color: 'rgba(31,47,87,0.45)' }}>Color</th>
                                            </>
                                        )}
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide w-28"
                                            style={{ color: 'rgba(31,47,87,0.45)' }}>Stock inicial</th>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide w-36"
                                            style={{ color: 'rgba(31,47,87,0.45)' }}>Precio venta (S/)</th>
                                        <th className="px-4 py-3 w-10" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y" style={{ borderColor: 'rgba(31,47,87,0.06)' }}>
                                    {filas.map((fila, idx) => {
                                        const stockNum   = parseInt(fila.stock) || 0
                                        const warnPrecio = stockNum > 0 && !fila.precio.trim()
                                        return (
                                            <tr key={fila.id} className="hover:bg-[rgba(31,47,87,0.015)] transition-colors group">
                                                <td className="px-4 py-3">
                                                    <span className="text-xs" style={{ color: 'rgba(31,47,87,0.35)' }}>
                                                        {idx + 1}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {busquedaFila === fila.id ? (
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="flex items-center flex-1 h-8 rounded-lg px-2 gap-2"
                                                                style={{ border: '1px solid #3960A9', background: '#fff' }}
                                                            >
                                                                <Search size={12} color="#3960A9" />
                                                                <input
                                                                    autoFocus
                                                                    placeholder="Buscar producto..."
                                                                    className="flex-1 text-xs outline-none bg-transparent"
                                                                    style={{ color: '#1F2F57' }}
                                                                    onBlur={() => setBusquedaFila(null)}
                                                                />
                                                            </div>
                                                            <button onClick={() => setBusquedaFila(null)}>
                                                                <X size={14} color="rgba(31,47,87,0.4)" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2.5">
                                                            <ProductIcon nombre={fila.nombre || '?'} />
                                                            <div className="flex-1 min-w-0">
                                                                {fila.nombre ? (
                                                                    <p className="text-xs font-medium truncate" style={{ color: '#1F2F57' }}>
                                                                        {fila.nombre}
                                                                    </p>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => setBusquedaFila(fila.id)}
                                                                        className="text-xs flex items-center gap-1.5"
                                                                        style={{ color: '#3960A9' }}
                                                                    >
                                                                        <Search size={12} /> Buscar producto
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <InputCell
                                                        value={fila.codigo}
                                                        onChange={v => updateFila(fila.id, 'codigo', v)}
                                                        placeholder="COD-000"
                                                    />
                                                </td>
                                                {usaTallas && (
                                                    <>
                                                        <td className="px-4 py-3">
                                                            <SelectCell value={fila.talla} onChange={v => updateFila(fila.id, 'talla', v)} options={TALLAS} />
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <SelectCell value={fila.color} onChange={v => updateFila(fila.id, 'color', v)} options={COLORES} />
                                                        </td>
                                                    </>
                                                )}
                                                <td className="px-4 py-3">
                                                    <InputCell type="number" value={fila.stock} onChange={v => updateFila(fila.id, 'stock', v)} placeholder="0" />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <InputCell type="number" value={fila.precio} onChange={v => updateFila(fila.id, 'precio', v)} placeholder="0.00" prefix="S/" warn={warnPrecio} />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <button
                                                        onClick={() => eliminarFila(fila.id)}
                                                        aria-label="Eliminar fila"
                                                        className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                                                    >
                                                        <Trash2 size={14} color="#C0392B" />
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div
                            className="px-5 py-3 flex items-center justify-between"
                            style={{ borderTop: '0.5px solid rgba(31,47,87,0.08)', background: 'rgba(31,47,87,0.015)' }}
                        >
                            <button
                                onClick={() => setDrawerOpen(true)}
                                className="flex items-center gap-1.5 text-xs font-semibold transition-colors hover:opacity-80"
                                style={{ color: '#3960A9' }}
                            >
                                <Plus size={15} />
                                Agregar producto
                            </button>
                            <span className="text-xs" style={{ color: 'rgba(31,47,87,0.55)' }}>
                                <strong style={{ color: '#1F2F57' }}>{filas.length}</strong> producto{filas.length !== 1 ? 's' : ''}
                                &nbsp;—&nbsp;
                                <strong style={{ color: '#1F2F57' }}>{totalUnidades}</strong> unidades en total
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Barra sticky ────────────────────────────────────── */}
            <div
                className="fixed bottom-0 left-0 right-0 z-30 bg-white"
                style={{ borderTop: '0.5px solid rgba(31,47,87,0.12)', boxShadow: '0 -4px 20px rgba(0,0,0,0.06)' }}
            >
                <div className="max-w-6xl mx-auto px-8 py-3.5 flex items-center justify-between gap-3">

                    {pasoActual === 1 ? (
                        <>
                            <button
                                onClick={() => router.push('/dashboard/inventario/productos/crear')}
                                className="flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-lg transition-colors hover:bg-gray-50"
                                style={{ color: 'rgba(31,47,87,0.6)', border: '0.5px solid rgba(31,47,87,0.18)' }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => setPasoActual(2)}
                                disabled={!almacenSeleccionado}
                                className="flex items-center gap-1.5 text-xs font-bold px-5 py-2 rounded-lg text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                                style={{ background: '#1F2F57' }}
                            >
                                Continuar →
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setPasoActual(1)}
                                className="flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-lg transition-colors hover:bg-gray-50"
                                style={{ color: 'rgba(31,47,87,0.6)', border: '0.5px solid rgba(31,47,87,0.18)' }}
                            >
                                ← Volver
                            </button>
                            <div className="flex items-center gap-2">
                                <button
                                    className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-colors hover:bg-gray-50"
                                    style={{ color: '#3960A9', border: '0.5px solid rgba(57,96,169,0.3)' }}
                                >
                                    <Save size={14} />
                                    Guardar borrador
                                </button>
                                <button
                                    onClick={handleConfirmar}
                                    disabled={guardando || hayErrores}
                                    className="flex items-center gap-1.5 text-xs font-bold px-5 py-2 rounded-lg text-white transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ background: '#1F2F57' }}
                                >
                                    {guardando
                                        ? <><Loader2 size={13} className="animate-spin" /> Guardando...</>
                                        : <><Check size={14} /> Confirmar lote</>
                                    }
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* ── Drawer nuevo producto ────────────────────────────── */}
            <DrawerNuevoProducto
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                onAgregar={handleAgregarDesdeDrawer}
            />

        </div>
    )
}
