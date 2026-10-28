import { Users } from 'lucide-react';
import React from 'react'

export default function EmptyState({query}) {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 gap-3 text-center bg-white rounded-xl"
      style={{ border: "0.5px solid rgba(31,47,87,0.12)" }}
    >
      <div className="w-14 h-14 rounded-2xl bg-[#1F4363]/5 flex items-center justify-center">
        <Users size={24} className="text-[#1F4363]/40" />
      </div>
      <p className="font-semibold text-[#1F4363] text-sm">
        {query ? "Sin resultados" : "Sin clientes aún"}
      </p>
      <p className="text-xs text-gray-400 max-w-[220px]">
        {query
          ? `No se encontraron clientes para "${query}"`
          : "Agrega tu primer cliente con el botón Nuevo Cliente"}
      </p>
    </div>
  );
};