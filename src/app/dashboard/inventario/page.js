'use client'

import React, { useState, useEffect } from 'react'
import {
    Search, Warehouse, LayoutGrid, List, ChevronDown,
    Loader2
} from 'lucide-react'
import AlmacenCard from '@/components/Cards/CardInventario'
import { getAlmacenesByUser } from '@/Connections/almacen'
import DropdownMenuGroup from './components/DropdownMenuGroup'
import { getTiendasByUser } from '@/Connections/tiendas'
export default function PageInventarioResumen() {
    const [query, setQuery]   = useState('')
    const [view, setView]     = useState('kanban') 
    const [loading, setLoading] = useState(true);
    const [dataLoaded, setDataLoaded] = useState([]);
    const [groupBySelected, setGroupBySelected] = useState('Almacen');

    useEffect(() => {
        async function getDataAlmacenes() {
            try {
                let response
                if (groupBySelected === 'Almacen') {
                    response = await getAlmacenesByUser();
                } else {
                    response = await getTiendasByUser();
                }
                const data = response?.data || [];
                setDataLoaded(data);
            } catch (error) { 
                console.log('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }

        getDataAlmacenes();
    }, [groupBySelected]);

    const filtered = dataLoaded?.filter(a =>
        a.nombre.toLowerCase().includes(query.toLowerCase())
    ) || [];

    return (
        <div className="p-6 flex flex-col gap-6 bg-[#E1E7F0] min-h-full">

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold" style={{ color: '#1F2F57' }}>
                        Resumen de inventario
                    </h2>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(31,47,87,0.55)' }}>
                        Visualiza el estado de tus almacenes y sus principales indicadores.
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    {/* Buscador */}
                    <div
                        className="flex items-center gap-2 px-3 rounded-lg h-9 min-w-[200px]"
                        style={{ background: '#fff', border: '0.5px solid rgba(31,47,87,0.18)' }}
                    >
                        <Search size={14} color="rgba(31,47,87,0.4)" />
                        <input
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Buscar almacén..."
                            className="bg-transparent outline-none text-xs flex-1 placeholder:text-[rgba(31,47,87,0.35)]"
                            style={{ color: '#1F2F57' }}
                        />
                    </div>

                    {/* Toggle Kanban / Lista */}
                    <div
                        className="flex items-center rounded-lg overflow-hidden h-9"
                        style={{ border: '0.5px solid rgba(31,47,87,0.18)', background: '#fff' }}
                    >
                        {[
                            { key: 'kanban', Icon: LayoutGrid, label: 'Kanban' },
                            { key: 'lista',  Icon: List,       label: 'Lista'  },
                        ].map(({ key, Icon, label }) => (
                            <button
                                key={key}
                                onClick={() => setView(key)}
                                aria-label={label}
                                className="flex items-center gap-1.5 px-3 h-full text-xs font-medium transition-colors"
                                style={{
                                    background: view === key ? '#3960A9' : 'transparent',
                                    color:      view === key ? '#fff'    : 'rgba(31,47,87,0.6)',
                                }}
                            >
                                <Icon size={14} />
                                {label}
                            </button>
                        ))}
                    </div>

                   <DropdownMenuGroup
                        items={["Almacen", "Tienda"]}
                        groupBySelected={groupBySelected}
                        setGroupBySelected={setGroupBySelected}
                    />
                </div>
            </div>

            {/* Grid de tarjetas */}
            {
                loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filtered.map(a => (
                            <AlmacenCard key={a.id} almacen={a} />
                        ))}
                    </div>
                )
            }

        </div>
    )
}
