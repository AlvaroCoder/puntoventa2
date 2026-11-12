'use client';
import ContainerLayout from '@/shared/components/ContainerLayout';
import { TrendingUp } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React from 'react'

export default function RootLayout({ children }) {
  const pathName = usePathname();
  if (pathName.endsWith("/pos")) return <div className='flex-1'>
    {children}
  </div>;
    return (
      <ContainerLayout
        hrefPrincipal="/dashboard/ventas"
        icon={TrendingUp}
        title={"Mi negocio"}
        links={[
          { href: "/dashboard/ventas/caja", label: "Caja" },
          { href: "/dashboard/ventas/clientes", label: "Clientes" },
          { href: "/dashboard/ventas/reportes", label: "Reportes" },
        ]}
      >
        {children}
      </ContainerLayout>
    );
};