import React from 'react';
import { Title } from '@/shared/components/Title';
import Text from '@/shared/components/Text';
import SkeletonCard from '@/shared/components/SkeletonCard';
import { AnimatePresence } from 'framer-motion';
import { Plus, Users, Shield, ShoppingCart, Package, Wallet, BadgePercent } from 'lucide-react';
import TrabajadorCard from './components/TrabajadorCard';

const ROLES_INFO = [
  {
    rol: "Gerente",
    icon: Shield,
    desc: "Todo: configuracion, reportes, personal y facturacion.",
  },
  {
    rol: "Encargado",
    icon: ShoppingCart,
    desc: "Encargado del local cuando el gerente no esta.",
  },
  {
    rol: "Cajero",
    icon: Wallet,
    desc: "Abrir y cerrar su caja, vender, registrar clientes.",
  },
  {
    rol: "Vendedor",
    icon: BadgePercent,
    desc: "Encargado de vender y atender al cliente.",
  },
  {
    rol: "Almacenero",
    icon: Package,
    desc: "Productos, ingresos de stock y recepcion de ordenes.",
  },
];

const ROL_ICON_STYLES = {
  Administrador: { background: 'rgba(57,96,169,0.1)', color: '#3960A9' },
  Cajero: { background: 'rgba(30,179,178,0.1)', color: '#0E9090' },
  Almacenero: { background: 'rgba(232,160,32,0.1)', color: '#B87A10' },
};

function InviteCard({ onInvitar }) {
  return (
    <button
      onClick={onInvitar}
      className="w-full h-full min-h-[176px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 p-6 hover:bg-blue-50/30 transition-all group"
      style={{ borderColor: 'rgba(31,47,87,0.2)' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#3960A9'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(31,47,87,0.2)'; }}
    >
      <div
        className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors"
        style={{ borderColor: 'rgba(31,47,87,0.25)' }}
      >
        <Plus size={18} style={{ color: 'rgba(31,47,87,0.4)' }} />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold" style={{ color: '#1F2F57' }}>
          Invita a tu equipo
        </p>
        <p
          className="text-xs mt-1 max-w-[160px]"
          style={{ color: 'rgba(31,47,87,0.5)' }}
        >
          Le llega un enlace por correo o WhatsApp para crear su contrasena.
        </p>
      </div>
    </button>
  );
}

export default function PageTrabajadores({
  trabajadores,
  loading,
  query,
  setQuery,
  handleInvitar,
  handleEditar,
  handleEliminar,
}) {
  return (
    <div className="p-6 flex flex-col gap-6 bg-[#E1E7F0] min-h-screen">

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <Title>Empleados</Title>
          <Text>Gestiona el acceso y roles de tu equipo.</Text>
        </div>
        <button
          onClick={handleInvitar}
          className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-90 self-start sm:self-auto"
          style={{ background: '#1F2F57' }}
        >
          <Plus size={14} />
          Invitar empleado
        </button>
      </div>

      {/* Grid de tarjetas */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {trabajadores.map((trabajador) => (
              <TrabajadorCard
                key={trabajador.id}
                trabajador={trabajador}
                onEditar={handleEditar}
                onEliminar={handleEliminar}
              />
            ))}
          </AnimatePresence>

          {/* Invite card al final del grid */}
          <InviteCard onInvitar={handleInvitar} />
        </div>
      )}

      <div className="mt-2">
        <p
          className="text-sm font-semibold mb-3"
          style={{ color: 'rgba(31,47,87,0.6)' }}
        >
          ¿Que puede hacer cada rol?
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {ROLES_INFO.map(({ rol, icon: Icon, desc }) => {
            const iconStyle = ROL_ICON_STYLES[rol] ?? { background: 'rgba(31,47,87,0.07)', color: 'rgba(31,47,87,0.5)' };
            return (
              <div
                key={rol}
                className="bg-white rounded-xl px-5 py-4 flex items-start gap-4"
                style={{ border: '0.5px solid rgba(31,47,87,0.1)' }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: iconStyle.background }}
                >
                  <Icon size={16} style={{ color: iconStyle.color }} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: '#1F2F57' }}>
                    {rol}
                  </p>
                  <p
                    className="text-xs mt-1 leading-relaxed"
                    style={{ color: 'rgba(31,47,87,0.5)' }}
                  >
                    {desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Estado vacío (no hay trabajadores y no está cargando) */}
      {!loading && trabajadores.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(31,47,87,0.07)' }}
          >
            <Users size={26} style={{ color: 'rgba(31,47,87,0.25)' }} />
          </div>
          <p
            className="text-sm font-semibold"
            style={{ color: 'rgba(31,47,87,0.4)' }}
          >
            No hay empleados registrados
          </p>
          <button
            onClick={handleInvitar}
            className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: '#1F2F57' }}
          >
            <Plus size={14} />
            Invitar primer empleado
          </button>
        </div>
      )}
    </div>
  );
}
