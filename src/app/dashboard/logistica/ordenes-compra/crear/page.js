'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { ChevronRight, Plus, Loader2, Save, X, ShoppingCart } from 'lucide-react'
import { useAuth } from '@/Context/AuthContext'
import { getProveedoresByEmpresa } from '@/Connections/proveedores'
import { getTiendasByEmpresa } from '@/Connections/tiendas'
import { getProductosByEmpresa } from '@/Connections/productos'
import { createOrdenCompra, enviarOrdenCompra } from '@/Connections/logistica'
import { Button } from '@/components/ui/button'
import DatosOC from '@/components/ordenes-compra/DatosOC'
import BuscadorProducto from '@/components/ordenes-compra/BuscadorProducto'
import TablaLineasOC from '@/components/ordenes-compra/TablaLineasOC'
import DrawerProductoNuevo from '@/components/ordenes-compra/DrawerProductoNuevo'
import ResumenOC from '@/components/ordenes-compra/ResumenOC'

const INITIAL_FORM = {
    proveedor_id:        null,
    tienda_id:           null,
    tipo_oc:             'ESTANDAR',
    fecha_estimada:      null,
    fecha_vigencia_ini:  null,
    fecha_vigencia_fin:  null,
    condiciones_pago:    '',
    observaciones:       '',
}

// ─── Página ──────────────────────────────────────────────────────────────────
export default function CrearOrdenCompraPage() {
    const { user } = useAuth()
    const router = useRouter()

    const [form, setForm] = useState(INITIAL_FORM)
    const [lineas, setLineas] = useState([])
    const [errors, setErrors] = useState({})

    const [proveedores, setProveedores] = useState([])
    const [tiendas, setTiendas] = useState([])
    const [productos, setProductos] = useState([])
    const [loadingProveedores, setLoadingProveedores] = useState(true)
    const [loadingTiendas, setLoadingTiendas] = useState(true)
    const [loadingProductos, setLoadingProductos] = useState(true)

    const [saving, setSaving] = useState(false)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [queryDrawer, setQueryDrawer] = useState('')
    const [resumenOpen, setResumenOpen] = useState(false)
    const [ordenCreada, setOrdenCreada] = useState({ id: null, estado: 'BORRADOR' })

    // ── Carga inicial ─────────────────────────────────────────────────────
    useEffect(() => {
        if (!user?.empresa_id) return

        Promise.all([
            getProveedoresByEmpresa(user.empresa_id)
                .then(res => {
                    const data = res?.data?.data ?? res?.data ?? []
                    setProveedores(Array.isArray(data) ? data : [])
                })
                .catch(() => setProveedores([]))
                .finally(() => setLoadingProveedores(false)),

            getTiendasByEmpresa(user.empresa_id)
                .then(res => {
                    const data = res?.data?.data ?? res?.data ?? []
                    setTiendas(Array.isArray(data) ? data : [])
                })
                .catch(() => setTiendas([]))
                .finally(() => setLoadingTiendas(false)),

            getProductosByEmpresa(user.empresa_id)
                .then(res => {
                    const data = res?.data?.content ?? res?.data?.data ?? res?.data ?? []
                    setProductos(Array.isArray(data) ? data : [])
                })
                .catch(() => setProductos([]))
                .finally(() => setLoadingProductos(false)),
        ])
    }, [user])

    // ── Handlers ──────────────────────────────────────────────────────────
    const handleChange = useCallback((name, value) => {
        setForm(prev => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
    }, [errors])

    const handleSeleccionarProducto = useCallback((prod) => {
        const existe = lineas.find(l => l.producto_id === prod.id && !prod.esNuevo)
        if (existe) {
            setLineas(prev => prev.map(l =>
                l._id === existe._id
                    ? { ...l, cantidad: String(parseInt(l.cantidad) + 1) }
                    : l
            ))
            return
        }
        const nuevaLinea = {
            _id:            Date.now(),
            producto_id:    prod.id,
            nombre:         prod.nombre,
            codigo:         prod.codigo,
            cantidad:       '1',
            precio_unitario: String(prod.precio_compra ?? ''),
            esNuevo:        prod.esNuevo ?? false,
        }
        setLineas(prev => [...prev, nuevaLinea])
    }, [lineas])

    const handleProductoCreado = useCallback((prod) => {
        handleSeleccionarProducto(prod)
    }, [handleSeleccionarProducto])

    const handleAbrirDrawer = (query = '') => {
        setQueryDrawer(query)
        setDrawerOpen(true)
    }

    // ── Total ─────────────────────────────────────────────────────────────
    const totalOC = useMemo(() =>
        lineas.reduce((acc, l) =>
            acc + (parseFloat(l.cantidad) || 0) * (parseFloat(l.precio_unitario) || 0)
        , 0)
    , [lineas])

    // ── Validación ────────────────────────────────────────────────────────
    const validate = () => {
        const e = {}
        if (!form.proveedor_id) e.proveedor_id = 'Selecciona un proveedor'
        if (!form.tienda_id)    e.tienda_id    = 'Selecciona una tienda de destino'
        if (lineas.length === 0) e.lineas = 'Agrega al menos un producto'

        if (form.tipo_oc === 'ABIERTA') {
            if (!form.fecha_vigencia_ini) e.fecha_vigencia_ini = 'Fecha inicio requerida'
            if (!form.fecha_vigencia_fin) e.fecha_vigencia_fin = 'Fecha fin requerida'
            if (form.fecha_vigencia_ini && form.fecha_vigencia_fin &&
                form.fecha_vigencia_fin <= form.fecha_vigencia_ini) {
                e.fecha_vigencia_fin = 'Debe ser posterior a la fecha inicio'
            }
        }
        return e
    }

    // ── Payload ───────────────────────────────────────────────────────────
    const buildPayload = (estado) => {
        const payload = {
            proveedor_id: form.proveedor_id,
            tienda_id:    form.tienda_id,
            tipo_oc:      form.tipo_oc,
            estado,
            lineas:       lineas.map(l => ({
                producto_id:     l.producto_id,
                cantidad:        parseFloat(l.cantidad) || 1,
                precio_unitario: parseFloat(l.precio_unitario) || 0,
            })),
        }

        if (form.empresa_id)                                   payload.empresa_id = user?.empresa_id
        if (form.fecha_estimada)                               payload.fecha_estimada = form.fecha_estimada
        if (form.tipo_oc === 'ABIERTA') {
            payload.fecha_vigencia_ini = form.fecha_vigencia_ini
            payload.fecha_vigencia_fin = form.fecha_vigencia_fin
        }
        if (form.condiciones_pago?.trim()) payload.condiciones_pago = form.condiciones_pago.trim()
        if (form.observaciones?.trim())    payload.observaciones    = form.observaciones.trim()

        return payload
    }

    // ── Guardar ───────────────────────────────────────────────────────────
    const handleGuardar = async (enviar = false) => {
        const e = validate()
        if (Object.keys(e).length) {
            setErrors(e)
            if (e.lineas) toast.error(e.lineas)
            else toast.error('Revisa los campos obligatorios')
            return
        }

        setSaving(true)
        try {
            const estado = enviar ? 'ENVIADA' : 'BORRADOR'
            const payload = buildPayload(estado)

            const res = await createOrdenCompra({ ...payload, empresa_id: user?.empresa_id })
            if (!res.ok) {
                toast.error(res.message || 'No se pudo crear la orden')
                return
            }

            const ordenId = res?.data?.id ?? res?.data?.data?.id

            // Si se solicita enviar y hay endpoint separado
            if (enviar && ordenId) {
                await enviarOrdenCompra(ordenId).catch(() => {})
            }

            setOrdenCreada({ id: ordenId, estado })
            setResumenOpen(true)
            toast.success(enviar ? 'Orden creada y enviada al proveedor' : 'Borrador guardado correctamente')
        } catch {
            toast.error('Error inesperado al guardar la orden')
        } finally {
            setSaving(false)
        }
    }

    const resetFormulario = () => {
        setForm(INITIAL_FORM)
        setLineas([])
        setErrors({})
        setOrdenCreada({ id: null, estado: 'BORRADOR' })
        setResumenOpen(false)
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24">

            {/* ── Breadcrumb ─────────────────────────────────────────────── */}
            <div className="px-6 pt-7 pb-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Link href="/dashboard" className="hover:text-[#1F4363] transition-colors">
                        Inicio
                    </Link>
                    <ChevronRight size={14} />
                    <Link href="/dashboard/inventario" className="hover:text-[#1F4363] transition-colors">
                        Inventario
                    </Link>
                    <ChevronRight size={14} />
                    <span className="text-[#1F4363] font-semibold">Nueva Orden de Compra</span>
                </div>

                <div className="flex items-center gap-4 mt-5 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-[#1F4363]/10 flex items-center justify-center shrink-0">
                        <ShoppingCart size={22} className="text-[#1F4363]" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-[#1F4363]">Nueva Orden de Compra</h1>
                        <p className="text-sm text-gray-400">
                            Selecciona proveedor, tienda y agrega los productos a pedir
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Layout dos columnas ──────────────────────────────────── */}
            <div className="px-6 flex flex-col lg:flex-row gap-6 items-start">

                {/* Columna izquierda — Datos de la OC */}
                <div className="w-full lg:w-[40%] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-50">
                        <h2 className="text-sm font-bold text-[#1F4363] uppercase tracking-wide">
                            Datos de la orden
                        </h2>
                    </div>
                    <div className="px-5 py-5">
                        <DatosOC
                            form={form}
                            errors={errors}
                            onChange={handleChange}
                            proveedores={proveedores}
                            tiendas={tiendas}
                            loadingProveedores={loadingProveedores}
                            loadingTiendas={loadingTiendas}
                        />
                    </div>
                </div>

                {/* Columna derecha — Líneas de productos */}
                <div className="w-full lg:flex-1 space-y-4">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                            <h2 className="text-sm font-bold text-[#1F4363] uppercase tracking-wide">
                                Productos a pedir
                            </h2>
                            <Button
                                type="button"
                                size="sm"
                                onClick={() => handleAbrirDrawer()}
                                className="flex items-center gap-1.5 bg-[#FF821E] hover:bg-[#FF821E]/90 text-white text-xs font-bold"
                            >
                                <Plus size={13} />
                                Agregar producto
                            </Button>
                        </div>

                        <div className="px-5 pb-4 pt-4 space-y-4">
                            {/* Buscador */}
                            <BuscadorProducto
                                productos={loadingProductos ? [] : productos}
                                onSeleccionar={handleSeleccionarProducto}
                                onCrearNuevo={handleAbrirDrawer}
                            />

                            {/* Error de líneas */}
                            {errors.lineas && (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                    {errors.lineas}
                                </p>
                            )}

                            {/* Tabla de líneas */}
                            <TablaLineasOC lineas={lineas} onChange={setLineas} />
                        </div>
                    </div>
                </div>

            </div>

            {/* ── Drawer de nuevo producto ─────────────────────────────── */}
            <DrawerProductoNuevo
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                onCreado={handleProductoCreado}
                nombreInicial={queryDrawer}
            />

            {/* ── Modal de resumen post-creación ───────────────────────── */}
            <ResumenOC
                open={resumenOpen}
                onClose={() => setResumenOpen(false)}
                ordenId={ordenCreada.id}
                estado={ordenCreada.estado}
                lineas={lineas}
                onVerOrden={() => {
                    setResumenOpen(false)
                    router.push('/dashboard/logistica')
                }}
                onCrearOtra={() => {
                    resetFormulario()
                }}
            />

            {/* ── Barra sticky inferior ────────────────────────────────── */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
                <div className="px-6 py-3.5 flex items-center justify-between gap-3">

                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">Total OC:</span>
                        <span className="text-xl font-extrabold text-[#1F4363]">
                            S/ {totalOC.toFixed(2)}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => router.push('/dashboard/inventario')}
                            disabled={saving}
                            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700"
                        >
                            <X size={15} />
                            Cancelar
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => handleGuardar(false)}
                            disabled={saving}
                            className="border-[#1F4363]/30 text-[#1F4363] hover:bg-[#1F4363]/5 font-semibold text-sm"
                        >
                            {saving && <Loader2 size={13} className="animate-spin mr-1.5" />}
                            Guardar borrador
                        </Button>

                        <Button
                            onClick={() => handleGuardar(true)}
                            disabled={saving}
                            className="flex items-center gap-1.5 bg-[#FF821E] hover:bg-[#FF821E]/90 text-white font-bold shadow-sm"
                        >
                            {saving
                                ? <Loader2 size={14} className="animate-spin" />
                                : <Save size={14} />
                            }
                            Crear y enviar
                        </Button>
                    </div>

                </div>
            </div>

        </div>
    )
}
