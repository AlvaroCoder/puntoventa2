'use client'
import React, { useState, useMemo, useEffect } from 'react'
import {
    Search, Plus, Download, Tag, ChevronLeft, ChevronRight,
    Trash2, X, FolderOpen
} from 'lucide-react';

import { getCategorias } from '@/Connections/productos'
import CheckBox from '@/components/Buttons/CheckBox';
import SwitcherLoader from '@/components/Navigation/SwitcherLoader';
import Link from 'next/link';

const NIVEL_DOT = [
    { bg: 'rgba(57,96,169,0.12)', text: '#3960A9' },
    { bg: 'rgba(30,179,178,0.12)', text: '#1EB3B2' },
    { bg: 'rgba(232,160,32,0.12)', text: '#E8A020' },
];

function agregarPath(categorias) {
  const mapa = new Map(categorias.map(cat => [cat.id, cat]));

  function obtenerPath(categoria) {
    if (categoria.categoria_padre_id === null) {
      return categoria.nombre;
    }
    const padre = mapa.get(categoria.categoria_padre_id);
    return `${obtenerPath(padre)}/${categoria.nombre}`;
  }

  return categorias.map(cat => ({
    ...cat,
    path: obtenerPath(cat)
  }));
}

function PathDisplay({ path }) {
    const partes = path.split(' / ')
    return (
        <span className="text-sm">
            {partes.map((parte, i) => (
                <React.Fragment key={i} >
                    {i > 0 && (
                        <span className="mx-1.5 select-none" style={{ color: 'rgba(31,47,87,0.25)' }}> / </span>
                    )}
                    <span style={{ color: i === partes.length - 1 ? '#1F2F57' : 'rgba(31,47,87,0.45)' }}>
                        {parte}
                    </span>
                </React.Fragment>
            ))}
        </span>
    )
}

export default function Page() {
    const [selected, setSelected] = useState(new Set())
    const [query, setQuery] = useState('')
    const [loading, setLoading] = useState(true);
    const [categorias, setCategorias] = useState([]);
    useEffect(() => {
        async function fetchData() { 
            try {
                const response = await getCategorias();
                const respModified = agregarPath(response?.data?.data || []);
                setCategorias(respModified);
            } catch (error) { 

            } finally {
                setLoading(false)
            }
        }

        fetchData();
    }, []);

    const filtered = useMemo(
        () => categorias.filter(c =>
            c.nombre.toLowerCase().includes(query.toLowerCase())
        ),
        [categorias, query]
    )

    const allSelected  = selected.size === filtered.length && filtered.length > 0
    const someSelected = selected.size > 0 && !allSelected

    const toggleAll = () => {
        if (allSelected) setSelected(new Set())
        else setSelected(new Set(filtered.map(c => c.id)))
    }

    const toggleOne = (id) => {
        const next = new Set(selected)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        setSelected(next)
    }

    return (
        <div className="p-6 flex flex-col gap-5 bg-[#E1E7F0] min-h-full">

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-lg font-semibold" style={{ color: '#1F2F57' }}>
                        Categorías de productos
                    </h1>
                    <p className="text-xs mt-0.5 flex items-center gap-2" style={{ color: 'rgba(31,47,87,0.55)' }}>
                        Organiza tus productos en categorías jerárquicas
                        <span
                            className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(31,47,87,0.08)', color: '#1F2F57' }}
                        >
                            {categorias.length}
                        </span>
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <div
                        className="flex items-center gap-2 px-3 rounded-lg h-9 min-w-[220px]"
                        style={{ background: '#fff', border: '0.5px solid rgba(31,47,87,0.18)' }}
                    >
                        <Search size={14} color="rgba(31,47,87,0.4)" />
                        <input
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Buscar categoría..."
                            className="bg-transparent outline-none text-xs flex-1 placeholder:text-[rgba(31,47,87,0.35)]"
                            style={{ color: '#1F2F57' }}
                        />
                        {query && (
                            <button onClick={() => setQuery('')}>
                                <X size={13} color="rgba(31,47,87,0.4)" />
                            </button>
                        )}
                    </div>

                    <button
                        className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors hover:bg-white/80"
                        style={{ background: '#fff', border: '0.5px solid rgba(31,47,87,0.18)' }}
                        title="Exportar"
                    >
                        <Download size={15} color="rgba(31,47,87,0.5)" />
                    </button>

                    <Link
                        href="/dashboard/inventario/categoria/create"
                        className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-90"
                        style={{ background: '#1F2F57' }}
                    >
                        <Plus size={14} />
                        Nueva Categoría
                    </Link>
                </div>
            </div>

            <div
                className="bg-white rounded-xl overflow-hidden flex flex-col"
                style={{ border: '0.5px solid rgba(31,47,87,0.12)' }}
            >
                {selected.size > 0 && (
                    <div
                        className="px-5 py-2.5 flex items-center gap-3"
                        style={{ background: 'rgba(57,96,169,0.06)', borderBottom: '0.5px solid rgba(57,96,169,0.15)' }}
                    >
                        <span className="text-xs font-semibold" style={{ color: '#3960A9' }}>
                            {selected.size} seleccionada{selected.size > 1 ? 's' : ''}
                        </span>
                        <div className="h-4 w-px" style={{ background: 'rgba(31,47,87,0.15)' }} />
                        <button
                            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                            style={{ color: '#C0392B' }}
                        >
                            <Trash2 size={13} />
                            Eliminar
                        </button>
                        <button
                            onClick={() => setSelected(new Set())}
                            className="ml-auto flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                            style={{ color: 'rgba(31,47,87,0.5)' }}
                        >
                            <X size={13} />
                            Cancelar selección
                        </button>
                    </div>
                )}

                <div
                    className="flex items-center gap-4 px-5 py-3"
                    style={{
                        background:    'rgba(31,47,87,0.03)',
                        borderBottom:  '0.5px solid rgba(31,47,87,0.1)',
                    }}
                >
                    <CheckBox
                        checked={allSelected}
                        indeterminate={someSelected}
                        onChange={toggleAll}
                    />
                    <span className="flex-1 text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'rgba(31,47,87,0.45)' }}>
                        Categoría de producto
                    </span>
                    <span className="text-[11px]" style={{ color: 'rgba(31,47,87,0.35)' }}>
                        {filtered.length === categorias.length
                            ? `1 – ${filtered.length} / ${categorias.length}`
                            : `${filtered.length} de ${categorias.length}`
                        }
                    </span>
                </div>

                <SwitcherLoader loading={loading}>
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-2.5">
                        <FolderOpen size={32} color="rgba(31,47,87,0.2)" />
                        <p className="text-sm" style={{ color: 'rgba(31,47,87,0.45)' }}>
                            No se encontraron categorías
                        </p>
                    </div>
                ) : (
                    <div className="divide-y" style={{ borderColor: 'rgba(31,47,87,0.06)' }}>
                        {filtered.map((cat, idx) => {
                            const isSelected = selected.has(cat.id)
                            const dotStyle   = NIVEL_DOT[0]

                            return (
                                <div
                                    key={cat.id}
                                    className={`flex items-center gap-4 px-5 py-3 cursor-pointer transition-colors ${
                                        isSelected
                                            ? ''
                                            : idx % 2 === 0 ? 'hover:bg-[rgba(31,47,87,0.02)]' : 'hover:bg-[rgba(31,47,87,0.02)]'
                                    }`}
                                    style={{
                                        background: isSelected
                                            ? 'rgba(57,96,169,0.05)'
                                            : idx % 2 !== 0 ? 'rgba(31,47,87,0.012)' : 'transparent',
                                    }}
                                    onClick={() => toggleOne(cat.id)}
                                >
                                    <div onClick={e => { e.stopPropagation(); toggleOne(cat.id) }}>
                                        <CheckBox checked={isSelected} indeterminate={false} onChange={() => toggleOne(cat.id)} />
                                    </div>

                                    <div
                                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                                        style={{ background: dotStyle.bg }}
                                    >
                                        <Tag size={13} color={dotStyle.text} />
                                    </div>

                                    <PathDisplay path={cat.path} />
                                </div>
                            )
                        })}
                    </div>
                )}
                </SwitcherLoader>

                <div
                    className="px-5 py-3 flex items-center justify-between"
                    style={{ borderTop: '0.5px solid rgba(31,47,87,0.08)', background: 'rgba(31,47,87,0.015)' }}
                >
                    <span className="text-xs" style={{ color: 'rgba(31,47,87,0.45)' }}>
                        {filtered.length} categoría{filtered.length !== 1 ? 's' : ''}
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: 'rgba(31,47,87,0.4)' }}>
                            1 – {filtered.length}&nbsp;/&nbsp;{categorias.length}
                        </span>
                        <button
                            disabled
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30"
                        >
                            <ChevronLeft size={15} color="rgba(31,47,87,0.5)" />
                        </button>
                        <button
                            disabled
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30"
                        >
                            <ChevronRight size={15} color="rgba(31,47,87,0.5)" />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}