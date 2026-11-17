'use client'
import React, { useState, useEffect, Suspense, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, Lock } from 'lucide-react'
import PosRigthPanel from '@/components/Panel/PosRigthPanel'
import PosPanelClients from '@/components/Panel/PosPanelClients'
import PosLeftPanel from '@/components/Panel/PosLeftPanel'
import { useAuth } from '@/Context/AuthContext'
import { getSesionActual } from '@/Connections/caja'
import SwitcherLoader from '@/components/Navigation/SwitcherLoader'

const fmt = v =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(v ?? 0)

function formatHoraApertura(fechaApertura) {
  if (!fechaApertura) return '—'
  if (Array.isArray(fechaApertura)) {
    const [y, m, d, h = 0, min = 0] = fechaApertura
    return new Date(y, m - 1, d, h, min).toLocaleTimeString('es-PE', {
      hour: '2-digit', minute: '2-digit', hour12: false,
    })
  }
  return '—'
}

function POSContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const cajaId = Number(searchParams.get('cajaId'))
  const { user } = useAuth()
  const [cajaSesion, setCajaSesion] = useState(null)
  // ── Multi-orden ──────────────────────────────────────────────
  const [ordenes, setOrdenes] = useState([{ id: 1, items: [] }])
  const [ordenActualIdx, setOrdenActualIdx] = useState(0)

  const carritoActual = ordenes[ordenActualIdx]?.items ?? []

  const setCarritoActual = (updater) => {
    setOrdenes(prev => prev.map((o, i) =>
      i === ordenActualIdx
        ? { ...o, items: typeof updater === 'function' ? updater(o.items) : updater }
        : o
    ))
  }

  /** Cantidades reservadas en OTRAS órdenes: { [productoId]: qty } */
  const reservas = useMemo(() => {
    const map = {}
    ordenes.forEach((orden, idx) => {
      if (idx === ordenActualIdx) return
      orden.items.forEach(line => {
        map[line.id] = (map[line.id] ?? 0) + line.qty
      })
    })
    return map
  }, [ordenes, ordenActualIdx])

  const crearNuevaOrden = () => {
    const nuevoIdx = ordenes.length
    setOrdenes(prev => [...prev, { id: Date.now(), items: [] }])
    setOrdenActualIdx(nuevoIdx)
    setSelectedIdx(null)
    setBuffer('')
    setModo('CANT')
  }

  const handleSelectOrden = (idx) => {
    setOrdenActualIdx(idx)
    setSelectedIdx(null)
    setBuffer('')
    setModo('CANT')
  }

  const eliminarOrden = (idx) => {
    const newOrdenes = ordenes.filter((_, i) => i !== idx)
    let newIdx = ordenActualIdx
    if (idx < ordenActualIdx) newIdx = ordenActualIdx - 1
    else if (idx === ordenActualIdx) newIdx = Math.max(0, ordenActualIdx - 1)
    setOrdenes(newOrdenes)
    setOrdenActualIdx(newIdx)
    setSelectedIdx(null)
    setBuffer('')
    setModo('CANT')
  }
  // ─────────────────────────────────────────────────────────────
  const [selectedIdx, setSelectedIdx] = useState(null)
  const [modo, setModo] = useState('CANT')
  const [buffer, setBuffer] = useState('')
  const [cliente, setCliente] = useState(null)
  const [showClienteModal, setShowClienteModal] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchSesionActual() {
      try {
        setLoading(true)
        const response = await getSesionActual(cajaId)
        if (response.ok) {
          const data = response.data
          setCajaSesion(data)
        } else {
          console.error('Error fetching current session:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching current session:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSesionActual()
  }, [cajaId])

  const addProducto = (producto) => {
    setOrdenes(prev => prev.map((orden, i) => {
      if (i !== ordenActualIdx) return orden
      const items = orden.items
      const idx = items.findIndex(l => l.id === producto.id)
      if (idx >= 0) {
        const next = [...items]
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 }
        setSelectedIdx(idx)
        setBuffer(String(next[idx].qty))
        return { ...orden, items: next }
      }
      const newIdx = items.length
      setSelectedIdx(newIdx)
      setBuffer('1')
      return {
        ...orden,
        items: [...items, {
          id: producto.id,
          nombre: producto.nombre,
          codigo: producto.codigo,
          precio: producto.precioVenta,
          qty: 1,
          descuento: 0,
          varianteSeleccionada: producto.varianteSeleccionada ?? null,
        }],
      }
    }))
    setModo('CANT')
  }

  const removeLine = (idx) => {
    setOrdenes(prev => prev.map((o, i) =>
      i === ordenActualIdx
        ? { ...o, items: o.items.filter((_, j) => j !== idx) }
        : o
    ))
    setSelectedIdx(null)
    setBuffer('')
  }

  const handleCobrar = () => {
    sessionStorage.setItem(
      'pos_cart',
      JSON.stringify({
        carrito: carritoActual,
        cajaSesionId: cajaSesion?.id,
        tiendaId:     cajaSesion?.tienda_id,
        trabajadorId: user?.trabajador_id,
        empresaId:    user?.empresa_id,
        cliente,
      })
    )
    router.push(`/dashboard/ventas/caja/pos/payment?cajaId=${cajaId}`)
  }

  const handleCerrarCaja = () => {
    router.push(`/dashboard/ventas/caja/cerrar?cajaId=${cajaId}&sesionId=${cajaSesion?.id ?? ''}`)
  }

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'F12') {
        e.preventDefault()
        handleCerrarCaja()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [cajaSesion?.id, cajaId])

  const cajaNombre   = cajaSesion?.cajaNombre ?? cajaSesion?.nombre ?? `Caja #${cajaId}`
  const tiendaNombre = cajaSesion?.tiendaNombre ?? null
  const cajeroNombre = cajaSesion?.cajeroNombre ?? cajaSesion?.trabajadorNombre ?? null
  const horaApertura = formatHoraApertura(cajaSesion?.fechaApertura)
  const totalVentas  = cajaSesion?.totalVentas ?? 0
  return (
    <div
      className="flex flex-col h-[calc(100vh-4rem)]"
      style={{ background: "#F0F4FA" }}
    >
      <div
        className="h-12 flex-shrink-0 flex items-center px-4 gap-3"
        style={{
          background: "#fff",
          borderBottom: "0.5px solid rgba(31,47,87,0.1)",
        }}
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-xs font-medium hover:opacity-70 transition-opacity"
          style={{ color: "rgba(31,47,87,0.5)" }}
        >
          <ChevronLeft size={14} /> Volver
        </button>

        <span
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0"
          style={{ background: "rgba(25,142,123,0.1)", color: "#198E7B" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          Abierta
        </span>

        <span
          className="text-sm font-bold shrink-0"
          style={{ color: "#1F2F57" }}
        >
          {cajaNombre}
        </span>

        <span
          className="text-xs truncate flex-1 min-w-0"
          style={{ color: "rgba(31,47,87,0.5)" }}
        >
          {tiendaNombre && `Tienda ${tiendaNombre} · `}
          desde {horaApertura}
          {cajeroNombre && ` · Cajero: ${cajeroNombre}`}
          {" · "}
          <span style={{ color: "#1F2F57", fontWeight: 600 }}>
            Vendido hoy: {fmt(totalVentas)}
          </span>
        </span>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => router.push("/dashboard/ventas")}
            className="text-xs font-semibold hover:opacity-70 transition-opacity"
            style={{ color: "#3960A9", textDecoration: "underline" }}
          >
            Cambiar de caja
          </button>

          <button
            onClick={handleCerrarCaja}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
            style={{
              border: "1px solid rgba(31,47,87,0.2)",
              color: "#1F2F57",
              background: "#fff",
            }}
          >
            <Lock size={12} />
            Cerrar caja
            <span className="text-[10px] font-mono opacity-40">F12</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <SwitcherLoader loading={loading}>
          <PosLeftPanel
            carrito={carritoActual}
            setSelectedIdx={setSelectedIdx}
            setBuffer={setBuffer}
            setModo={setModo}
            removeLine={removeLine}
            cliente={cliente}
            modo={modo}
            selectedIdx={selectedIdx}
            setCarrito={setCarritoActual}
            buffer={buffer}
            setCliente={setCliente}
            setShowClienteModal={setShowClienteModal}
            onCobrar={handleCobrar}
            ordenes={ordenes}
            ordenActualIdx={ordenActualIdx}
            onSelectOrden={handleSelectOrden}
            crearNuevaOrden={crearNuevaOrden}
            eliminarOrden={eliminarOrden}
          />

          <PosRigthPanel
            addProducto={addProducto}
            tiendaId={cajaSesion?.tienda_id}
            reservas={reservas}
          />

          {showClienteModal && (
            <PosPanelClients
              setCliente={setCliente}
              setShowClienteModal={setShowClienteModal}
            />
          )}
        </SwitcherLoader>
      </div>
    </div>
  );
}

export default function PagePOS() {
  return (
    <Suspense>
      <POSContent />
    </Suspense>
  )
}
