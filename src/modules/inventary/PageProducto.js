'use client';
import SwitcherLoader from '@/shared/components/SwitcherLoader';
import Text from '@/shared/components/Text';
import { Title } from '@/shared/components/Title';
import { ChevronDown, Search } from 'lucide-react';
import React from 'react'
import NewProductCard from './components/NewProductCard';
import CreateLinkButton from '@/shared/components/CreateLinkButton';
import { SORT_OPTIONS } from '@/shared/constants/Inventary';

export default function PageProducto({
    query, setQuery, 
    setPage,
    filtered,
    sortLabel,
    showSort,
    sort,
    loading,
    paginated,
    totalPages,
    page,
    setShowSort,
    start,
    end,
    favoritos,
    toggleFav,
}) {
    return (
      <div className="p-6 flex flex-col gap-5 bg-[#E1E7F0] min-h-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Title>Productos</Title>
            <Text>
              Administra tu catálogo de productos. Visualiza, busca y gestiona
              la información de tu inventario.
            </Text>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div
              className="flex items-center gap-2 px-3 rounded-lg h-9 min-w-[210px]"
              style={{
                background: "#fff",
                border: "0.5px solid rgba(31,47,87,0.18)",
              }}
            >
              <Search size={14} color="rgba(31,47,87,0.4)" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Buscar productos..."
                className="bg-transparent outline-none text-xs flex-1 placeholder:text-[rgba(31,47,87,0.35)]"
                style={{ color: "#1F2F57" }}
              />
            </div>
                <CreateLinkButton
                        href="/dashboard/inventario/productos/crear">
                        Agregar Producto
                </CreateLinkButton>
            
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: "rgba(31,47,87,0.55)" }}>
            {filtered.length === 0
              ? "0 productos"
              : `${start} - ${end} de ${filtered.length} producto${filtered.length !== 1 ? "s" : ""}`}
          </span>

          <div className="relative">
            <button
              onClick={() => setShowSort((v) => !v)}
              className="flex items-center gap-1.5 text-xs"
              style={{ color: "rgba(31,47,87,0.6)" }}
            >
              Ordenar por:&nbsp;
              <strong style={{ color: "#1F2F57" }}>{sortLabel}</strong>
              <ChevronDown size={13} color="rgba(31,47,87,0.5)" />
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
                    className="px-4 py-2.5 text-xs text-left hover:bg-[rgba(31,47,87,0.04)] transition-colors"
                    style={{
                      color: sort === o.key ? "#3960A9" : "#1F2F57",
                      fontWeight: sort === o.key ? 600 : 400,
                    }}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            )}
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
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {paginated.map((p) => (
                <NewProductCard
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
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-white transition-colors disabled:opacity-40"
              style={{
                border: "0.5px solid rgba(31,47,87,0.18)",
                color: "#1F2F57",
              }}
            >
              ‹ Anterior
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
                  background: n === page ? "#3960A9" : "transparent",
                  color: n === page ? "#fff" : "#1F2F57",
                  border:
                    n === page ? "none" : "0.5px solid rgba(31,47,87,0.18)",
                }}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-white transition-colors disabled:opacity-40"
              style={{
                border: "0.5px solid rgba(31,47,87,0.18)",
                color: "#1F2F57",
              }}
            >
              Siguiente ›
            </button>
          </div>
        )}
      </div>
    );
};