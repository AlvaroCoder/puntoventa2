import WrapperLink from '@/components/Navigation/WrapperLink';
import { Title } from '@/components/Titles/Title';
import { TrendingUp } from 'lucide-react';
import React from 'react'

export default function RootLayout({children}) {
  return (
    <div className="flex flex-col min-h-screen bg-grisClaro">
      <div
        className="bg-white flex items-center gap-8 px-6"
        style={{
          height: 52,
          borderBottom: "0.5px solid rgba(31,47,87,0.1)",
          flexShrink: 0,
        }}
      >
        <div className="flex items-center gap-2">
          <TrendingUp size={18} color="#3960A9" />
          <Title>Punto de venta</Title>
        </div>
        <div className="flex items-center gap-2 px-3 rounded-lg h-9 min-w-[200px]">
          <WrapperLink href={"/dashboard/ventas"}>Resumen</WrapperLink>
          <WrapperLink href={"/dashboard/ventas/caja"}>Caja</WrapperLink>
          <WrapperLink href={"/dashboard/ventas/clientes"}>Clientes</WrapperLink>
          <WrapperLink href={"/dashboard/ventas/reportes"}>Reportes</WrapperLink>
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
};