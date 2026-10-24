'use client'
import { ChevronLeft, ChevronRight,  Search, X, Trash2, Tag, FolderOpen } from 'lucide-react';
import React from 'react'
import { Title } from '@/shared/components/Title';
import CreateLinkButton from '@/shared/components/CreateLinkButton';
import PathCategoryDisplay from './components/PathCategoryDisplay';
import CheckBox from '@/shared/components/CheckBox';
import SwitcherLoader from '@/shared/components/SwitcherLoader';
import { NIVEL_DOT } from '@/shared/constants/Inventary';

export default function PageInventary({
    categorias,
    query,
    setQuery,
    filtered,
    loading,
    selected,
    toggleOne,
    toggleAll,
    allSelected,
    someSelected,
    setSelected
}) {
    return (
      <div className="p-6 flex flex-col gap-5 bg-[#E1E7F0] min-h-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <Title>Categorías de productos</Title>
            <p
              className="text-xs mt-0.5 flex items-center gap-2"
              style={{ color: "rgba(31,47,87,0.55)" }}
            >
              Organiza tus productos en categorías jerárquicas
              <span
                className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(31,47,87,0.08)", color: "#1F2F57" }}
              >
                {categorias.length}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div
              className="flex items-center gap-2 px-3 rounded-lg h-9 min-w-[220px]"
              style={{
                background: "#fff",
                border: "0.5px solid rgba(31,47,87,0.18)",
              }}
            >
              <Search size={14} color="rgba(31,47,87,0.4)" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar categoría..."
                className="bg-transparent outline-none text-xs flex-1 placeholder:text-[rgba(31,47,87,0.35)]"
                style={{ color: "#1F2F57" }}
              />
              {query && (
                <button onClick={() => setQuery("")}>
                  <X size={13} color="rgba(31,47,87,0.4)" />
                </button>
              )}
            </div>
            <CreateLinkButton href="/dashboard/inventario/categoria/create">
                Nueva Categoría
            </CreateLinkButton>
          </div>
        </div>

        <div
          className="bg-white rounded-xl overflow-hidden flex flex-col"
          style={{ border: "0.5px solid rgba(31,47,87,0.12)" }}
        >
          {selected.size > 0 && (
            <div
              className="px-5 py-2.5 flex items-center gap-3"
              style={{
                background: "rgba(57,96,169,0.06)",
                borderBottom: "0.5px solid rgba(57,96,169,0.15)",
              }}
            >
              <span
                className="text-xs font-semibold"
                style={{ color: "#3960A9" }}
              >
                {selected.size} seleccionada{selected.size > 1 ? "s" : ""}
              </span>
              <div
                className="h-4 w-px"
                style={{ background: "rgba(31,47,87,0.15)" }}
              />
              <button
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                style={{ color: "#C0392B" }}
              >
                <Trash2 size={13} />
                Eliminar
              </button>
              <button
                onClick={() => setSelected(new Set())}
                className="ml-auto flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                style={{ color: "rgba(31,47,87,0.5)" }}
              >
                <X size={13} />
                Cancelar selección
              </button>
            </div>
          )}

          <div
            className="flex items-center gap-4 px-5 py-3"
            style={{
              background: "rgba(31,47,87,0.03)",
              borderBottom: "0.5px solid rgba(31,47,87,0.1)",
            }}
          >
            <CheckBox
              checked={allSelected}
              indeterminate={someSelected}
              onChange={toggleAll}
            />
            <span
              className="flex-1 text-[11px] font-semibold uppercase tracking-wide"
              style={{ color: "rgba(31,47,87,0.45)" }}
            >
              Categoría de producto
            </span>
            <span
              className="text-[11px]"
              style={{ color: "rgba(31,47,87,0.35)" }}
            >
              {filtered.length === categorias.length
                ? `1 – ${filtered.length} / ${categorias.length}`
                : `${filtered.length} de ${categorias.length}`}
            </span>
          </div>

          <SwitcherLoader loading={loading}>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2.5">
                <FolderOpen size={32} color="rgba(31,47,87,0.2)" />
                <p className="text-sm" style={{ color: "rgba(31,47,87,0.45)" }}>
                  No se encontraron categorías
                </p>
              </div>
            ) : (
              <div
                className="divide-y"
                style={{ borderColor: "rgba(31,47,87,0.06)" }}
              >
                {filtered.map((cat, idx) => {
                  const isSelected = selected.has(cat.id);
                  const dotStyle = NIVEL_DOT[0];

                  return (
                    <div
                      key={cat.id}
                      className={`flex items-center gap-4 px-5 py-3 cursor-pointer transition-colors ${
                        isSelected
                          ? ""
                          : idx % 2 === 0
                            ? "hover:bg-[rgba(31,47,87,0.02)]"
                            : "hover:bg-[rgba(31,47,87,0.02)]"
                      }`}
                      style={{
                        background: isSelected
                          ? "rgba(57,96,169,0.05)"
                          : idx % 2 !== 0
                            ? "rgba(31,47,87,0.012)"
                            : "transparent",
                      }}
                      onClick={() => toggleOne(cat.id)}
                    >
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleOne(cat.id);
                        }}
                      >
                        <CheckBox
                          checked={isSelected}
                          indeterminate={false}
                          onChange={() => toggleOne(cat.id)}
                        />
                      </div>

                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: dotStyle.bg }}
                      >
                        <Tag size={13} color={dotStyle.text} />
                      </div>

                      <PathCategoryDisplay path={cat.path} />
                    </div>
                  );
                })}
              </div>
            )}
          </SwitcherLoader>

          <div
            className="px-5 py-3 flex items-center justify-between"
            style={{
              borderTop: "0.5px solid rgba(31,47,87,0.08)",
              background: "rgba(31,47,87,0.015)",
            }}
          >
            <span className="text-xs" style={{ color: "rgba(31,47,87,0.45)" }}>
              {filtered.length} categoría{filtered.length !== 1 ? "s" : ""}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: "rgba(31,47,87,0.4)" }}>
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
    );
};