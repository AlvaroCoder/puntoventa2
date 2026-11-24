import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Store, Pencil, Trash2 } from 'lucide-react';

const ROL_STYLES = {
  // Roles senior — fondo sólido, texto blanco
  Gerente:       { background: '#1F2F57', color: '#FFFFFF', solid: true },
  Encargado:     { background: '#3960A9', color: '#FFFFFF', solid: true },
  Administrador: { background: '#3960A9', color: '#FFFFFF', solid: true },
  // Roles operativos — fondo tenue, texto de color
  Vendedor:      { background: 'rgba(249,115,22,0.12)',  color: '#C45500' },
  Cajero:        { background: 'rgba(25,142,123,0.12)',  color: '#147A6C' },
  Almacenero:    { background: 'rgba(232,160,32,0.12)',  color: '#97620A' },
};

function getRolStyle(rol) {
  return ROL_STYLES[rol] ?? { background: 'rgba(31,47,87,0.07)', color: 'rgba(31,47,87,0.45)' };
}

function MenuDesplegable({ onEditar, onEliminar, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-7 z-20 bg-white rounded-xl shadow-lg py-1 min-w-[140px]"
      style={{ border: '0.5px solid rgba(31,47,87,0.12)' }}
    >
      <button
        onClick={onEditar}
        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium hover:bg-[#E1E7F0] transition-colors text-left"
        style={{ color: '#1F2F57' }}
      >
        <Pencil size={12} />
        Editar empleado
      </button>
      <button
        onClick={onEliminar}
        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium hover:bg-red-50 transition-colors text-left"
        style={{ color: '#C0392B' }}
      >
        <Trash2 size={12} />
        Eliminar
      </button>
    </div>
  );
}

export default function TrabajadorCard({ trabajador, onEditar, onEliminar }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const rolStyle = getRolStyle(trabajador.rol);

  const handleEditar = () => {
    setMenuAbierto(false);
    onEditar(trabajador.id);
  };

  const handleEliminar = () => {
    setMenuAbierto(false);
    onEliminar(trabajador.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.16 }}
      className="bg-white rounded-xl flex flex-col overflow-hidden hover:shadow-sm transition-shadow duration-200"
      style={{ border: '0.5px solid rgba(31,47,87,0.12)' }}
    >
      <div className="flex items-start gap-3.5 px-5 pt-5 pb-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white text-sm font-extrabold"
          style={{ background: trabajador.colorAvatar }}
        >
          {trabajador.iniciales}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="ml-3 min-w-0">
              <h3
                className="text-sm font-bold truncate"
                style={{ color: '#1F2F57' }}
              >
                {trabajador.nombre}
              </h3>
              <p
                className="text-[11px] mt-0.5 truncate"
                style={{ color: 'rgba(31,47,87,0.45)' }}
              >
                {trabajador.email}
              </p>
            </div>

            <div className="relative shrink-0">
              <button
                onClick={() => setMenuAbierto(prev => !prev)}
                className="p-1 rounded-lg transition-colors hover:bg-[#E1E7F0]"
                title="Opciones"
              >
                <MoreVertical size={15} style={{ color: 'rgba(31,47,87,0.4)' }} />
              </button>
              {menuAbierto && (
                <MenuDesplegable
                  onEditar={handleEditar}
                  onEliminar={handleEliminar}
                  onClose={() => setMenuAbierto(false)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-5" style={{ borderTop: '0.5px solid rgba(31,47,87,0.08)' }} />

      <div className="px-5 py-3.5 flex flex-wrap items-center gap-2">
        <span
          className="px-2.5 py-1 rounded-full text-[11px] font-bold"
          style={rolStyle}
        >
          {trabajador.rol}
        </span>

        <span
          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium"
          style={{ background: 'rgba(31,47,87,0.06)', color: 'rgba(31,47,87,0.55)' }}
        >
          <Store size={10} />
          {trabajador.tienda}
        </span>
      </div>

      {/* Separador */}
      <div className="mx-5" style={{ borderTop: '0.5px solid rgba(31,47,87,0.07)' }} />

      {/* Footer: caja o último acceso */}
      <div className="px-5 py-3 flex-1 flex items-center">
        {trabajador.cajaAsignada ? (
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[11px]"
              style={{ color: 'rgba(31,47,87,0.5)' }}
            >
              Caja asignada: <span className="font-semibold" style={{ color: '#1F2F57' }}>{trabajador.cajaAsignada}</span>
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                trabajador.cajaEstado === 'Abierta'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {trabajador.cajaEstado}
            </span>
          </div>
        ) : trabajador.ultimoAcceso ? (
          <p
            className="text-[11px]"
            style={{ color: 'rgba(31,47,87,0.5)' }}
          >
            Ultimo acceso:{' '}
            <span className="font-semibold" style={{ color: 'rgba(31,47,87,0.7)' }}>
              {trabajador.ultimoAcceso}
            </span>
          </p>
        ) : (
          <p
            className="text-[11px]"
            style={{ color: 'rgba(31,47,87,0.35)' }}
          >
            Sin actividad reciente
          </p>
        )}
      </div>
    </motion.div>
  );
}
