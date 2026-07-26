'use client'
import React, { useEffect, useState } from 'react'
import { X, ChevronDown, Loader2, Plus, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createProducto, updateProducto, createVariante } from '@/Connections/productos'
import StoreIcon from '@mui/icons-material/Store'

const INITIAL = {
    tiendaId: '',
    nombre: '',
    codigo: '',
    codigoBarras: '',
    categoriaId: '',
    descripcion: '',
    imagenUrl: '',
    precioVenta: '',
    precioCompra: '',
    igv: 18,
    tieneVariantes: false,
    stockInicial: '',
    temporada: 'verano',
    genero: 'masculino',
    tipoProducto: 'zapatilla',
    tagsModa: ['urbano', 'clasico'],
}

const TEMPORADAS   = ['verano', 'otoño', 'invierno', 'primavera']
const GENEROS      = ['masculino', 'femenino', 'unisex', 'niño', 'niña']
const TIPOS_PROD   = ['zapatilla', 'sandalia', 'bota', 'mocasín', 'deportiva', 'otro']

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
    const [form, setForm]                       = useState(INITIAL)
    const [variantes, setVariantes]             = useState([{ talla: '', color: '', cantidad: '', codigoVariante: '', codigoBarras: '', precioAdicional: '' }])
    const [varianteTiendaGlobal, setVTG]        = useState(true)
    const [tagInput, setTagInput]               = useState('')
    const [saving, setSaving]                   = useState(false)
    const [sugerido]                            = useState(generateCodigo)
    const isEdit = !!productoData

    useEffect(() => {
        if (!open) return
        if (productoData) {
            setForm({
                tiendaId:      '',
                nombre:        productoData.nombre        ?? '',
                codigo:        productoData.codigo        ?? '',
                codigoBarras:  productoData.codigoBarras  ?? '',
                categoriaId:   productoData.categoriaId   ?? '',
                descripcion:   productoData.descripcion   ?? '',
                imagenUrl:     productoData.imagenUrl     ?? '',
                precioVenta:   productoData.precioVenta   ?? '',
                precioCompra:  productoData.precioCompra  ?? '',
                igv:           productoData.igv           ?? 18,
                tieneVariantes: false,
                stockInicial:  '',
                temporada:     productoData.temporada     ?? 'verano',
                genero:        productoData.genero        ?? 'masculino',
                tipoProducto:  productoData.tipoProducto  ?? 'zapatilla',
                tagsModa:      productoData.tagsModa      ?? [],
            })
            setVariantes([{ talla: '', color: '', cantidad: '', codigoVariante: '', codigoBarras: '', precioAdicional: '' }])
        } else {
            setForm(INITIAL)
            setVariantes([{ talla: '', color: '', cantidad: '', codigoVariante: '', codigoBarras: '', precioAdicional: '' }])
        }
        setVTG(true)
        setTagInput('')
    }, [productoData, open])

    const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const handleToggleVariantes = () =>
        setForm(prev => ({ ...prev, tieneVariantes: !prev.tieneVariantes }))

    const addTag = () => {
        const tag = tagInput.trim().toLowerCase()
        if (!tag || form.tagsModa.includes(tag)) { setTagInput(''); return }
        setForm(prev => ({ ...prev, tagsModa: [...prev.tagsModa, tag] }))
        setTagInput('')
    }
    const removeTag = idx =>
        setForm(prev => ({ ...prev, tagsModa: prev.tagsModa.filter((_, i) => i !== idx) }))

    const handleVarianteField = (idx, field, value) =>
        setVariantes(prev => prev.map((v, i) => i === idx ? { ...v, [field]: value } : v))

    const handleSubmit = async e => {
        e?.preventDefault()
        if (!form.nombre.trim() || !form.codigo.trim()) {
            toast.warn('Nombre y código son obligatorios')
            return
        }
        if (!form.precioVenta) {
            toast.warn('El precio de venta es obligatorio')
            return
        }
        if (!isEdit && !form.tiendaId) {
            toast.warn('Selecciona una tienda de destino')
            return
        }

        const basePayload = {
            empresaId,
            nombre:             form.nombre.trim(),
            codigo:             form.codigo.trim(),
            precioVenta:        parseFloat(form.precioVenta),
            impuestoPorcentaje: parseFloat(form.igv) / 100,
            aplicaIgv:          parseFloat(form.igv) > 0,
            temporada:          form.temporada,
            genero:             form.genero,
            tipoProducto:       form.tipoProducto,
            tagsModa:           form.tagsModa,
            tiendaId:           Number(form.tiendaId),
            ...(form.codigoBarras ? { codigoBarras: form.codigoBarras }               : {}),
            ...(form.categoriaId  ? { categoriaId:  Number(form.categoriaId) }         : {}),
            ...(form.descripcion  ? { descripcion:  form.descripcion }                 : {}),
            ...(form.imagenUrl    ? { imagenUrl:    form.imagenUrl }                  : {}),
            ...(form.precioCompra ? { precioCompra: parseFloat(form.precioCompra) }    : {}),
        }

        setSaving(true)
        try {
            if (isEdit) {
                const res = await updateProducto(productoData.id, basePayload)
                if (!res.ok) { toast.error(res.message || 'Error al actualizar'); return }
                toast.success('Producto actualizado')
                onUpdateSuccess?.({ ...productoData, ...(res.data?.data ?? res.data ?? {}) })
                return
            }

            if (!form.tieneVariantes) {
                const res = await createProducto({
                    ...basePayload,
                    tieneVariantes: null,
                    stockInicial:   parseInt(form.stockInicial) || null,
                })
                if (!res.ok) { toast.error(res.message || 'Error al crear el producto'); return }
                toast.success('Producto creado correctamente')
                onAddSuccess?.(res.data?.data ?? res.data ?? {})
                return
            }

        
            const resProducto = await createProducto({
                ...basePayload,
                tieneVariantes: true,
                stockInicial:   null,
            })

            console.log("PRODUCTO : "+basePayload)
            if (!resProducto.ok) {
                toast.error(resProducto.message || 'Error al crear el producto base')
                return
            }
            const productoId = resProducto.data?.id ?? resProducto.data?.data?.id
            if (!productoId) {
                toast.error('No se obtuvo el ID del producto creado')
                return
            }

            const variantesValidas = variantes.filter(v => v.talla || v.color || v.cantidad)
            if (variantesValidas.length === 0) {
                toast.warn('Agrega al menos una variante con datos')
                return
            }
            const resultados = await Promise.allSettled(
                variantesValidas.map(v =>
                    createVariante({
                        productoId,
                        tiendaId: varianteTiendaGlobal ? Number(form.tiendaId) : Number(v.tiendaId || form.tiendaId),
                        descripcion: form.descripcion || null,
                        stockInicial: parseInt(v.cantidad) || 0,
                        talla: v.talla  || null,
                        color: v.color  || null,
                        codigoVariante: v.codigoVariante || null,
                        codigoBarras: v.codigoBarras   || null,
                        precioAdicional: parseFloat(v.precioAdicional) || 0,
                    })
                )
            )
            const fallidas = resultados.filter(r => r.status === 'rejected' || !r.value?.ok)
            if (fallidas.length === 0) {
                toast.success(`Producto y ${variantesValidas.length} variante(s) creadas correctamente`)
            } else {
                toast.warn(`Producto creado. ${variantesValidas.length - fallidas.length}/${variantesValidas.length} variante(s) guardadas`)
            }
            onAddSuccess?.(resProducto.data?.data ?? resProducto.data ?? {})
        } catch {
            toast.error('Error inesperado al guardar')
        } finally {
            setSaving(false)
        }
    }

    return (
        <>
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

                    {/* ── Tienda destino ── */}
                    {!isEdit && (
                        <div className="bg-[#1F4363]/5 border border-[#1F4363]/10 rounded-xl px-4 py-3.5">
                            <label className="block text-sm font-bold text-[#1F4363] mb-2">
                                <StoreIcon style={{ fontSize: 16, verticalAlign: 'text-bottom', marginRight: 6 }} />
                                Tienda destino <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    name="tiendaId"
                                    value={form.tiendaId}
                                    onChange={handleChange}
                                    className="w-full h-10 pl-3 pr-8 rounded-lg border border-[#1F4363]/20 bg-white text-sm text-[#1F4363] font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF821E]/30 focus:border-[#FF821E]"
                                >
                                    <option value="">— Selecciona una tienda —</option>
                                    {tiendas.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                                </select>
                                <ChevronDown size={14} className="absolute right-2.5 top-3 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    )}

                    <div>
                        <SectionTitle>Información básica</SectionTitle>
                        <div className="space-y-4">

                            <div>
                                <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">
                                    Nombre del producto <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    name="nombre"
                                    placeholder="Ej: Zapatilla New Athletic"
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
                                        name="codigoBarras"
                                        placeholder="EAN-13"
                                        value={form.codigoBarras}
                                        onChange={handleChange}
                                        className="focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">Categoría</label>
                                <div className="relative">
                                    <select
                                        name="categoriaId"
                                        value={form.categoriaId}
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
                                    name="imagenUrl"
                                    placeholder="https://..."
                                    value={form.imagenUrl}
                                    onChange={handleChange}
                                    className="focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                                />
                            </div>

                        </div>
                    </div>

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
                                        name="precioVenta"
                                        type="number" step="0.01" min="0"
                                        placeholder="0.00"
                                        value={form.precioVenta}
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
                                        name="precioCompra"
                                        type="number" step="0.01" min="0"
                                        placeholder="0.00"
                                        value={form.precioCompra}
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

                    <div>
                        <SectionTitle>Clasificación</SectionTitle>
                        <div className="space-y-4">

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">Temporada</label>
                                    <div className="relative">
                                        <select
                                            name="temporada"
                                            value={form.temporada}
                                            onChange={handleChange}
                                            className="w-full h-10 pl-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-[#1F4363] appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF821E]/30 focus:border-[#FF821E]"
                                        >
                                            {TEMPORADAS.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                        <ChevronDown size={14} className="absolute right-2.5 top-3 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">Género</label>
                                    <div className="relative">
                                        <select
                                            name="genero"
                                            value={form.genero}
                                            onChange={handleChange}
                                            className="w-full h-10 pl-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-[#1F4363] appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF821E]/30 focus:border-[#FF821E]"
                                        >
                                            {GENEROS.map(g => <option key={g} value={g}>{g}</option>)}
                                        </select>
                                        <ChevronDown size={14} className="absolute right-2.5 top-3 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">Tipo</label>
                                    <div className="relative">
                                        <select
                                            name="tipoProducto"
                                            value={form.tipoProducto}
                                            onChange={handleChange}
                                            className="w-full h-10 pl-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-[#1F4363] appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF821E]/30 focus:border-[#FF821E]"
                                        >
                                            {TIPOS_PROD.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                        <ChevronDown size={14} className="absolute right-2.5 top-3 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">Tags de moda</label>
                                <div className="flex flex-wrap gap-1.5 mb-2">
                                    {form.tagsModa.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#1F4363]/8 text-[#1F4363]"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(idx)}
                                                className="hover:text-red-400 transition-colors"
                                            >
                                                <X size={11} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        value={tagInput}
                                        onChange={e => setTagInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                        placeholder="Ej: urbano, casual..."
                                        className="flex-1 text-sm focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                                    />
                                    <button
                                        type="button"
                                        onClick={addTag}
                                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#FF821E] border border-[#FF821E]/30 hover:bg-[#FF821E]/5 transition-colors"
                                    >
                                        <Plus size={13} /> Agregar
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div>
                        <SectionTitle>Variantes y Stock</SectionTitle>
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm text-gray-600 flex-1 pr-4">
                                ¿Este producto tiene variantes de talla y/o color?
                            </p>
                            <button
                                type="button"
                                onClick={handleToggleVariantes}
                                className={`relative w-12 h-6 rounded-full transition-colors duration-200 shrink-0 ${form.tieneVariantes ? 'bg-[#FF821E]' : 'bg-gray-200'}`}
                            >
                                <span
                                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${form.tieneVariantes ? 'translate-x-7' : 'translate-x-1'}`}
                                />
                            </button>
                        </div>

                        {form.tieneVariantes ? (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2.5">
                                    <span className="text-xs font-semibold text-[#1F4363]">
                                        {varianteTiendaGlobal ? 'Una tienda para todas las variantes' : 'Tienda por variante'}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setVTG(p => !p)}
                                        className={`relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0 ${varianteTiendaGlobal ? 'bg-[#1F4363]' : 'bg-[#FF821E]'}`}
                                    >
                                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${varianteTiendaGlobal ? 'translate-x-0.5' : 'translate-x-5'}`} />
                                    </button>
                                </div>

                                {variantes.map((v, idx) => (
                                    <div key={idx} className="p-3 bg-gray-50 rounded-xl space-y-2">
                                        {/* Fila 1: talla, color, cantidad, eliminar */}
                                        <div className="flex items-center gap-2">
                                            <Input
                                                placeholder="Talla (ej: 39)"
                                                value={v.talla}
                                                onChange={e => handleVarianteField(idx, 'talla', e.target.value)}
                                                className="flex-1 text-xs"
                                            />
                                            <Input
                                                placeholder="Color (ej: Azul)"
                                                value={v.color}
                                                onChange={e => handleVarianteField(idx, 'color', e.target.value)}
                                                className="flex-1 text-xs"
                                            />
                                            <Input
                                                type="number" min="0"
                                                placeholder="Cant."
                                                value={v.cantidad}
                                                onChange={e => handleVarianteField(idx, 'cantidad', e.target.value)}
                                                className="w-20 text-xs"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setVariantes(p => p.filter((_, i) => i !== idx))}
                                                disabled={variantes.length === 1}
                                                className="text-red-400 hover:text-red-600 shrink-0 disabled:opacity-20 transition-colors"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                        {/* Fila 2: cód. variante, cód. barras, precio adicional, tienda (opcional) */}
                                        <div className="flex items-center gap-2">
                                            <Input
                                                placeholder="Cód. variante"
                                                value={v.codigoVariante}
                                                onChange={e => handleVarianteField(idx, 'codigoVariante', e.target.value)}
                                                className="flex-1 text-xs"
                                            />
                                            <Input
                                                placeholder="Cód. barras"
                                                value={v.codigoBarras}
                                                onChange={e => handleVarianteField(idx, 'codigoBarras', e.target.value)}
                                                className="flex-1 text-xs"
                                            />
                                            <div className="relative w-24">
                                                <span className="absolute left-2.5 top-2.5 text-[11px] text-gray-400 select-none">+S/</span>
                                                <Input
                                                    type="number" step="0.01" min="0"
                                                    placeholder="0.00"
                                                    value={v.precioAdicional}
                                                    onChange={e => handleVarianteField(idx, 'precioAdicional', e.target.value)}
                                                    className="pl-8 text-xs"
                                                />
                                            </div>
                                            {!varianteTiendaGlobal && (
                                                <select
                                                    value={v.tiendaId}
                                                    onChange={e => handleVarianteField(idx, 'tiendaId', e.target.value)}
                                                    className="flex-1 h-10 pl-2 pr-6 rounded-lg border border-gray-200 bg-white text-xs text-[#1F4363] appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF821E]/30 focus:border-[#FF821E]"
                                                >
                                                    <option value="">— Tienda —</option>
                                                    {tiendas.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                                                </select>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setVariantes(p => [...p, { talla: '', color: '', cantidad: '', codigoVariante: '', codigoBarras: '', precioAdicional: '', tiendaId: '' }])}
                                    className="flex items-center gap-1 text-xs text-[#FF821E] hover:underline font-semibold"
                                >
                                    <Plus size={14} /> Agregar variante
                                </button>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">Stock inicial</label>
                                <Input
                                    name="stockInicial"
                                    type="number" min="0"
                                    placeholder="0"
                                    value={form.stockInicial}
                                    onChange={handleChange}
                                    className="w-40 focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                                />
                            </div>
                        )}
                    </div>

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
                        {isEdit
                            ? 'Guardar cambios'
                            : form.tieneVariantes
                                ? `Crear ${variantes.filter(v => v.talla || v.color).length || 1} variante(s)`
                                : 'Guardar producto'
                        }
                    </Button>
                </div>

            </div>
        </>
    )
}
