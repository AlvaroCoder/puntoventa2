'use client'
import { Plus, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

/**
 * TablaVariantes — tabla editable de variantes del producto.
 * Props:
 *   variantes: Array<{ id, talla, color, codigo_barras, precio_adicional, stock_inicial }>
 *   onChange: (variantes) => void
 *   mostrarStock: boolean — si mostrar la col stock (cuando ingresarStock=true)
 */
export default function TablaVariantes({ variantes = [], onChange, mostrarStock = true }) {

    const agregarVariante = () => {
        const nueva = {
            id: Date.now(),
            talla: '',
            color: '',
            codigo_barras: '',
            precio_adicional: '',
            stock_inicial: '',
        }
        onChange([...variantes, nueva])
    }

    const actualizarVariante = (id, campo, valor) => {
        onChange(variantes.map(v => v.id === id ? { ...v, [campo]: valor } : v))
    }

    const eliminarVariante = (id) => {
        onChange(variantes.filter(v => v.id !== id))
    }

    const totalStock = variantes.reduce((acc, v) => acc + (parseInt(v.stock_inicial) || 0), 0)

    return (
        <div className="space-y-3">
            <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Talla</th>
                            <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Color</th>
                            <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Cód. Barras</th>
                            <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Precio adicional</th>
                            {mostrarStock && (
                                <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Stock inicial</th>
                            )}
                            <th className="px-3 py-2.5 w-10" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {variantes.length === 0 ? (
                            <tr>
                                <td colSpan={mostrarStock ? 6 : 5} className="px-4 py-8 text-center text-xs text-gray-400">
                                    No hay variantes. Haz clic en &quot;+ Agregar variante&quot; para comenzar.
                                </td>
                            </tr>
                        ) : (
                            variantes.map((v, idx) => (
                                <tr key={v.id} className="hover:bg-gray-50/60 transition-colors">
                                    <td className="px-3 py-2">
                                        <Input
                                            value={v.talla}
                                            onChange={e => actualizarVariante(v.id, 'talla', e.target.value)}
                                            placeholder="Ej: 38"
                                            className="h-8 text-xs focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E] min-w-[70px]"
                                        />
                                    </td>
                                    <td className="px-3 py-2">
                                        <Input
                                            value={v.color}
                                            onChange={e => actualizarVariante(v.id, 'color', e.target.value)}
                                            placeholder="Ej: Rojo"
                                            className="h-8 text-xs focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E] min-w-[80px]"
                                        />
                                    </td>
                                    <td className="px-3 py-2">
                                        <Input
                                            value={v.codigo_barras}
                                            onChange={e => actualizarVariante(v.id, 'codigo_barras', e.target.value)}
                                            placeholder="Opcional"
                                            className="h-8 text-xs focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E] min-w-[100px]"
                                        />
                                    </td>
                                    <td className="px-3 py-2">
                                        <div className="relative min-w-[100px]">
                                            <span className="absolute left-2.5 top-1.5 text-xs text-gray-400 pointer-events-none">S/</span>
                                            <Input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={v.precio_adicional}
                                                onChange={e => actualizarVariante(v.id, 'precio_adicional', e.target.value)}
                                                placeholder="0.00"
                                                className="h-8 text-xs pl-7 focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                                            />
                                        </div>
                                    </td>
                                    {mostrarStock && (
                                        <td className="px-3 py-2">
                                            <Input
                                                type="number"
                                                min="0"
                                                value={v.stock_inicial}
                                                onChange={e => actualizarVariante(v.id, 'stock_inicial', e.target.value)}
                                                placeholder="0"
                                                className="h-8 text-xs focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E] min-w-[70px]"
                                            />
                                        </td>
                                    )}
                                    <td className="px-3 py-2">
                                        <button
                                            type="button"
                                            onClick={() => eliminarVariante(v.id)}
                                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                    {mostrarStock && variantes.length > 0 && (
                        <tfoot>
                            <tr className="border-t border-gray-100 bg-gray-50/60">
                                <td colSpan={4} className="px-3 py-2 text-xs text-gray-500 font-medium text-right">
                                    Total stock:
                                </td>
                                <td className="px-3 py-2">
                                    <span className="text-xs font-bold text-[#1F4363]">{totalStock} unid.</span>
                                </td>
                                <td />
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>

            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={agregarVariante}
                className="flex items-center gap-1.5 border-dashed border-[#1F4363]/30 text-[#1F4363] hover:bg-[#1F4363]/5 text-xs"
            >
                <Plus size={14} />
                Agregar variante
            </Button>
        </div>
    )
}
