import { useState, useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'
import { getClientesByEmpresa } from '@/Connections/clientes'
import { getInventarioByTienda } from '@/Connections/productos'
import { createVenta } from '@/Connections/ventas'
import { Add } from '@mui/icons-material'
import { DeleteOutline } from '@mui/icons-material'
import { Input } from '../ui/input'
import { DialogFooter, Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'


const ITEM_EMPTY = { productoId: '', cantidad: 1, precioUnitario: '' }
const TIPO_PAGO_OPTIONS = [
    { key: 'CONTADO',  label: 'Contado'  },
    { key: 'CREDITO',  label: 'Crédito'  },
]
const fmt = v =>
    new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(v ?? 0)


const fmtDate = d =>
    d
        ? new Date(d).toLocaleString('es-PE', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        })
        : '—';

const extractList = res =>
    res?.data?.data?.data ?? res?.data?.data ?? res?.data ?? []

export function DialogNuevaVenta({ open, onClose, tiendaId, empresaId, onSuccess }) {
    const [clientes,   setClientes]   = useState([])
    const [inventario, setInventario] = useState([])
    const [loadingData, setLoadingData] = useState(false)

    const [clienteId, setClienteId] = useState('')
    const [tipoPago,  setTipoPago]  = useState('CONTADO')
    const [items, setItems] = useState([{ ...ITEM_EMPTY }])
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (!open || !empresaId || !tiendaId) return
        setLoadingData(true)
        Promise.all([
            getClientesByEmpresa(empresaId),
            getInventarioByTienda(tiendaId),
        ])
            .then(([resClientes, resInventario]) => {
                setClientes(extractList(resClientes))
                setInventario(extractList(resInventario))
            })
            .catch(() => toast.error('Error al cargar datos'))
            .finally(() => setLoadingData(false))
    }, [open, empresaId, tiendaId])

    useEffect(() => {
        if (!open) {
            setClienteId('')
            setTipoPago('CONTADO')
            setItems([{ ...ITEM_EMPTY }])
        }
    }, [open])

    const addItem = () => setItems(p => [...p, { ...ITEM_EMPTY }])

    const updateItem = (idx, field, value) =>
        setItems(p => p.map((it, i) => i === idx ? { ...it, [field]: value } : it))

    const removeItem = idx =>
        setItems(p => p.filter((_, i) => i !== idx))

    const handleProductoChange = (idx, productoId) => {
        const inv = inventario.find(i => String(i.productoId ?? i.id) === String(productoId))
        const precio = inv?.producto?.precio ?? inv?.precio ?? inv?.precioUnitario ?? ''
        updateItem(idx, 'productoId', productoId)
        if (precio) updateItem(idx, 'precioUnitario', precio)
    }

    const total = useMemo(() =>
        items.reduce((sum, it) => {
            const qty   = parseFloat(it.cantidad)    || 0
            const price = parseFloat(it.precioUnitario) || 0
            return sum + qty * price
        }, 0)
    , [items])

    const handleGuardar = async () => {
        const validItems = items.filter(it => it.productoId && it.cantidad > 0 && it.precioUnitario > 0)
        if (!validItems.length) return toast.error('Agrega al menos un producto válido')

        setSaving(true)
        try {
            const body = {
                tiendaId,
                ...(clienteId ? { clienteId } : {}),
                tipoPago,
                detalles: validItems.map(it => ({
                    productoId:     parseInt(it.productoId),
                    cantidad:       parseFloat(it.cantidad),
                    precioUnitario: parseFloat(it.precioUnitario),
                })),
            }
            const res = await createVenta(body)
            if (res.ok) {
                toast.success('Venta registrada correctamente')
                onSuccess()
                onClose()
            } else {
                toast.error(res.message || 'Error al registrar la venta')
            }
        } finally {
            setSaving(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={v => !v && onClose()}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Nueva Venta</DialogTitle>
                </DialogHeader>

                {loadingData ? (
                    <div className="space-y-3 py-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4 py-1">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1 block">
                                Cliente <span className="font-normal text-gray-400">(opcional)</span>
                            </label>
                            <select
                                value={clienteId}
                                onChange={e => setClienteId(e.target.value)}
                                className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm text-[#1F4363] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF821E]/30 focus:border-[#FF821E]"
                            >
                                <option value="">— Sin cliente —</option>
                                {clientes.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {c.nombre} {c.documento ? `(${c.documento})` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Tipo de pago */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Tipo de pago</label>
                            <div className="flex gap-2">
                                {TIPO_PAGO_OPTIONS.map(({ key, label }) => (
                                    <button
                                        key={key}
                                        onClick={() => setTipoPago(key)}
                                        className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all border-2 ${
                                            tipoPago === key
                                                ? key === 'CONTADO'
                                                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                                                    : 'bg-amber-50 border-amber-400 text-amber-700'
                                                : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-gray-300'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Productos */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Productos *</label>
                            <div className="space-y-2">
                                {items.map((item, idx) => (
                                    <div key={idx} className="flex gap-2 items-start">
                                        {/* Selector de producto */}
                                        <select
                                            value={item.productoId}
                                            onChange={e => handleProductoChange(idx, e.target.value)}
                                            className="flex-1 h-9 px-2 rounded-lg border border-gray-200 text-sm text-[#1F4363] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF821E]/30 focus:border-[#FF821E]"
                                        >
                                            <option value="">— Producto —</option>
                                            {inventario.map(inv => {
                                                const prod = inv.producto ?? inv
                                                const id   = inv.productoId ?? prod.id
                                                return (
                                                    <option key={id} value={id}>
                                                        {prod.nombre ?? `#${id}`}
                                                    </option>
                                                )
                                            })}
                                        </select>

                                        {/* Cantidad */}
                                        <Input
                                            type="number"
                                            min="1"
                                            step="1"
                                            value={item.cantidad}
                                            onChange={e => updateItem(idx, 'cantidad', e.target.value)}
                                            placeholder="Cant."
                                            className="w-20 h-9 text-sm focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                                        />

                                        {/* Precio unitario */}
                                        <Input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={item.precioUnitario}
                                            onChange={e => updateItem(idx, 'precioUnitario', e.target.value)}
                                            placeholder="Precio"
                                            className="w-28 h-9 text-sm focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                                        />

                                        {/* Subtotal */}
                                        <div className="w-24 h-9 flex items-center justify-end text-sm font-semibold text-[#1F4363] shrink-0">
                                            {fmt((parseFloat(item.cantidad) || 0) * (parseFloat(item.precioUnitario) || 0))}
                                        </div>

                                        {/* Eliminar fila */}
                                        <button
                                            onClick={() => removeItem(idx)}
                                            disabled={items.length === 1}
                                            className="w-9 h-9 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 disabled:opacity-20 shrink-0 transition-all"
                                        >
                                            <DeleteOutline style={{ fontSize: 18 }} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={addItem}
                                className="mt-2 text-xs text-[#FF821E] font-semibold hover:underline flex items-center gap-1"
                            >
                                <Add style={{ fontSize: 15 }} /> Agregar producto
                            </button>
                        </div>

                        {/* Total */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <span className="text-sm font-semibold text-gray-500">Total</span>
                            <span className="text-xl font-bold text-[#1F4363]">{fmt(total)}</span>
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={saving}>Cancelar</Button>
                    <Button
                        onClick={handleGuardar}
                        disabled={saving || loadingData}
                        className="bg-[#FF821E] hover:bg-[#FF821E]/90 text-white font-bold"
                    >
                        {saving ? 'Registrando...' : 'Registrar Venta'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}