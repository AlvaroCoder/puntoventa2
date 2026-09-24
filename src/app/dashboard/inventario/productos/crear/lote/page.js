'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Loader2, Save} from 'lucide-react';
import {getAlmacenesByUser} from '@/Connections/almacen'
import Stepper1 from '../components/Stepper1';
import Stepper2 from '../components/Stepper2';

const PASOS = ['Seleccionar almacén', 'Ingresar productos']

function Stepper({ paso }) {
    return (
        <div className="flex items-center">
            {PASOS.map((label, i) => {
                const num = i + 1
                const activo = paso === num
                const completo = paso > num
                return (
                    <React.Fragment key={num}>
                        <div className="flex items-center gap-2">
                            <div
                                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors"
                                style={{
                                    background: activo || completo ? '#3960A9' : 'transparent',
                                    border:     activo || completo ? 'none' : '1.5px solid rgba(31,47,87,0.25)',
                                    color:      activo || completo ? '#fff'  : 'rgba(31,47,87,0.4)',
                                }}
                            >
                                {completo ? <Check size={13} /> : num}
                            </div>
                            <span
                                className="text-xs font-medium whitespace-nowrap"
                                style={{ color: activo ? '#1F2F57' : 'rgba(31,47,87,0.4)' }}
                            >
                                {label}
                            </span>
                        </div>
                        {i < PASOS.length - 1 && (
                            <div className="w-10 h-px mx-3 shrink-0" style={{ background: 'rgba(31,47,87,0.15)' }} />
                        )}
                    </React.Fragment>
                )
            })}
        </div>
    )
}

export default function LotePage() {
    const router = useRouter()

    const [pasoActual, setPasoActual] = useState(1)
    const [almacenSeleccionado, setAlmacenSel] = useState(null)
    const [busqAlmacen, setBusqAlmacen] = useState('')
    const [filas, setFilas] = useState([])
    const [guardando, setGuardando] = useState(false)
    const [almacenes, setAlmacenes] = useState([]);

    const almacenActual = almacenes.find(a => a.id === almacenSeleccionado)
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function fetchAlmacenes() { 
            try {
                const data = await getAlmacenesByUser();
                setAlmacenes(data?.data || []);
            } catch (error) { 
                console.log('Error fetching almacenes:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchAlmacenes();
    }, []);

    const filteredAlmacenes = useMemo(
        () => almacenes.filter(a =>
            a.nombre.toLowerCase().includes(busqAlmacen.toLowerCase()) ||
            a.tienda.toLowerCase().includes(busqAlmacen.toLowerCase())
        ),
        [busqAlmacen, almacenes]
    )

    const hayErrores = filas.some(f => parseInt(f.stock) > 0 && !f.precio.trim())

    const handleConfirmar = async () => {
        if (hayErrores) return
        setGuardando(true)
        await new Promise(r => setTimeout(r, 1200))
        setGuardando(false)
        router.push('/dashboard/inventario/productos')
    }

    return (
        <div className="min-h-screen bg-[#E1E7F0] pb-24">

            <div className="bg-white px-8 py-5" style={{ borderBottom: '0.5px solid rgba(31,47,87,0.1)' }}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-lg font-bold" style={{ color: '#1F2F57' }}>
                            Ingreso de productos en lote
                        </h1>
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(31,47,87,0.55)' }}>
                            Registra varios productos a la vez para el almacén seleccionado.
                        </p>
                    </div>
                    <Stepper paso={pasoActual} />
                </div>
            </div>

            {pasoActual === 1 && <Stepper1
                busqAlmacen={busqAlmacen}
                setBusqAlmacen={setBusqAlmacen}
                setAlmacenSel={setAlmacenSel}
                filteredAlmacenes={filteredAlmacenes}
                loading={loading}
                almacenSeleccionado={almacenSeleccionado}
            />}

            {pasoActual === 2 && (
                <Stepper2
                    almacenSeleccionado={almacenActual}
                />
            )}

            <div
                className="fixed bottom-0 left-0 right-0 z-30 bg-white"
                style={{ borderTop: '0.5px solid rgba(31,47,87,0.12)', boxShadow: '0 -4px 20px rgba(0,0,0,0.06)' }}
            >
                <div className="max-w-6xl mx-auto px-8 py-3.5 flex items-center justify-between gap-3">

                    {pasoActual === 1 ? (
                        <>
                            <button
                                onClick={() => router.push('/dashboard/inventario/productos/crear')}
                                className="flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-lg transition-colors hover:bg-gray-50"
                                style={{ color: 'rgba(31,47,87,0.6)', border: '0.5px solid rgba(31,47,87,0.18)' }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => setPasoActual(2)}
                                disabled={!almacenSeleccionado}
                                className="flex items-center gap-1.5 text-xs font-bold px-5 py-2 rounded-lg text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                                style={{ background: '#1F2F57' }}
                            >
                                Continuar →
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setPasoActual(1)}
                                className="flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-lg transition-colors hover:bg-gray-50"
                                style={{ color: 'rgba(31,47,87,0.6)', border: '0.5px solid rgba(31,47,87,0.18)' }}
                            >
                                ← Volver
                            </button>
                            <div className="flex items-center gap-2">
                                <button
                                    className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-colors hover:bg-gray-50"
                                    style={{ color: '#3960A9', border: '0.5px solid rgba(57,96,169,0.3)' }}
                                >
                                    <Save size={14} />
                                    Guardar borrador
                                </button>
                                <button
                                    onClick={handleConfirmar}
                                    disabled={guardando || hayErrores}
                                    className="flex items-center gap-1.5 text-xs font-bold px-5 py-2 rounded-lg text-white transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ background: '#1F2F57' }}
                                >
                                    {guardando
                                        ? <><Loader2 size={13} className="animate-spin" /> Guardando...</>
                                        : <><Check size={14} /> Confirmar lote</>
                                    }
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}