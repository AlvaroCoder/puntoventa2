'use client'

import React, { useState, useMemo, useEffect } from 'react'
import PageProducto from '@/modules/inventary/PageProducto'
import { SORT_OPTIONS } from '@/shared/constants/Inventary'
import useInventario from "@/modules/inventary/hooks/useInventario";

const PAGE_SIZE = 24

export default function ProductosPage() {
    const { productos, loading } = useInventario();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("nombre_az");
  const [page, setPage] = useState(1);
  const [favoritos, setFavoritos] = useState(new Set());
  const [showSort, setShowSort] = useState(false);

  const handleQuery = (val) => {
    setQuery(val);
    setPage(1);
  };
  const handleSort = (val) => {
    setSort(val);
    setPage(1);
  };

  useEffect(() => {
    if (!showSort) return;
    const handler = () => setShowSort(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [showSort]);

  const toggleFav = (id) =>
    setFavoritos((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const filtered = useMemo(() => {
    let list = productos || [];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          p.codigo.toLowerCase().includes(q),
      );
    }
    return [...list].sort((a, b) => {
      switch (sort) {
        case "nombre_za":
          return b.nombre.localeCompare(a.nombre);
        case "precio_asc":
          return a.precioVenta - b.precioVenta;
        case "precio_desc":
          return b.precioVenta - a.precioVenta;
        case "stock_asc":
          return a.stockTotal - b.stockTotal;
        default:
          return a.nombre.localeCompare(b.nombre);
      }
    });
  }, [query, sort, productos]); 

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, filtered.length);
  const sortLabel =
    SORT_OPTIONS.find((o) => o.key === sort)?.label ?? "Nombre (A - Z)";

  return (
    <PageProducto
      loading={loading}
      query={query}
      setQuery={handleQuery}
      filtered={filtered}
      sortLabel={sortLabel}
      showSort={showSort}
      setShowSort={setShowSort}
      sort={sort}
      setSort={handleSort}
      paginated={paginated}
      totalPages={totalPages}
      page={page}
      setPage={setPage}
      start={start}
      end={end}
      favoritos={favoritos}
      toggleFav={toggleFav}
    />
  );
}
