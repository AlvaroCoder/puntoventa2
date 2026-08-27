'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/Context/AuthContext'
import { getTiendasByUser } from '@/Connections/tiendas'
import { getCategoriasByUser, createProducto, createVariante } from '@/Connections/productos'
import { uploadImage } from '@/Connections/images'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    X, Plus, Trash2, ChevronDown, Loader2,
    ArrowLeft, CheckCircle2, ImagePlus,
} from 'lucide-react'
import StoreIcon from '@mui/icons-material/Store'
import Image from 'next/image'
import PreviewCard from '@/components/Cards/PreviewCard'
import ProductCard from '@/components/Cards/ProductCard'
import SectionTitle from '@/components/Titles/SectionTitle'


const tipoProductos = [
    { nombre: 'zapatilla de hombre',  tieneVariantes: true  },
    { nombre: 'zapatilla de mujer',   tieneVariantes: true  },
    { nombre: 'zapatilla de niño',    tieneVariantes: true  },
    { nombre: 'calzado de caballero', tieneVariantes: true  },
    { nombre: 'calzado de dama',      tieneVariantes: true  },
    { nombre: 'calzado de niño',      tieneVariantes: true  },
    { nombre: 'sandalias',            tieneVariantes: true  },
    { nombre: 'polo hombre',          tieneVariantes: true  },
    { nombre: 'polo de niño',         tieneVariantes: true  },
    { nombre: 'polo de hombre',       tieneVariantes: true  },
    { nombre: 'polo de mujer',        tieneVariantes: true  },
    { nombre: 'camisa de hombre',     tieneVariantes: true  },
    { nombre: 'camisa de mujer',      tieneVariantes: true  },
    { nombre: 'medias',               tieneVariantes: true  },
    { nombre: 'carteras',             tieneVariantes: false },
    { nombre: 'relojes',              tieneVariantes: false },
    { nombre: 'billeteras',           tieneVariantes: false },
    { nombre: 'correas',              tieneVariantes: false },
    { nombre: 'smartwatch',           tieneVariantes: false },
]

const TEMPORADAS = ['verano', 'otoño', 'invierno', 'primavera']
const GENEROS    = ['masculino', 'femenino', 'unisex', 'niño', 'niña']
const TIPOS_PROD = ['zapatilla', 'sandalia', 'bota', 'mocasín', 'deportiva', 'otro']

const INIT_VARIANTE = {
    talla: '', color: '', cantidad: '',
    codigoVariante: '', codigoBarras: '', precioAdicional: '', tiendaId: '',
}

const INIT_FORM = {
    tipoPreset:   null,
    tiendaId:     '',
    nombre:       '',
    codigo:       '',
    codigoBarras: '',
    categoriaId:  '',
    descripcion:  '',
    precioVenta:  '',
    precioCompra: '',
    igv:          18,
    masVariantes: false,
    temporada:    'verano',
    genero:       'masculino',
    tipoProducto: 'zapatilla',
    tagsModa:     [],
}

function genCodigo() {
    return `PRD-${String(Math.floor(Math.random() * 9000) + 1000)}`
}

const extractList = res =>res?.data?.data?.data ?? res?.data?.data ?? res?.data ?? []

async function submitProduct(form, variantes, varianteTiendaGlobal, empresaId, imagenFile = null) {
    let imagenUrl = null
    if (imagenFile) {
        const fd = new FormData()
        fd.append('archivo', imagenFile)
        const resImg = await uploadImage(fd);
        imagenUrl = resImg?.data?.url ?? null
    }
    const stockTotal = variantes.reduce((acc, v) => acc + (parseInt(v.cantidad) || 0), 0);
    const payload = {
        empresaId,
        nombre:             form.nombre.trim(),
        codigo:             (form.codigo || '').trim() || genCodigo(),
        precioVenta:        parseFloat(form.precioVenta),
        impuestoPorcentaje: parseFloat(form.igv) / 100,
        aplicaIgv:          parseFloat(form.igv) > 0,
        tieneVariantes:     true,
        stockInicial:       stockTotal,
        temporada:          form.temporada,
        genero:             form.genero,
        tipoProducto:       form.tipoProducto,
        tagsModa:           form.tagsModa,
        tiendaId:           Number(form.tiendaId),
        ...(imagenUrl        ? { imagenUrl }                                    : {}),
        ...(form.codigoBarras ? { codigoBarras: form.codigoBarras }             : {}),
        ...(form.categoriaId  ? { categoriaId:  Number(form.categoriaId) }      : {}),
        ...(form.descripcion  ? { descripcion:  form.descripcion }              : {}),
        ...(form.precioCompra ? { precioCompra: parseFloat(form.precioCompra) } : {}),
    }

    const resProducto = await createProducto(payload)
    if (!resProducto.ok) throw new Error(resProducto.message || 'Error al crear producto')

    const productoId = resProducto.data?.id ?? resProducto.data?.data?.id
    if (!productoId) throw new Error('No se obtuvo el ID del producto')

    const rows = variantes.filter(v => v.talla || v.color || v.cantidad)
    if (rows.length === 0) rows.push({ ...INIT_VARIANTE })

    await Promise.allSettled(
        rows.map(v => createVariante({
            productoId,
            tiendaId:        varianteTiendaGlobal
                ? Number(form.tiendaId)
                : Number(v.tiendaId || form.tiendaId),
            descripcion:     form.descripcion     || null,
            stockInicial:    parseInt(v.cantidad) || 0,
            talla:           v.talla              || null,
            color:           v.color              || null,
            codigoVariante:  v.codigoVariante     || null,
            codigoBarras:    v.codigoBarras       || null,
            precioAdicional: parseFloat(v.precioAdicional) || 0,
        }))
    )
    return resProducto
}

export default function Page() {
    const router   = useRouter()
    const { user } = useAuth()
    const fileInputRef = useRef(null)

    const [tiendas,    setTiendas]    = useState([])
    const [categorias, setCategorias] = useState([])
    const [loading,    setLoading]    = useState(true)

    const [form,       setForm]      = useState(INIT_FORM)
    const [variantes,  setVariantes] = useState([{ ...INIT_VARIANTE }])
    const [varianteTiendaGlobal, setVTG] = useState(true)
    const [tagInput,   setTagInput]  = useState('')
    const [imagenPreview, setImagenPreview] = useState(null)
    const [imagenFile,    setImagenFile]    = useState(null)
    const [sugerido] = useState(genCodigo);
    
    const [listProducts,   setListProducts]   = useState([])
    const [loteResult,     setLoteResult]     = useState(null)
    const [loteSubmitting, setLoteSubmitting] = useState(false)

    useEffect(() => {
        if (!user) return
        Promise.all([getTiendasByUser(), getCategoriasByUser()])
            .then(([resTiendas, resCat]) => {
                setTiendas(extractList(resTiendas))
                setCategorias(extractList(resCat))
            })
            .catch(() => toast.error('Error al cargar datos'))
            .finally(() => setLoading(false))
    }, [user])

    const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

    const handlePreset = (tipo) => {
        if (form.tipoPreset?.nombre === tipo.nombre) {
            setForm(p => ({ ...p, tipoPreset: null }))
        } else {
            setForm(p => ({ ...p, tipoPreset: tipo, masVariantes: tipo.tieneVariantes }))
        }
    }

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        setImagenFile(file)
        setImagenPreview(URL.createObjectURL(file))
    }

    const removeImage = () => {
        setImagenFile(null)
        setImagenPreview(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const addTag = () => {
        const tag = tagInput.trim().toLowerCase()
        if (!tag || form.tagsModa.includes(tag)) { setTagInput(''); return }
        setForm(p => ({ ...p, tagsModa: [...p.tagsModa, tag] }))
        setTagInput('')
    }

    const removeTag = idx =>
        setForm(p => ({ ...p, tagsModa: p.tagsModa.filter((_, i) => i !== idx) }))

    const handleVarianteField = (idx, field, value) =>
        setVariantes(p => p.map((v, i) => i === idx ? { ...v, [field]: value } : v))

    const resetForm = () => {
        setForm(INIT_FORM)
        setVariantes([{ ...INIT_VARIANTE }])
        setVTG(true)
        setTagInput('')
        setImagenFile(null)
        setImagenPreview(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const validate = () => {
        if (!form.nombre.trim()) { toast.warn('El nombre del producto es obligatorio'); return false }
        if (!form.precioVenta)   { toast.warn('El precio de venta es obligatorio');      return false }
        if (!form.tiendaId)      { toast.warn('Selecciona una tienda de destino');       return false }
        return true
    }

    const handleAdd = () => {
        if (!validate()) return
        setListProducts(p => [...p, {
            id: Date.now(),
            form: { ...form, codigo: form.codigo || genCodigo() },
            variantes: [...variantes],
            varianteTiendaGlobal,
            imagenPreview,
            imagenFile,
        }])
        toast.success(`"${form.nombre}" agregado al lote`)
        setLoteResult(null)
        resetForm()
    }

    const handleSaveLote = async () => {
        if (listProducts.length === 0) { toast.warn('El lote está vacío'); return }
        setLoteSubmitting(true)
        let ok = 0, fail = 0
        for (const item of listProducts) {
            try {
                await submitProduct(item.form, item.variantes, item.varianteTiendaGlobal, user.empresa_id, item.imagenFile)
                ok++
            } catch (err){
                console.log("ERRORR: "+err  )
                fail++
            }
        }
        setLoteSubmitting(false)
        setLoteResult({ ok, fail })
        if (fail === 0) {
            toast.success(`${ok} producto(s) creados correctamente`)
            setTimeout(() => router.push('/dashboard/bd/inventario'), 1500)
        } else {
            toast.warn(`${ok} creados · ${fail} fallaron`)
        }
    }

    return (
        <div className="w-full pb-12">

            <div className="flex items-center gap-3 mb-7">
                <button
                    onClick={() => router.push('/dashboard/bd/inventario')}
                    className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 hover:text-[#1F4363] transition-colors shrink-0"
                >
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h1 className="font-bold text-[#1F4363] text-2xl leading-tight">Nuevo Producto</h1>
                    <p className="text-sm text-gray-400">
                        {listProducts.length > 0
                            ? `${listProducts.length} producto(s) listos para guardar`
                            : 'Completa la información y agrega al lote'
                        }
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-5 gap-6">
                    <div className="col-span-3 space-y-4">
                        <div className="h-32 bg-white rounded-2xl animate-pulse" />
                        <div className="h-64 bg-white rounded-2xl animate-pulse" />
                        <div className="h-48 bg-white rounded-2xl animate-pulse" />
                    </div>
                    <div className="col-span-2">
                        <div className="h-56 bg-white rounded-2xl animate-pulse" />
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-5 gap-6 items-start">

                    <div className="col-span-3">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-7">

                            {/* 0 · Tipo de producto */}
                            <div>
                                <SectionTitle>Tipo de producto</SectionTitle>
                                <div className="flex flex-wrap gap-2">
                                    {tipoProductos.map(tipo => (
                                        <button
                                            key={tipo.nombre}
                                            type="button"
                                            onClick={() => handlePreset(tipo)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                                                form.tipoPreset?.nombre === tipo.nombre
                                                    ? 'bg-[#1F4363] text-white border-[#1F4363] shadow-sm'
                                                    : 'bg-white text-gray-500 border-gray-200 hover:border-[#1F4363]/40 hover:text-[#1F4363]'
                                            }`}
                                        >
                                            {tipo.nombre}
                                        </button>
                                    ))}
                                </div>
                                {form.tipoPreset && (
                                    <p className="text-[11px] text-gray-400 mt-2">
                                        <span className="font-semibold text-[#FF821E]">{form.tipoPreset.nombre}</span>
                                        {' → '}
                                        {form.tipoPreset.tieneVariantes
                                            ? 'Incluye variantes de talla y color'
                                            : 'Sin variantes adicionales'
                                        }
                                    </p>
                                )}
                            </div>

                            {/* 1 · Tienda destino */}
                            <div>
                                <SectionTitle>Tienda destino</SectionTitle>
                                <div className="bg-[#1F4363]/5 border border-[#1F4363]/10 rounded-xl px-4 py-3.5">
                                    <label className="block text-sm font-bold text-[#1F4363] mb-2">
                                        <StoreIcon style={{ fontSize: 16, verticalAlign: 'text-bottom', marginRight: 6 }} />
                                        Tienda <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="tiendaId"
                                            value={form.tiendaId}
                                            onChange={handleChange}
                                            className="w-full h-10 pl-3 pr-8 rounded-lg border border-[#1F4363]/20 bg-white text-sm text-[#1F4363] font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF821E]/30 focus:border-[#FF821E]"
                                        >
                                            <option value="">— Selecciona una tienda —</option>
                                            {tiendas.map(t => (
                                                <option key={t.id} value={t.id}>{t.nombre}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={14} className="absolute right-2.5 top-3 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {/* 2 · Información básica */}
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
                                            <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">Código</label>
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
                                                        onClick={() => setForm(f => ({ ...f, codigo: genCodigo() }))}
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
                                                {categorias.map(c => (
                                                    <option key={c.id} value={c.id}>{c.nombre}</option>
                                                ))}
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

                                </div>
                            </div>

                            {/* 3 · Imagen */}
                            <div>
                                <SectionTitle>Imagen del producto</SectionTitle>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                {imagenPreview ? (
                                    <div className="relative w-full h-36 rounded-xl overflow-hidden border border-gray-200">
                                        <Image src={imagenPreview} className="w-full h-full object-cover" width={160} height={160} alt="preview" />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-red-400 hover:text-red-600 shadow-sm transition-colors"
                                        >
                                            <X size={13} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute bottom-2 right-2 px-2.5 py-1 bg-white/90 rounded-lg text-xs font-semibold text-[#1F4363] shadow-sm hover:bg-white transition-colors"
                                        >
                                            Cambiar
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full h-24 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-[#FF821E]/50 hover:bg-orange-50/40 transition-all group cursor-pointer"
                                    >
                                        <ImagePlus size={22} className="text-gray-300 group-hover:text-[#FF821E]/50 transition-colors" />
                                        <span className="text-xs text-gray-400 group-hover:text-[#FF821E]/60 transition-colors font-medium">
                                            Subir imagen
                                        </span>
                                    </button>
                                )}
                            </div>

                            {/* 4 · Precios */}
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
                                                name="precioVenta" type="number" step="0.01" min="0" placeholder="0.00"
                                                value={form.precioVenta} onChange={handleChange}
                                                className="pl-8 focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">Precio compra</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-sm text-gray-400 font-medium select-none">S/</span>
                                            <Input
                                                name="precioCompra" type="number" step="0.01" min="0" placeholder="0.00"
                                                value={form.precioCompra} onChange={handleChange}
                                                className="pl-8 focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">IGV %</label>
                                        <Input
                                            name="igv" type="number" step="1" min="0" max="100"
                                            value={form.igv} onChange={handleChange}
                                            className="focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 5 · Clasificación */}
                            <div>
                                <SectionTitle>Clasificación</SectionTitle>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { label: 'Temporada', name: 'temporada',    opts: TEMPORADAS },
                                            { label: 'Género',    name: 'genero',       opts: GENEROS    },
                                            { label: 'Tipo',      name: 'tipoProducto', opts: TIPOS_PROD },
                                        ].map(({ label, name, opts }) => (
                                            <div key={name}>
                                                <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">{label}</label>
                                                <div className="relative">
                                                    <select
                                                        name={name} value={form[name]} onChange={handleChange}
                                                        className="w-full h-10 pl-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-[#1F4363] appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF821E]/30 focus:border-[#FF821E]"
                                                    >
                                                        {opts.map(o => <option key={o} value={o}>{o}</option>)}
                                                    </select>
                                                    <ChevronDown size={14} className="absolute right-2.5 top-3 text-gray-400 pointer-events-none" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">Tags de moda</label>
                                        <div className="flex flex-wrap gap-1.5 mb-2">
                                            {form.tagsModa.map((tag, idx) => (
                                                <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#1F4363]/8 text-[#1F4363]">
                                                    {tag}
                                                    <button type="button" onClick={() => removeTag(idx)} className="hover:text-red-400 transition-colors">
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
                                                type="button" onClick={addTag}
                                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#FF821E] border border-[#FF821E]/30 hover:bg-[#FF821E]/5 transition-colors"
                                            >
                                                <Plus size={13} /> Agregar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 6 · Talla, color y variantes */}
                            <div>
                                <SectionTitle>Talla, color y variantes</SectionTitle>

                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-sm text-gray-600 flex-1 pr-4">
                                        ¿Este producto tiene múltiples variantes de talla y/o color?
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setForm(p => ({ ...p, masVariantes: !p.masVariantes }))}
                                        className={`relative w-12 h-6 rounded-full transition-colors duration-200 shrink-0 ${form.masVariantes ? 'bg-[#FF821E]' : 'bg-gray-200'}`}
                                    >
                                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${form.masVariantes ? 'translate-x-7' : 'translate-x-1'}`} />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {/* Toggle tienda: global / por variante (solo si hay >1 fila) */}
                                    {variantes.length > 1 && (
                                        <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2.5">
                                            <span className="text-xs font-semibold text-[#1F4363]">
                                                {varianteTiendaGlobal ? 'Una tienda para todas' : 'Tienda por variante'}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setVTG(p => !p)}
                                                className={`relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0 ${varianteTiendaGlobal ? 'bg-[#1F4363]' : 'bg-[#FF821E]'}`}
                                            >
                                                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${varianteTiendaGlobal ? 'translate-x-0.5' : 'translate-x-5'}`} />
                                            </button>
                                        </div>
                                    )}

                                    {variantes.map((v, idx) => (
                                        <div key={idx} className="p-3 bg-gray-50 rounded-xl space-y-2">
                                            {/* Sub-fila 1 */}
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
                                                    type="number" min="0" placeholder="Cant."
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
                                            {/* Sub-fila 2 */}
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
                                                        type="number" step="0.01" min="0" placeholder="0.00"
                                                        value={v.precioAdicional}
                                                        onChange={e => handleVarianteField(idx, 'precioAdicional', e.target.value)}
                                                        className="pl-8 text-xs"
                                                    />
                                                </div>
                                                {!varianteTiendaGlobal && (
                                                    <div className="relative flex-1">
                                                        <select
                                                            value={v.tiendaId}
                                                            onChange={e => handleVarianteField(idx, 'tiendaId', e.target.value)}
                                                            className="w-full h-10 pl-2 pr-6 rounded-lg border border-gray-200 bg-white text-xs text-[#1F4363] appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF821E]/30"
                                                        >
                                                            <option value="">— Tienda —</option>
                                                            {tiendas.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                                                        </select>
                                                        <ChevronDown size={12} className="absolute right-2 top-3 text-gray-400 pointer-events-none" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {form.masVariantes && (
                                        <button
                                            type="button"
                                            onClick={() => setVariantes(p => [...p, { ...INIT_VARIANTE }])}
                                            className="w-full flex items-center justify-center gap-2 h-10 rounded-xl border-2 border-dashed border-[#FF821E]/30 text-xs font-semibold text-[#FF821E] hover:bg-orange-50/40 transition-colors"
                                        >
                                            <Plus size={14} /> Agregar otra variante
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex gap-3 pt-2 border-t border-gray-100">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.push('/dashboard/bd/inventario')}
                                    className="flex-1 border-gray-200 text-gray-500 hover:bg-gray-50"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleAdd}
                                    className="flex-1 bg-[#1F4363] hover:bg-[#1F4363]/90 text-white font-bold"
                                >
                                    <Plus size={16} className="mr-2" />
                                    Agregar producto
                                </Button>
                            </div>

                        </div>
                    </div>

                    <div className="col-span-2 sticky top-6 space-y-5">

                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5 px-0.5">
                                Vista previa
                            </p>
                            <PreviewCard form={form} variantes={variantes} imagenPreview={imagenPreview} />
                        </div>

                        {listProducts.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-2.5 px-0.5">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        En el lote ({listProducts.length})
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => { setListProducts([]); setLoteResult(null) }}
                                        className="text-[10px] text-red-400 hover:text-red-600 font-semibold transition-colors"
                                    >
                                        Limpiar todo
                                    </button>
                                </div>

                                <div className="space-y-2 max-h-72 overflow-y-auto pr-0.5">
                                    <AnimatePresence>
                                        {listProducts.map((item, idx) => (
                                            <ProductCard
                                                key={item.id}
                                                item={item}
                                                idx={idx}
                                                onRemove={() => setListProducts(p => p.filter(i => i.id !== item.id))}
                                            />
                                        ))}
                                    </AnimatePresence>
                                </div>

                                {loteResult ? (
                                    <div className={`mt-3 rounded-2xl p-3.5 ${loteResult.fail === 0 ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <CheckCircle2 size={15} className={loteResult.fail === 0 ? 'text-green-500' : 'text-amber-500'} />
                                            <p className="text-sm font-bold text-[#1F4363]">
                                                {loteResult.fail === 0 ? '¡Lote guardado!' : 'Guardado con errores'}
                                            </p>
                                        </div>
                                        <p className="text-xs text-gray-500 pl-6">
                                            {loteResult.ok} creados · {loteResult.fail} fallaron
                                        </p>
                                    </div>
                                ) : (
                                    <Button
                                        type="button"
                                        onClick={handleSaveLote}
                                        disabled={loteSubmitting}
                                        className="w-full mt-3 bg-[#FF821E] hover:bg-[#FF821E]/90 text-white font-bold shadow-sm"
                                    >
                                        {loteSubmitting ? (
                                            <><Loader2 size={14} className="animate-spin mr-2" />Guardando...</>
                                        ) : (
                                            <><CheckCircle2 size={14} className="mr-2" />Guardar {listProducts.length} producto{listProducts.length !== 1 ? 's' : ''}</>
                                        )}
                                    </Button>
                                )}
                            </div>
                        )}

                    </div>

                </div>
            )}
        </div>
    )
}