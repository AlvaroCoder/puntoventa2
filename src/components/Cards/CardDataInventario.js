'use client'
import { MoreVertical, Package, Truck, Warehouse } from 'lucide-react'
import React, { useEffect, useState } from 'react';
import { getInventarioByAlmacen, getInventarioByTienda } from '@/Connections/productos';

import Link from 'next/link';

function Chip({ icon: Icon, value, label, alert = false }) {
    const bg    = alert ? 'rgba(192,57,43,0.07)' : 'rgba(57,96,169,0.07)'
    const color = alert ? '#C0392B' : '#3960A9'
    return (
        <div
            className="flex flex-col items-start gap-0.5 rounded-lg px-3 py-2 min-w-[80px]"
            style={{ backgroundColor: bg }}
        >
            <div className="flex items-center gap-1.5">
                <Icon size={14} style={{ color }} />
                <span className="text-sm font-bold" style={{ color }}>{value}</span>
            </div>
            <span className="text-[11px] leading-tight" style={{ color: 'rgba(31,47,87,0.55)' }}>
                {label}
            </span>
        </div>
    )
}

function barColor(nivel) {
    if (nivel >= 75) return '#1EB3B2'   
    if (nivel >= 50) return '#E8A020'   
    return '#C0392B'                   
}

export default function CardDataInventario({ data, groupBySelected }) {
    const { id, nombre, codigo, totales, nivel } = data;

    const bColor = barColor(nivel);
    const [loading, setLoading] = useState(true);
    const [inventarioData, setInventarioData] = useState(null);
    const [cantProductos, setCantProductos] = useState(0);
    useEffect(() => {
        async function fetchInventario() { 
            try {
                let response;
                if (groupBySelected === 'Almacen') { 
                    response = await getInventarioByAlmacen(id);
                } else {
                    response = await getInventarioByTienda(id);
                }
                const data = response?.data || [];
                setInventarioData(data);
                setCantProductos(data?.totalElements || 0);
            } catch (error) {
                console.error('Error fetching inventory data:', error);
            } finally {
                setLoading(false);
            }
            
        }
        fetchInventario();
    }, [groupBySelected, id]);

    return (
        <div
            className="bg-white rounded-xl p-5 flex flex-col gap-4"
            style={{ border: '0.5px solid rgba(31,47,87,0.12)' }}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: 'rgba(57,96,169,0.08)' }}
                    >
                        <Warehouse size={20} color="#3960A9" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold leading-tight" style={{ color: '#1F2F57' }}>
                            {nombre}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(31,47,87,0.45)' }}>
                            {codigo}
                        </p>
                    </div>
                </div>
                <button
                    aria-label="Opciones del almacén"
                    className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors shrink-0"
                >
                    <MoreVertical size={16} color="rgba(31,47,87,0.45)" />
                </button>
            </div>

            <div className="flex gap-2 flex-wrap">
                <Chip icon={Package} value={cantProductos} label="Productos totales" />
            </div>

            <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                    <span className="text-xs" style={{ color: 'rgba(31,47,87,0.55)' }}>
                        Nivel de stock
                    </span>
                    <span
                        className="text-xs font-semibold"
                        style={{ color: bColor }}
                        aria-hidden
                    >
                        {cantProductos}%
                    </span>
                    <span className="sr-only">{cantProductos}% de nivel de stock</span>
                </div>
                <div
                    className="w-full h-1.5 rounded-full"
                    style={{ backgroundColor: 'rgba(31,47,87,0.08)' }}
                >
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${cantProductos}%`, backgroundColor: bColor }}
                    />
                </div>
            </div>

            <Link
                href={`/dashboard/almacen/${id}`}
                className="text-xs font-medium hover:underline flex items-center gap-1"
                style={{ color: '#3960A9' }}
            >
                Ver detalles →
            </Link>
        </div>
    )
}

