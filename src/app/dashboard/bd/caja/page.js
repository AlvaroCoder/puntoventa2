'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { useAuth } from '@/Context/AuthContext'
import { getTiendasByEmpresa } from '@/Connections/tiendas'
import {
    getCajaByTienda,
    getSesionActual, getSesionesByCaja,
    getMovimientosByCaja, 
} from '@/Connections/caja'
import { Button } from '@/components/ui/button'

import AddIcon from '@mui/icons-material/Add'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import LockIcon from '@mui/icons-material/Lock'
import EditIcon from '@mui/icons-material/Edit'
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import HistoryIcon from '@mui/icons-material/History'
import StorefrontIcon from '@mui/icons-material/Storefront'
import DialogCaja from '@/elements/DialogCaja';
import DialogAbrirCaja from '@/elements/DialogAbrirCaja';
import DialogCerrarCaja from '@/elements/DialogCerrarCaja';
import DialogMovimiento from '@/elements/DialogMovimiento';
import TablaMovimientos from '@/components/Tables/TablaMovimientos';
import TablaSesiones from '@/components/Tables/TablaSesiones'

const fmt = v =>
    new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(v ?? 0);

const fmtDate = d =>
    d
        ? new Date(d).toLocaleString('es-PE', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        })
        : '—';

const extractList = res =>
    res?.data?.data?.data ?? res?.data?.data ?? res?.data ?? []

const extractOne = res => {
    const d = res?.data?.data ?? res?.data
    if (!d) return null
    if (Array.isArray(d)) return d[0] ?? null
    return d
}


export default function PageCaja() {
    const { user } = useAuth()

    const [tiendas,     setTiendas]     = useState([])
    const [tiendaId,    setTiendaId]    = useState('')
    const [caja,        setCaja]        = useState(null)
    const [sesion,      setSesion]      = useState(null)
    const [sesiones,    setSesiones]    = useState([])
    const [movimientos, setMovimientos] = useState([])

    const [loadingTiendas,  setLoadingTiendas]  = useState(true)
    const [loadingCaja,     setLoadingCaja]     = useState(false)
    const [loadingMovs,     setLoadingMovs]     = useState(false)
    const [loadingSesiones, setLoadingSesiones] = useState(false)

    const [tab, setTab] = useState('movimientos')

    const [dlgCaja,      setDlgCaja]      = useState(false)
    const [dlgAbrir,     setDlgAbrir]     = useState(false)
    const [dlgCerrar,    setDlgCerrar]    = useState(false)
    const [dlgMovimiento, setDlgMovimiento] = useState(false)

    useEffect(() => {
        if (!user?.empresa_id) return
        async function load() {
            try {
                const res = await getTiendasByEmpresa(user.empresa_id)
                const list = extractList(res)
                setTiendas(list)
                if (list.length === 1) setTiendaId(String(list[0].id))
            } catch {
                toast.error('Error al cargar las tiendas')
            } finally {
                setLoadingTiendas(false)
            }
        }
        load()
    }, [user])

    const loadCaja = useCallback(async () => {
        if (!tiendaId) return
        setLoadingCaja(true)
        setCaja(null)
        setSesion(null)
        setMovimientos([])
        setSesiones([])
        try {
            const res = await getCajaByTienda(tiendaId)
            const cajaObj = extractOne(res)
            setCaja(cajaObj)

            if (cajaObj?.id) {
                const resSesion = await getSesionActual(cajaObj.id)
                setSesion(extractOne(resSesion))
            }
        } catch {
            toast.error('Error al cargar la caja')
        } finally {
            setLoadingCaja(false)
        }
    }, [tiendaId])

    useEffect(() => { loadCaja() }, [loadCaja])

    useEffect(() => {
        if (!caja?.id) return
        if (tab === 'movimientos') {
            setLoadingMovs(true)
            getMovimientosByCaja(caja.id)
                .then(res => setMovimientos(extractList(res)))
                .catch(() => toast.error('Error al cargar movimientos'))
                .finally(() => setLoadingMovs(false))
        } else {
            setLoadingSesiones(true)
            getSesionesByCaja(caja.id)
                .then(res => setSesiones(extractList(res)))
                .catch(() => toast.error('Error al cargar sesiones'))
                .finally(() => setLoadingSesiones(false))
        }
    }, [caja?.id, tab])

    const reloadMovimientos = useCallback(() => {
        if (!caja?.id) return
        setLoadingMovs(true)
        getMovimientosByCaja(caja.id)
            .then(res => setMovimientos(extractList(res)))
            .catch(() => {})
            .finally(() => setLoadingMovs(false))
    }, [caja?.id])

    const cajaAbierta = !!sesion && !sesion.fecha_cierre

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="font-bold text-[#1F4363] text-2xl">Movimientos de Caja</h1>
                    <p className="text-sm text-gray-400">Gestiona los movimientos de caja de tus tiendas</p>
                </div>
                {caja && (
                    <Button
                        onClick={() => setDlgCaja(true)}
                        variant="outline"
                        className="flex items-center gap-2 border-[#1F4363]/20 text-[#1F4363] font-semibold hover:bg-[#1F4363]/5"
                    >
                        <EditIcon style={{ fontSize: 16 }} />
                        Editar Caja
                    </Button>
                )}
            </div>

            <div className="mb-6">
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Tienda</label>
                {loadingTiendas ? (
                    <div className="h-10 w-64 bg-gray-100 rounded-xl animate-pulse" />
                ) : (
                    <select
                        value={tiendaId}
                        onChange={e => setTiendaId(e.target.value)}
                        className="h-10 px-3 pr-8 rounded-xl border border-gray-200 text-sm text-[#1F4363] font-medium bg-white shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF821E]/30 focus:border-[#FF821E] min-w-[220px] transition-all"
                    >
                        <option value="">— Selecciona una tienda —</option>
                        {tiendas.map(t => (
                            <option key={t.id} value={t.id}>{t.nombre}</option>
                        ))}
                    </select>
                )}
            </div>

            {/* Contenido según estado */}
            {!tiendaId ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                        <StorefrontIcon style={{ fontSize: 32, color: '#D1D5DB' }} />
                    </div>
                    <p className="text-gray-400 text-sm font-medium">Selecciona una tienda para ver su caja</p>
                </div>

            ) : loadingCaja ? (
                <div className="space-y-4">
                    <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
                    <div className="h-10 w-56 bg-gray-100 rounded-xl animate-pulse" />
                    <div className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
                </div>

            ) : !caja ? (
                /* Sin caja → invitar a crear */
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm flex flex-col items-center justify-center py-20 text-center"
                >
                    <div className="w-16 h-16 rounded-2xl bg-[#FF821E]/10 flex items-center justify-center mb-4">
                        <PointOfSaleIcon style={{ fontSize: 32, color: '#FF821E' }} />
                    </div>
                    <p className="text-[#1F4363] font-semibold text-base">No hay caja registrada</p>
                    <p className="text-gray-400 text-sm mt-1 mb-5">Crea la caja para comenzar a operar</p>
                    <Button
                        onClick={() => setDlgCaja(true)}
                        className="flex items-center gap-2 bg-[#FF821E] hover:bg-[#FF821E]/90 text-white font-bold shadow-sm"
                    >
                        <AddIcon style={{ fontSize: 18 }} />
                        Crear Caja
                    </Button>
                </motion.div>

            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                >
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                                    cajaAbierta ? 'bg-green-100' : 'bg-gray-100'
                                }`}>
                                    {cajaAbierta
                                        ? <LockOpenIcon style={{ fontSize: 24, color: '#16a34a' }} />
                                        : <LockIcon    style={{ fontSize: 24, color: '#9CA3AF' }} />
                                    }
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="font-bold text-[#1F4363] text-lg">{caja.nombre}</h2>
                                        {cajaAbierta ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                                Abierta
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                                                Cerrada
                                            </span>
                                        )}
                                    </div>
                                    {caja.descripcion && (
                                        <p className="text-sm text-gray-400 mt-0.5">{caja.descripcion}</p>
                                    )}
                                    {cajaAbierta && sesion?.fecha_apertura && (
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            Abierta desde: {fmtDate(sesion.fecha_apertura)}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Acciones */}
                            <div className="flex flex-wrap items-center gap-2">
                                {cajaAbierta ? (
                                    <>
                                        {sesion && (
                                            <div className="text-right pr-3 border-r border-gray-200">
                                                <p className="text-xs text-gray-400">Apertura</p>
                                                <p className="font-bold text-[#1F4363] text-base">
                                                    {fmt(sesion.monto_apertura)}
                                                </p>
                                            </div>
                                        )}
                                        <Button
                                            onClick={() => setDlgMovimiento(true)}
                                            className="flex items-center gap-2 bg-[#FF821E] hover:bg-[#FF821E]/90 text-white font-bold"
                                        >
                                            <AddIcon style={{ fontSize: 18 }} />
                                            Movimiento
                                        </Button>
                                        <Button
                                            onClick={() => setDlgCerrar(true)}
                                            variant="outline"
                                            className="flex items-center gap-2 border-red-200 text-red-500 hover:bg-red-50 font-semibold"
                                        >
                                            <LockIcon style={{ fontSize: 16 }} />
                                            Cerrar Caja
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        onClick={() => setDlgAbrir(true)}
                                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold"
                                    >
                                        <LockOpenIcon style={{ fontSize: 18 }} />
                                        Abrir Caja
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
                        {[
                            { key: 'movimientos', label: 'Movimientos', icon: <SwapVertIcon style={{ fontSize: 16 }} /> },
                            { key: 'sesiones',    label: 'Sesiones',    icon: <HistoryIcon  style={{ fontSize: 16 }} /> },
                        ].map(t => (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                    tab === t.key
                                        ? 'bg-white text-[#1F4363] shadow-sm'
                                        : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                {t.icon}
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {tab === 'movimientos' ? (
                        <TablaMovimientos data={movimientos} loading={loadingMovs} />
                    ) : (
                        <TablaSesiones data={sesiones} loading={loadingSesiones} />
                    )}
                </motion.div>
            )}

            <DialogCaja
                open={dlgCaja}
                onClose={() => setDlgCaja(false)}
                caja={caja}
                tiendaId={tiendaId}
                onSuccess={loadCaja}
            />
            <DialogAbrirCaja
                open={dlgAbrir}
                onClose={() => setDlgAbrir(false)}
                cajaId={caja?.id}
                onSuccess={loadCaja}
            />
            <DialogCerrarCaja
                open={dlgCerrar}
                onClose={() => setDlgCerrar(false)}
                cajaId={caja?.id}
                sesion={sesion}
                onSuccess={loadCaja}
            />
            <DialogMovimiento
                open={dlgMovimiento}
                onClose={() => setDlgMovimiento(false)}
                cajaId={caja?.id}
                onSuccess={reloadMovimientos}
            />
        </div>
    )
}