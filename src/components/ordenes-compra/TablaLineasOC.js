'use client'
import { useMemo } from 'react'
import { Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

/**
 * TablaLineasOC — tabla de líneas de la orden de compra.
 * Props:
 *   lineas: Array<{ _id, producto_id, nombre, codigo, cantidad, precio_unitario, esNuevo }>
 *   onChange: (lineas) => void
 */
export default function TablaLineasOC({ lineas = [], onChange }) {

    const actualizarLinea = (id, campo, valor) => {
        onChange(lineas.map(l => l._id === id ? { ...l, [campo]: valor } : l))
    }

    const eliminarLinea = (id) => {
        onChange(lineas.filter(l => l._id !== id))
    }

    const total = useMemo(() =>
        lineas.reduce((acc, l) => acc + (parseFloat(l.cantidad) || 0) * (parseFloat(l.precio_unitario) || 0), 0)
    , [lineas])

    if (lineas.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-14 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50/60">
                <div className="w-12 h-12 rounded-xl bg-[#FF821E]/10 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-[#FF821E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                </div>
                <p className="text-sm font-medium text-gray-400">No has agregado productos aún</p>
                <p className="text-xs text-gray-300 mt-1">
                    Usa el buscador para agregar productos a la orden
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">
                                Producto
                            </th>
                            <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide w-24">
                                Cantidad
                            </th>
                            <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide w-28">
                                Precio unit.
                            </th>
                            <th className="px-3 py-2.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wide w-24">
                                Subtotal
                            </th>
                            <th className="px-3 py-2.5 w-10" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {lineas.map((linea) => {
                            const subtotal = (parseFloat(linea.cantidad) || 0) * (parseFloat(linea.precio_unitario) || 0)
                            return (
                                <tr key={linea._id} className="hover:bg-gray-50/60 transition-colors">
                                    <td className="px-3 py-2.5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-lg bg-[#1F4363]/10 flex items-center justify-center text-[#1F4363] font-bold text-xs shrink-0">
                                                {(linea.nombre ?? 'P')[0].toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-[#1F4363] truncate max-w-[150px]">
                                                    {linea.nombre}
                                                </p>
                                                <div className="flex items-center gap-1.5">
                                                    <p className="text-xs text-gray-400 font-mono">
                                                        {linea.codigo ?? '—'}
                                                    </p>
                                                    {linea.esNuevo && (
                                                        <Badge className="bg-[#198E7B]/10 text-[#198E7B] border-[#198E7B]/20 text-[10px] px-1.5 py-0 font-bold">
                                                            Nuevo
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2.5">
                                        <Input
                                            type="number"
                                            min="1"
                                            value={linea.cantidad}
                                            onChange={e => actualizarLinea(linea._id, 'cantidad', e.target.value)}
                                            className="h-8 text-xs w-20 focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                                        />
                                    </td>
                                    <td className="px-3 py-2.5">
                                        <div className="relative w-24">
                                            <span className="absolute left-2 top-1.5 text-xs text-gray-400 pointer-events-none">S/</span>
                                            <Input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={linea.precio_unitario}
                                                onChange={e => actualizarLinea(linea._id, 'precio_unitario', e.target.value)}
                                                className="h-8 text-xs pl-7 focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-3 py-2.5 text-right">
                                        <span className="text-sm font-semibold text-[#1F4363]">
                                            S/ {subtotal.toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2.5">
                                        <button
                                            type="button"
                                            onClick={() => eliminarLinea(linea._id)}
                                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pie de tabla */}
            <div className="flex items-center justify-between px-1 py-1 text-sm text-gray-500">
                <span>
                    Líneas: <span className="font-semibold text-[#1F4363]">{lineas.length}</span>
                </span>
                <span>
                    Total:{' '}
                    <span className="font-extrabold text-[#1F4363] text-base">
                        S/ {total.toFixed(2)}
                    </span>
                </span>
            </div>
        </div>
    )
}
