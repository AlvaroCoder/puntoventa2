'use client';
import { Search, X, ImageIcon } from 'lucide-react';
import React, { useMemo, useState } from 'react'
import SwitcherLoader from '../Navigation/SwitcherLoader';
import useInventario from '@/modules/inventary/hooks/useInventario';
import Image from 'next/image';

const fmt = v => new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(v ?? 0);

const normalizar = texto =>
    String(texto ?? "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

const COLOR_CSS = {
    negro: '#1a1a1a', blanco: '#f5f5f5', rojo: '#ef4444', azul: '#3b82f6',
    verde: '#22c55e', amarillo: '#eab308', naranja: '#f97316', morado: '#a855f7',
    rosado: '#ec4899', rosa: '#ec4899', gris: '#9ca3af', marron: '#92400e',
    cafe: '#92400e', celeste: '#7dd3fc', beige: '#d4c5a9', plateado: '#d1d5db',
    dorado: '#fbbf24', turquesa: '#14b8a6', lila: '#c084fc',
};

function getColorCss(nombre) {
    const key = normalizar(nombre ?? '');
    return COLOR_CSS[key] ?? '#9ca3af';
}

const COLORES_CLAROS = new Set(['blanco', 'beige', 'amarillo', 'celeste', 'plateado']);
function esColorClaro(nombre) {
    return COLORES_CLAROS.has(normalizar(nombre ?? ''));
}

function VarianteSelector({ producto, onClose, onAgregar }) {
    const variantes = producto?.variantes ?? [];

    const colores = useMemo(
        () => [...new Set(variantes.map(v => v.color).filter(Boolean))],
        [variantes],
    );
    const tallas = useMemo(
        () => [...new Set(variantes.map(v => v.talla ?? v.size).filter(Boolean))],
        [variantes],
    );

    const tieneColores = colores.length > 0;
    const tieneTallas = tallas.length > 0;

    const [colorSel, setColorSel] = useState(colores[0] ?? null);
    const [tallaSel, setTallaSel] = useState(null);

    const tallasPorColor = useMemo(() => {
        return tallas.map(talla => {
            const v = variantes.find(v =>
                (!tieneColores || (v.color === colorSel)) &&
                (v.talla === talla || v.size === talla),
            );
            const stock = v ? Number(v.stockInicial ?? v.stock_actual ?? v.stock ?? 0) : 0;
            return { talla, stock };
        });
    }, [variantes, colorSel, tallas, tieneColores]);

    const handleAgregar = () => {
        const variante = variantes.find(v =>
            (!tieneColores || v.color === colorSel) &&
            (!tieneTallas || v.talla === tallaSel || v.size === tallaSel),
        );
        onAgregar(producto, variante ?? null);
        onClose();
    };

    const labelBoton = [colorSel, tallaSel].filter(Boolean).join(' · ') || producto.nombre;
    const puedeAgregar = !tieneTallas || tallaSel !== null;

    return (
        <>
            <div className="fixed inset-0 z-40" onClick={onClose} />

            <div
                className="fixed bottom-5 right-5 w-[360px] bg-white rounded-2xl z-50 flex flex-col"
                style={{
                    boxShadow: '0 24px 64px rgba(0,0,0,0.16), 0 4px 16px rgba(0,0,0,0.08)',
                    border: '0.5px solid rgba(31,47,87,0.12)',
                    maxHeight: '80vh',
                }}
            >
                <div className="flex items-start justify-between px-5 pt-4 pb-3 shrink-0">
                    <div className="flex-1 min-w-0 pr-3">
                        <h3
                            className="text-sm font-bold leading-tight truncate"
                            style={{ color: '#1F2F57' }}
                        >
                            {producto.nombre}
                        </h3>
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(31,47,87,0.5)' }}>
                            {fmt(producto.precioVenta)}
                            {(tieneColores || tieneTallas) && (
                                <> · elige {tieneColores ? 'color' : ''}{tieneColores && tieneTallas ? ' y ' : ''}{tieneTallas ? 'talla' : ''}</>
                            )}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                        style={{ color: 'rgba(31,47,87,0.4)' }}
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="overflow-y-auto px-5 pb-5 flex flex-col gap-4" style={{ scrollbarWidth: 'none' }}>
                    {tieneColores && (
                        <div>
                            <p className="text-xs font-semibold mb-2" style={{ color: '#1F2F57' }}>
                                Color
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {colores.map(color => {
                                    const activo = colorSel === color;
                                    const claro = esColorClaro(color);
                                    return (
                                        <button
                                            key={color}
                                            onClick={() => { setColorSel(color); setTallaSel(null); }}
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                                            style={
                                                activo
                                                    ? { background: '#1F2F57', color: '#fff', border: '1.5px solid #1F2F57' }
                                                    : { background: '#fff', color: '#1F2F57', border: '1.5px solid rgba(31,47,87,0.18)' }
                                            }
                                        >
                                            <span
                                                style={{
                                                    display: 'inline-block',
                                                    width: 12,
                                                    height: 12,
                                                    borderRadius: '50%',
                                                    background: getColorCss(color),
                                                    border: claro ? '1.5px solid rgba(0,0,0,0.2)' : 'none',
                                                    flexShrink: 0,
                                                }}
                                            />
                                            {color}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {tieneTallas && (
                        <div>
                            <p className="text-xs font-semibold mb-2" style={{ color: '#1F2F57' }}>
                                Talla{' '}
                                <span style={{ color: 'rgba(31,47,87,0.4)', fontWeight: 400 }}>
                                    (stock disponible debajo)
                                </span>
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {tallasPorColor.map(({ talla, stock }) => {
                                    const activo = tallaSel === talla;
                                    const sinStock = stock === 0;
                                    return (
                                        <button
                                            key={talla}
                                            onClick={() => !sinStock && setTallaSel(talla)}
                                            disabled={sinStock}
                                            className="flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all"
                                            style={
                                                activo
                                                    ? { background: '#1F2F57', color: '#fff', border: '1.5px solid #1F2F57' }
                                                    : sinStock
                                                        ? { background: '#f5f5f5', color: 'rgba(31,47,87,0.25)', border: '1.5px solid transparent', textDecoration: 'line-through' }
                                                        : { background: '#fff', color: '#1F2F57', border: '1.5px solid rgba(31,47,87,0.18)' }
                                            }
                                        >
                                            <span className="text-sm font-bold leading-none">{talla}</span>
                                            <span
                                                className="text-[10px] mt-0.5 leading-none"
                                                style={{ opacity: sinStock ? 0.4 : 0.55 }}
                                            >
                                                {stock}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleAgregar}
                        disabled={!puedeAgregar}
                        className="w-full py-3 rounded-xl text-sm font-bold text-white transition-opacity disabled:opacity-35"
                        style={{ background: '#1F2F57' }}
                    >
                        Agregar {labelBoton}
                    </button>

                    <p className="text-[10px] text-center -mt-1" style={{ color: 'rgba(31,47,87,0.38)' }}>
                        Tip: escanear el código de barras agrega la variante directamente.
                    </p>
                </div>
            </div>
        </>
    );
}

function ProductoCard({ producto, onSelect, isSelected }) {
    const variantes = producto?.variantes ?? [];
    const colores = [...new Set(variantes.map(v => v.color).filter(Boolean))];
    const tallas = [...new Set(variantes.map(v => v.talla ?? v.size).filter(Boolean))];
    const stockTotal = Number(producto.stockTotal ?? producto.stock ?? 0);
    const stockBajo = stockTotal > 0 && stockTotal <= 5;

    return (
        <button
            onClick={() => onSelect(producto)}
            className="bg-white rounded-2xl overflow-hidden text-left transition-all hover:shadow-md hover:-translate-y-0.5 active:scale-95 relative flex flex-col"
            style={{
                border: isSelected
                    ? '2px solid #1F2F57'
                    : '1px solid rgba(31,47,87,0.1)',
            }}
        >
            <div className="absolute top-2 right-2 z-10">
                <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                    style={{ background: '#1F2F57', color: 'white' }}
                >
                    {fmt(producto.precioVenta)}
                </span>
            </div>

            <div
                className="relative w-full"
                style={{ height: '120px', background: '#F4F6FB', flexShrink: 0 }}
            >
                {producto.imagenUrl ? (
                    <Image
                        src={producto.imagenUrl}
                        alt={producto.nombre}
                        fill
                        sizes="200px"
                        loading='eager'
                        className="object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <ImageIcon size={28} color="rgba(31,47,87,0.18)" />
                    </div>
                )}
            </div>

            <div className="p-2.5 flex flex-col gap-0.5 flex-1">
                <p
                    className="text-[11px] font-bold leading-tight line-clamp-2"
                    style={{ color: '#1F2F57' }}
                >
                    {producto.nombre}
                </p>

                {variantes.length > 0 ? (
                    <div className="flex items-center gap-1 mt-1 flex-wrap">
                        {colores.length > 0 && (
                            <div className="flex items-center gap-0.5">
                                {colores.slice(0, 4).map(c => (
                                    <span
                                        key={c}
                                        title={c}
                                        style={{
                                            display: 'inline-block',
                                            width: 10,
                                            height: 10,
                                            borderRadius: '50%',
                                            background: getColorCss(c),
                                            border: esColorClaro(c) ? '1px solid rgba(0,0,0,0.18)' : 'none',
                                        }}
                                    />
                                ))}
                                {colores.length > 4 && (
                                    <span className="text-[9px]" style={{ color: 'rgba(31,47,87,0.4)' }}>
                                        +{colores.length - 4}
                                    </span>
                                )}
                            </div>
                        )}
                        {tallas.length > 0 && (
                            <span className="text-[10px]" style={{ color: 'rgba(31,47,87,0.5)' }}>
                                {colores.length > 0 ? '·' : ''} {tallas.length} talla{tallas.length !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>
                ) : stockBajo ? (
                    <p className="text-[10px] mt-0.5 font-semibold" style={{ color: '#D97706' }}>
                        Quedan {stockTotal}
                    </p>
                ) : null}
            </div>
        </button>
    );
}

export default function PosRigthPanel({ addProducto, tiendaId }) {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [productoSel, setProductoSel] = useState(null);

    const { loading, productosByTienda : productos, categorias } = useInventario(tiendaId);

    const productosFiltrados = useMemo(() => {
        const termino = normalizar(search.trim());
        return productos?.filter(p => {
            const matchTexto = !termino ||
                normalizar(p.nombre).includes(termino) ||
                normalizar(p.codigo).includes(termino);
            const matchCategoria = !selectedCategory || p.categoriaId === selectedCategory;
            return matchTexto && matchCategoria;
        });
    }, [productos, search, selectedCategory]);

    const handleCardClick = (p) => {
        const tieneVariantes = (p.variantes ?? []).length > 0;
        if (tieneVariantes) {
            setProductoSel(prev => prev?.id === p.id ? null : p);
        } else {
            addProducto(p);
        }
    };

    const handleAgregar = (producto, variante) => {
        addProducto({ ...producto, varianteSeleccionada: variante });
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <div
                className="bg-white px-4 pt-3 pb-0 shrink-0 flex flex-col gap-2"
                style={{ borderBottom: "0.5px solid rgba(31,47,87,0.1)" }}
            >
                <div className="relative">
                    <Search
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: "rgba(31,47,87,0.35)" }}
                    />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Buscar productos..."
                        className="w-full h-9 pl-9 pr-9 rounded-lg text-xs outline-none"
                        style={{
                            background: "#F4F6FB",
                            border: "1px solid rgba(31,47,87,0.12)",
                            color: "#1F2F57",
                        }}
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-70"
                        >
                            <X size={13} />
                        </button>
                    )}
                </div>

                {categorias.length > 0 && (
                    <div
                        className="flex gap-2 overflow-x-auto pb-3"
                        style={{ scrollbarWidth: 'none' }}
                    >
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className="shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
                            style={
                                !selectedCategory
                                    ? { background: '#1F2F57', color: '#fff' }
                                    : { background: 'rgba(31,47,87,0.07)', color: 'rgba(31,47,87,0.6)' }
                            }
                        >
                            Todos
                        </button>
                        {categorias.map(cat => {
                            const isActive = selectedCategory === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(isActive ? null : cat.id)}
                                    className="shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
                                    style={
                                        isActive
                                            ? { background: '#3960A9', color: '#fff' }
                                            : { background: 'rgba(31,47,87,0.07)', color: 'rgba(31,47,87,0.6)' }
                                    }
                                >
                                    {cat.nombre}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            <SwitcherLoader loading={loading}>
                <div className="flex-1 overflow-y-auto p-4">
                    {productosFiltrados.length === 0 ? (
                        <div
                            className="flex flex-col items-center gap-2 py-20"
                            style={{ color: "rgba(31,47,87,0.3)" }}
                        >
                            <Search size={28} />
                            <p className="text-sm font-medium">
                                {search
                                    ? `Sin resultados para "${search}"`
                                    : 'No hay productos en esta categoría'}
                            </p>
                        </div>
                    ) : (
                        <div
                            className="grid gap-3"
                            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))" }}
                        >
                            {productosFiltrados.map(p => (
                                <ProductoCard
                                    key={p.id}
                                    producto={p}
                                    onSelect={handleCardClick}
                                    isSelected={productoSel?.id === p.id}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </SwitcherLoader>

            {productoSel && (
                <VarianteSelector
                    producto={productoSel}
                    onClose={() => setProductoSel(null)}
                    onAgregar={handleAgregar}
                />
            )}
        </div>
    );
}
