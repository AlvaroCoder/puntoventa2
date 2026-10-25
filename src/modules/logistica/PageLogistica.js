import React from 'react';
import { Title } from '@/shared/components/Title';
import Text from '@/shared/components/Text';
import CreateLinkButton from '@/shared/components/CreateLinkButton';
import {
  Truck,
  Search,
  PackageOpen,
  Users,
  BarChart2,
  ArrowRight,
} from 'lucide-react';

// ─── Configuración de tabs ────────────────────────────────────────────────────
const TABS = [
  { id: 'ordenes',      label: 'Órdenes de compra', icon: PackageOpen },
  { id: 'entradas',     label: 'Entradas',           icon: Truck       },
  { id: 'proveedores',  label: 'Proveedores',        icon: Users       },
  { id: 'reportes',     label: 'Reportes',           icon: BarChart2   },
];

// ─── Configuración de filtros ─────────────────────────────────────────────────
const FILTROS = [
  { key: 'Todas',           label: 'Todas'           },
  { key: 'Borrador',        label: 'Borrador'        },
  { key: 'Enviada',         label: 'Enviada'         },
  { key: 'Recibida parcial',label: 'Recibida parcial'},
  { key: 'Recibida',        label: 'Recibida'        },
];

// ─── Estilos por estado ───────────────────────────────────────────────────────
const BADGE_STYLES = {
  Borrador:          { background: '#F3F4F6', color: '#6B7280' },
  Enviada:           { background: '#DBEAFE', color: '#2563EB' },
  'Recibida parcial':{ background: '#FEF3C7', color: '#D97706' },
  Recibida:          { background: '#D1FAE5', color: '#059669' },
};

// ─── Badge de estado ──────────────────────────────────────────────────────────
function EstadoBadge({ estado }) {
  const style = BADGE_STYLES[estado] ?? { background: '#F3F4F6', color: '#6B7280' };
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
      style={style}
    >
      {estado}
    </span>
  );
}

// ─── Botón de acción según estado ─────────────────────────────────────────────
function BotonAccion({ orden, onAccion }) {
  if (orden.estado === 'Enviada') {
    return (
      <button
        onClick={() => onAccion(orden.id, 'recibir')}
        className="inline-flex items-center gap-1 h-7 px-3 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-85"
        style={{ background: '#1F2F57' }}
      >
        Recibir
      </button>
    );
  }

  const LINK_MAP = {
    'Recibida parcial': { label: 'Completar', tipo: 'completar' },
    Borrador:           { label: 'Continuar', tipo: 'continuar' },
    Recibida:           { label: 'Ver',        tipo: 'ver'       },
  };

  const cfg = LINK_MAP[orden.estado];
  if (!cfg) return null;

  return (
    <button
      onClick={() => onAccion(orden.id, cfg.tipo)}
      className="inline-flex items-center gap-0.5 text-xs font-semibold transition-opacity hover:opacity-70"
      style={{ color: '#1F2F57' }}
    >
      {cfg.label}
      <ArrowRight size={13} />
    </button>
  );
}

// ─── Skeleton de filas ────────────────────────────────────────────────────────
function SkeletonFila() {
  return (
    <tr>
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div
            className="h-4 rounded animate-pulse"
            style={{
              background: 'rgba(31,47,87,0.06)',
              width: i === 0 ? '90px' : i === 1 ? '120px' : '70px',
            }}
          />
        </td>
      ))}
    </tr>
  );
}

// ─── Tabla de órdenes ─────────────────────────────────────────────────────────
function TablaOrdenes({ ordenesFiltradas, loading, query, filtro, handleAccion }) {
  const COL_HEADERS = [
    'N° orden', 'Proveedor', 'Almacén destino',
    'Fecha', 'Productos', 'Total', 'Estado', 'Acción',
  ];

  return (
    <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(31,47,87,0.08)' }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {/* Encabezado */}
          <thead>
            <tr style={{ background: 'rgba(31,47,87,0.03)', borderBottom: '1px solid rgba(31,47,87,0.07)' }}>
              {COL_HEADERS.map(h => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold tracking-wide whitespace-nowrap"
                  style={{ color: 'rgba(31,47,87,0.5)' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          {/* Cuerpo */}
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonFila key={i} />)
            ) : ordenesFiltradas.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ background: 'rgba(31,47,87,0.06)' }}
                    >
                      <PackageOpen size={22} style={{ color: 'rgba(31,47,87,0.25)' }} />
                    </div>
                    <p className="text-xs font-medium" style={{ color: 'rgba(31,47,87,0.4)' }}>
                      {query || filtro !== 'Todas'
                        ? 'Sin resultados para la búsqueda'
                        : 'No hay órdenes de compra registradas'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              ordenesFiltradas.map((orden, idx) => (
                <tr
                  key={orden.id}
                  className="transition-colors hover:bg-[#F8FAFC]"
                  style={{
                    borderBottom: idx < ordenesFiltradas.length - 1
                      ? '1px solid rgba(31,47,87,0.05)'
                      : 'none',
                  }}
                >
                  <td className="px-4 py-3">
                    <span className="text-xs font-bold" style={{ color: '#1F2F57' }}>
                      {orden.numero}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs" style={{ color: '#1F2F57' }}>
                      {orden.proveedor}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs" style={{ color: 'rgba(31,47,87,0.65)' }}>
                      {orden.almacen}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs" style={{ color: 'rgba(31,47,87,0.65)' }}>
                      {orden.fecha}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold"
                      style={{ background: 'rgba(31,47,87,0.06)', color: '#1F2F57' }}
                    >
                      {orden.productos}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold" style={{ color: '#1F2F57' }}>
                      S/ {orden.total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <EstadoBadge estado={orden.estado} />
                  </td>
                  <td className="px-4 py-3">
                    <BotonAccion orden={orden} onAccion={handleAccion} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Contenido placeholder para tabs no implementados ────────────────────────
function TabPlaceholder({ label, icon: Icon }) {
  return (
    <div className="flex flex-col items-center gap-4 py-24">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: 'rgba(31,47,87,0.06)' }}
      >
        <Icon size={26} style={{ color: 'rgba(31,47,87,0.25)' }} />
      </div>
      <p className="text-sm font-medium" style={{ color: 'rgba(31,47,87,0.4)' }}>
        Módulo de {label} próximamente
      </p>
    </div>
  );
}

// ─── Componente principal UI ──────────────────────────────────────────────────
export default function PageLogistica({
  activeTab,
  setActiveTab,
  query,
  setQuery,
  filtro,
  setFiltro,
  ordenesFiltradas,
  conteos,
  loading,
  handleAccion,
}) {
  return (
    <div className="p-6 flex flex-col gap-6 bg-[#E1E7F0] min-h-full">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#1F2F57' }}
          >
            <Truck size={20} className="text-white" />
          </div>
          <div>
            <Title>Logística</Title>
            <Text>Gestiona tus órdenes de compra, entradas y proveedores.</Text>
          </div>
        </div>
      </div>

      {/* ── Tabs pill ──────────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-1 p-1 rounded-xl self-start"
        style={{ background: 'rgba(31,47,87,0.08)' }}
      >
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex items-center gap-1.5 h-8 px-3.5 rounded-lg text-xs font-semibold transition-all"
              style={
                active
                  ? { background: '#1F2F57', color: '#FFFFFF', boxShadow: '0 1px 4px rgba(31,47,87,0.25)' }
                  : { color: 'rgba(31,47,87,0.55)', background: 'transparent' }
              }
            >
              <Icon size={13} />
              {label}
            </button>
          );
        })}
      </div>

      {/* ── Contenido del tab activo ────────────────────────────────────────── */}
      {activeTab === 'ordenes' ? (
        <div className="flex flex-col gap-4">

          {/* Subheader */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold" style={{ color: '#1F2F57' }}>
                Órdenes de compra
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(31,47,87,0.5)' }}>
                {conteos.total} {conteos.total === 1 ? 'orden registrada' : 'órdenes registradas'}
              </p>
            </div>
            <CreateLinkButton href="/dashboard/logistica/ordenes-compra/crear">
              Nueva orden
            </CreateLinkButton>
          </div>

          {/* Filtros + Búsqueda */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

            {/* Filter chips */}
            <div className="flex items-center gap-2 flex-wrap">
              {FILTROS.map(({ key, label }) => {
                const active  = filtro === key;
                const count   = key === 'Todas' ? conteos.total : (conteos[key] ?? 0);
                return (
                  <button
                    key={key}
                    onClick={() => setFiltro(key)}
                    className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs font-semibold border transition-all"
                    style={
                      active
                        ? { background: '#1F2F57', color: '#FFFFFF', borderColor: '#1F2F57' }
                        : { background: '#FFFFFF', color: 'rgba(31,47,87,0.6)', borderColor: 'rgba(31,47,87,0.12)' }
                    }
                  >
                    {label}
                    <span
                      className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold"
                      style={
                        active
                          ? { background: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }
                          : { background: 'rgba(31,47,87,0.08)', color: 'rgba(31,47,87,0.6)' }
                      }
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Buscador */}
            <div className="relative min-w-[260px]">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: 'rgba(31,47,87,0.35)' }}
              />
              <input
                placeholder="N° de orden o proveedor..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-8 pl-8 pr-3 rounded-lg text-xs outline-none bg-white transition-all"
                style={{
                  border: '0.5px solid rgba(31,47,87,0.18)',
                  color: '#1F2F57',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3960A9';
                  e.target.style.boxShadow   = '0 0 0 3px rgba(57,96,169,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(31,47,87,0.18)';
                  e.target.style.boxShadow   = 'none';
                }}
              />
            </div>
          </div>

          {/* Tabla */}
          <TablaOrdenes
            ordenesFiltradas={ordenesFiltradas}
            loading={loading}
            query={query}
            filtro={filtro}
            handleAccion={handleAccion}
          />
        </div>
      ) : (
        // Tabs sin implementar
        (() => {
          const tab = TABS.find(t => t.id === activeTab);
          return tab ? <TabPlaceholder label={tab.label} icon={tab.icon} /> : null;
        })()
      )}
    </div>
  );
}
