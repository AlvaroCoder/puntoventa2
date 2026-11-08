'use client';
import SwitcherLoader from '@/shared/components/SwitcherLoader';
import Text from '@/shared/components/Text';
import { Title } from '@/shared/components/Title';
import { SORT_OPTIONS } from '@/shared/constants/Inventary';
import {
  AlignJustify,
  ChevronDown,
  LayoutGrid,
  Package,
  Star,
  TriangleAlert,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import NewProductCard from './components/NewProductCard';
import InputSearch from '@/shared/components/InputSearch';
import CreateLinkButton from '@/shared/components/CreateLinkButton';

function ProductRow({ producto, favorito, onToggleFav }) {
  const stock = Number(producto.stockTotal ?? 0);
  const stockColor = stock === 0 ? '#DC2626' : stock <= 5 ? '#D97706' : '#198E7B';
  const stockBg =
    stock === 0
      ? 'rgba(220,38,38,0.08)'
      : stock <= 5
        ? 'rgba(217,119,6,0.08)'
        : 'rgba(25,142,123,0.08)';
  const initials = (producto.nombre ?? '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <div
      className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 transition-all hover:shadow-sm"
      style={{ border: '0.5px solid rgba(31,47,87,0.1)' }}
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold text-white"
        style={{ background: '#3960A9' }}
      >
        {initials || <Package size={14} />}
      </div>

      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-bold" style={{ color: '#1F2F57' }}>
          {producto.nombre}
        </p>
        <p className="text-[11px] font-mono" style={{ color: 'rgba(31,47,87,0.4)' }}>
          {producto.codigo}
        </p>
      </div>

      <span
        className="hidden shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold sm:block"
        style={{ background: 'rgba(57,96,169,0.08)', color: '#3960A9' }}
      >
        {producto.categoriaNombre ?? '—'}
      </span>

      <span
        className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold"
        style={{ background: stockBg, color: stockColor }}
      >
        {stock} {producto.unidadMedida ?? 'und'}
      </span>

      <span className="shrink-0 text-sm font-extrabold" style={{ color: '#3960A9' }}>
        S/ {Number(producto.precioVenta ?? 0).toFixed(2)}
      </span>

      <button
        onClick={(e) => { e.preventDefault(); onToggleFav(producto.id); }}
        className="shrink-0 transition-opacity hover:opacity-70"
      >
        <Star
          size={14}
          strokeWidth={1.8}
          fill={favorito ? '#E8A020' : 'none'}
          color={favorito ? '#E8A020' : 'rgba(31,47,87,0.28)'}
        />
      </button>
    </div>
  );
}

export default function PageProducto({
  query,
  setQuery,
  setPage,
  filtered,
  sortLabel,
  showSort,
  sort,
  setSort,
  loading,
  paginated,
  totalPages,
  page,
  setShowSort,
  favoritos,
  toggleFav,
  stockBajoCount,
  filtrarStockBajo,
  setFiltrarStockBajo,
  soloFavoritos,
  setSoloFavoritos,
  agotadoCount,
}) {
  const [modeVisible, setModeVisible] = useState('grid');
  const sortRef = useRef(null);

  useEffect(() => {
    if (!showSort) return;
    function handleClick(e) {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setShowSort(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showSort, setShowSort]);

  return (
    <div className="p-6 flex flex-col gap-5 bg-[#E1E7F0] min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <Title>Productos</Title>
          <Text>Todo tu catálogo disponible en un solo lugar.</Text>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <CreateLinkButton
            href="/dashboard/inventario/productos/crear/lote"
          >Ingreso en lote</CreateLinkButton>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <InputSearch setQuery={setQuery} setPage={setPage} query={query} />

        <button
          className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-xs font-medium"
          style={{
            background: "#fff",
            border: "0.5px solid rgba(31,47,87,0.18)",
            color: "rgba(31,47,87,0.65)",
          }}
        >
          Todas las categorías
          <ChevronDown size={13} color="rgba(31,47,87,0.4)" />
        </button>

        <button
          onClick={() => {
            setFiltrarStockBajo((v) => !v);
            setPage(1);
          }}
          className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-xs font-medium transition-colors"
          style={{
            background: filtrarStockBajo ? "#FEF3C7" : "#fff",
            border: filtrarStockBajo
              ? "1px solid #D97706"
              : "0.5px solid rgba(31,47,87,0.18)",
            color: filtrarStockBajo ? "#D97706" : "rgba(31,47,87,0.65)",
          }}
        >
          <TriangleAlert
            size={13}
            strokeWidth={2}
            color={filtrarStockBajo ? "#D97706" : "rgba(31,47,87,0.4)"}
          />
          Stock bajo
          {typeof stockBajoCount === "number" && stockBajoCount > 0 && (
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none"
              style={{
                backgroundColor: filtrarStockBajo
                  ? "#D97706"
                  : "rgba(31,47,87,0.12)",
                color: filtrarStockBajo ? "#fff" : "#1F2F57",
              }}
            >
              {stockBajoCount}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setSoloFavoritos((v) => !v);
            setPage(1);
          }}
          className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-xs font-medium transition-colors"
          style={{
            background: soloFavoritos ? "#FFFBEB" : "#fff",
            border: soloFavoritos
              ? "1px solid #E8A020"
              : "0.5px solid rgba(31,47,87,0.18)",
            color: soloFavoritos ? "#E8A020" : "rgba(31,47,87,0.65)",
          }}
        >
          <Star
            size={13}
            strokeWidth={1.8}
            fill={soloFavoritos ? "#E8A020" : "none"}
            color={soloFavoritos ? "#E8A020" : "rgba(31,47,87,0.4)"}
          />
          Favoritos
        </button>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: "rgba(31,47,87,0.55)" }}>
          {filtered.length === 0
            ? "0 productos"
            : `${filtered.length} producto${filtered.length !== 1 ? "s" : ""}`}
          {typeof agotadoCount === "number" && agotadoCount > 0 && (
            <span style={{ color: "#DC2626" }}>
              {" "}
              · {agotadoCount} agotado{agotadoCount !== 1 ? "s" : ""}
            </span>
          )}
        </span>

        <div className="flex items-center gap-3">
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setShowSort((v) => !v)}
              className="flex items-center gap-1.5 text-xs"
              style={{ color: "rgba(31,47,87,0.6)" }}
            >
              Ordenar por:&nbsp;
              <strong style={{ color: "#1F2F57" }}>{sortLabel}</strong>
              <ChevronDown
                size={13}
                color="rgba(31,47,87,0.5)"
                style={{
                  transition: "transform 0.2s",
                  transform: showSort ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>
            {showSort && (
              <div
                className="absolute right-0 top-7 z-20 flex flex-col rounded-xl overflow-hidden shadow-lg min-w-[200px]"
                style={{
                  background: "#fff",
                  border: "0.5px solid rgba(31,47,87,0.12)",
                }}
              >
                {SORT_OPTIONS.map((o) => (
                  <button
                    key={o.key}
                    onClick={() => {
                      setSort(o.key);
                      setShowSort(false);
                      setPage(1);
                    }}
                    className="px-4 py-2.5 text-xs text-left transition-colors hover:bg-[rgba(31,47,87,0.04)]"
                    style={{
                      color: sort === o.key ? "#3960A9" : "#1F2F57",
                      fontWeight: sort === o.key ? 700 : 400,
                      background:
                        sort === o.key ? "rgba(57,96,169,0.05)" : "transparent",
                    }}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div
            className="flex items-center rounded-lg overflow-hidden"
            style={{ border: "0.5px solid rgba(31,47,87,0.18)" }}
          >
            <button
              aria-label="Vista lista"
              onClick={() => setModeVisible("table")}
              className="w-8 h-8 flex items-center justify-center transition-colors"
              style={{
                borderRight: "0.5px solid rgba(31,47,87,0.12)",
                background: modeVisible === "table" ? "#1F2F57" : "transparent",
              }}
            >
              <AlignJustify
                size={14}
                color={modeVisible === "table" ? "#fff" : "rgba(31,47,87,0.45)"}
              />
            </button>
            <button
              aria-label="Vista cuadrícula"
              onClick={() => setModeVisible("grid")}
              className="w-8 h-8 flex items-center justify-center transition-colors"
              style={{
                background: modeVisible === "grid" ? "#1F2F57" : "transparent",
              }}
            >
              <LayoutGrid
                size={14}
                color={modeVisible === "grid" ? "#fff" : "rgba(31,47,87,0.45)"}
              />
            </button>
          </div>
        </div>
      </div>

      <SwitcherLoader loading={loading}>
        {paginated.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 rounded-xl bg-white"
            style={{ border: "0.5px solid rgba(31,47,87,0.12)" }}
          >
            <p className="text-sm" style={{ color: "rgba(31,47,87,0.5)" }}>
              No se encontraron productos
            </p>
          </div>
        ) : modeVisible === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {paginated.map((p) => (
              <NewProductCard
                key={p.id}
                producto={p}
                favorito={favoritos.has(p.id)}
                onToggleFav={toggleFav}
                categoriaNombre={p.categoriaNombre}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <div
              className="hidden sm:grid px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide"
              style={{
                gridTemplateColumns: "2rem 1fr 140px 100px 90px 1.5rem",
                gap: "0.75rem",
                color: "rgba(31,47,87,0.4)",
              }}
            >
              <span />
              <span>Producto</span>
              <span>Categoría</span>
              <span>Stock</span>
              <span>Precio</span>
              <span />
            </div>
            {paginated.map((p) => (
              <ProductRow
                key={p.id}
                producto={p}
                favorito={favoritos.has(p.id)}
                onToggleFav={toggleFav}
              />
            ))}
          </div>
        )}
      </SwitcherLoader>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 pt-2">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-white transition-colors disabled:opacity-40"
            style={{
              border: "0.5px solid rgba(31,47,87,0.18)",
              color: "#1F2F57",
            }}
          >
            Anterior
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(
            (n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className="w-8 h-8 rounded-lg text-xs font-semibold transition-colors"
                style={{
                  background: n === page ? "#3960A9" : "transparent",
                  color: n === page ? "#fff" : "#1F2F57",
                  border:
                    n === page ? "none" : "0.5px solid rgba(31,47,87,0.18)",
                }}
              >
                {n}
              </button>
            ),
          )}
          <button
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-white transition-colors disabled:opacity-40"
            style={{
              border: "0.5px solid rgba(31,47,87,0.18)",
              color: "#1F2F57",
            }}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
