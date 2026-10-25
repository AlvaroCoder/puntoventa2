import React from 'react'
import { motion } from "framer-motion";
import { Calendar, MapPin, Pencil, Phone, ToggleLeft, ToggleRight, Trash2, User } from 'lucide-react';

function formatFecha(fecha) {
  if (!fecha) return "—";
  return new Date(fecha + "T00:00:00").toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
function InfoRow({ icon, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-2">
      <span style={{ color: "rgba(31,47,87,0.35)" }}>{icon}</span>
      <span
        className="text-xs truncate"
        style={{ color: "rgba(31,47,87,0.6)" }}
      >
        {value}
      </span>
    </div>
  );
}


export default function  TiendaCard({ tienda, onEdit, onDelete, onToggleEstado }) {
    const initials = tienda.nombre?.slice(0, 2).toUpperCase() ?? 'T'

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
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white text-sm font-extrabold"
                    style={{ background: '#1F2F57' }}
                >
                    {initials}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                            <h3 className="text-sm font-bold truncate" style={{ color: '#1F2F57' }}>
                                {tienda.nombre}
                            </h3>
                            <p className="text-[11px] mt-0.5 font-mono" style={{ color: 'rgba(31,47,87,0.4)' }}>
                                {tienda.codigo}
                            </p>
                        </div>
                        <span
                            className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold"
                            style={
                                tienda.activa
                                    ? { background: 'rgba(57,96,169,0.1)', color: '#3960A9' }
                                    : { background: 'rgba(31,47,87,0.07)', color: 'rgba(31,47,87,0.4)' }
                            }
                        >
                            {tienda.activa ? 'Activa' : 'Inactiva'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mx-5" style={{ borderTop: '0.5px solid rgba(31,47,87,0.08)' }} />

            <div className="px-5 py-4 flex flex-col gap-2.5 flex-1">
                <InfoRow icon={<User size={12} />}     value={tienda.responsable} />
                <InfoRow icon={<MapPin size={12} />}   value={tienda.direccion} />
                <InfoRow icon={<Phone size={12} />}    value={tienda.telefono} />
                <InfoRow icon={<Calendar size={12} />} value={formatFecha(tienda.fecha_apertura)} />
            </div>

            <div
                className="px-5 py-3 flex items-center justify-between"
                style={{ borderTop: '0.5px solid rgba(31,47,87,0.07)' }}
            >
                <button
                    onClick={() => onToggleEstado(tienda)}
                    className="flex items-center gap-1.5 text-[11px] font-medium transition-opacity hover:opacity-60"
                    style={{ color: tienda.activa ? '#3960A9' : 'rgba(31,47,87,0.4)' }}
                >
                    {tienda.activa ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
                    {tienda.activa ? 'Desactivar' : 'Activar'}
                </button>

                <div className="flex items-center gap-0.5">
                    <button
                        onClick={() => onEdit(tienda)}
                        className="p-1.5 rounded-lg transition-colors hover:bg-[#E1E7F0]"
                        title="Editar"
                    >
                        <Pencil size={13} style={{ color: 'rgba(31,47,87,0.4)' }} />
                    </button>
                    <button
                        onClick={() => onDelete(tienda.id)}
                        className="p-1.5 rounded-lg transition-colors hover:bg-red-50"
                        title="Eliminar"
                    >
                        <Trash2 size={13} style={{ color: '#C0392B' }} />
                    </button>
                </div>
            </div>
        </motion.div>
    )
}