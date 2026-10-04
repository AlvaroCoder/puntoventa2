'use client';
import { getProductosByEmpresa } from '@/Connections/productos';
import { useAuth } from '@/Context/AuthContext';
import { Search, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react'
import SwitcherLoader from '../Navigation/SwitcherLoader';

const fmt = (v) =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(
    v ?? 0,
  );

export default function PosRigthPanel({ addProducto }) {
    const { user } = useAuth();
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const productos = await getProductosByEmpresa(user?.empresa_id);
                console.log(productos);
                
                setProducts(productos?.data?.content || []);
            } catch (err) {
                
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [user]);

    const normalizar = (texto) =>
    String(texto ?? "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""); 

    const productosFiltrados = useMemo(() => {
    const termino = normalizar(search.trim());
    if (!termino) return products;

    return products.filter(
        (p) =>
        normalizar(p.nombre).includes(termino) ||
        normalizar(p.codigo).includes(termino),
    );
    }, [products, search]);
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div
        className="bg-white px-4 py-3 shrink-0"
        style={{ borderBottom: "0.5px solid rgba(31,47,87,0.1)" }}
      >
        <div className="relative max-w-sm">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "rgba(31,47,87,0.35)" }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
                Sin resultados para &ldquo;{search}&rdquo;
              </p>
            </div>
          ) : (
            <div
              className="grid gap-3"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
              }}
            >
              {productosFiltrados.map((p) => (
                <button
                  key={p.id}
                  onClick={() => addProducto(p)}
                  className="bg-white rounded-xl p-3 flex flex-col items-center gap-2 text-center transition-all hover:shadow-md hover:-translate-y-0.5 active:scale-95"
                  style={{ border: "0.5px solid rgba(31,47,87,0.1)" }}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
                    style={{ background: "rgba(31,47,87,0.04)" }}
                  >
                    {p.emoji}
                  </div>
                  <div className="min-w-0 w-full">
                    <p
                      className="text-[11px] font-semibold leading-tight truncate"
                      style={{ color: "#1F2F57" }}
                    >
                      {p.nombre}
                    </p>
                    <p
                      className="text-xs font-bold mt-0.5"
                      style={{ color: "#198E7B" }}
                    >
                      {fmt(p.precioVenta)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </SwitcherLoader>
    </div>
  );
}
