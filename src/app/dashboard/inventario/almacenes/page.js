import { Title } from '@/components/Titles/Title';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

export default function Page() {
  return (
    <div className="p-6 flex flex-col gap-6 bg-[#E1E7F0] min-h-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <Title>Gestión del almacen</Title>
          <p
            className="text-xs mt-0.5"
            style={{ color: "rgba(31,47,87,0.55)" }}
          >
            Visualiza el estado de tus tiendas y sus principales indicadores.
          </p>
        </div>
        <Link
          href="/dashboard/inventario/almacenes/create"
          className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-90 self-start sm:self-auto"
          style={{ background: "#1F2F57" }}
        >
          <Plus size={14} />
          Nueva Almacen
        </Link>
      </div>
    </div>
  );
};