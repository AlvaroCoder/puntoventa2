'use client';
import { Plus, Store } from 'lucide-react';
import React from 'react'
import CajaCard from '../Cards/CajaCard';
import PrimaryButton from '../Buttons/PrimaryButton';
import { useRouter } from 'next/navigation';

export default function PanelTiendas({ tienda }) {
    const router = useRouter();
  return (
    <div key={tienda.id} className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "rgba(31,47,87,0.08)" }}
        >
          <Store size={14} style={{ color: "#1F2F57" }} />
        </div>
        <span className="text-sm font-bold" style={{ color: "#1F2F57" }}>
          {tienda.nombre}
        </span>
        <span style={{ color: "rgba(31,47,87,0.3)", fontSize: 13 }}>—</span>
        <span className="text-xs" style={{ color: "rgba(31,47,87,0.5)" }}>
          {tienda.ubicacion}
        </span>
        <span
          className="ml-auto text-[11px] font-medium px-2.5 py-0.5 rounded-full"
          style={{
            background: "rgba(31,47,87,0.06)",
            color: "rgba(31,47,87,0.4)",
          }}
        >
          {tienda.cajas.length} {tienda.cajas.length === 1 ? "caja" : "cajas"}
        </span>
      </div>

          {tienda?.cajas?.length > 0 ? 
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tienda.cajas.map((caja) => (
          <CajaCard key={caja.id} caja={caja} />
        ))}
              </div> : 
            <div className='flex-1 p-4 rounded-xl bg-gray-100 min-h-40 flex flex-col gap-4 justify-center items-center'>
                  <h1 className='font-semibold text-azulMarino text-lg'>Aún no has registrado una caja en este local</h1>
                  <PrimaryButton handleClick={()=>router.push("/dashboard/ventas/caja/crear")}><Plus/> Crear Caja</PrimaryButton>
            </div>}
    </div>
  );
}
