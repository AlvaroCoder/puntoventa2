'use client'
import { useEffect, useState } from 'react'
// import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Field } from '@/components/Inputs/Field'
import { getAlmacenesByTienda } from '@/Connections/almacen'

/**
 * SeccionStockInicial — toggle de ingreso de stock + tienda, almacén, stock y mínimo.
 * Props:
 *   ingresarStock: boolean
 *   onToggle: (val) => void
 *   form: object { tienda_id, almacen_id, stock_inicial, stock_minimo }
 *   errors: object
 *   onChange: (name, value) => void
 *   tiendas: array
 *   loadingTiendas: boolean
 *   tieneVariantes: boolean
 */
export default function SeccionStockInicial({
    ingresarStock,
    onToggle,
    form,
    errors,
    onChange,
    tiendas = [],
    loadingTiendas = false,
    tieneVariantes = false,
}) {
    const [almacenes, setAlmacenes] = useState([])
    const [loadingAlmacenes, setLoadingAlmacenes] = useState(false)

    useEffect(() => {
        if (!form.tienda_id) {
            setAlmacenes([])
            onChange('almacen_id', '')
            return
        }
        setLoadingAlmacenes(true)
        getAlmacenesByTienda(form.tienda_id)
            .then(res => {
                const data = res?.data?.data ?? res?.data ?? []
                setAlmacenes(Array.isArray(data) ? data : [])
                onChange('almacen_id', '')
            })
            .catch(() => setAlmacenes([]))
            .finally(() => setLoadingAlmacenes(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.tienda_id])

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                    <p className="text-sm font-semibold text-[#1F4363]">Ingresar stock inicial ahora</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Asigna unidades iniciales a una tienda y almacén
                    </p>
                </div>

            </div>

            {ingresarStock && (
                <div className="space-y-4 p-4 border border-[#198E7B]/20 rounded-xl bg-[#198E7B]/5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Tienda" required error={errors.tienda_id}>
                            {loadingTiendas ? (
                                <div className="h-9 bg-gray-100 rounded-lg animate-pulse" />
                            ) : (
                                <div className="relative">
                                    <select
                                        value={form.tienda_id ?? ''}
                                        onChange={e => onChange('tienda_id', e.target.value || '')}
                                        className={`w-full h-9 px-3 pr-8 rounded-lg border bg-white text-sm text-[#1F4363] appearance-none focus:outline-none focus:ring-2 focus:ring-[#198E7B]/30 focus:border-[#198E7B] transition-all
                                            ${errors.tienda_id ? 'border-red-400' : 'border-gray-200'}`}
                                    >
                                        <option value="">Seleccionar tienda</option>
                                        {tiendas.map(t => (
                                            <option key={t.id} value={t.id}>{t.nombre}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute right-2.5 top-2.5">
                                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </Field>

                        <Field label="Almacén" error={errors.almacen_id}>
                            {loadingAlmacenes ? (
                                <div className="h-9 bg-gray-100 rounded-lg animate-pulse" />
                            ) : (
                                <div className="relative">
                                    <select
                                        value={form.almacen_id ?? ''}
                                        onChange={e => onChange('almacen_id', e.target.value || '')}
                                        disabled={!form.tienda_id}
                                        className="w-full h-9 px-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-[#1F4363] appearance-none focus:outline-none focus:ring-2 focus:ring-[#198E7B]/30 focus:border-[#198E7B] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="">
                                            {!form.tienda_id ? 'Primero selecciona una tienda' : almacenes.length === 0 ? 'Sin almacenes en esta tienda' : 'Seleccionar almacén'}
                                        </option>
                                        {almacenes.map(a => (
                                            <option key={a.id} value={a.id}>{a.nombre}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute right-2.5 top-2.5">
                                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </Field>
                    </div>

                    {!tieneVariantes && (
                        <Field label="Stock inicial" required error={errors.stock_inicial}>
                            <Input
                                type="number"
                                min="1"
                                value={form.stock_inicial ?? ''}
                                onChange={e => onChange('stock_inicial', e.target.value || '')}
                                placeholder="0"
                                className={`focus-visible:ring-[#198E7B]/30 focus-visible:border-[#198E7B] ${errors.stock_inicial ? 'border-red-400' : ''}`}
                            />
                        </Field>
                    )}

                    {tieneVariantes && (
                        <p className="text-xs text-[#198E7B] bg-[#198E7B]/10 px-3 py-2 rounded-lg">
                            El stock por variante se ingresa en la tabla de variantes arriba.
                        </p>
                    )}

                    <Field label="Stock mínimo" error={errors.stock_minimo}>
                        <Input
                            type="number"
                            min="0"
                            value={form.stock_minimo ?? ''}
                            onChange={e => onChange('stock_minimo', e.target.value || '')}
                            placeholder="0"
                            className="focus-visible:ring-[#198E7B]/30 focus-visible:border-[#198E7B]"
                        />
                        <p className="text-[11px] text-gray-400 -mt-1">
                            Se mostrará alerta cuando el stock baje de este valor
                        </p>
                    </Field>
                </div>
            )}
        </div>
    )
}
