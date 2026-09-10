'use client'
import { useMemo } from 'react'
import { CheckCircle2, ClipboardList, X } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

/**
 * ResumenOC — modal de confirmación post-creación de la orden de compra.
 * Props:
 *   open: boolean
 *   onClose: () => void
 *   ordenId: string|number|null
 *   estado: 'BORRADOR'|'ENVIADA'
 *   lineas: array
 *   onVerOrden: () => void
 *   onCrearOtra: () => void
 */
export default function ResumenOC({ open, onClose, ordenId, estado, lineas = [], onVerOrden, onCrearOtra }) {

    const total = useMemo(() =>
        lineas.reduce((acc, l) => acc + (parseFloat(l.cantidad) || 0) * (parseFloat(l.precio_unitario) || 0), 0)
    , [lineas])

    const estadoColor = estado === 'ENVIADA'
        ? { bg: 'bg-[#198E7B]/10', text: 'text-[#198E7B]', border: 'border-[#198E7B]/20' }
        : { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 rounded-xl bg-[#198E7B]/10 flex items-center justify-center">
                            <CheckCircle2 size={22} className="text-[#198E7B]" />
                        </div>
                        <div>
                            <DialogTitle className="text-[#1F4363] font-extrabold">
                                Orden creada exitosamente
                            </DialogTitle>
                            {ordenId && (
                                <p className="text-xs text-gray-400 mt-0.5">
                                    OC #{String(ordenId).padStart(6, '0')}
                                </p>
                            )}
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-3 py-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Estado</span>
                        <Badge className={`${estadoColor.bg} ${estadoColor.text} ${estadoColor.border} font-semibold`}>
                            {estado === 'ENVIADA' ? 'Enviada al proveedor' : 'Borrador'}
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Productos</span>
                        <span className="text-sm font-semibold text-[#1F4363]">{lineas.length} línea(s)</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Total estimado</span>
                        <span className="text-lg font-extrabold text-[#1F4363]">
                            S/ {total.toFixed(2)}
                        </span>
                    </div>

                    {lineas.length > 0 && (
                        <div className="rounded-xl border border-gray-100 overflow-hidden">
                            <div className="bg-gray-50 px-3 py-2 border-b border-gray-100">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                    Detalle de líneas
                                </p>
                            </div>
                            <ul className="divide-y divide-gray-50 max-h-40 overflow-y-auto">
                                {lineas.map(l => (
                                    <li key={l._id} className="flex items-center justify-between px-3 py-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-[#1F4363] truncate">{l.nombre}</p>
                                            <p className="text-xs text-gray-400">
                                                {l.cantidad} × S/ {parseFloat(l.precio_unitario || 0).toFixed(2)}
                                            </p>
                                        </div>
                                        <span className="text-xs font-bold text-[#1F4363] ml-3">
                                            S/ {((parseFloat(l.cantidad) || 0) * (parseFloat(l.precio_unitario) || 0)).toFixed(2)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={onCrearOtra}
                        className="flex-1 flex items-center gap-1.5 border-[#1F4363]/30 text-[#1F4363] hover:bg-[#1F4363]/5"
                    >
                        <ClipboardList size={14} />
                        Crear otra
                    </Button>
                    <Button
                        onClick={onVerOrden}
                        className="flex-1 bg-[#FF821E] hover:bg-[#FF821E]/90 text-white font-bold"
                    >
                        Ver orden
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
