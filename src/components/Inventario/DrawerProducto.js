'use client'
import React, { useEffect, useState } from 'react'
import { X, ChevronDown, Loader2, Plus, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createProducto, updateProducto } from '@/Connections/productos'
import StoreIcon from '@mui/icons-material/Store'

const INITIAL = {
    nombre:         '',
    codigo:         '',
    codigo_barras:  '',
    categoria_id:   '',
    descripcion:    '',
    imagen_url:     '',
    precio_venta:   '',
    precio_compra:  '',
    igv:            18,
    tiene_variantes: false,
    stock_inicial:  '',
    stock_minimo:   '',
}

function SectionTitle({ children }) {
    return (
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 pb-1.5 border-b border-gray-100">
            {children}
        </h3>
    )
}

function generateCodigo() {
    return `PRD-${String(Math.floor(Math.random() * 9000) + 1000)}`
}

export default function DrawerProducto({
    open,
    onClose,
    productoData,
    tiendas = [],
    categorias = [],
    empresaId,
    onAddSuccess,
    onUpdateSuccess,
}) {
    const [form, setForm]                     = useState(INITIAL)
    const [variantes, setVariantes]           = useState([{ talla: '', color: '', stocks: {} }])
    const [stocksPorTienda, setStocksPorTienda] = useState({})
    const [saving, setSaving]                 = useState(false)
    const [sugerido]                          = useState(generateCodigo)
    const isEdit = !!productoData

    useEffect(() => {
        if (!open) return
        if (productoData) {
            setForm({
                nombre:         productoData.nombre         ?? '',
                codigo:         productoData.codigo         ?? '',
                codigo_barras:  productoData.codigo_barras  ?? '',
                categoria_id:   productoData.categoria_id   ?? '',
                descripcion:    productoData.descripcion    ?? '',
                imagen_url:     productoData.imagen_url     ?? '',
                precio_venta:   productoData.precio_venta   ?? '',
                precio_compra:  productoData.precio_compra  ?? '',
                igv:            productoData.igv             ?? 18,
                tiene_variantes: false,
                stock_inicial:  '',
                stock_minimo:   '',
            })
            setVariantes([{ talla: '', color: '', stocks: {} }])
            setStocksPorTienda({})
        } else {
            setForm(INITIAL)
            setVariantes([{ talla: '', color: '', stocks: {} }])
            setStocksPorTienda({})
        }
    }, [productoData, open])

    const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const handleToggleVariantes = () =>
        setForm(prev => ({ ...prev, tiene_variantes: !prev.tiene_variantes }))

    const handleVarianteField = (idx, field, value) =>
        setVariantes(prev => prev.map((v, i) => i === idx ? { ...v, [field]: value } : v))

    const handleVarianteStock = (idx, tiendaId, value) =>
        setVariantes(prev => prev.map((v, i) => i === idx ? { ...v, stocks: { ...v.stocks, [tiendaId]: value } } : v))

    const handleSubmit = async e => {
        e?.preventDefault()
        if (!form.nombre.trim() || !form.codigo.trim()) {
            toast.warn('Nombre y código son obligatorios')
            return
        }
        if (!form.precio_venta) {
            toast.warn('El precio de venta es obligatorio')
            return
        }
        setSaving(true)
        try {
            const payload = {
                nombre:         form.nombre.trim(),
                codigo:         form.codigo.trim(),
                precio_venta:   parseFloat(form.precio_venta),
                igv:            parseFloat(form.igv),
                empresa_id:     empresaId,
                ...(form.codigo_barras  ? { codigo_barras:  form.codigo_barras }           : {}),
                ...(form.categoria_id   ? { categoria_id:   Number(form.categoria_id) }    : {}),
                ...(form.descripcion    ? { descripcion:    form.descripcion }              : {}),
                ...(form.imagen_url     ? { imagen_url:     form.imagen_url }               : {}),
                ...(form.precio_compra  ? { precio_compra:  parseFloat(form.precio_compra) } : {}),
                ...(form.stock_inicial  ? { stock_inicial:  parseInt(form.stock_inicial) }  : {}),
                ...(form.stock_minimo   ? { stock_minimo:   parseInt(form.stock_minimo) }   : {}),
            }

            const res = isEdit
                ? await updateProducto(productoData.id, payload)
                : await createProducto(payload)

            if (!res.ok) {
                toast.error(res.message || 'Error al guardar el producto')
                return
            }
            toast.success(isEdit ? 'Producto actualizado' : 'Producto creado correctamente')
            const result = res.data?.data ?? res.data ?? payload
            if (isEdit) onUpdateSuccess?.({ ...productoData, ...result })
            else        onAddSuccess?.(result)
        } catch {
            toast.error('Error inesperado al guardar')
        } finally {
            setSaving(false)
        }
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div className={`fixed inset-y-0 right-0 w-full max-w-[540px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
                    <div>
                        <h2 className="font-bold text-[#1F4363] text-lg">
                            {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
                        </h2>
                        <p className="text-sm text-gray-400">
                            {isEdit ? (productoData?.nombre ?? '') : 'Completa la información del producto'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

                    {/* ── Sección 1: Información básica ── */}
                    <div>
                        <SectionTitle>Información básica</SectionTitle>
                        <div className="space-y-4">

                            <div>
                                <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">
                                    Nombre del producto <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    name="nombre"
                                    placeholder="Ej: Arroz extra calidad 5kg"
                                    value={form.nombre}
                                    onChange={handleChange}
                                    className="focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">
                                        Código <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Input
                                            name="codigo"
                                            placeholder={sugerido}
                                            value={form.codigo}
                                            onChange={handleChange}
                                            className="focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E] pr-16"
                                        />
                                        {!form.codigo && (
                                            <button
                                                type="button"
                                                onClick={() => setForm(f => ({ ...f, codigo: sugerido }))}
                                                className="absolute right-2 top-2 text-[10px] text-[#FF821E] hover:underline font-bold"
                                            >
                                                Sugerir
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">Código de barras</label>
                                    <Input
                                        name="codigo_barras"
                                        placeholder="EAN-13"
                                        value={form.codigo_barras}
                                        onChange={handleChange}
                                        className="focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">Categoría</label>
                                <div className="relative">
                                    <select
                                        name="categoria_id"
                                        value={form.categoria_id}
                                        onChange={handleChange}
                                        className="w-full h-10 pl-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-[#1F4363] appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF821E]/30 focus:border-[#FF821E]"
                                    >
                                        <option value="">Sin categoría</option>
                                        {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-2.5 top-3 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">Descripción</label>
                                <textarea
                                    name="descripcion"
                                    value={form.descripcion}
                                    onChange={handleChange}
                                    rows={2}
                                    placeholder="Descripción opcional del producto..."
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-[#1F4363] resize-none focus:outline-none focus:ring-2 focus:ring-[#FF821E]/30 focus:border-[#FF821E] placeholder-gray-300"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">URL de imagen</label>
                                <Input
                                    name="imagen_url"
                                    placeholder="https://..."
                                    value={form.imagen_url}
                                    onChange={handleChange}
                                    className="focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                                />
                            </div>

                        </div>
                    </div>

                    {/* ── Sección 2: Precios ── */}
                    <div>
                        <SectionTitle>Precios</SectionTitle>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">
                                    Precio venta <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-sm text-gray-400 font-medium select-none">S/</span>
                                    <Input
                                        name="precio_venta"
                                        type="number" step="0.01" min="0"
                                        placeholder="0.00"
                                        value={form.precio_venta}
                                        onChange={handleChange}
                                        className="pl-8 focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">Precio compra</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-sm text-gray-400 font-medium select-none">S/</span>
                                    <Input
                                        name="precio_compra"
                                        type="number" step="0.01" min="0"
                                        placeholder="0.00"
                                        value={form.precio_compra}
                                        onChange={handleChange}
                                        className="pl-8 focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">IGV %</label>
                                <Input
                                    name="igv"
                                    type="number" step="1" min="0" max="100"
                                    value={form.igv}
                                    onChange={handleChange}
                                    className="focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── Sección 3: Variantes ── */}
                    <div>
                        <SectionTitle>Variantes</SectionTitle>
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm text-gray-600 flex-1 pr-4">
                                ¿Este producto tiene variantes de talla y/o color?
                            </p>
                            <button
                                type="button"
                                onClick={handleToggleVariantes}
                                className={`relative w-12 h-6 rounded-full transition-colors duration-200 shrink-0 ${form.tiene_variantes ? 'bg-[#FF821E]' : 'bg-gray-200'}`}
                            >
                                <span
                                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${form.tiene_variantes ? 'translate-x-7' : 'translate-x-1'}`}
                                />
                            </button>
                        </div>

                        {form.tiene_variantes ? (
                            <div className="space-y-2">
                                {variantes.map((v, idx) => (
                                    <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                                        <Input
                                            placeholder="Talla"
                                            value={v.talla}
                                            onChange={e => handleVarianteField(idx, 'talla', e.target.value)}
                                            className="w-24 text-xs"
                                        />
                                        <Input
                                            placeholder="Color"
                                            value={v.color}
                                            onChange={e => handleVarianteField(idx, 'color', e.target.value)}
                                            className="w-24 text-xs"
                                        />
                                        {tiendas.slice(0, 2).map(t => (
                                            <Input
                                                key={t.id}
                                                type="number" min="0"
                                                placeholder={t.nombre.slice(0, 8)}
                                                value={v.stocks[t.id] ?? ''}
                                                onChange={e => handleVarianteStock(idx, t.id, e.target.value)}
                                                className="w-24 text-xs"
                                            />
                                        ))}
                                        {variantes.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => setVariantes(p => p.filter((_, i) => i !== idx))}
                                                className="text-red-400 hover:text-red-600 shrink-0"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setVariantes(p => [...p, { talla: '', color: '', stocks: {} }])}
                                    className="flex items-center gap-1 text-xs text-[#FF821E] hover:underline font-semibold mt-1"
                                >
                                    <Plus size={14} /> Agregar variante
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">Stock inicial</label>
                                    <Input
                                        name="stock_inicial"
                                        type="number" min="0"
                                        placeholder="0"
                                        value={form.stock_inicial}
                                        onChange={handleChange}
                                        className="focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">Stock mínimo</label>
                                    <Input
                                        name="stock_minimo"
                                        type="number" min="0"
                                        placeholder="0"
                                        value={form.stock_minimo}
                                        onChange={handleChange}
                                        className="focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Sección 4: Stock por tienda ── */}
                    {!form.tiene_variantes && tiendas.length > 0 && (
                        <div>
                            <SectionTitle>Stock por tienda</SectionTitle>
                            <div className="space-y-2">
                                {tiendas.map(t => (
                                    <div key={t.id} className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-xl">
                                        <StoreIcon style={{ fontSize: 18, color: '#8D99AE' }} />
                                        <span className="text-sm font-medium text-[#1F4363] flex-1 truncate">{t.nombre}</span>
                                        <Input
                                            type="number" min="0"
                                            placeholder="Stock"
                                            value={stocksPorTienda[t.id] ?? ''}
                                            onChange={e => setStocksPorTienda(prev => ({ ...prev, [t.id]: e.target.value }))}
                                            className="w-28 text-xs focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex gap-3 shrink-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 border-gray-200 text-gray-500 hover:bg-gray-50"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="flex-1 bg-[#FF821E] hover:bg-[#FF821E]/90 text-white font-bold"
                    >
                        {saving && <Loader2 size={15} className="animate-spin mr-2" />}
                        {isEdit ? 'Guardar cambios' : 'Guardar producto'}
                    </Button>
                </div>

            </div>
        </>
    )
}