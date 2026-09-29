'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import {
    Search,
    Plus, ChevronDown
} from 'lucide-react'
import { useAuth } from '@/Context/AuthContext'
import { getProductosByEmpresa } from '@/Connections/productos'
import { Title } from '@/components/Titles/Title'
import SwitcherLoader from '@/components/Navigation/SwitcherLoader'
import NewProductCard from '@/components/Cards/NewProductCard'

const PAGE_SIZE = 24

const SORT_OPTIONS = [
    { key: 'nombre_az',   label: 'Nombre (A - Z)' },
    { key: 'nombre_za',   label: 'Nombre (Z - A)' },
    { key: 'precio_asc',  label: 'Precio (menor a mayor)' },
    { key: 'precio_desc', label: 'Precio (mayor a menor)' },
    { key: 'stock_asc',   label: 'Stock (menor a mayor)' },
]

export default function ProductosPage() {
    const [query, setQuery] = useState('')
    const [sort, setSort] = useState('nombre_az')
    const [page, setPage] = useState(1)
    const [favoritos, setFavoritos] = useState(new Set())
    const [showSort, setShowSort]   = useState(false)

    const { user } = useAuth();
    
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    useEffect(() => {
        async function fetchDataProductos() {
            try {
                const productos = await getProductosByEmpresa(user?.empresa_id);
                setData(productos?.data?.content || []);
            } catch (error) {
                console.error("Error fetching productos:", error);
            } finally {
                setLoading(false);
            }
        }

        if (user) {
            fetchDataProductos();
        }
    }, [user]);

    const toggleFav = id => setFavoritos(prev => {
        const next = new Set(prev)
        next.has(id) ? next.delete(id) : next.add(id)
        return next
    })

    const filtered = useMemo(() => {
        let list = data;
        if (query.trim()) {
            const q = query.toLowerCase()
            list = list.filter(p =>
                p.nombre.toLowerCase().includes(q) ||
                p.codigo.toLowerCase().includes(q)
            )
        }
        return [...list].sort((a, b) => {
            switch (sort) {
                case 'nombre_za':   return b.nombre.localeCompare(a.nombre)
                case 'precio_asc':  return a.precio - b.precio
                case 'precio_desc': return b.precio - a.precio
                case 'stock_asc':   return a.stock  - b.stock
                default:            return a.nombre.localeCompare(b.nombre)
            }
        })
    }, [query, sort, data])

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    const start = (page - 1) * PAGE_SIZE + 1
    const end = Math.min(page * PAGE_SIZE, filtered.length)

    const sortLabel  = SORT_OPTIONS.find(o => o.key === sort)?.label ?? 'Nombre (A - Z)'

    return (
      <div className="p-6 flex flex-col gap-5 bg-[#E1E7F0] min-h-full">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <Title>Productos</Title>
            <p
              className="text-xs mt-0.5"
              style={{ color: "rgba(31,47,87,0.55)" }}
            >
              Administra tu catálogo de productos. Visualiza, busca y gestiona
              la información de tu inventario.
            </p>
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

            <Link
              href="/dashboard/inventario/productos/crear"
              className="flex items-center gap-1.5 px-4 h-9 rounded-lg text-xs font-semibold text-white"
              style={{ background: "#1F2F57" }}
            >
              <Plus size={15} />
              Agregar Producto
            </Link>
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
}
