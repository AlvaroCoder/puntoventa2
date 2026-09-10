'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { Search, Plus, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

/**
 * BuscadorProducto — input de búsqueda con dropdown de resultados.
 * Props:
 *   productos: array — lista completa de productos de la empresa (filtrado local)
 *   onSeleccionar: (producto) => void
 *   onCrearNuevo: (query: string) => void — abre el DrawerProductoNuevo
 */
export default function BuscadorProducto({ productos = [], onSeleccionar, onCrearNuevo }) {
    const [abierto, setAbierto] = useState(false)
    const [query, setQuery] = useState('')
    const inputRef = useRef(null)
    const wrapperRef = useRef(null)

    const resultados = query.trim().length >= 2
        ? productos.filter(p =>
            (p.nombre ?? '').toLowerCase().includes(query.toLowerCase()) ||
            (p.codigo ?? '').toLowerCase().includes(query.toLowerCase())
          ).slice(0, 8)
        : []

    const handleSeleccionar = (prod) => {
        onSeleccionar(prod)
        setQuery('')
        setAbierto(false)
    }

    const handleCrearNuevo = () => {
        onCrearNuevo(query.trim())
        setQuery('')
        setAbierto(false)
    }

    useEffect(() => {
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setAbierto(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    return (
        <div ref={wrapperRef} className="relative">
            <div className="relative">
                <Search size={15} className="absolute left-3 top-2.5 text-gray-400 pointer-events-none" />
                <Input
                    ref={inputRef}
                    value={query}
                    onChange={e => {
                        setQuery(e.target.value)
                        setAbierto(true)
                    }}
                    onFocus={() => setAbierto(true)}
                    placeholder="Buscar producto por nombre o código..."
                    className="pl-9 pr-9 focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                />
                {query && (
                    <button
                        type="button"
                        onClick={() => { setQuery(''); setAbierto(false) }}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            {abierto && query.trim().length >= 2 && (
                <div className="absolute z-40 top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
                    {resultados.length > 0 ? (
                        <ul className="max-h-52 overflow-y-auto divide-y divide-gray-50">
                            {resultados.map(prod => (
                                <li key={prod.id}>
                                    <button
                                        type="button"
                                        onClick={() => handleSeleccionar(prod)}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#FF821E]/5 text-left transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-[#1F4363]/10 flex items-center justify-center text-[#1F4363] font-bold text-xs shrink-0">
                                            {(prod.nombre ?? 'P')[0].toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-[#1F4363] truncate">
                                                {prod.nombre}
                                            </p>
                                            <p className="text-xs text-gray-400">{prod.codigo ?? '—'}</p>
                                        </div>
                                        <Plus size={14} className="text-[#FF821E] shrink-0" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="px-4 py-3 text-sm text-gray-400">
                            Sin resultados para &quot;{query}&quot;
                        </div>
                    )}

                    <div className="border-t border-gray-100 bg-gray-50/60">
                        <button
                            type="button"
                            onClick={handleCrearNuevo}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#FF821E] hover:bg-[#FF821E]/5 transition-colors"
                        >
                            <Plus size={14} />
                            Crear nuevo producto &quot;{query}&quot;
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
