'use client';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from "framer-motion";
import {
    User, Clock, TrendingUp, ShoppingBag, LockOpen, X,
} from "lucide-react";
import { getSesionActual, abrirCaja } from '@/Connections/caja';
import SwitcherLoader from '../Navigation/SwitcherLoader';
import { toast } from 'react-toastify';
import { useAuth } from '@/Context/AuthContext';
import { getTrabajadoresByEmpresa } from '@/Connections/trabajadores';

const ESTADO_CONFIG = {
    ABIERTA: {
        label: "Abierta",
        bg: "rgba(25,142,123,0.1)",
        color: "#198E7B",
        border: "#198E7B",
    },
    TRASPASO: {
        label: "Traspaso",
        bg: "rgba(255,130,30,0.12)",
        color: "#FF821E",
        border: "#FF821E",
    },
    CERRADA: {
        label: "Cerrada",
        bg: "rgba(31,47,87,0.07)",
        color: "rgba(31,47,87,0.4)",
        border: "rgba(31,47,87,0.2)",
    },
};

const BASE_SELECT_STYLE = {
    border:     '1px solid rgba(31,47,87,0.18)',
    color:      '#1F2F57',
    background: '#fff',
}

const fmt = v =>
    new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(v ?? 0);

function InfoRow({ icon, label, value, valueStyle }) {
    return (
        <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
                <span style={{ color: "rgba(31,47,87,0.35)" }}>{icon}</span>
                <span className="text-[11px]" style={{ color: "rgba(31,47,87,0.5)" }}>
                    {label}
                </span>
            </div>
            <span className="text-xs font-semibold" style={valueStyle ?? { color: "#1F2F57" }}>
                {value}
            </span>
        </div>
    );
}

export default function CajaCard({ caja }) {
    const { user } = useAuth();
    const router   = useRouter()

    const [session,         setSession]         = useState(null);
    const [loading,         setLoading]         = useState(false);
    const [showAbrirDialog, setShowAbrirDialog] = useState(false);
    const [montoApertura,   setMontoApertura]   = useState('');
    const [abriendo,        setAbriendo]        = useState(false);
    const [trabajadores,    setTrabajadores]    = useState([]);
    const [trabajadorId,    setTrabajadorId]    = useState(null);

    useEffect(() => {
        async function fetchSession() {
            try {
                setLoading(true);
                const response = await getSesionActual(caja?.id);
                setSession(response.data);
            } catch {
                // sin sesión activa
            } finally {
                setLoading(false);
            }
        }
        fetchSession();
    }, [caja]);

    useEffect(() => {
        if (!user?.empresa_id || !user?.esAdmin) return;
        async function fetchTrabajadores() {
            try {
                const response = await getTrabajadoresByEmpresa(user.empresa_id);
                setTrabajadores(response.data?.data ?? []);
            } catch {
            }
        }
        fetchTrabajadores();
    }, [user?.empresa_id, user?.esAdmin]);

    const estado = session?.estado?.toUpperCase() ?? 'CERRADA'
    const cfg = ESTADO_CONFIG[estado] ?? ESTADO_CONFIG.CERRADA;

    const handleCardClick = () => {
        if (estado === 'ABIERTA') {
            router.push(`/dashboard/ventas/caja/pos?cajaId=${caja.id}`)
        } else {
            setTrabajadorId(user?.trabajador_id ?? null)
            setMontoApertura('')
            setShowAbrirDialog(true)
        }
    }

    const handleAbrirCaja = async () => {
        setAbriendo(true)
        try {
            await abrirCaja(caja.id, {
                montoApertura: parseFloat(montoApertura) || 0,
                trabajadorId:  trabajadorId ?? user?.trabajador_id,
            })
            toast.success('Caja abierta correctamente')
            setShowAbrirDialog(false)
            router.push(`/dashboard/ventas/caja/pos?cajaId=${caja.id}`)
        } catch {
            toast.error('Error al abrir la caja')
        } finally {
            setAbriendo(false)
        }
    }

    return (
        <>
            <SwitcherLoader loading={loading}>
                <motion.div
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    onClick={handleCardClick}
                    className="bg-white rounded-xl overflow-hidden flex flex-col cursor-pointer transition-shadow hover:shadow-md"
                    style={{
                        border:     "0.5px solid rgba(31,47,87,0.1)",
                        borderLeft: `3px solid ${cfg.border}`,
                    }}
                >
                    <div className="px-4 pt-4 pb-3">
                        <div className="flex items-start justify-between gap-2">
                            <h3 className="text-sm font-bold leading-tight" style={{ color: "#1F2F57" }}>
                                {caja.nombre}
                            </h3>
                            <span
                                className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold"
                                style={{ background: cfg.bg, color: cfg.color }}
                            >
                                {cfg.label}
                            </span>
                        </div>
                        <p className="text-[11px] mt-0.5 font-mono" style={{ color: "rgba(31,47,87,0.35)" }}>
                            {caja.codigo}
                        </p>
                    </div>

                    <div className="mx-4" style={{ borderTop: "0.5px solid rgba(31,47,87,0.08)" }} />

                    <div className="px-4 py-3 flex flex-col gap-2 flex-1">
                        {estado === "ABIERTA" && (
                            <>
                                <InfoRow icon={<User size={11} />}      label="Cajero"     value={caja.cajero} />
                                <InfoRow icon={<Clock size={11} />}     label="Desde"      value={caja.hora_apertura} />
                                <InfoRow
                                    icon={<TrendingUp size={11} />}
                                    label="Ventas hoy"
                                    value={fmt(caja.ventas_hoy)}
                                    valueStyle={{ color: "#198E7B", fontWeight: 700 }}
                                />
                                <p className="text-[10px] text-right mt-0.5" style={{ color: "rgba(31,47,87,0.35)" }}>
                                    {caja.num_ventas} transacciones
                                </p>
                            </>
                        )}

                        {estado === "TRASPASO" && (
                            <>
                                <InfoRow icon={<User size={11} />}       label="Cajero"        value={caja.cajero} />
                                <InfoRow icon={<Clock size={11} />}      label="Desde"         value={caja.hora_apertura} />
                                <InfoRow
                                    icon={<ShoppingBag size={11} />}
                                    label="Monto traspaso"
                                    value={fmt(caja.monto_traspaso)}
                                    valueStyle={{ color: "#FF821E", fontWeight: 700 }}
                                />
                            </>
                        )}

                        {estado === "CERRADA" && (
                            <>
                                <InfoRow icon={<Clock size={11} />} label="Último cierre" value={caja.ultimo_cierre} />
                                <InfoRow icon={<User size={11} />}  label="Cajero"        value={caja.ultimo_cajero} />
                                <div className="mt-2 flex items-center gap-1 text-xs font-semibold" style={{ color: "#3960A9" }}>
                                    <LockOpen size={12} />
                                    Abrir para operar
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>
            </SwitcherLoader>

            {showAbrirDialog && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    style={{ background: "rgba(0,0,0,0.35)" }}
                    onClick={() => setShowAbrirDialog(false)}
                >
                    <div
                        className="bg-white rounded-2xl p-6 w-full max-w-xs shadow-2xl flex flex-col gap-5"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h3 className="text-sm font-bold" style={{ color: "#1F2F57" }}>
                                    Abrir caja
                                </h3>
                                <p className="text-xs mt-0.5" style={{ color: "rgba(31,47,87,0.5)" }}>
                                    {caja.nombre} · {caja.codigo}
                                </p>
                            </div>
                            <button onClick={() => setShowAbrirDialog(false)} className="opacity-40 hover:opacity-70 shrink-0">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "rgba(31,47,87,0.5)" }}>
                                Cajero
                            </label>

                            {user?.esAdmin ? (
                                <select
                                    value={trabajadorId ?? ''}
                                    onChange={e => setTrabajadorId(Number(e.target.value))}
                                    className="w-full h-11 px-3.5 rounded-xl text-sm outline-none appearance-none transition-all"
                                    style={BASE_SELECT_STYLE}
                                    onFocus={e => { e.target.style.borderColor = '#3960A9'; e.target.style.boxShadow = '0 0 0 3px rgba(57,96,169,0.1)' }}
                                    onBlur={e  => { e.target.style.borderColor = 'rgba(31,47,87,0.18)'; e.target.style.boxShadow = 'none' }}
                                >
                                    <option value="">— Selecciona un cajero —</option>
                                    {trabajadores.map(t => (
                                        <option key={t.id} value={t.id}>
                                            {t?.nombre_completo}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <div
                                    className="flex items-center gap-2.5 h-11 px-3.5 rounded-xl"
                                    style={{ background: 'rgba(31,47,87,0.04)', border: '1px solid rgba(31,47,87,0.1)' }}
                                >
                                    <div
                                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                                        style={{ background: '#3960A9' }}
                                    >
                                        {(user?.nombre ?? user?.username ?? 'U').slice(0, 1).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-medium truncate" style={{ color: '#1F2F57' }}>
                                        {user?.nombre ?? user?.username ?? 'Cajero actual'}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "rgba(31,47,87,0.5)" }}>
                                Monto de apertura
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold" style={{ color: "rgba(31,47,87,0.4)" }}>
                                    S/
                                </span>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={montoApertura}
                                    onChange={e => setMontoApertura(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full h-11 pl-9 pr-3 rounded-xl text-sm outline-none transition-all"
                                    style={{ border: "1px solid rgba(31,47,87,0.18)", color: "#1F2F57", background: "#fff" }}
                                    onFocus={e => { e.target.style.borderColor = "#3960A9"; e.target.style.boxShadow = "0 0 0 3px rgba(57,96,169,0.1)" }}
                                    onBlur={e  => { e.target.style.borderColor = "rgba(31,47,87,0.18)"; e.target.style.boxShadow = "none" }}
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowAbrirDialog(false)}
                                className="flex-1 py-2.5 rounded-xl text-xs font-medium transition-colors hover:bg-gray-50"
                                style={{ border: "0.5px solid rgba(31,47,87,0.2)", color: "#1F2F57" }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleAbrirCaja}
                                disabled={abriendo || (user?.esAdmin && !trabajadorId)}
                                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                                style={{ background: "#198E7B" }}
                            >
                                {abriendo ? "Abriendo..." : "Abrir caja"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}