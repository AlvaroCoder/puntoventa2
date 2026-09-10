'use client'
import { useState, useEffect } from 'react'
import { Loader2, Wand2, Plus, Trash2 } from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
// import { Switch } from '@/components/ui/switch'
import { Field } from '@/components/Inputs/Field'
import { createProducto, createVariante, getCategorias } from '@/Connections/productos'
import { useGenerarCodigo } from '@/hooks/useGenerarCodigo'
import { useAuth } from '@/Context/AuthContext'
import { toast } from 'react-toastify'

const INITIAL = {
    nombre: '',
    codigo: '',
    categoria_id: null,
    precio_venta: '',
    precio_compra: '',
    tiene_variantes: false,
}

/**
 * DrawerProductoNuevo — Sheet lateral para crear un producto desde la OC.
 * Props:
 *   open: boolean
 *   onClose: () => void
 *   onCreado: (producto: { id, nombre, codigo, esNuevo: true }) => void
 *   nombreInicial?: string — pre-rellena el nombre
 */
export default function DrawerProductoNuevo({ open, onClose, onCreado, nombreInicial = '' }) {
    const { user } = useAuth()
    const { generarCodigo } = useGenerarCodigo()

    const [form, setForm] = useState({ ...INITIAL, nombre: nombreInicial })
    const [variantes, setVariantes] = useState([])
    const [categorias, setCategorias] = useState([])
    const [errors, setErrors] = useState({})
    const [saving, setSaving] = useState(false)

    // Pre-rellenar nombre cuando cambia el prop
    useEffect(() => {
        if (open) {
            setForm({ ...INITIAL, nombre: nombreInicial })
            setVariantes([])
            setErrors({})
        }
    }, [open, nombreInicial])

    // Cargar categorías al abrir
    useEffect(() => {
        if (!open) return
        getCategorias()
            .then(res => {
                const data = res?.data?.data ?? res?.data ?? []
                setCategorias(Array.isArray(data) ? data : [])
            })
            .catch(() => setCategorias([]))
    }, [open])

    const handleChange = (name, value) => {
        setForm(prev => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
    }

    const handleGenerar = () => {
        if (!form.nombre.trim()) return
        handleChange('codigo', generarCodigo(form.nombre))
    }

    const agregarVariante = () => {
        setVariantes(prev => [...prev, { id: Date.now(), talla: '', color: '' }])
    }

    const actualizarVariante = (id, campo, valor) => {
        setVariantes(prev => prev.map(v => v.id === id ? { ...v, [campo]: valor } : v))
    }

    const eliminarVariante = (id) => {
        setVariantes(prev => prev.filter(v => v.id !== id))
    }

    const validate = () => {
        const e = {}
        if (!form.nombre.trim()) e.nombre = 'El nombre es obligatorio'
        if (!form.codigo.trim()) e.codigo = 'El código es obligatorio'
        return e
    }

    const handleCrearYAgregar = async () => {
        const e = validate()
        if (Object.keys(e).length) { setErrors(e); return }

        setSaving(true)
        try {
            const payload = {
                empresa_id:       user?.empresa_id,
                nombre:           form.nombre.trim(),
                codigo:           form.codigo.trim(),
                tiene_variantes:  form.tiene_variantes,
                aplica_igv:       true,
                unidad_medida:    'UNIDAD',
                tags:             [],
            }
            if (form.categoria_id)          payload.categoria_id  = form.categoria_id
            if (form.precio_venta)          payload.precio_venta  = parseFloat(form.precio_venta)
            if (form.precio_compra)         payload.precio_compra = parseFloat(form.precio_compra)

            const res = await createProducto(payload)
            if (!res.ok) {
                toast.error(res.message || 'No se pudo crear el producto')
                return
            }

            const productoId = res?.data?.id ?? res?.data?.data?.id

            // Crear variantes si aplica
            if (form.tiene_variantes && variantes.length > 0 && productoId) {
                const validas = variantes.filter(v => v.talla || v.color)
                await Promise.allSettled(
                    validas.map(v => createVariante({
                        productoId,
                        talla: v.talla || null,
                        color: v.color || null,
                    }))
                )
            }

            const productoCreado = {
                id:       productoId,
                nombre:   form.nombre.trim(),
                codigo:   form.codigo.trim(),
                esNuevo:  true,
                precio_compra: form.precio_compra ? parseFloat(form.precio_compra) : 0,
            }

            toast.success(`Producto "${form.nombre}" creado`)
            onCreado(productoCreado)
            onClose()
        } catch {
            toast.error('Error inesperado al crear el producto')
        } finally {
            setSaving(false)
        }
    }

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent side="right" className="w-full max-w-[480px] overflow-y-auto flex flex-col">
                <SheetHeader>
                    <SheetTitle className="text-[#1F4363] text-lg font-extrabold">
                        Crear nuevo producto
                    </SheetTitle>
                    <p className="text-xs text-gray-400 -mt-1">
                        El producto se creará y se agregará a la orden de compra.
                    </p>
                </SheetHeader>

                <div className="flex-1 space-y-5 py-5">

                    <Field label="Nombre" required error={errors.nombre}>
                        <Input
                            value={form.nombre}
                            onChange={e => handleChange('nombre', e.target.value)}
                            placeholder="Nombre del producto"
                            className={`focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E] ${errors.nombre ? 'border-red-400' : ''}`}
                        />
                    </Field>

                    <Field label="Código interno" required error={errors.codigo}>
                        <div className="flex gap-2">
                            <Input
                                value={form.codigo}
                                onChange={e => handleChange('codigo', e.target.value)}
                                placeholder="Ej: ZAP-NIK-001"
                                className={`flex-1 focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E] ${errors.codigo ? 'border-red-400' : ''}`}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleGenerar}
                                className="shrink-0 flex items-center gap-1.5 border-[#1F4363]/30 text-[#1F4363] hover:bg-[#1F4363]/5 text-xs px-3"
                            >
                                <Wand2 size={13} />
                                Generar
                            </Button>
                        </div>
                    </Field>

                    <Field label="Categoría">
                        <div className="relative">
                            <select
                                value={form.categoria_id ?? ''}
                                onChange={e => handleChange('categoria_id', e.target.value || null)}
                                className="w-full h-9 px-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-[#1F4363] appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF821E]/30 focus:border-[#FF821E] transition-all"
                            >
                                <option value="">Sin categoría</option>
                                {categorias.map(c => (
                                    <option key={c.id} value={c.id}>{c.nombre}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute right-2.5 top-2.5">
                                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Precio venta">
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-xs text-gray-400 pointer-events-none">S/</span>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.precio_venta}
                                    onChange={e => handleChange('precio_venta', e.target.value)}
                                    placeholder="0.00"
                                    className="pl-8 focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                                />
                            </div>
                        </Field>
                        <Field label="Precio compra">
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-xs text-gray-400 pointer-events-none">S/</span>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.precio_compra}
                                    onChange={e => handleChange('precio_compra', e.target.value)}
                                    placeholder="0.00"
                                    className="pl-8 focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                                />
                            </div>
                        </Field>
                    </div>

                    {/* Toggle variantes */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div>
                            <p className="text-sm font-semibold text-[#1F4363]">Tiene variantes</p>
                            <p className="text-xs text-gray-400">Talla, color, etc.</p>
                        </div>

                    </div>

                    {/* Tabla simplificada de variantes */}
                    {form.tiene_variantes && (
                        <div className="space-y-2">
                            <div className="overflow-x-auto rounded-xl border border-gray-100">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100">
                                            <th className="px-3 py-2 text-left text-xs font-bold text-gray-500">Talla</th>
                                            <th className="px-3 py-2 text-left text-xs font-bold text-gray-500">Color</th>
                                            <th className="px-3 py-2 w-8" />
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {variantes.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="px-3 py-4 text-center text-xs text-gray-400">
                                                    Sin variantes
                                                </td>
                                            </tr>
                                        ) : (
                                            variantes.map(v => (
                                                <tr key={v.id}>
                                                    <td className="px-3 py-1.5">
                                                        <Input
                                                            value={v.talla}
                                                            onChange={e => actualizarVariante(v.id, 'talla', e.target.value)}
                                                            placeholder="Ej: 38"
                                                            className="h-7 text-xs focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                                                        />
                                                    </td>
                                                    <td className="px-3 py-1.5">
                                                        <Input
                                                            value={v.color}
                                                            onChange={e => actualizarVariante(v.id, 'color', e.target.value)}
                                                            placeholder="Ej: Rojo"
                                                            className="h-7 text-xs focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                                                        />
                                                    </td>
                                                    <td className="px-3 py-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => eliminarVariante(v.id)}
                                                            className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={agregarVariante}
                                className="flex items-center gap-1 text-xs border-dashed border-[#1F4363]/30 text-[#1F4363] hover:bg-[#1F4363]/5"
                            >
                                <Plus size={12} />
                                Agregar variante
                            </Button>
                        </div>
                    )}

                </div>

                <SheetFooter className="flex gap-2 pt-4 border-t border-gray-100">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={saving}
                        className="flex-1 border-gray-200 text-gray-500"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleCrearYAgregar}
                        disabled={saving}
                        className="flex-1 bg-[#FF821E] hover:bg-[#FF821E]/90 text-white font-bold"
                    >
                        {saving ? (
                            <Loader2 size={14} className="animate-spin mr-1.5" />
                        ) : null}
                        Crear y agregar a OC
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
