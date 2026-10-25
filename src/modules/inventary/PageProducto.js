'use client';
import SwitcherLoader from '@/shared/components/SwitcherLoader';
import Text from '@/shared/components/Text';
import { Title } from '@/shared/components/Title';
import CreateLinkButton from '@/shared/components/CreateLinkButton';
import { SORT_OPTIONS } from '@/shared/constants/Inventary';
import {
  AlignJustify,
  ChevronDown,
  LayoutGrid,
  Search,
  Star,
  TriangleAlert,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import NewProductCard from './components/NewProductCard';

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
  start,
  end,
  favoritos,
  toggleFav,
  stockBajoCount,
  filtrarStockBajo,
  setFiltrarStockBajo,
  soloFavoritos,
  setSoloFavoritos,
  agotadoCount,
}) {
  return (
    <div className="p-6 flex flex-col gap-5 bg-[#E1E7F0] min-h-full">

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <Title>Productos</Title>
          <Text>Todo tu catálogo disponible en un solo lugar.</Text>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/dashboard/inventario/productos/ingreso-lote"
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-xs font-medium transition-colors hover:bg-gray-50"
            style={{
              background: '#fff',
              border: '1px solid rgba(31,47,87,0.2)',
              color: '#1F2F57',
            }}
          >
            Ingreso en lote
          </Link>
          <CreateLinkButton href="/dashboard/inventario/productos/crear">
            + Nuevo producto
          </CreateLinkButton>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div
          className="flex items-center gap-2 px-3 rounded-lg h-9 min-w-[220px]"
          style={{
            background: '#fff',
            border: '0.5px solid rgba(31,47,87,0.18)',
          }}
        >
          <Search size={14} color="rgba(31,47,87,0.4)" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Nombre, codigo o escanear..."
            className="bg-transparent outline-none text-xs flex-1 placeholder:text-[rgba(31,47,87,0.35)]"
            style={{ color: '#1F2F57' }}
          />
        </div>

        <button
          className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-xs font-medium"
          style={{
            background: '#fff',
            border: '0.5px solid rgba(31,47,87,0.18)',
            color: 'rgba(31,47,87,0.65)',
          }}
        >
          Todos los almacenes
          <ChevronDown size={13} color="rgba(31,47,87,0.4)" />
        </button>

        <button
          className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-xs font-medium"
          style={{
            background: '#fff',
            border: '0.5px solid rgba(31,47,87,0.18)',
            color: 'rgba(31,47,87,0.65)',
          }}
        >
          Todas las categorias
          <ChevronDown size={13} color="rgba(31,47,87,0.4)" />
        </button>

        <button
          onClick={() => {
            setFiltrarStockBajo((v) => !v);
            setPage(1);
          }}
          className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-xs font-medium transition-colors"
          style={{
            background: filtrarStockBajo ? '#FEF3C7' : '#fff',
            border: filtrarStockBajo
              ? '1px solid #D97706'
              : '0.5px solid rgba(31,47,87,0.18)',
            color: filtrarStockBajo ? '#D97706' : 'rgba(31,47,87,0.65)',
          }}
        >
          <TriangleAlert
            size={13}
            strokeWidth={2}
            color={filtrarStockBajo ? '#D97706' : 'rgba(31,47,87,0.4)'}
          />
          Stock bajo
          {typeof stockBajoCount === 'number' && stockBajoCount > 0 && (
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none"
              style={{
                backgroundColor: filtrarStockBajo ? '#D97706' : 'rgba(31,47,87,0.12)',
                color: filtrarStockBajo ? '#fff' : '#1F2F57',
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
            background: soloFavoritos ? '#FFFBEB' : '#fff',
            border: soloFavoritos
              ? '1px solid #E8A020'
              : '0.5px solid rgba(31,47,87,0.18)',
            color: soloFavoritos ? '#E8A020' : 'rgba(31,47,87,0.65)',
          }}
        >
          <Star
            size={13}
            strokeWidth={1.8}
            fill={soloFavoritos ? '#E8A020' : 'none'}
            color={soloFavoritos ? '#E8A020' : 'rgba(31,47,87,0.4)'}
          />
          Favoritos
        </button>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: 'rgba(31,47,87,0.55)' }}>
          {filtered.length === 0
            ? '0 productos'
            : `${filtered.length} producto${filtered.length !== 1 ? 's' : ''}`}
          {typeof agotadoCount === 'number' && agotadoCount > 0 && (
            <span style={{ color: '#DC2626' }}>
              {' '}· {agotadoCount} agotado{agotadoCount !== 1 ? 's' : ''}
            </span>
          )}
        </span>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowSort((v) => !v)}
              className="flex items-center gap-1.5 text-xs"
              style={{ color: 'rgba(31,47,87,0.6)' }}
            >
              Ordenar por:&nbsp;
              <strong style={{ color: '#1F2F57' }}>{sortLabel}</strong>
              <ChevronDown size={13} color="rgba(31,47,87,0.5)" />
            </button>
            {showSort && (
              <div
                className="absolute right-0 top-7 z-20 flex flex-col rounded-xl overflow-hidden shadow-lg min-w-[200px]"
                style={{
                  background: '#fff',
                  border: '0.5px solid rgba(31,47,87,0.12)',
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
                    className="px-4 py-2.5 text-xs text-left hover:bg-[rgba(31,47,87,0.04)] transition-colors"
                    style={{
                      color: sort === o.key ? '#3960A9' : '#1F2F57',
                      fontWeight: sort === o.key ? 600 : 400,
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
            style={{ border: '0.5px solid rgba(31,47,87,0.18)' }}
          >
            <button
              className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-[rgba(31,47,87,0.04)]"
              aria-label="Vista lista"
              style={{ borderRight: '0.5px solid rgba(31,47,87,0.12)' }}
            >
              <AlignJustify size={14} color="rgba(31,47,87,0.45)" />
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center transition-colors"
              aria-label="Vista cuadricula"
              style={{ backgroundColor: '#1F2F57' }}
            >
              <LayoutGrid size={14} color="#fff" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Grid de tarjetas ── */}
      <SwitcherLoader loading={loading}>
        {paginated.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 rounded-xl bg-white"
            style={{ border: '0.5px solid rgba(31,47,87,0.12)' }}
          >
            <p className="text-sm" style={{ color: 'rgba(31,47,87,0.5)' }}>
              No se encontraron productos
            </p>
          </div>
        ) : (
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
        )}
      </SwitcherLoader>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 pt-2">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-white transition-colors disabled:opacity-40"
            style={{
              border: '0.5px solid rgba(31,47,87,0.18)',
              color: '#1F2F57',
            }}
          >
            Anterior
          </button>
          {Array.from(
            { length: Math.min(5, totalPages) },
            (_, i) => i + 1,
          ).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className="w-8 h-8 rounded-lg text-xs font-semibold transition-colors"
              style={{
                background: n === page ? '#3960A9' : 'transparent',
                color: n === page ? '#fff' : '#1F2F57',
                border:
                  n === page ? 'none' : '0.5px solid rgba(31,47,87,0.18)',
              }}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-white transition-colors disabled:opacity-40"
            style={{
              border: '0.5px solid rgba(31,47,87,0.18)',
              color: '#1F2F57',
            }}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
