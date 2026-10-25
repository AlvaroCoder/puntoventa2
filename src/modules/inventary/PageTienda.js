import Text from '@/shared/components/Text';
import { Title } from '@/shared/components/Title';
import React from 'react'
import { Search, Store } from 'lucide-react'
import CreateLinkButton from '@/shared/components/CreateLinkButton';
import SkeletonCard from '@/shared/components/SkeletonCard';
import { AnimatePresence } from 'framer-motion';
import TiendaCard from './components/TiendaCard';

export default function PageTienda({
    query,
    loading,
    filtered,
    setQuery,
    handleEdit,
    handleDelete,
    handleToggleEstado
}) {
  return (
    <div className="p-6 flex flex-col gap-6 bg-[#E1E7F0] min-h-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <Title>Gestión de la Tienda</Title>
          <Text>
            Visualiza el estado de tus tiendas y sus principales indicadores.
          </Text>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative min-w-[300px]">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "rgba(31,47,87,0.35)" }}
            />
            <input
              placeholder="Buscar por nombre, código o responsable..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-lg text-xs outline-none bg-white transition-all"
              style={{
                border: "0.5px solid rgba(31,47,87,0.18)",
                color: "#1F2F57",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3960A9";
                e.target.style.boxShadow = "0 0 0 3px rgba(57,96,169,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(31,47,87,0.18)";
                e.target.style.boxShadow = "none";
              }}
            />
        </div>
            <CreateLinkButton href="/dashboard/inventario/tienda/create" >
                Nueva Tieda
            </CreateLinkButton>
       
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(31,47,87,0.07)" }}
          >
            <Store size={26} style={{ color: "rgba(31,47,87,0.25)" }} />
          </div>
          <p
            className="text-sm font-semibold"
            style={{ color: "rgba(31,47,87,0.4)" }}
          >
            {query
              ? "Sin resultados para tu búsqueda"
              : "No hay tiendas registradas"}
          </p>
            {!query && (
                <CreateLinkButton href="/dashboard/inventario/tienda/create" >
                    Crea la primera tienda
                </CreateLinkButton>
           
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((tienda) => (
              <TiendaCard
                key={tienda.id}
                tienda={tienda}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleEstado={handleToggleEstado}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
