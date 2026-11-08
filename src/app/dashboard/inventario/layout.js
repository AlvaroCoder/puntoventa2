'use client'

import React from 'react'
import { Package } from 'lucide-react'
import ContainerLayout from '@/shared/components/ContainerLayout'

export default function InventarioLayout({ children }) {
  return (
    <ContainerLayout
      hrefPrincipal="/dashboard/inventario"
      icon={Package}
      title={"Inventario"}
      links={[
        { href: "/dashboard/inventario", label: "Resumen general" },
        { href: "/dashboard/inventario/productos", label: "Productos" },
        { href: "/dashboard/inventario/reportes", label: "Reportes" },
        {href : "/dashboard/inventario/tienda", label : "Tiendas"},
        { href: "/dashboard/inventario/categoria" , label : "Categoria"},
      ]}
    >
      {children}
    </ContainerLayout>
  );
}