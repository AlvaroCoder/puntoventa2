'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2, PackagePlus } from 'lucide-react'
import { getProductosSemillaByRubro } from '@/Connections/estandar'

export default function ModalCatalogoSemilla({ open, onClose, empresa, onImportSuccess }) {
    const [categorias, setCategorias]     = useState([])
    const [catActiva, setCatActiva]       = useState(null)
    const [seleccionados, setSeleccionados] = useState(new Set())
    const [loading, setLoading]           = useState(false)
    const [importing, setImporting]       = useState(false)

    useEffect(() => {
        if (!open) return
        const rubroId = empresa?.rubro_id
        if (!rubroId) return

        async function loadSemilla() {
            setLoading(true)
            try {
                const res = await getProductosSemillaByRubro(rubroId)

                const raw = res?.data?.data ?? res?.data ?? []
                const grouped = {}
                raw.forEach(p => {
                    const cat = p.categoria?.nombre;
                    if (!grouped[cat]) grouped[cat] = []
                    grouped[cat].push(p)
                })

                const cats = Object.entries(grouped).map(([nombre, productos]) => ({ nombre, productos }));
                setCategorias(cats)
                if (cats.length > 0) setCatActiva(cats[0].nombre)
            } catch {
                toast.error('Error al cargar el catálogo semilla')
            } finally {
                setLoading(false)
            }
        }
        loadSemilla()
    }, [open, empresa]);

    const productosActivos = useMemo(
        () => categorias.find(c => c.nombre === catActiva)?.productos ?? [],
        [categorias, catActiva]
    )

    const allSelected = productosActivos.length > 0 && productosActivos.every(p => seleccionados.has(p.id))

    const toggleProducto = id => {
        setSeleccionados(prev => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    const toggleCategoria = () => {
        setSeleccionados(prev => {
            const next = new Set(prev)
            if (allSelected) productosActivos.forEach(p => next.delete(p.id))
            else             productosActivos.forEach(p => next.add(p.id))
            return next
        })
    }

    const toggleCategoriaByName = (catNombre, catProds) => {
        const allCatSel = catProds.every(p => seleccionados.has(p.id))
        setSeleccionados(prev => {
            const next = new Set(prev)
            if (allCatSel) catProds.forEach(p => next.delete(p.id))
            else           catProds.forEach(p => next.add(p.id))
            return next
        })
    }

    const handleImport = async () => {
        if (seleccionados.size === 0) { toast.warn('Selecciona al menos un producto'); return }
        setImporting(true)
        const allProds = categorias.flatMap(c => c.productos)
        const selected = allProds.filter(p => seleccionados.has(p.id))
        await new Promise(r => setTimeout(r, 1200))
        setImporting(false)
        onImportSuccess?.(selected)
        setSeleccionados(new Set())
    }

    const handleClose = () => {
        setSeleccionados(new Set())
        onClose()
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl rounded-2xl p-0 overflow-hidden flex flex-col" style={{ maxHeight: '88vh' }}>

                <div className="px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">
                    <DialogTitle className="text-[#1F4363] font-bold text-lg">Catálogo Semilla</DialogTitle>
                    <DialogDescription className="text-sm text-gray-400 mt-0.5">
                        Selecciona productos del catálogo estándar para tu tipo de negocio
                    </DialogDescription>
                </div>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center py-20">
                        <Loader2 className="animate-spin text-[#1F4363]" size={32} />
                    </div>
                ) : !empresa?.rubro_id ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-20 text-center px-6">
                        <PackagePlus size={44} className="text-gray-200 mb-3" />
                        <p className="text-gray-400 text-sm">No se pudo determinar el rubro de tu empresa.</p>
                        <p className="text-gray-300 text-xs mt-1">Verifica la configuración de tu empresa.</p>
                    </div>
                ) : categorias.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-20 text-center px-6">
                        <PackagePlus size={44} className="text-gray-200 mb-3" />
                        <p className="text-gray-400 text-sm">No hay catálogo disponible para tu tipo de negocio.</p>
                    </div>
                ) : (
                    <div className="flex flex-1 overflow-hidden min-h-0">

                        <div className="w-52 shrink-0 border-r border-gray-100 overflow-y-auto bg-gray-50/40 py-2">
                            {categorias.map((cat, key) => {
                                const selCount = cat.productos.filter(p => seleccionados.has(p.id)).length
                                const allCatSel = selCount === cat.productos.length
                                return (
                                    <div
                                        key={key}
                                        onClick={() => setCatActiva(cat.nombre)}
                                        className={`flex items-center gap-2.5 px-4 py-2.5 cursor-pointer transition-colors ${
                                            catActiva === cat.nombre
                                                ? 'bg-white border-r-2 border-[#FF821E]'
                                                : 'hover:bg-white/60'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={allCatSel}
                                            className="accent-[#FF821E] w-4 h-4 shrink-0 cursor-pointer"
                                            onChange={e => { e.stopPropagation(); toggleCategoriaByName(cat.nombre, cat.productos) }}
                                            onClick={e => e.stopPropagation()}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium truncate ${catActiva === cat.nombre ? 'text-[#1F4363]' : 'text-gray-600'}`}>
                                                {cat.nombre}
                                            </p>
                                            {selCount > 0 && (
                                                <p className="text-[10px] text-[#FF821E] font-bold">{selCount}/{cat.productos.length} sel.</p>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-2.5 flex items-center gap-2 shrink-0">
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    onChange={toggleCategoria}
                                    className="accent-[#FF821E] w-4 h-4 cursor-pointer"
                                />
                                <span className="text-xs font-semibold text-gray-500">
                                    Seleccionar todos en &quot;{catActiva}&quot; ({productosActivos.length})
                                </span>
                            </div>

                            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                                {productosActivos.map((prod) => {
                                      
                                    return (<div
                                        key={prod?.id}
                                        onClick={() => toggleProducto(prod?.id)}
                                        className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50 ${seleccionados.has(prod?.id) ? 'bg-[#FF821E]/5' : ''}`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={seleccionados.has(prod?.id)}
                                            onChange={() => toggleProducto(prod?.id)}
                                            onClick={e => e.stopPropagation()}
                                            className="accent-[#FF821E] w-4 h-4 shrink-0 cursor-pointer"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-[#1F4363] truncate">
                                                {prod?.nombre}
                                            </p>
                                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                               {prod?.marca && (
                                                    <span className="text-xs text-gray-400">{prod?.marca?.nombre}</span>
                                                )}
                                                {prod?.variantes != null && (
                                                    <span className="text-[10px] bg-[#FF821E]/10 text-[#FF821E] font-semibold px-1.5 py-0.5 rounded-full">
                                                        {prod?.variantes} variantes
                                                    </span>
                                                )}
                                                {prod?.unidad && (
                                                    <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                                                        {prod?.unidad}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {prod?.precio_referencial && (
                                            <span className="text-xs text-gray-400 shrink-0">
                                                S/ {parseFloat(prod?.precio_referencial).toFixed(2)}
                                            </span>
                                        )}
                                    </div>)
                                })}
                            </div>
                        </div>
                    </div>
                )}

                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between shrink-0">
                    <p className="text-sm text-gray-500">
                        <span className="font-bold text-[#1F4363]">{seleccionados.size}</span> productos seleccionados
                    </p>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            className="border-gray-200 text-gray-500 hover:bg-gray-50"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleImport}
                            disabled={importing || seleccionados.size === 0}
                            className="bg-[#FF821E] hover:bg-[#FF821E]/90 text-white font-bold flex items-center gap-2"
                        >
                            {importing
                                ? <Loader2 size={14} className="animate-spin" />
                                : <PackagePlus size={15} />
                            }
                            Importar seleccionados
                        </Button>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    )
}