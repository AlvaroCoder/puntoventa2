import React from 'react'
import CardHeader from './CardHeader';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import FieldRow from './FieldRow';

export default function CardMetricas() {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{ border: "0.5px solid rgba(31,47,87,0.08)" }}
    >
      <CardHeader title={"Información general"} />
      <div className="p-5 flex gap-5">
        <div className="flex flex-col gap-2 shrink-0">
          <div
            className="w-[130px] h-[130px] rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(31, 47, 87, 0.04)",
              border: "0.5px solid rgba(31, 47, 87, 0.10)",
            }}
          >
            {producto.imagenUrl ? (
              <Image
                src={producto.imagenUrl}
                alt={producto.nombre}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <ImageIcon
                size={32}
                color="rgba(31,47,87,0.2)"
                strokeWidth={1.5}
              />
            )}
          </div>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{
                  background: "rgba(31,47,87,0.03)",
                  border: "0.5px solid rgba(31,47,87,0.09)",
                }}
              >
                <ImageIcon
                  size={12}
                  color="rgba(31, 47, 87, 0.18)"
                  strokeWidth={1.5}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-4 content-start">
          <FieldRow label="Nombre" value={producto.nombre} />
          <FieldRow label="Categoría" value={producto.categoria} />
          <FieldRow label="Marca" value={producto.marca} />
          <FieldRow label="Código de barras" value={producto.codigoBarras} />
          <div className="col-span-2">
            <FieldRow label="Descripción" value={producto.descripcion} />
          </div>
          <FieldRow label="Unidad" value={producto.unidadMedida} />
        </div>
      </div>
    </div>
  );
}
